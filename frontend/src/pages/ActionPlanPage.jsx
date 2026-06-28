import { useState, useEffect } from "react";
import { actionPlan } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function ActionPlanPage({ cvText, jobDescription, gapAnalysis }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await actionPlan(cvText, jobDescription, gapAnalysis);
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="card"><Spinner /></div>;
  if (error) return <div className="card"><ErrorMessage message={error} /></div>;

  const { actions, total_hours, summary } = result;

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

      <div className="summary-box" style={{ marginBottom: "24px" }}>{summary}</div>

      {actions.map((item, i) => (
        <div key={i} className="action-item">
          <div className="action-header">
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
    </div>
  );
}
