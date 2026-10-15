import DashboardLayout from "../components/DashboardLayout";
import { assets } from "../assets";

const overview = [
  { label: "Total Jobs", value: 132 },
  { label: "Total Assigned Jobs", value: 43 },
  { label: "Jobs That You Have Applied", value: 21 },
  { label: "Finished Jobs", value: 63, highlighted: true },
];

function MentorStats() {
  return (
    <DashboardLayout accountType="mentor" searchPlaceholder="Search">
      <section className="mentor-stats-page">
        <h1 className="mentor-stats-title">My Stats</h1>

        <div className="mentor-stats-summary">
          <article className="mentor-profile-card stats-profile-card">
            <div className="mentor-profile-image-wrap">
              <img src={assets.slika7} alt="Kierra Press" />
            </div>
            <h1>
              Kierra Press <small>in</small>
            </h1>
            <p className="mentor-job-title">Sales Representative</p>
            <a href="mailto:mentormail@mail.com">mentormail@mail.com</a>
            <a href="tel:+38977663234">+389 77 663 234</a>
          </article>

          <article className="mentor-stats-about">
            <div className="mentor-stats-about-heading">
              <h2>About</h2>
              <button type="button" aria-label="Edit profile">
                <img src={assets.editicon} alt="" />
              </button>
            </div>
            <h3>Skills: Sales | Management | Problem-solving</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur. Suspendisse quis varius
              felis augue adipiscing. Sapien volutpat ac velit facilisis
              fermentum diam bibendum libero non. Semper morbi at congue
              pellentesque pharetra amet rhoncus elit quis. Lorem ipsum dolor
              sit amet consectetur. Suspendisse quis varius felis augue
              adipiscing. Sapien volutpat ac velit facilisis fermentum diam
              bibendum libero non. Semper morbi at congue pellentesque pharetra
              amet rhoncus elit quis.
            </p>
          </article>
        </div>

        <div className="mentor-performance-grid">
          <section>
            <h2>Performance Over Time</h2>
            <div className="mentor-performance-card">
              <h3>Statistics</h3>
              <p>Overall target accomplishment over the year</p>
              <img src={assets.graph} alt="Performance over time" />
            </div>
          </section>

          <section className="mentor-overview-section">
            <h2>Quick Overview</h2>
            <div className="mentor-overview-list">
              {overview.map((item) => (
                <article
                  className={item.highlighted ? "highlighted" : ""}
                  key={item.label}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default MentorStats;
