import React, { useEffect, useState } from "react";
import { getStats, updateProfile } from "../api/statsApi";

export default function ProfileManager() {
  const [form, setForm] = useState({ name: "", email: "", dailyGoal: 1 });

  useEffect(() => {
    (async () => {
      const s = await getStats();
      setForm({
        name: s?.profile?.name || "",
        email: s?.profile?.email || "",
        dailyGoal: s?.profile?.dailyGoal || 1,
      });
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form);
    alert("Profile updated");
  };

  return (
    <div className="lc-card">
      <h2 className="lc-title">Profile</h2>
      <form onSubmit={onSubmit}>
        <input className="lc-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="lc-input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="lc-input" type="number" min="1" value={form.dailyGoal} onChange={(e) => setForm({ ...form, dailyGoal: Number(e.target.value) })} />
        <div style={{ marginTop: 10 }}>
          <button className="lc-btn btn-green" type="submit">Save Profile</button>
        </div>
      </form>
    </div>
  );
}
