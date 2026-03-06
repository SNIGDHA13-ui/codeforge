import React, { useEffect, useState } from "react";
import { getSubmissions } from "../api/dailyApi";

export default function HeatmapCalendar() {
  const [solvedDates, setSolvedDates] = useState(new Set());

  useEffect(() => {
    (async () => {
      try {
        const data = await getSubmissions();
        const dates = Array.isArray(data?.solvedDates) ? data.solvedDates : [];
        setSolvedDates(new Set(dates));
      } catch (err) {
        console.error(err);
        setSolvedDates(new Set());
      }
    })();
  }, []);

  const today = new Date();
  const days = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const isSolved = solvedDates.has(dateStr);
    days.push({ date: dateStr, solved: isSolved });
  }

  return (
    <div className="lc-card">
      <h2 className="lc-title">Activity Calendar</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(53, 12px)",
          gap: "4px",
          overflowX: "auto",
        }}
      >
        {days.map((day) => (
          <div
            key={day.date}
            title={day.date}
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: day.solved ? "var(--green)" : "var(--panel-2)",
              color: "#fff",
              fontSize: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {day.solved ? "✓" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}