import { useState, useEffect } from "react";
import { actionPlan } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import CoverLetterSection from "./CoverLetterSection.jsx";

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function ActionPlanPage({ cvText, jobDescription, gapAnalysis, onReset }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState([]);
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await actionPlan(cvText, jobDescription, gapAnalysis);
        setResult(data);
        setChecked(new Array(data.actions.length).fill(false));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggle(i) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  if (loading) return <div className="card"><Spinner /></div>;
  if (error) return <div className="card"><ErrorMessage message={error} /></div>;

  const { actions, total_hours, summary } = result;
  const completedCount = checked.filter(Boolean).length;

  return (
    <div className="card">
      <h2>Your Action Plan</h2>
      <p className="subtitle">
        A prioritised list of steps to close your skill gaps and land the role.
      </p>

      <div className="total-hours">
        <div className="number">{total_hours}h</div>
        <div className="label">Estimated total time investment</div>
      </div>

      <div className="summary-box" style={{ marginBottom: "20px" }}>{summary}</div>

      <div className="completed-counter">
        {completedCount} of {actions.length} completed
      </div>

      {actions.map((item, i) => (
        <div key={i} className={`action-item${checked[i] ? " completed" : ""}`}>
          <div className="action-header">
            <input
              type="checkbox"
              className="action-checkbox"
              checked={checked[i] || false}
              onChange={() => toggle(i)}
            />
            <span className="action-title">{item.action}</span>
            <span className={`impact-badge impact-${item.impact}`}>{item.impact}</span>
          </div>
          <div className="action-gap">{item.skill_gap_addressed}</div>
          <div className="action-meta">
            <span>{item.effort_hours}h effort</span>
            <span>{item.suggested_weeks} week{item.suggested_weeks !== 1 ? "s" : ""}</span>
          </div>
          {item.resource_url && (
            <a
              href={item.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-link"
            >
              {item.resource_url}
            </a>
          )}
        </div>
      ))}

      <button className="btn-outline" style={{ marginTop: "24px" }} onClick={onReset}>
        ↩ Start Over
      </button>

      {/* ── Want to go further? ── */}
      <div className="go-further-divider" />

      <div className="go-further-heading">Want to go further?</div>

      {!showCoverLetter ? (
        <div className="go-further-card">
          <div className="go-further-icon"><MailIcon /></div>
          <div className="go-further-body">
            <div className="go-further-title">Cover Letter Generator</div>
            <div className="go-further-desc">
              Turn your tailored CV into a matching cover letter in one click.
            </div>
          </div>
          <button className="btn-primary" style={{ margin: 0, whiteSpace: "nowrap" }} onClick={() => setShowCoverLetter(true)}>
            Try it →
          </button>
        </div>
      ) : (
        <CoverLetterSection
          cvText={cvText}
          jobDescription={jobDescription}
          onHide={() => setShowCoverLetter(false)}
        />
      )}
    </div>
  );
}
