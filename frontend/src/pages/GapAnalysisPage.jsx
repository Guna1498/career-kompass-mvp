import ScoreRing from "../components/ScoreRing.jsx";

export default function GapAnalysisPage({ gapAnalysis, onNext }) {
  const { match_score, matched_skills, missing_skills, transferable_skills, summary } =
    gapAnalysis;

  return (
    <div className="card">
      <h2>Gap Analysis</h2>
      <p className="subtitle">Here&apos;s how your CV stacks up against the role.</p>

      <ScoreRing score={match_score} />

      <div className="skills-grid">
        <div className="skills-section">
          <h3>Matched Skills</h3>
          <div className="chips">
            {matched_skills.map((s) => (
              <span key={s} className="chip chip-green">{s}</span>
            ))}
          </div>
        </div>
        <div className="skills-section">
          <h3>Missing Skills</h3>
          <div className="chips">
            {missing_skills.map((s) => (
              <span key={s} className="chip chip-red">{s}</span>
            ))}
          </div>
        </div>
        <div className="skills-section">
          <h3>Transferable Skills</h3>
          <div className="chips">
            {transferable_skills.map((s) => (
              <span key={s} className="chip chip-yellow">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="summary-box">{summary}</div>

      <button className="btn-primary" onClick={onNext}>
        Rewrite My CV →
      </button>
    </div>
  );
}
