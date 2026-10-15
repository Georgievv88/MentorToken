import { Link } from "react-router-dom";
import { assets } from "../assets";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand-column">
          <Link to="/" className="footer-brand">
            <img src={assets.icon} alt="" />
            <span>Mentor Token</span>
          </Link>
          <p>
            With Mentor Token, every failure transforms into an opportunity for
            growth.
          </p>
        </div>

        <div>
          <h2>Pages</h2>
          <Link to="/">Home</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div>
          <h2>Contact</h2>
          <a>info@mentortoken.com</a>
          <a>+ (389) 123 456 789</a>
        </div>

        <div>
          <h2>Follow Us</h2>
          <div className="footer-socials">
            <a href="#linkedin" aria-label="LinkedIn">
              in
            </a>
            <a href="#twitter" aria-label="Twitter">
              ♥
            </a>
            <a href="#facebook" aria-label="Facebook">
              f
            </a>
          </div>
        </div>
      </div>
      <p className="footer-copyright">
        ©2026 Mentor Token. All right reserved.
      </p>
    </footer>
  );
}

export default Footer;
