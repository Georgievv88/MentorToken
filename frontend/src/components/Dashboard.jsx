import { assets } from "../assets";

function DashboardPreview() {
  return (
    <section className="dashboard-preview">
      <h2>
        Every <span>success</span> is rewarded!
      </h2>

      <div className="dashboard-frame">
        <img src={assets.grupa} alt="" className="dashboard-big-img" />

        <div className="dashboard-sidebar">
          <div>
            <div className="dashboard-logo">
              <img src={assets.icon} alt="" /> Mentor Token
            </div>

            <ul>
              <li>
                <img src={assets.kockice} alt="" />
                Dashboard
              </li>

              <li>
                <img src={assets.covece} alt="" />
                Mentors
              </li>

              <li>
                <img src={assets.krugce} alt="" />
                Tokens
              </li>
            </ul>
          </div>

          <p className="dashboard-preview-logout">
            <img src={assets.logout} alt="" />
            Logout
          </p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-search">
            <img src={assets.search} alt="" />
            <div className="search-box">Search Mentor...</div>
          </div>

          <div className="mentor-header">
            <div>
              <h3>Mentors</h3>
              <p>Monitor and add new mentors</p>
            </div>

            <div className="mentor-buttons">
              <button type="button">+ Add New Mentor</button>
              <button type="button">Create New Job</button>
            </div>
          </div>

          <div className="mentor-list">
            <div className="mentor-card">
              <img className="avatar" src={assets.slika7} alt="Kierra Press" />
              <div>
                <h4>Kierra Press</h4>
                <p>Skills: Sales | Management | Problem-solving</p>
                <small>
                  Find sales training — 5 years in a scalable sales position.
                </small>
              </div>
              <button type="button">View Mentor</button>
            </div>

            <div className="mentor-card">
              <img
                className="avatar"
                src={assets.slika3}
                alt="Alison Vetrovs"
              />
              <div>
                <h4>Alison Vetrovs</h4>
                <p>Skills: Sales | Management | Problem-solving</p>
                <small>
                  This sales representative position is an ID-based sales role.
                </small>
              </div>
              <button type="button">View Mentor</button>
            </div>

            <div className="mentor-card">
              <img className="avatar" src={assets.slika1} alt="Marcus Carter" />
              <div>
                <h4>Marcus Carter</h4>
                <p>Skills: Leadership | Management | Product sales</p>
                <small>
                  Field sales training — 5 years in an outside sales position.
                </small>
              </div>
              <button type="button">View Mentor</button>
            </div>
          </div>
        </div>

        <div className="overview-panel">
          <h3>Quick Overview</h3>
          <p>In the last month</p>

          <div className="stat-box">
            <small>Total Mentors</small>
            <strong>32</strong>
          </div>

          <div className="stat-box purple">
            <small>Assigned Jobs</small>
            <strong>63</strong>
          </div>

          <div className="stat-box">
            <small>Monthly Progress</small>
            <strong>19%</strong>
          </div>

          <div className="stat-box">
            <small>Tokens Reserved</small>
            <strong>35,125.00</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;
