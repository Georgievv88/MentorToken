import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets";
import api from "../api/api";
import "./PortalDashboard.css";

const startupLinks = [
  { label: "Dashboard", icon: assets.kockice, path: "/startup/dashboard" },
  { label: "Mentors", icon: assets.covece, path: "/startup/mentors" },
  { label: "Jobs", icon: assets.krugce, path: "/startup/jobs" },
];

const mentorLinks = [
  { label: "Dashboard", icon: assets.kockice, path: "/mentor/dashboard" },
  { label: "My Stats", icon: assets.trello, path: "/mentor/stats" },
  { label: "Job Feed", icon: assets.krugce, path: "/mentor/jobs" },
];

function DashboardLayout({ accountType, children, searchPlaceholder }) {
  const navigate = useNavigate();
  const isStartup = accountType === "startup";
  const links = isStartup ? startupLinks : mentorLinks;
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [displayName, setDisplayName] = useState(
    storedUser.displayName || (isStartup ? "Startup" : "Mentor"),
  );
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/auth/me");
        setDisplayName(response.data.user.displayName);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch {
        return;
      }
    }

    loadProfile();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="portal-page">
      <aside className="portal-sidebar">
        <div>
          <div className="portal-brand-row">
            <Link to="/" className="portal-brand">
              <img src={assets.icon} alt="" />
              <span>Mentor Token</span>
            </Link>
            <button
              type="button"
              className="sidebar-collapse"
              aria-label="Collapse menu"
            >
              ‹
            </button>
          </div>

          <nav className="portal-nav">
            {links.map((link) => (
              <NavLink key={link.label} to={link.path}>
                <img className="portal-nav-icon" src={link.icon} alt="" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button type="button" className="portal-logout" onClick={logout}>
          <img src={assets.logout} alt="" /> <span>Logout</span>
        </button>
      </aside>

      <main className="portal-main">
        <header className="portal-topbar">
          <label className="portal-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder={
                searchPlaceholder || (isStartup ? "Search Mentor..." : "Search")
              }
            />
          </label>

          <div className="portal-profile">
            {isStartup ? (
              <div className="company-avatar">{initials}</div>
            ) : (
              <img src={assets.slika7} alt={displayName} />
            )}
            <div>
              <strong>{displayName}</strong>
              {!isStartup && <small>Mentor</small>}
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
