import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { assets } from "../assets";
import api from "../api/api";

function Register() {
  const { accountType } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!["startup", "mentor"].includes(accountType)) {
    return <Navigate to="/startup/register" replace />;
  }

  const isStartup = accountType === "startup";

  function selectAccount(type) {
    navigate(`/${type}/register`);
  }

  function continueRegistration(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setCredentials({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    setError("");
    setStep(2);
  }

  async function finishRegistration(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const requestBody = isStartup
      ? {
          email: credentials.email,
          password: credentials.password,
          accountType: "startup",
          startupName: formData.get("startupName"),
          legalRepresentative: formData.get("representative"),
          businessAddress: formData.get("address"),
          mentorEmail: formData.get("mentorEmail"),
        }
      : {
          email: credentials.email,
          password: credentials.password,
          accountType: "mentor",
          name: formData.get("mentorName"),
          phone: formData.get("phone"),
          address: formData.get("address"),
        };

    try {
      const response = await api.post("/auth/register", requestBody);
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(`/${data.user.accountType}/dashboard`);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-register-card">
        <img className="auth-logo" src={assets.icon} alt="Mentor Token" />

        {step === 1 ? (
          <>
            <h2>Choose account type</h2>
            <div className="account-tabs" role="group" aria-label="Account type">
              <button
                className={isStartup ? "selected" : ""}
                type="button"
                onClick={() => selectAccount("startup")}
              >
                Startup
              </button>
              <button
                className={!isStartup ? "selected" : ""}
                type="button"
                onClick={() => selectAccount("mentor")}
              >
                Mentor
              </button>
            </div>

            <form className="auth-form register-first-form" onSubmit={continueRegistration}>
              <label className="auth-field auth-field-highlighted">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder={isStartup ? "mentortoken@mail.com" : "mentormail@mail.com"}
                  required
                />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input type="password" name="password" placeholder="Password" minLength="8" required />
              </label>

              <ul className="password-rules">
                <li>Password Strength: Weak</li>
                <li>Cannot contain your name or email address</li>
                <li>At least 8 characters</li>
                <li>Contains a number or symbol</li>
              </ul>

              <button className="auth-primary-button" type="submit">Continue</button>
            </form>

            <p className="auth-switch-link">
              Already have account? <Link to={`/${accountType}/login`}>Login.</Link>
            </p>
          </>
        ) : (
          <>
            <h2>Setup {isStartup ? "Startup" : "Mentor"} Account</h2>
            <div className="profile-image-placeholder" aria-label="Add profile image">
              <span>{isStartup ? "▣" : "♙"}</span>
              <small>▧</small>
            </div>

            <form className="auth-form setup-form" onSubmit={finishRegistration}>
              {isStartup ? (
                <>
                  <label className="auth-field auth-field-highlighted">
                    <span>Startup Name</span>
                    <input name="startupName" placeholder="My Startup Name" required />
                  </label>
                  <label className="auth-field">
                    <span>Legal Representative *</span>
                    <input name="representative" placeholder="Name and surname" required />
                  </label>
                  <label className="auth-field">
                    <span>Registered Business Address *</span>
                    <input name="address" placeholder="Registered Business Address" required />
                  </label>
                  <label className="auth-field">
                    <span>Invite Mentors via email</span>
                    <input type="email" name="mentorEmail" placeholder="Enter email address to invite mentor" />
                  </label>
                </>
              ) : (
                <>
                  <label className="auth-field auth-field-highlighted">
                    <span>Mentor Name</span>
                    <input name="mentorName" placeholder="Name and surname" required />
                  </label>
                  <label className="auth-field">
                    <span>Phone</span>
                    <input type="tel" name="phone" placeholder="Phone" required />
                  </label>
                  <label className="auth-field">
                    <span>Address</span>
                    <input name="address" placeholder="Address" required />
                  </label>
                </>
              )}

              {error && <p className="auth-error">{error}</p>}
              <button
                className="auth-primary-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <label className="terms-check">
                <input type="checkbox" required />
                <span>
                  By signing up to create an account I accept Company&apos;s
                  <a href="#terms"> Terms of use</a> &amp; <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default Register;
