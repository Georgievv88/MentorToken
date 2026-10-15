import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { assets } from "../assets";
import api from "../api/api";

const jobImages = [
  assets.job1,
  assets.job2,
  assets.job3,
  assets.job4,
  assets.job5,
  assets.job6,
  assets.job7,
];

const applicantImages = [
  assets.slika1,
  assets.slika2,
  assets.slika3,
  assets.slika4,
  assets.slika5,
  assets.slika6,
  assets.slika7,
];

function StartupJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [respondingApplicantId, setRespondingApplicantId] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  async function createJob(event) {
    event.preventDefault();
    setCreating(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const jobData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
    };

    try {
      const response = await api.post("/jobs", jobData);
      setJobs((currentJobs) => [response.data, ...currentJobs]);
      setCreateModalOpen(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create job");
    } finally {
      setCreating(false);
    }
  }

  async function updateJob(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const jobData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      status: formData.get("status"),
    };

    try {
      const response = await api.put(`/jobs/${selectedJob._id}`, jobData);
      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job._id === response.data._id ? response.data : job,
        ),
      );
      setSelectedJob(response.data);
      setEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob() {
    const confirmed = window.confirm("Are you sure you want to delete this job?");

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/jobs/${selectedJob._id}`);
      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== selectedJob._id),
      );
      setSelectedJob(null);
      setEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to delete job");
    }
  }

  async function respondToApplicant(applicantId, response) {
    setRespondingApplicantId(applicantId);
    setError("");

    try {
      const request = await api.patch(
        `/jobs/${selectedJob._id}/applicants/${applicantId}`,
        { response },
      );
      setSelectedJob(request.data);
      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job._id === request.data._id ? request.data : job,
        ),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to respond to applicant",
      );
    } finally {
      setRespondingApplicantId("");
    }
  }

  return (
    <DashboardLayout accountType="startup" searchPlaceholder="Search Mentor...">
      <section className="startup-jobs-page">
        <div className="startup-jobs-heading">
          <h1>Your Startup Jobs</h1>
          <button type="button" onClick={() => setCreateModalOpen(true)}>
            ＋ Create New Job
          </button>
        </div>

        {error && <p className="dashboard-message error">{error}</p>}
        {loading && <p className="dashboard-message">Loading jobs...</p>}
        {!loading && jobs.length === 0 && (
          <p className="dashboard-message empty">
            You have not created any jobs yet.
          </p>
        )}

        <div className="startup-job-cards">
          {jobs.map((job, index) => (
            <article className="startup-job-card" key={job._id}>
              <div className="job-company-row">
                <img
                  className="job-company-logo"
                  src={jobImages[index % jobImages.length]}
                  alt="TechWave Innovations"
                />
                <div>
                  <strong>TechWave</strong>
                  <span>Innovations</span>
                </div>
              </div>

              <h2>{job.title}</h2>
              <p>{job.description}</p>

              <div className="job-card-footer">
                <div className="job-applicants">
                  <div className="job-applicant-avatars">
                    {job.applicants?.slice(0, 3).map((applicant, applicantIndex) => (
                      <Link
                        to={`/startup/mentors/${applicant.id}`}
                        key={applicant.id}
                        aria-label={`View ${applicant.name}`}
                      >
                        <img
                          src={
                            applicant.profileImage ||
                            applicantImages[applicantIndex % applicantImages.length]
                          }
                          alt={applicant.name}
                        />
                      </Link>
                    ))}
                  </div>
                  <small>{job.applicants?.length || 0} Applicants</small>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJob(job);
                    setEditing(false);
                  }}
                >
                  View Job
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {createModalOpen && (
        <div
          className="create-job-backdrop"
          role="presentation"
          onMouseDown={() => setCreateModalOpen(false)}
        >
          <section
            className="create-job-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-job-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="create-job-close"
              aria-label="Close"
              onClick={() => setCreateModalOpen(false)}
            >
              ×
            </button>

            <h2 id="create-job-title">Create New Job</h2>
            <p>Add a new opportunity for your startup.</p>

            <form onSubmit={createJob}>
              <label className="create-job-field">
                <span>Job Title</span>
                <input name="title" placeholder="New Job Offer" required autoFocus />
              </label>

              <label className="create-job-field">
                <span>Category</span>
                <select name="category" defaultValue="General">
                  <option>General</option>
                  <option>Sales</option>
                  <option>Management</option>
                  <option>Development</option>
                </select>
              </label>

              <label className="create-job-field">
                <span>Description</span>
                <textarea
                  name="description"
                  placeholder="Write a short description about the job"
                  required
                />
              </label>

              <button
                className="create-job-submit"
                type="submit"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Job"}
              </button>
            </form>
          </section>
        </div>
      )}

      {selectedJob && (
        <div
          className="manage-job-backdrop"
          role="presentation"
          onMouseDown={() => {
            setSelectedJob(null);
            setEditing(false);
          }}
        >
          <section
            className="manage-job-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-job-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="manage-job-close"
              aria-label="Close"
              onClick={() => {
                setSelectedJob(null);
                setEditing(false);
              }}
            >
              ×
            </button>

            <h2 id="manage-job-title">
              {editing ? "Edit Job" : "Job Details"}
            </h2>

            {editing ? (
              <form className="manage-job-form" onSubmit={updateJob}>
                <label className="create-job-field">
                  <span>Job Title</span>
                  <input name="title" defaultValue={selectedJob.title} required />
                </label>

                <label className="create-job-field">
                  <span>Category</span>
                  <select name="category" defaultValue={selectedJob.category}>
                    <option>General</option>
                    <option>Sales</option>
                    <option>Management</option>
                    <option>Development</option>
                  </select>
                </label>

                <label className="create-job-field">
                  <span>Status</span>
                  <select name="status" defaultValue={selectedJob.status}>
                    <option value="open">Open</option>
                    <option value="assigned">Assigned</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>

                <label className="create-job-field">
                  <span>Description</span>
                  <textarea
                    name="description"
                    defaultValue={selectedJob.description}
                    required
                  />
                </label>

                <div className="manage-job-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="manage-job-details">
                <span className={`manage-job-status ${selectedJob.status}`}>
                  {selectedJob.status}
                </span>
                <h3>{selectedJob.title}</h3>
                <small>{selectedJob.category}</small>
                <p>{selectedJob.description}</p>
                <div className="manage-job-applicants">
                  <strong>
                    {selectedJob.applicants?.length || 0} applicants
                  </strong>
                  {selectedJob.applicants?.map((applicant) => (
                    <div className="applicant-review-row" key={applicant.id}>
                      <Link to={`/startup/mentors/${applicant.id}`}>
                        {applicant.name}
                      </Link>
                      {selectedJob.status === "open" && (
                        <div>
                          <button
                            type="button"
                            className="accept-applicant"
                            disabled={respondingApplicantId === applicant.id}
                            onClick={() =>
                              respondToApplicant(applicant.id, "accept")
                            }
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="reject-applicant"
                            disabled={respondingApplicantId === applicant.id}
                            onClick={() =>
                              respondToApplicant(applicant.id, "reject")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="manage-job-actions">
                  <button
                    type="button"
                    className="danger"
                    onClick={deleteJob}
                  >
                    Delete Job
                  </button>
                  <button type="button" onClick={() => setEditing(true)}>
                    Edit Job
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

export default StartupJobs;
