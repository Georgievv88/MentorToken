import { assets } from "../assets";

function Features() {
  return (
    <section className="features-section" id="about">
      <img src={assets.raketa} alt="Rocket" className="rocket-big" />
      <p className="section-label">FEATURES</p>

      <h2>
        Boost Your Startup's Journey:
        <br />
        Discover Mentor Token's Robust
        <br />
        Features
      </h2>

      <div className="features-grid">
        <div className="feature-card">
          <img
            src={assets.raketice}
            alt="Goal setting"
            className="feature-icon-img"
          />
          <h3>Goal Setting</h3>
          <p>Set clear and achievable goals for your startup's success.</p>
        </div>

        <div className="feature-card">
          <img
            src={assets.slikice}
            alt="Performance tracking"
            className="feature-icon-img"
          />
          <h3>Performance Tracking</h3>
          <p>Monitor mentor performance in real-time and track progress.</p>
        </div>

        <div className="feature-card">
          <img
            src={assets.medal}
            alt="Reward system"
            className="feature-icon-img"
          />
          <h3>Reward System</h3>
          <p>
            Motivate mentors with a secure and rewarding token-based reward
            system.
          </p>
        </div>

        <div className="feature-card">
          <img
            src={assets.knigice}
            alt="Knowledge library"
            className="feature-icon-img"
          />
          <h3>Knowledge Library</h3>
          <p>
            Access a comprehensive knowledge library to equip mentors with
            skills and motivation.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;
