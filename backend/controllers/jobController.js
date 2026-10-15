const Job = require("../models/Job");
const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");
const StartupProfile = require("../models/StartupProfile");

async function addStartupNames(jobs) {
  const validJobs = jobs.filter((job) => job.startup);
  const startupIds = validJobs.map((job) => job.startup._id);
  const profiles = await StartupProfile.find({ user: { $in: startupIds } });
  const startupNames = new Map(
    profiles.map((profile) => [profile.user.toString(), profile.startupName]),
  );

  return validJobs.map((job) => ({
    ...job.toObject(),
    startupName:
      startupNames.get(job.startup._id.toString()) || "Startup Company",
  }));
}

async function addApplicantDetails(jobs) {
  const applicantIds = jobs.flatMap((job) =>
    job.applicants
      .filter(Boolean)
      .map((applicant) => applicant._id),
  );
  const profiles = await MentorProfile.find({
    user: { $in: applicantIds },
  });
  const profileMap = new Map(
    profiles.map((profile) => [profile.user.toString(), profile]),
  );

  return jobs.map((job) => ({
    ...job.toObject(),
    applicants: job.applicants
      .filter(Boolean)
      .map((applicant) => {
        const profile = profileMap.get(applicant._id.toString());

        return {
          id: applicant._id,
          name: profile?.name || applicant.email,
          email: applicant.email,
          profileImage: profile?.profileImage || "",
        };
      }),
  }));
}

const createJob = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Only startups can create jobs" });
    }

    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const job = await Job.create({
      startup: req.user._id,
      title,
      description,
      category,
      offerType: "open",
      status: "open",
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to create job" });
  }
};

const getJobs = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const jobs = await Job.find({
      startup: req.user._id,
      offerType: { $ne: "direct" },
    })
      .populate("applicants", "email")
      .sort({ createdAt: -1 });

    res.json(await addApplicantDetails(jobs));
  } catch (error) {
    res.status(500).json({ message: "Failed to get jobs" });
  }
};

const getStartupDashboardJobs = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Only startups can view these jobs" });
    }

    const jobs = await Job.find({
      startup: req.user._id,
      $or: [
        {
          offerType: "direct",
          status: { $in: ["pending", "assigned", "completed", "rejected"] },
        },
        {
          offerType: { $ne: "direct" },
          status: { $in: ["assigned", "completed", "rejected", "cancelled"] },
        },
      ],
    }).sort({ updatedAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to get startup dashboard jobs" });
  }
};

const getJobFeed = async (req, res) => {
  try {
    if (req.user.accountType !== "mentor") {
      return res.status(403).json({ message: "Only mentors can view the job feed" });
    }

    const jobs = await Job.find({
      offerType: { $ne: "direct" },
      status: "open",
      applicants: { $ne: req.user._id },
      rejectedMentors: { $ne: req.user._id },
    })
      .populate("startup", "email")
      .sort({ createdAt: -1 });

    res.json(await addStartupNames(jobs));
  } catch (error) {
    res.status(500).json({ message: "Failed to get job feed" });
  }
};

const applyToJob = async (req, res) => {
  try {
    if (req.user.accountType !== "mentor") {
      return res.status(403).json({ message: "Only mentors can apply to jobs" });
    }

    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        offerType: { $ne: "direct" },
        status: "open",
        applicants: { $ne: req.user._id },
      },
      { $addToSet: { applicants: req.user._id } },
      { new: true },
    );

    if (!job) {
      return res.status(400).json({ message: "Job is unavailable or already applied to" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to apply to job" });
  }
};

const respondToApplicant = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Only startups can respond to applicants" });
    }

    const { response } = req.body;

    if (!["accept", "reject"].includes(response)) {
      return res.status(400).json({ message: "Response must be accept or reject" });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      startup: req.user._id,
      offerType: { $ne: "direct" },
      status: "open",
      applicants: req.params.mentorId,
    });

    if (!job) {
      return res.status(404).json({ message: "Applicant or open job not found" });
    }

    if (response === "accept") {
      const otherApplicants = job.applicants.filter(
        (applicantId) => applicantId.toString() !== req.params.mentorId,
      );

      otherApplicants.forEach((applicantId) => {
        if (!job.rejectedMentors.some((id) => id.equals(applicantId))) {
          job.rejectedMentors.push(applicantId);
        }
      });

      job.applicants = [req.params.mentorId];
      job.assignedMentor = req.params.mentorId;
      job.status = "assigned";
    } else {
      job.applicants = job.applicants.filter(
        (applicantId) => applicantId.toString() !== req.params.mentorId,
      );

      if (!job.rejectedMentors.some((id) => id.toString() === req.params.mentorId)) {
        job.rejectedMentors.push(req.params.mentorId);
      }
    }

    await job.save();
    await job.populate("applicants", "email");
    res.json((await addApplicantDetails([job]))[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to respond to applicant" });
  }
};

