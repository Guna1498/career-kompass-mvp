import { useState, useEffect } from "react";
import { rewriteCV, downloadCVDocx, downloadCVPdf } from "../api/index.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

function WordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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

function SectionHeading({ children }) {
  return <div className="cv-section-heading">{children}</div>;
}

function BeforeAfter({ original, rewritten }) {
  if (!original && !rewritten) return null;
  return (
    <div className="rewrite-item">
      <div className="rewrite-original">
        <div className="rewrite-label">Original</div>
        {original}
      </div>
      <div className="rewrite-new">
        <div className="rewrite-label">Rewritten</div>
        {rewritten}
      </div>
    </div>
  );
}

export default function CVRewritePage({ cvText, jobDescription, gapAnalysis, onNext }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const docx = useDownloadButton();
  const pdf = useDownloadButton();

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

  const {
    personal_details = {},
    about_me = {},
    work_experience = [],
    education = [],
    projects = [],
    skills = {},
    keywords_added = [],
    summary = "",
  } = result;

  const contactParts = [
    personal_details.email,
    personal_details.phone,
    personal_details.location,
    personal_details.linkedin,
    personal_details.github,
  ].filter(Boolean);

  async function handleDocx() {
    setDownloadError("");
    try {
      await docx.trigger(() => downloadCVDocx(result));
    } catch (err) {
      setDownloadError(err.message);
    }
  }

  async function handlePdf() {
    setDownloadError("");
    try {
      await pdf.trigger(() => downloadCVPdf(result));
    } catch (err) {
      setDownloadError(err.message);
    }
  }

  return (
    <div className="card">
      <h2>Rewritten CV</h2>
      <p className="subtitle">
        Full CV rewritten to mirror the job description&apos;s language and keywords.
      </p>

      {/* Personal details header */}
      {personal_details.name && (
        <div className="cv-personal-header">
          <div className="cv-candidate-name">{personal_details.name}</div>
          {personal_details.title && (
            <div className="cv-candidate-title">{personal_details.title}</div>
          )}
          {contactParts.length > 0 && (
            <div className="cv-contact-line">{contactParts.join("  ·  ")}</div>
          )}
        </div>
      )}

      {/* About Me */}
      {(about_me.original || about_me.rewritten) && (
        <div className="cv-section">
          <SectionHeading>About Me</SectionHeading>
          <BeforeAfter original={about_me.original} rewritten={about_me.rewritten} />
        </div>
      )}

      {/* Work Experience */}
      {work_experience.length > 0 && (
        <div className="cv-section">
          <SectionHeading>Work Experience</SectionHeading>
          {work_experience.map((job, i) => (
            <div key={i} className="cv-job">
              <div className="cv-job-header">
                <span className="cv-company">{job.company}</span>
                {job.role && <span className="cv-role">{job.role}</span>}
              </div>
              {(job.period || job.location) && (
                <div className="cv-meta">
                  {[job.period, job.location].filter(Boolean).join("  ·  ")}
                </div>
              )}
              {job.bullets?.map((b, j) => (
                <BeforeAfter key={j} original={b.original} rewritten={b.rewritten} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="cv-section">
          <SectionHeading>Education</SectionHeading>
          {education.map((edu, i) => (
            <div key={i} className="cv-job" style={{ marginBottom: 8 }}>
              <div className="cv-job-header">
                <span className="cv-company">{edu.degree}</span>
                {edu.institution && <span className="cv-role">{edu.institution}</span>}
              </div>
              {(edu.period || edu.location) && (
                <div className="cv-meta">
                  {[edu.period, edu.location].filter(Boolean).join("  ·  ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="cv-section">
          <SectionHeading>Projects</SectionHeading>
          {projects.map((proj, i) => (
            <div key={i} className="cv-job">
              <div className="cv-job-header">
                <span className="cv-company">{proj.name}</span>
                {proj.period && <span className="cv-meta-inline">{proj.period}</span>}
              </div>
              {proj.bullets?.map((b, j) => (
                <BeforeAfter key={j} original={b.original} rewritten={b.rewritten} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills.original || skills.rewritten) && (
        <div className="cv-section">
          <SectionHeading>Skills</SectionHeading>
          <BeforeAfter original={skills.original} rewritten={skills.rewritten} />
        </div>
      )}

      {/* Keywords Added */}
      {keywords_added.length > 0 && (
        <div className="cv-section">
          <SectionHeading>Keywords Added</SectionHeading>
          <div className="chips" style={{ marginTop: 8 }}>
            {keywords_added.map((k) => (
              <span key={k} className="chip chip-blue">{k}</span>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && <div className="summary-box">{summary}</div>}

      {/* Download buttons */}
      <div className="download-buttons">
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

      <button className="btn-primary" onClick={onNext}>
        Get Action Plan →
      </button>
    </div>
  );
}
