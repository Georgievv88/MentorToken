import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import JobList from "../components/JobList";
import { assets } from "../assets";
import api from "../api/api";

const mentors = [
  { name: "Lucie Weber", jobs: 18, image: assets.slika4 },
  { name: "Crystal Porter", jobs: 51, image: assets.slika2 },
  { name: "Thomas Rose", jobs: 22, image: assets.slika5 },
];

function formatJobStatus(job) {
  if (job.status === "completed") return "done";
  if (job.status === "rejected" || job.status === "cancelled") {
    return "rejected";
  }
  if (job.offerType === "direct" && job.status === "assigned") {
    return "done";
  }
  return "progress";
}

function StartupDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardJobs() {
      try {
        const response = await api.get("/jobs/startup/dashboard");
        setJobs(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load startup jobs",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardJobs();
  }, []);

  const assignedJobs = jobs.map((job) => ({
    id: job._id,
    name: job.title,
    status: formatJobStatus(job),
  }));
  const visibleJobs =
    filter === "all"
      ? assignedJobs
      : assignedJobs.filter((job) => job.status === filter);

  return (
    <DashboardLayout accountType="startup">
      {error && <p className="dashboard-message error">{error}</p>}
      {loading && <p className="dashboard-message">Loading jobs...</p>}

      <div className="portal-dashboard-grid startup-dashboard-grid">
        <section className="portal-section assigned-section">
          <h1>Assigned Jobs</h1>
          <div className="job-tabs">
            <button
              className={filter === "all" ? "active" : ""}
              type="button"
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "done" ? "active" : ""}
              type="button"
              onClick={() => setFilter("done")}
            >
              Done
            </button>
            <button
              className={filter === "rejected" ? "active" : ""}
              type="button"
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </button>
            <button
              className={filter === "progress" ? "active" : ""}
              type="button"
              onClick={() => setFilter("progress")}
            >
              In Progress
            </button>
          </div>
          {visibleJobs.length > 0 ? (
            <JobList jobs={visibleJobs} />
          ) : (
            !loading && <p className="dashboard-message empty">No jobs here.</p>
          )}
        </section>

        <div className="startup-right-column">
          <section className="portal-section">
            <h1>Best Performing Mentors</h1>
            <div className="mentor-ranking-card">
              {mentors.map((mentor) => (
                <div className="mentor-ranking-row" key={mentor.name}>
                  <img
                    className="mentor-ranking-avatar"
                    src={mentor.image}
                    alt={mentor.name}
                  />
                  <span>{mentor.name}</span>
                  <strong>
                    {mentor.jobs}
                    <small>Achieved Jobs</small>
                  </strong>
                  <img className="mentor-ranking-arrow" src={assets.strelka} alt="" />
                </div>
              ))}
            </div>
          </section>

          <section className="portal-section statistics-section">
            <h2>Overall statistic</h2>
            <div className="statistics-card">
              <img
                className="statistics-graph"
                src={assets.graph}
                alt="Annual target statistics"
              />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StartupDashboard;
