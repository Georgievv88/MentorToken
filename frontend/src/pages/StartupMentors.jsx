import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { assets } from "../assets";
import api from "../api/api";

const mentorImages = [
  assets.slika7,
  assets.slika1,
  assets.slika2,
  assets.slika3,
  assets.slika4,
  assets.slika5,
  assets.slika6,
];

function StartupMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMentors() {
      try {
        const response = await api.get("/jobs/mentors");
        setMentors(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Failed to load mentors",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMentors();
  }, []);

  return (
    <DashboardLayout accountType="startup" searchPlaceholder="Search Mentor...">
      <section className="startup-mentors-page">
        <div className="startup-mentors-heading">
          <div>
            <h1>Mentors</h1>
            <p>View mentor profiles and offer them jobs</p>
          </div>
          <strong>{mentors.length} mentors</strong>
        </div>

        {loading && <p className="dashboard-message">Loading mentors...</p>}
        {error && <p className="dashboard-message error">{error}</p>}
        {!loading && !error && mentors.length === 0 && (
          <p className="dashboard-message empty">No mentors available yet.</p>
        )}

        <div className="startup-mentor-grid">
          {mentors.map((mentor, index) => (
            <article className="startup-mentor-card" key={mentor.id}>
              <img
                src={mentor.profileImage || mentorImages[index % mentorImages.length]}
                alt={mentor.name}
              />
              <h2>{mentor.name}</h2>
              <p>{mentor.email}</p>
              <span>{mentor.address}</span>
              <Link to={`/startup/mentors/${mentor.id}`}>View Profile</Link>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default StartupMentors;
