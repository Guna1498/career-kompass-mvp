import { useState, useEffect } from "react";
import { actionPlan } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function ActionPlanPage({ cvText, jobDescription, gapAnalysis, onReset }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState([]);

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
    </div>
  );
}
