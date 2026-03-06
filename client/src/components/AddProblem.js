import React, { useState } from "react";
import { createProblem } from "../api/problemsApi";
import { markTodayActive } from "../api/statsApi";

export default function AddProblem({ onProblemAdded }) {
  const [form, setForm] = useState({ title: "", difficulty: "Easy", category: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProblem(form);
      await markTodayActive(1);
      setForm({ title: "", difficulty: "Easy", category: "" });
      if (onProblemAdded) onProblemAdded();
    } catch {
      alert("Failed to add problem");
    }
  };

  return (
    <div className="lc-card">
      <h2 className="lc-title">Add Problem</h2>
      <form onSubmit={onSubmit} className="lc-row">
        <div>
          <label>Title</label>
          <input className="lc-input" name="title" value={form.title} onChange={onChange} required />
        </div>
        <div>
          <label>Difficulty</label>
          <select className="lc-select" name="difficulty" value={form.difficulty} onChange={onChange}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </div>
        <div>
          <label>Category</label>
          <input className="lc-input" name="category" value={form.category} onChange={onChange} required />
        </div>
        <button className="lc-btn btn-brand" type="submit">Add</button>
      </form>
    </div>
  );
}
