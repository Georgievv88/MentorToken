import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import JobList from "../components/JobList";
import { assets } from "../assets";
import api from "../api/api";

function formatJobStatus(status) {
  if (["completed", "assigned"].includes(status)) return "done";
  if (status === "pending") return "progress";
  return status;
}

function StartupMentorProfile() {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [offers, setOffers] = useState([]);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMentorProfile() {
      try {
        const [mentorResponse, offersResponse] = await Promise.all([
          api.get(`/jobs/mentors/${mentorId}`),
          api.get(`/jobs/offers/sent?mentorId=${mentorId}`),
        ]);
        setMentor(mentorResponse.data);
        setOffers(offersResponse.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Failed to load mentor profile",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMentorProfile();
  }, [mentorId]);

  async function cancelOffer(offerId) {
    try {
      await api.delete(`/jobs/${offerId}`);
      setOffers((currentOffers) =>
        currentOffers.filter((offer) => offer._id !== offerId),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to cancel offer",
      );
    }
  }

  async function sendOffer(event) {
    event.preventDefault();
    setSending(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await api.post("/jobs/offers", {
        mentorId,
        title: formData.get("jobName"),
        description: formData.get("description"),
      });
      setOffers((currentOffers) => [response.data, ...currentOffers]);
      setOfferModalOpen(false);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to send job offer",
      );
    } finally {
      setSending(false);
    }
  }

  const pendingOffers = offers.filter((offer) => offer.status === "pending");
  const acceptedJobs = offers
    .filter((offer) => ["assigned", "completed"].includes(offer.status))
    .map((offer) => ({
      id: offer._id,
      name: offer.title,
      status: formatJobStatus(offer.status),
    }));

  return (
    <DashboardLayout
      accountType="startup"
      searchPlaceholder="Search Startup, KPI, Mentor..."
    >
      <div className="mentor-detail-page">
        <Link className="back-to-mentors" to="/startup/mentors">
          All Mentors
        </Link>

        {loading && <p className="dashboard-message">Loading mentor...</p>}
        {error && <p className="dashboard-message error">{error}</p>}

        {mentor && (
          <>
            <section className="mentor-summary-row">
              <article className="mentor-profile-card">
                <div className="mentor-profile-image-wrap">
                  <img
                    src={mentor.profileImage || assets.slika7}
                    alt={mentor.name}
                  />
                  <span></span>
                </div>
                <h1>{mentor.name}</h1>
                <p className="mentor-job-title">Mentor</p>
                <a href={`mailto:${mentor.email}`}>{mentor.email}</a>
                <a href={`tel:${mentor.phone}`}>{mentor.phone}</a>
              </article>

              <article className="mentor-about-card">
                <div className="mentor-about-heading">
                  <h2>About Mentor</h2>
                  <button type="button" onClick={() => setOfferModalOpen(true)}>
                    ＋ Offer New Job
                  </button>
                </div>
                <h3>Address: {mentor.address}</h3>
                <p>
                  Send this mentor a direct job offer. The offer will appear in
                  their Pending Jobs, where they can accept or reject it.
                </p>
              </article>
            </section>

            <section className="mentor-work-grid">
              <div className="portal-section">
                <h1>Accepted Jobs</h1>
                {acceptedJobs.length > 0 ? (
                  <JobList jobs={acceptedJobs} />
                ) : (
                  <p className="dashboard-message empty">No accepted jobs.</p>
                )}
              </div>

              <div className="portal-section pending-offers-section">
                <h1>Pending Job Offers</h1>
                <div className="pending-offers-list">
                  {pendingOffers.map((offer) => (
                    <div className="pending-offer-row" key={offer._id}>
                      <span>{offer.title}</span>
                      <button
                        type="button"
                        onClick={() => cancelOffer(offer._id)}
                      >
                        Cancel Offer
                      </button>
                    </div>
                  ))}
                  {pendingOffers.length === 0 && (
                    <p className="empty-offers">No pending job offers.</p>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {offerModalOpen && mentor && (
        <div
          className="offer-modal-backdrop"
          role="presentation"
          onMouseDown={() => setOfferModalOpen(false)}
        >
          <section
            className="offer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="offer-modal-close"
              aria-label="Close"
              onClick={() => setOfferModalOpen(false)}
            >
              ⊗
            </button>

            <h2 id="offer-modal-title">Offer Job</h2>
            <p>Create and offer job to {mentor.name}</p>

            <form onSubmit={sendOffer}>
              <label className="offer-modal-field highlighted">
                <span>Job Name</span>
                <input
                  name="jobName"
                  placeholder="Expansion Revenue – Upsell and Cross-Sell"
                  required
                  autoFocus
                />
              </label>

              <label className="offer-modal-field">
                <span>Short Description</span>
                <textarea
                  name="description"
                  placeholder="Write short description about job offering"
                  required
                />
              </label>

              <button
                className="send-offer-button"
                type="submit"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Job Offer"}
              </button>
            </form>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

export default StartupMentorProfile;
