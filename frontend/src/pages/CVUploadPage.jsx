import { useState } from "react";
import { analyseCV } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function CVUploadPage({ jobDescription, onNext }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const result = await analyseCV(file, jobDescription);
      onNext(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Upload Your CV</h2>
      <p className="subtitle">
        Upload your CV as a PDF and we'll compare it against the job description.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="file-zone">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0] || null)}
            disabled={loading}
          />
          {file && <span className="file-name">{file.name}</span>}
        </div>
        <ErrorMessage message={error} />
        <button type="submit" className="btn-primary" disabled={loading || !file}>
          {loading ? <Spinner inline /> : null}
          {loading ? "Analysing CV…" : "Upload & Analyse →"}
        </button>
      </form>
    </div>
  );
}
