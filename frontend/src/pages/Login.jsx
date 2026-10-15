import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { assets } from "../assets";
import { useState } from "react";
import api from "../api/api";

function Login() {
  const { accountType } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!["startup", "mentor"].includes(accountType)) {
    return <Navigate to="/startup/login" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await api.post("/auth/login", loginData);
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(`/${data.user.accountType}/dashboard`);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-login-card">
        <img className="auth-logo" src={assets.icon} alt="Mentor Token" />
        <h2>Log in to Mentor Token</h2>
        <p className="auth-subtitle">Enter your email and pass to login.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field auth-field-highlighted">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder={
                accountType === "mentor"
                  ? "mentormail@mail.com"
                  : "mentortoken@mail.com"
              }
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </label>

          <a className="forgot-link" href="#forgot">
            Forgot password?
          </a>
          {error && <p className="auth-error">{error}</p>}
          <button
            className="auth-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch-link">
          Don&apos;t have account?{" "}
          <Link to={`/${accountType}/register`}>Register.</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;
