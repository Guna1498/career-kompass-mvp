import { useState, useEffect } from "react";
import { getAnalyses } from "../api/index.js";
import ScoreRing from "../components/ScoreRing.jsx";

export default function DashboardPage({ gapAnalysis, onStartAnalysis, onViewHistory }) {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    getAnalyses()
      .then(setAnalyses)
      .catch(() => {});
  }, [gapAnalysis]); // re-fetch after a new analysis completes

  const totalCount = analyses.length;
  const avgScore = totalCount > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.match_score || 0), 0) / totalCount)
    : null;
  const bestScore = totalCount > 0
    ? Math.max(...analyses.map(a => a.match_score || 0))
    : null;
  const now = new Date();
  const thisMonth = analyses.filter(a => {
    const d = new Date(a.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div>
      {/* Metric cards */}
      <div className="metrics-grid">
        <div className="metric-card dark">
          <div className="metric-label">Total Analyses</div>
          <div className="metric-value">{totalCount}</div>
          <div className="metric-sub">All time</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Average Score</div>
          <div className="metric-value">{avgScore !== null ? `${avgScore}%` : "—"}</div>
          <div className="metric-sub">Across all analyses</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Best Score</div>
          <div className="metric-value">{bestScore !== null ? `${bestScore}%` : "—"}</div>
          <div className="metric-sub">Personal best</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">This Month</div>
          <div className="metric-value">{thisMonth}</div>
          <div className="metric-sub">Analyses run</div>
        </div>
      </div>

      {/* Latest analysis results or empty state */}
      {gapAnalysis ? (
        <LatestResults
          gapAnalysis={gapAnalysis}
          onNewAnalysis={onStartAnalysis}
          onViewHistory={onViewHistory}
        />
      ) : (
        <EmptyState onStartAnalysis={onStartAnalysis} />
      )}
    </div>
  );
}

function LatestResults({ gapAnalysis, onNewAnalysis, onViewHistory }) {
  const { match_score, matched_skills, missing_skills, transferable_skills, summary } = gapAnalysis;

  return (
    <div>
      <div className="results-header">
        <h2>Latest Analysis Results</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-outline" style={{ margin: 0 }} onClick={onViewHistory}>
            View History
          </button>
          <button className="btn-primary" style={{ margin: 0 }} onClick={onNewAnalysis}>
            + New Analysis
          </button>
        </div>
      </div>

      {/* Score + Summary row */}
      <div className="score-summary-grid">
        <div className="score-card">
          <ScoreRing score={match_score} />
          <div className="score-card-label">Match Score</div>
        </div>
        <div className="summary-card">
          <h3>Analysis Summary</h3>
          <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.65 }}>{summary}</p>
        </div>
      </div>

      {/* Skills row */}
      <div className="dashboard-skills-grid">
        <div className="dashboard-skills-card">
          <h4>Matched Skills</h4>
          <div className="chips">
            {matched_skills?.map(s => <span key={s} className="chip chip-green">{s}</span>)}
          </div>
        </div>
        <div className="dashboard-skills-card">
          <h4>Missing Skills</h4>
          <div className="chips">
            {missing_skills?.map(s => <span key={s} className="chip chip-red">{s}</span>)}
          </div>
        </div>
        <div className="dashboard-skills-card">
          <h4>Transferable Skills</h4>
          <div className="chips">
            {transferable_skills?.map(s => <span key={s} className="chip chip-yellow">{s}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onStartAnalysis }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      <h3>No analyses yet</h3>
      <p>Paste a job description and upload your CV to get a gap analysis, CV rewrite, and action plan.</p>
      <button className="btn-primary" style={{ margin: "0 auto", display: "inline-flex" }} onClick={onStartAnalysis}>
        Start Your First Analysis
      </button>
    </div>
  );
}
