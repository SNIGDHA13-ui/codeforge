import React, { useEffect, useMemo, useState } from "react";
import { getTodayChallenge, getSubmissions, submitSolution } from "../api/dailyApi";

const toKey = (d) => new Date(d).toISOString().slice(0, 10);

function getCurrentStreak(solvedSet) {
  let streak = 0;
  const d = new Date();
  while (solvedSet.has(toKey(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function lastNMonths(n = 3) {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    out.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }
  return out;
}

function monthCells(monthDate, solvedSet) {
  const y = monthDate.getFullYear();
  const m = monthDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const totalDays = new Date(y, m + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(y, m, d);
    const key = toKey(date);
    cells.push({ day: d, key, solved: solvedSet.has(key) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function DailyStreakHover({ onSolved }) {
  const [challenge, setChallenge] = useState(null);
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [solvedToday, setSolvedToday] = useState(false);

  const load = async () => {
    const [todayRes, submissionsRes] = await Promise.all([
      getTodayChallenge(),
      getSubmissions(),
    ]);

    const dates = Array.isArray(submissionsRes?.solvedDates) ? submissionsRes.solvedDates : [];
    const set = new Set(dates);

    setChallenge(todayRes?.challenge || null);
    setSolvedSet(set);
    setSolvedToday(Boolean(todayRes?.solved));
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const streak = useMemo(() => getCurrentStreak(solvedSet), [solvedSet]);
  const months = useMemo(() => lastNMonths(3), []);

  const handleSubmit = async () => {
    await submitSolution();
    await load();
    if (onSolved) onSolved();
  };

  return (
    <div className="streak-wrap">
      <button className="fire-btn" title="Daily streak">
        🔥
        <span className="fire-count">{streak}</span>
      </button>

      <div className="streak-popover">
        <div className="streak-head">
          <div className="streak-title">Daily Challenge</div>
          <div className="streak-sub">{new Date().toLocaleDateString()}</div>
        </div>

        {challenge ? (
          <div className="daily-mini-card">
            <div className="daily-mini-title">{challenge.title}</div>
            <div className="daily-mini-meta">
              <span className={`badge ${(challenge.difficulty || "Easy").toLowerCase()}`}>
                {challenge.difficulty}
              </span>
              <span>{challenge.category}</span>
            </div>
            <p className="daily-mini-desc">{challenge.description}</p>

            {solvedToday ? (
              <div className="solved-mini">✅ Solved today</div>
            ) : (
              <button className="lc-btn btn-brand" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        ) : (
          <div className="daily-mini-card">No challenge available.</div>
        )}

        <div className="mini-calendar-wrap">
          {months.map((m) => {
            const cells = monthCells(m, solvedSet);
            const monthLabel = m.toLocaleString("default", { month: "long", year: "numeric" });

            return (
              <div key={monthLabel} className="mini-month">
                <div className="mini-month-label">{monthLabel}</div>
                <div className="mini-weekdays">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div className="mini-grid">
                  {cells.map((c, i) =>
                    c ? (
                      <div key={c.key} className={`mini-day ${c.solved ? "solved" : ""}`} title={c.key}>
                        <span className="day-num">{c.day}</span>
                        {c.solved ? <span className="tick">✓</span> : null}
                      </div>
                    ) : (
                      <div key={`e-${i}`} className="mini-day empty" />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}