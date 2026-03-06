import React, { useEffect, useState } from "react";
import { getStats, markTodayActive } from "../api/statsApi";

function Stat({ title, value }) {
  return (
    <div className="stat-box">
      <div className="stat-k">{title}</div>
      <div className="stat-v">{value}</div>
    </div>
  );
}

export default function Dashboard({ refreshKey }) {
  const [stats, setStats] = useState(null);

  const load = async () => setStats(await getStats());

  useEffect(() => { load(); }, [refreshKey]);

  const onMark = async () => {
    await markTodayActive(1);
    load();
  };

  if (!stats) return <div className="lc-card">Loading...</div>;

  return (
    <div className="lc-card">
      <h2 className="lc-title">Daily Streak</h2>
      <div className="lc-grid">
        <Stat title="Current Streak" value={stats.currentStreak || 0} />
        <Stat title="Longest Streak" value={stats.longestStreak || 0} />
        <Stat title="Active Days" value={(stats.activeDates || []).length} />
        <Stat title="Total Solved" value={stats.totalSolved || 0} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="lc-btn btn-brand" onClick={onMark}>Mark Today Active</button>
      </div>
    </div>
  );
}
