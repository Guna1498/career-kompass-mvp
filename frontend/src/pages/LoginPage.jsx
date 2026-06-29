import { useState } from "react";
import { login, register } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fn = mode === "login" ? login : register;
      const result = await fn(email, password);
      if (!result.access_token) {
        setError("Account created — please check your email to confirm before signing in.");
        setMode("login");
        return;
      }
      localStorage.setItem("ck_token", result.access_token);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next) {
    setMode(next);
    setError("");
  }

  return (
    <div className="login-shell">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1D9E75" />
            <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="login-left-logo-text">Career Kompass</span>
        </div>
        <h2>Land your next role faster</h2>
        <p>AI-powered gap analysis, CV rewriting, and personalised action plans in minutes.</p>
        <div className="login-feature">
          <div className="login-feature-dot" />
          <span>Gap analysis against any job description</span>
        </div>
        <div className="login-feature">
          <div className="login-feature-dot" />
          <span>AI-rewritten CV bullets that match the JD</span>
        </div>
        <div className="login-feature">
          <div className="login-feature-dot" />
          <span>Prioritised action plan to close skill gaps</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-card">
          <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="subtitle">
            {mode === "login"
              ? "Sign in to access your analyses."
              : "Free account — no credit card required."}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
            <ErrorMessage message={error} />
            <button type="submit" className="btn-green" disabled={loading}>
              {loading ? <Spinner inline /> : null}
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
          <p className="toggle-auth">
            {mode === "login" ? (
              <>Don&apos;t have an account?{" "}
                <button className="link-btn" onClick={() => switchMode("register")}>Register</button>
              </>
            ) : (
              <>Already registered?{" "}
                <button className="link-btn" onClick={() => switchMode("login")}>Sign in</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
