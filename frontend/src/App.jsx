import { useState, useEffect } from "react";
import "./App.css";
import { getMe } from "./api/index.js";
import useDarkMode from "./hooks/useDarkMode.js";
import LoginPage from "./pages/LoginPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import JDInputPage from "./pages/JDInputPage.jsx";
import CVUploadPage from "./pages/CVUploadPage.jsx";
import GapAnalysisPage from "./pages/GapAnalysisPage.jsx";
import CVRewritePage from "./pages/CVRewritePage.jsx";
import TemplateSelectPage from "./pages/TemplateSelectPage.jsx";
import ActionPlanPage from "./pages/ActionPlanPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import ProgressBar from "./components/ProgressBar.jsx";

const STEP_LABELS = ["Job Description", "Upload CV", "Gap Analysis", "CV Rewrite", "Choose Template", "Action Plan"];

function getPageTitle(nav, step) {
  if (nav === "analysis") return `Step ${step}: ${STEP_LABELS[step - 1]}`;
  if (nav === "history") return "History";
  if (nav === "settings") return "Settings";
  return "Dashboard";
}

export default function App() {
  const { isDark, toggleDark } = useDarkMode();
  const [user, setUser] = useState(null);
  const [nav, setNav] = useState("dashboard");
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [rewrittenCv, setRewrittenCv] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("ck_token");
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem("ck_token"));
    }
  }, []);

  function logout() {
    localStorage.removeItem("ck_token");
    setUser(null);
    setStep(1);
    setJobDescription("");
    setGapAnalysis(null);
    setRewrittenCv(null);
    setNav("dashboard");
  }

  function startNewAnalysis() {
    setStep(1);
    setJobDescription("");
    setGapAnalysis(null);
    setRewrittenCv(null);
    setNav("analysis");
  }

  function handleNavChange(target) {
    setNav(target);
    if (target === "analysis" && step === 0) setStep(1);
  }

  if (!user) return <LoginPage onLogin={setUser} />;

  const initials = user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="app-shell">
      <Sidebar nav={nav} setNav={handleNavChange} onLogout={logout} isDark={isDark} toggleDark={toggleDark} />

      <div className="main-content">
        {/* Top bar */}
        <div className="top-bar">
          <h1 className="page-title">{getPageTitle(nav, step)}</h1>
          <div className="top-bar-user">
            <span className="user-email-text">{user.email}</span>
            <div className="user-avatar">{initials}</div>
          </div>
        </div>

        {/* Page content */}
        <div className="page-content">
          {nav === "analysis" && <ProgressBar currentStep={step} />}

          {nav === "dashboard" && (
            <DashboardPage
              gapAnalysis={gapAnalysis}
              onStartAnalysis={startNewAnalysis}
              onViewHistory={() => setNav("history")}
            />
          )}

          {nav === "analysis" && step === 1 && (
            <JDInputPage onNext={(jd) => { setJobDescription(jd); setStep(2); }} />
          )}
          {nav === "analysis" && step === 2 && (
            <CVUploadPage
              jobDescription={jobDescription}
              onNext={(analysis) => { setGapAnalysis(analysis); setStep(3); }}
            />
          )}
          {nav === "analysis" && step === 3 && (
            <GapAnalysisPage gapAnalysis={gapAnalysis} onNext={() => setStep(4)} />
          )}
          {nav === "analysis" && step === 4 && (
            <CVRewritePage
              cvText={gapAnalysis.cv_text}
              jobDescription={jobDescription}
              gapAnalysis={gapAnalysis}
              onNext={(cv) => { setRewrittenCv(cv); setStep(5); }}
            />
          )}
          {nav === "analysis" && step === 5 && (
            <TemplateSelectPage
              cvResult={rewrittenCv}
              onNext={() => setStep(6)}
            />
          )}
          {nav === "analysis" && step === 6 && (
            <ActionPlanPage
              cvText={gapAnalysis.cv_text}
              jobDescription={jobDescription}
              gapAnalysis={gapAnalysis}
              onReset={() => setNav("dashboard")}
            />
          )}

          {nav === "history" && <HistoryPage />}

          {nav === "settings" && (
            <div className="card">
              <h2>Settings</h2>
              <p className="subtitle" style={{ marginTop: 6 }}>
                Account settings coming soon.
              </p>
            </div>
          )}

          <footer className="app-footer">
            Built by{" "}
            <a href="https://github.com/Guna1498/career-kompass-mvp" target="_blank" rel="noopener noreferrer">
              Guna1498 / career-kompass-mvp
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
