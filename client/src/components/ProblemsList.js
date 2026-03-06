import React, { useEffect, useState } from "react";
import { getProblems, deleteProblem, updateProblem } from "../api/problemsApi";

export default function ProblemsList({ refreshKey, selectedCategory, canManage }) {
  const [problems, setProblems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", difficulty: "Easy", category: "" });

  const load = async () => {
    const filters = selectedCategory ? { category: selectedCategory } : {};
    setProblems(await getProblems(filters));
  };

  useEffect(() => {
    load();
  }, [refreshKey, selectedCategory]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    await deleteProblem(id);
    load();
  };

  const onEdit = (p) => {
    setEditingId(p._id);
    setEditForm({ title: p.title, difficulty: p.difficulty, category: p.category });
  };

  const onSave = async (id) => {
    await updateProblem(id, editForm);
    setEditingId(null);
    load();
  };

  const badgeClass = (d) => (d === "Easy" ? "badge easy" : d === "Medium" ? "badge medium" : "badge hard");

  return (
    <div className="lc-card">
      <h2 className="lc-title">Problems {selectedCategory ? `• ${selectedCategory}` : ""}</h2>
      <div className="lc-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Difficulty</th><th>Category</th>{canManage && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p._id}>
                {canManage && editingId === p._id ? (
                  <>
                    <td><input className="lc-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></td>
                    <td>
                      <select className="lc-select" value={editForm.difficulty} onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}>
                        <option>Easy</option><option>Medium</option><option>Hard</option>
                      </select>
                    </td>
                    <td><input className="lc-input" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} /></td>
                    <td className="lc-actions">
                      <button className="lc-btn btn-green" onClick={() => onSave(p._id)}>Save</button>
                      <button className="lc-btn btn-blue" onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{p.title}</td>
                    <td><span className={badgeClass(p.difficulty)}>{p.difficulty}</span></td>
                    <td>{p.category}</td>
                    {canManage && (
                      <td className="lc-actions">
                        <button className="lc-btn btn-blue" onClick={() => onEdit(p)}>Edit</button>
                        <button className="lc-btn btn-red" onClick={() => onDelete(p._id)}>Delete</button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
            {problems.length === 0 && (
              <tr><td colSpan={canManage ? 4 : 3}>No problems found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}