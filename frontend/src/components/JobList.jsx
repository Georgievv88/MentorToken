const statusLabels = {
  done: "Done",
  rejected: "Rejected",
  canceled: "Canceled",
  progress: "In Progress",
};

function JobList({
  jobs,
  actions = false,
  applications = false,
  onAccept,
  onReject,
  respondingId,
}) {
  return (
    <div className="portal-job-list">
      {jobs.map((job, index) => (
        <div className="portal-job-row" key={job.id || `${job.name}-${index}`}>
          <span>{job.name}</span>
          {actions ? (
            <div className="job-actions">
              <button
                type="button"
                className="accept-job"
                disabled={respondingId === job.id}
                onClick={() => onAccept(job)}
              >
                Accept
              </button>
              <button
                type="button"
                className="reject-job"
                disabled={respondingId === job.id}
                onClick={() => onReject(job)}
              >
                Reject
              </button>
            </div>
          ) : applications ? (
            <span className="application-clock">◷</span>
          ) : (
            <span className={`job-status ${job.status}`}>
              {statusLabels[job.status]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default JobList;
