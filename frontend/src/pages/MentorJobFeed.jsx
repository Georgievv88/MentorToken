import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { assets } from "../assets";
import api from "../api/api";

const jobLogos = [
  assets.job1,
  assets.job2,
  assets.job3,
  assets.job4,
  assets.job5,
  assets.job6,
  assets.job7,
];

function MentorJobFeed() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await api.get("/jobs/feed");
        setJobs(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  async function applyToJob() {
    setApplying(true);
    setError("");

    try {
      await api.patch(`/jobs/${selectedJob._id}/apply`);
      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== selectedJob._id),
      );
      setMessage("Application sent successfully.");
      setSelectedJob(null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to apply to job",
      );
    } finally {
      setApplying(false);
    }
  }

  return (
    <DashboardLayout accountType="mentor" searchPlaceholder="Search">
      <section className="mentor-job-feed-page">
        <h1>All Startup Jobs</h1>

        <div className="job-feed-controls">
          <div className="job-feed-selects">
            <label>
              <span>Sort by:</span>
              <select defaultValue="newest">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>

            <label>
              <span>Category:</span>
              <select defaultValue="all">
                <option value="all">All Category</option>
                <option value="sales">Sales</option>
                <option value="management">Management</option>
                <option value="development">Development</option>
              </select>
            </label>
          </div>

          <div className="job-feed-view-actions">
            <button type="button">≡ Filters</button>
            <button
              type="button"
              className="grid-view-button"
              aria-label="Grid view"
            >
              ▦
            </button>
          </div>
        </div>

        {message && <p className="dashboard-message success">{message}</p>}
        {error && <p className="dashboard-message error">{error}</p>}
        {loading && <p className="dashboard-message">Loading jobs...</p>}
        {!loading && !error && jobs.length === 0 && (
          <p className="dashboard-message empty">No open jobs available.</p>
        )}

        <div className="mentor-job-feed-grid">
          {jobs.map((job, index) => {
            const logo = jobLogos[index % jobLogos.length];

            return (
              <article className="mentor-feed-card" key={job._id}>
                <div className="job-company-row">
                  <img
                    className="job-company-logo"
                    src={logo}
                    alt={job.startupName}
                  />
                  <div>
                    <strong>{job.startupName}</strong>
                    <span>{job.category}</span>
                  </div>
                </div>

                <h2>{job.title}</h2>
                <p>{job.description}</p>
                <button
                  type="button"
                  onClick={() => setSelectedJob({ ...job, logo })}
                >
                  View More
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {selectedJob && (
        <div
          className="job-details-backdrop"
          role="presentation"
          onMouseDown={() => setSelectedJob(null)}
        >
          <section
            className="job-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-details-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="job-details-close"
              type="button"
              aria-label="Close job details"
              onClick={() => setSelectedJob(null)}
            >
              ×
            </button>

            <div className="job-details-company">
              <img src={selectedJob.logo} alt={selectedJob.startupName} />
              <div>
                <strong>{selectedJob.startupName}</strong>
                <span>{selectedJob.category}</span>
              </div>
            </div>

            <h2 id="job-details-title">{selectedJob.title}</h2>
            <p>{selectedJob.description}</p>

            <button
              type="button"
              className="apply-job-button"
              disabled={applying}
              onClick={applyToJob}
            >
              {applying ? "Applying..." : "Apply"}
            </button>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

export default MentorJobFeed;
