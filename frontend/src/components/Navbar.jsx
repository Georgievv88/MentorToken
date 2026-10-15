import Button from "./Button";
import { assets } from "../assets";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img src={assets.icon} alt="Mentor Token logo" className="brand-img" />
        <span>Mentor Token</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <div className="nav-actions">
        <a href="/startup/login" className="login-link">
          Login
        </a>
        <Button href="/startup/register" variant="primary">
          → Get Started
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
