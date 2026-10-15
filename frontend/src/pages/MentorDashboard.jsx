import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import JobList from "../components/JobList";
import api from "../api/api";

function formatJobStatus(job) {
  if (job.status === "completed") return "done";
  if (job.status === "pending") return "progress";
  if (job.status === "assigned") {
    return job.offerType === "direct" ? "done" : "progress";
  }
  return job.status;
}

function MentorDashboard() {
  const [pendingOffers, setPendingOffers] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [respondingId, setRespondingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardJobs() {
      try {
        const response = await api.get("/jobs/mentor/dashboard");
        setPendingOffers(response.data.pendingOffers);
        setAssignedJobs(response.data.assignedJobs);
        setApplications(response.data.applications);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Failed to load mentor jobs",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardJobs();
  }, []);

  async function respondToOffer(job, response) {
    setRespondingId(job.id);
    setError("");

    try {
      const request = await api.patch(`/jobs/${job.id}/respond`, { response });
      setPendingOffers((currentOffers) =>
        currentOffers.filter((offer) => offer._id !== job.id),
      );
      setAssignedJobs((currentJobs) => {
        const updatedJob = { ...job.original, ...request.data };
        const jobExists = currentJobs.some(
          (currentJob) => currentJob._id === job.id,
        );

        if (!jobExists) {
          return [updatedJob, ...currentJobs];
        }

        return currentJobs.map((currentJob) =>
          currentJob._id === job.id ? updatedJob : currentJob,
        );
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to respond to offer",
      );
    } finally {
      setRespondingId("");
    }
  }

  const assignedList = assignedJobs.map((job) => ({
    id: job._id,
    name: job.title,
    status: formatJobStatus(job),
  }));
  const pendingList = pendingOffers.map((job) => ({
    id: job._id,
    name: job.title,
    original: job,
  }));
  const applicationList = applications.map((job) => ({
    id: job._id,
    name: job.title,
  }));
  const visibleAssignedJobs =
    filter === "all"
      ? assignedList
      : assignedList.filter((job) => job.status === filter);

  return (
    <DashboardLayout accountType="mentor">
      {error && <p className="dashboard-message error">{error}</p>}
      {loading && <p className="dashboard-message">Loading jobs...</p>}

      <div className="portal-dashboard-grid mentor-dashboard-grid">
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
          {visibleAssignedJobs.length > 0 ? (
            <JobList jobs={visibleAssignedJobs} />
          ) : (
            !loading && <p className="dashboard-message empty">No jobs here.</p>
          )}
        </section>

        <div className="mentor-right-column">
          <section className="portal-section pending-section">
            <h1>Pending Jobs</h1>
            <p>Jobs offered from startups</p>
            {pendingList.length > 0 ? (
              <JobList
                jobs={pendingList}
                actions
                respondingId={respondingId}
                onAccept={(job) => respondToOffer(job, "accept")}
                onReject={(job) => respondToOffer(job, "reject")}
              />
            ) : (
              !loading && (
                <p className="dashboard-message empty">No pending offers.</p>
              )
            )}
          </section>

          <section className="portal-section applications-section">
            <h1>Applications sent</h1>
            <p>Jobs you have applied to</p>
            {applicationList.length > 0 ? (
              <JobList jobs={applicationList} applications />
            ) : (
              !loading && (
                <p className="dashboard-message empty">No applications sent.</p>
              )
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MentorDashboard;
