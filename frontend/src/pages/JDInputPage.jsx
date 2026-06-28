import { useState } from "react";
import { parseJD } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function JDInputPage({ onNext }) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!jd.trim()) return;
    setLoading(true);
    setError("");
    try {
      await parseJD(jd);
      onNext(jd);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Paste the Job Description</h2>
      <p className="subtitle">
        We'll extract key skills and requirements to compare against your CV.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          disabled={loading}
        />
        <ErrorMessage message={error} />
        <button type="submit" className="btn-primary" disabled={loading || !jd.trim()}>
          {loading ? <Spinner inline /> : null}
          {loading ? "Analysing…" : "Analyse Job Description →"}
        </button>
      </form>
    </div>
  );
}
