import { Fragment } from "react";

const STEPS = ["Job Description", "Upload CV", "Gap Analysis", "CV Rewrite", "Action Plan"];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="progress-bar">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <div className={`progress-line${currentStep >= stepNum ? " filled" : ""}`} />
            )}
            <div className="progress-step">
              <div className={`progress-circle${done ? " done" : active ? " active" : ""}`}>
                {done ? "✓" : stepNum}
              </div>
              <div className={`progress-label${active ? " active-label" : ""}`}>
                {label}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
