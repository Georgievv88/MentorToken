const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/jobController");

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.get("/feed", protect, getJobFeed);
router.get("/mentors", protect, getMentors);
router.get("/mentors/:mentorId", protect, getMentorById);
router.post("/offers", protect, createJobOffer);
router.get("/offers/sent", protect, getSentOffers);
router.get("/startup/dashboard", protect, getStartupDashboardJobs);
router.get("/mentor/dashboard", protect, getMentorDashboardJobs);
router.patch("/:id/apply", protect, applyToJob);
router.patch("/:id/applicants/:mentorId", protect, respondToApplicant);
router.patch("/:id/respond", protect, respondToOffer);
router.get("/:id", protect, getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
