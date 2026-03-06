import React, { useEffect, useState } from "react";
import { getTodayChallenge, submitSolution } from "../api/dailyApi";

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [solved, setSolved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getTodayChallenge();
      setChallenge(data.challenge);
      setSolved(Boolean(data.solved));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async () => {
    await submitSolution();
    setSolved(true);
  };

  if (loading) return <div className="lc-card">Loading...</div>;
  if (!challenge) return <div className="lc-card">No challenge today</div>;

  return (
    <div className="lc-card daily-card">
      <h2 className="lc-title">Daily Challenge</h2>

      <div className="daily-badge" style={{ marginBottom: 10 }}>
        <span className={`badge ${String(challenge.difficulty || "Easy").toLowerCase()}`}>
          {challenge.difficulty}
        </span>
        <span style={{ marginLeft: 10, color: "var(--muted)" }}>{challenge.category}</span>
      </div>

      <div className="daily-title">{challenge.title}</div>
      <p className="daily-desc">{challenge.description}</p>

      <div className="daily-status">
        {solved ? (
          <div className="solved-badge">
            <span>✓</span> Solved Today
          </div>
        ) : (
          <button className="lc-btn btn-brand" onClick={onSubmit}>
            Submit Solution
          </button>
        )}
      </div>
    </div>
  );
}