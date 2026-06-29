import { useState, useEffect } from "react";
import { getAnalyses } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function scoreBadgeClass(score) {
  if (score >= 70) return "impact-low";
  if (score >= 40) return "impact-medium";
  return "impact-high";
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalyses()
      .then(setAnalyses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card"><Spinner /></div>;
  if (error) return <div className="card"><ErrorMessage message={error} /></div>;

  if (analyses.length === 0) {
    return (
      <div className="card">
        <h2>Analysis History</h2>
        <p className="subtitle" style={{ marginTop: 8 }}>
          No analyses yet. Complete your first CV analysis and it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 18 }}>
        <h2>Analysis History</h2>
        <p className="subtitle" style={{ marginTop: 4, marginBottom: 0 }}>
          Your past CV analyses, most recent first.
        </p>
      </div>
      <div className="history-grid">
        {analyses.map((a) => (
          <div key={a.id} className="history-card">
            <div className="history-meta">
              <span className="history-date">{formatDate(a.created_at)}</span>
              <span className={`impact-badge ${scoreBadgeClass(a.match_score)}`}>
                {a.match_score}% match
              </span>
            </div>
            <p className="history-snippet">
              {a.job_description?.slice(0, 120)}{a.job_description?.length > 120 ? "…" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
