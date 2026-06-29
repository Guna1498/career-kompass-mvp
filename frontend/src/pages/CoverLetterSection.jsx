import { useState } from "react";
import { generateCoverLetter, downloadCoverLetterDocx, downloadCoverLetterPdf } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function WordIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15v-4h2a2 2 0 0 1 0 4H9z" />
    </svg>
  );
}

function useDownloadButton() {
  const [state, setState] = useState("idle");
  async function trigger(fn) {
    if (state !== "idle") return;
    setState("loading");
    try {
      await fn();
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      setState("idle");
      throw err;
    }
  }
  const label = state === "loading" ? "Generating…" : state === "success" ? "Downloaded!" : null;
  return { state, trigger, label };
}

export default function CoverLetterSection({ cvText, jobDescription, onHide }) {
  const [userName, setUserName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [letterText, setLetterText] = useState("");
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const docx = useDownloadButton();
  const pdf = useDownloadButton();

  async function handleGenerate() {
    if (!userName.trim()) return;
    setGenerating(true);
    setError("");
    setResult(null);
    try {
      const data = await generateCoverLetter(cvText, jobDescription, userName.trim());
      setResult(data);
      setLetterText(data.cover_letter);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDocx() {
    setDownloadError("");
    try {
      await docx.trigger(() =>
        downloadCoverLetterDocx(letterText, result.subject_line, userName.trim())
      );
    } catch (err) {
      setDownloadError(err.message);
    }
  }

  async function handlePdf() {
    setDownloadError("");
    try {
      await pdf.trigger(() =>
        downloadCoverLetterPdf(letterText, result.subject_line, userName.trim())
      );
    } catch (err) {
      setDownloadError(err.message);
    }
  }

  return (
    <div className="cl-section">
      {/* Section header */}
      <div className="cl-section-header">
        <div className="cl-section-title">
          <span className="cl-mail-icon"><MailIcon /></span>
          Generate Cover Letter
        </div>
        <button className="cl-hide-btn" onClick={onHide}>Hide</button>
      </div>
      <p className="cl-description">
        Auto-draft a tailored cover letter based on your CV and this job description.
      </p>

      {/* Name input + generate button */}
      {!result && (
        <div className="cl-generate-row">
          <div className="field" style={{ marginBottom: 0, flex: 1 }}>
            <label>Your name</label>
            <input
              type="text"
              placeholder="e.g. Gunasekhar Jenni"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              disabled={generating}
            />
          </div>
          <button
            className="btn-primary cl-gen-btn"
            onClick={handleGenerate}
            disabled={generating || !userName.trim()}
          >
            {generating ? <Spinner inline /> : <MailIcon />}
            {generating ? "Generating…" : "Generate Cover Letter"}
          </button>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Result */}
      {result && (
        <div className="cl-result">
          {/* Re-generate controls */}
          <div className="cl-regen-row">
            <div className="field" style={{ marginBottom: 0, flex: 1 }}>
              <label>Your name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={generating}
              />
            </div>
            <button
              className="btn-outline cl-gen-btn"
              onClick={handleGenerate}
              disabled={generating || !userName.trim()}
            >
              {generating ? <Spinner inline /> : null}
              {generating ? "Regenerating…" : "↻ Regenerate"}
            </button>
          </div>

          {/* Subject line */}
          <div className="cl-subject-box">
            <div className="cl-subject-label">Suggested Subject Line</div>
            <div className="cl-subject-text">{result.subject_line}</div>
          </div>

          {/* Editable cover letter */}
          <label className="cl-body-label">Cover Letter</label>
          <textarea
            className="cl-body-textarea"
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            rows={16}
          />

          {/* Word count */}
          <div className="cl-meta-row">
            <span className="cl-word-count">{letterText.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>

          {/* Keywords used */}
          {result.keywords_used?.length > 0 && (
            <div className="cl-keywords">
              <span className="cl-keywords-label">Keywords used</span>
              <div className="chips" style={{ marginTop: 6 }}>
                {result.keywords_used.map((k) => (
                  <span key={k} className="chip chip-green">{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Download buttons */}
          <div className="download-buttons" style={{ marginTop: 16 }}>
            <button
              className={`btn-download-word${docx.state === "success" ? " success" : ""}`}
              onClick={handleDocx}
              disabled={docx.state === "loading"}
            >
              <WordIcon />
              {docx.label || "Download as Word"}
            </button>
            <button
              className={`btn-download-pdf${pdf.state === "success" ? " success" : ""}`}
              onClick={handlePdf}
              disabled={pdf.state === "loading"}
            >
              <PdfIcon />
              {pdf.label || "Download as PDF"}
            </button>
          </div>
          {downloadError && <ErrorMessage message={downloadError} />}
        </div>
      )}
    </div>
  );
}
