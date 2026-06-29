import { useState, useEffect } from "react";

export default function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#1D9E75" : score >= 50 ? "#f59e0b" : "#ef4444";

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOffset(targetOffset));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="score-ring-wrapper">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="score-ring-text">
        <div className="score-number" style={{ color }}>{score}</div>
        <div className="score-label">/ 100</div>
      </div>
    </div>
  );
}
