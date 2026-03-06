import React, { useEffect, useState } from "react";
import "./App.css";
import ProfileManager from "./components/ProfileManager";
import Dashboard from "./components/Dashboard";
import AddProblem from "./components/AddProblem";
import ProblemsList from "./components/ProblemsList";
import CategoryTabs from "./components/CategoryTabs";
import DailyStreakHover from "./components/DailyStreakHover";
import LoginPage from "./components/LoginPage";
import ProfileDropdown from "./components/ProfileDropdown";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem("auth") || "null"));
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  if (!auth?.token) {
    return <LoginPage onAuth={setAuth} />;
  }

  const role = auth?.user?.role || "user";
  const canManage = role === "admin";

  return (
    <div className="lc-shell">
      <header className="lc-topbar">
        <div className="lc-brand">CodeForge</div>
        <div className="lc-sub">{canManage ? "Admin Panel" : "User Panel"}</div>

        <div className="lc-topbar-right">
          <DailyStreakHover onSolved={triggerRefresh} />
          <ProfileDropdown user={auth.user} onLogout={handleLogout} />
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
          {canManage && <AddProblem onProblemAdded={triggerRefresh} />}
          <CategoryTabs
            refreshKey={refreshKey}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <ProblemsList
            refreshKey={refreshKey}
            selectedCategory={selectedCategory}
            canManage={canManage}
          />
        </section>
      </main>
    </div>
  );
}

export default App;