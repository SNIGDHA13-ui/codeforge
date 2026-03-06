import React, { useEffect, useState } from "react";
import "./App.css";
import ProfileManager from "./components/ProfileManager";
import Dashboard from "./components/Dashboard";
import AddProblem from "./components/AddProblem";
import ProblemsList from "./components/ProblemsList";
import CategoryTabs from "./components/CategoryTabs";
import DailyStreakHover from "./components/DailyStreakHover";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="lc-shell">
      <header className="lc-topbar">
        <div className="lc-brand">CodeForge</div>
        <div className="lc-sub">LeetCode-style Practice Tracker</div>

        <div className="lc-topbar-right">
          <DailyStreakHover onSolved={triggerRefresh} />
          <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="lc-main">
        <section className="lc-left">
          <Dashboard refreshKey={refreshKey} />
          <ProfileManager />
        </section>

        <section className="lc-right">
          <AddProblem onProblemAdded={triggerRefresh} />
          <CategoryTabs
            refreshKey={refreshKey}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <ProblemsList refreshKey={refreshKey} selectedCategory={selectedCategory} />
        </section>
      </main>
    </div>
  );
}

export default App;