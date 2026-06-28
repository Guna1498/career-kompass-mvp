import { useState, useEffect } from "react";
import { rewriteCV } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function CVRewritePage({ cvText, jobDescription, gapAnalysis, onNext }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await rewriteCV(cvText, jobDescription, gapAnalysis);
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

  const { rewritten_sections, keywords_added, summary } = result;

  return (
    <div className="card">
      <h2>Rewritten CV</h2>
      <p className="subtitle">
        Your bullet points have been rewritten to mirror the job description's language.
      </p>

      <div className="section">
        <div className="section-title">Before & After</div>
        {rewritten_sections.map((item, i) => (
          <div key={i} className="rewrite-item">
            <div className="rewrite-original">
              <div className="rewrite-label">Original</div>
              {item.original}
            </div>
            <div className="rewrite-new">
              <div className="rewrite-label">Rewritten</div>
              {item.rewritten}
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-title">Keywords Added</div>
        <div className="chips">
          {keywords_added.map((k) => (
            <span key={k} className="chip chip-blue">{k}</span>
          ))}
        </div>
      </div>

      <div className="summary-box">{summary}</div>

      <button className="btn-primary" onClick={onNext}>
        Get Action Plan →
      </button>
    </div>
  );
}