const getMentors = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Only startups can view mentors" });
    }

    const profiles = await MentorProfile.find()
      .populate("user", "email")
      .sort({ _id: -1 });

    const mentors = profiles
      .filter((profile) => profile.user)
      .map((profile) => ({
        id: profile.user._id,
        name: profile.name,
        email: profile.user.email,
        phone: profile.phone,
        address: profile.address,
        profileImage: profile.profileImage,
      }));

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: "Failed to get mentors" });
  }
};

const getMentorById = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Only startups can view mentors" });
    }

    const profile = await MentorProfile.findOne({
      user: req.params.mentorId,
    }).populate("user", "email");

    if (!profile || !profile.user) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json({
      id: profile.user._id,
      name: profile.name,
      email: profile.user.email,
      phone: profile.phone,
      address: profile.address,
      profileImage: profile.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get mentor" });
  }
};

const createJobOffer = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Only startups can offer jobs" });
    }

    const { mentorId, title, description } = req.body;

    if (!mentorId || !title || !description) {
      return res.status(400).json({ message: "Mentor, title and description are required" });
    }

    const mentor = await User.findOne({ _id: mentorId, accountType: "mentor" });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const job = await Job.create({
      startup: req.user._id,
      title,
      description,
      category: "Direct Offer",
      offerType: "direct",
      offeredMentor: mentor._id,
      status: "pending",
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to send job offer" });
  }
};

const getSentOffers = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const query = {
      startup: req.user._id,
      offerType: "direct",
    };

    if (req.query.mentorId) {
      query.offeredMentor = req.query.mentorId;
    }

    const offers = await Job.find(query).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Failed to get job offers" });
  }
};

const getMentorDashboardJobs = async (req, res) => {
  try {
    if (req.user.accountType !== "mentor") {
      return res.status(403).json({ message: "Only mentors can view these jobs" });
    }

    const [pendingOffers, assignedJobs, applications] = await Promise.all([
      Job.find({
        offerType: "direct",
        offeredMentor: req.user._id,
        status: "pending",
      })
        .populate("startup", "email")
        .sort({ createdAt: -1 }),
      Job.find({
        $or: [
          {
            offerType: "direct",
            offeredMentor: req.user._id,
            status: { $in: ["pending", "assigned", "completed", "rejected"] },
          },
          {
            offerType: { $ne: "direct" },
            assignedMentor: req.user._id,
            status: { $in: ["assigned", "completed"] },
          },
        ],
      })
        .populate("startup", "email")
        .sort({ updatedAt: -1 }),
      Job.find({
        offerType: { $ne: "direct" },
        applicants: req.user._id,
        status: "open",
      })
        .populate("startup", "email")
        .sort({ createdAt: -1 }),
    ]);

    res.json({
      pendingOffers: await addStartupNames(pendingOffers),
      assignedJobs: await addStartupNames(assignedJobs),
      applications: await addStartupNames(applications),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get mentor jobs" });
  }
};

const respondToOffer = async (req, res) => {
  try {
    if (req.user.accountType !== "mentor") {
      return res.status(403).json({ message: "Only mentors can respond to offers" });
    }

    const { response } = req.body;

    if (!["accept", "reject"].includes(response)) {
      return res.status(400).json({ message: "Response must be accept or reject" });
    }

    const update =
      response === "accept"
        ? { status: "completed", assignedMentor: req.user._id }
        : { status: "rejected", assignedMentor: null };

    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        offerType: "direct",
        offeredMentor: req.user._id,
        status: "pending",
      },
      update,
      { new: true, runValidators: true },
    );

    if (!job) {
      return res.status(404).json({ message: "Job offer is no longer available" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to respond to job offer" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      startup: req.user._id,
    }).populate("applicants", "email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json((await addApplicantDetails([job]))[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to get job" });
  }
};

const updateJob = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, category, status } = req.body;

    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        startup: req.user._id,
      },
      { title, description, category, status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.populate("applicants", "email");
    res.json((await addApplicantDetails([job]))[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    if (req.user.accountType !== "startup") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      startup: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getStartupDashboardJobs,
  getJobFeed,
  applyToJob,
  respondToApplicant,
  getMentors,
  getMentorById,
  createJobOffer,
  getSentOffers,
  getMentorDashboardJobs,
  respondToOffer,
  getJobById,
  updateJob,
  deleteJob,
};
