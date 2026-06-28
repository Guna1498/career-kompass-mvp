import { useState } from "react";
import "./App.css";
import JDInputPage from "./pages/JDInputPage.jsx";
import CVUploadPage from "./pages/CVUploadPage.jsx";
import GapAnalysisPage from "./pages/GapAnalysisPage.jsx";
import CVRewritePage from "./pages/CVRewritePage.jsx";
import ActionPlanPage from "./pages/ActionPlanPage.jsx";

const STEP_LABELS = [
  "Job Description",
  "Upload CV",
  "Gap Analysis",
  "CV Rewrite",
  "Action Plan",
];

export default function App() {
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [gapAnalysis, setGapAnalysis] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Career Kompass</h1>
        <div className="step-indicator">
          Step {step} of 5 — {STEP_LABELS[step - 1]}
        </div>
      </header>

      {step === 1 && (
        <JDInputPage
          onNext={(jd) => {
            setJobDescription(jd);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <CVUploadPage
          jobDescription={jobDescription}
          onNext={(analysis) => {
            setGapAnalysis(analysis);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <GapAnalysisPage
          gapAnalysis={gapAnalysis}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <CVRewritePage
          cvText={gapAnalysis.cv_text}
          jobDescription={jobDescription}
          gapAnalysis={gapAnalysis}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <ActionPlanPage
          cvText={gapAnalysis.cv_text}
          jobDescription={jobDescription}
          gapAnalysis={gapAnalysis}
        />
      )}
    </div>
  );
}
