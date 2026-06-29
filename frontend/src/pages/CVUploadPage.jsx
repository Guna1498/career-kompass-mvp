import { useState, useRef } from "react";
import { analyseCV } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

function UploadIcon() {
  return (
    <svg className="drop-zone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export default function CVUploadPage({ jobDescription, onNext }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function handleFile(f) {
    if (f && f.type === "application/pdf") setFile(f);
    else setError("Please upload a PDF file.");
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

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
        Upload your CV as a PDF and we&apos;ll compare it against the job description.
      </p>
      <form onSubmit={handleSubmit}>
        <div
          className={`drop-zone${dragging ? " dragging" : ""}${file ? " has-file" : ""}`}
          onClick={() => !loading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
            disabled={loading}
          />
          <UploadIcon />
          {file ? (
            <div className="drop-zone-filename">✓ {file.name}</div>
          ) : (
            <div className="drop-zone-text">
              Drag &amp; drop your CV or <strong>click to browse</strong>
            </div>
          )}
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
