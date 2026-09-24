import { useState } from "react";
import { downloadCVPdf } from "../api/index.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useDownloadButton from "../hooks/useDownloadButton.js";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Green accent headings, clean sans-serif — good default for tech and startup roles.",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Centered serif header, black and white — suits traditional or corporate applications.",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Dense academic/tech resume layout — bold entry with dates aligned right, tight section rules.",
  },
];

function ModernPreview() {
  return (
    <div className="template-preview template-preview-modern">
      <div className="tp-name">Jane Doe</div>
      <div className="tp-title">Software Engineer</div>
      <div className="tp-rule" />
      <div className="tp-heading">WORK EXPERIENCE</div>
      <div className="tp-line" />
      <div className="tp-line short" />
    </div>
  );
}

function ClassicPreview() {
  return (
    <div className="template-preview template-preview-classic">
      <div className="tp-name">JANE DOE</div>
      <div className="tp-title">Software Engineer</div>
      <div className="tp-rule" />
      <div className="tp-heading">WORK EXPERIENCE</div>
      <div className="tp-line" />
      <div className="tp-line short" />
    </div>
  );
}

function ProfessionalPreview() {
  return (
    <div className="template-preview template-preview-professional">
      <div className="tp-name">Jane Doe</div>
      <div className="tp-title">Software Engineer</div>
      <div className="tp-rule" />
      <div className="tp-heading">WORK EXPERIENCE</div>
      <div className="tp-row">
        <span className="tp-row-left">Acme Corp, Engineer</span>
        <span className="tp-row-right">2020 – 2023</span>
      </div>
      <div className="tp-line short" />
    </div>
  );
}

const PREVIEWS = { modern: ModernPreview, classic: ClassicPreview, professional: ProfessionalPreview };

export default function TemplateSelectPage({ cvResult, onNext }) {
  const [selected, setSelected] = useState("modern");
  const [downloadError, setDownloadError] = useState("");
  const pdf = useDownloadButton();

  async function handleDownload() {
    setDownloadError("");
    try {
      await pdf.trigger(() => downloadCVPdf(cvResult, selected));
    } catch (err) {
      setDownloadError(err.message);
    }
  }

  return (
    <div className="card">
      <h2>Choose a CV Template</h2>
      <p className="subtitle">
        Pick a layout for your PDF export. You can download and try both before continuing.
      </p>

      <div className="template-grid">
        {TEMPLATES.map((tpl) => {
          const Preview = PREVIEWS[tpl.id];
          return (
            <button
              key={tpl.id}
              type="button"
              className={`template-card${selected === tpl.id ? " selected" : ""}`}
              onClick={() => setSelected(tpl.id)}
            >
              <Preview />
              <div className="template-card-name">{tpl.name}</div>
              <div className="template-card-desc">{tpl.description}</div>
            </button>
          );
        })}
      </div>

      <div className="download-buttons">
        <button
          className={`btn-download-pdf${pdf.state === "success" ? " success" : ""}`}
          onClick={handleDownload}
          disabled={pdf.state === "loading"}
        >
          {pdf.label || `Download ${TEMPLATES.find((t) => t.id === selected).name} PDF`}
        </button>
      </div>
      {downloadError && <ErrorMessage message={downloadError} />}

      <button className="btn-primary" onClick={onNext}>
        Continue to Action Plan →
      </button>
    </div>
  );
}
