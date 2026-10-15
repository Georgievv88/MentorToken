import { Link } from "react-router-dom";
import { assets } from "../assets";
import "./Auth.css";

function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <aside className="auth-visual">
        <div className="auth-message">
          <h1>
            Grow
            <br />
            your
            <br />
            Startup!
          </h1>
          <p>Monitoring and evaluating now is easy!</p>
        </div>

        <img className="auth-rocket" src={assets.raketa} alt="Rocket" />

        <Link to="/" className="auth-brand">
          <span>
            <img src={assets.icon} alt="" /> Mentor Token
          </span>
          <small>mentortoken.com</small>
        </Link>
      </aside>

      <section className="auth-panel">
        <div className="auth-panel-inner">{children}</div>
      </section>
    </main>
  );
}

export default AuthLayout;
