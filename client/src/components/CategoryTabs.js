import React, { useEffect, useState } from "react";
import { getProblems } from "../api/problemsApi";

export default function CategoryTabs({ selectedCategory, onSelect, refreshKey }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const rows = await getProblems();
        const unique = [...new Set((rows || []).map((p) => p.category).filter(Boolean))].sort();
        setCategories(unique);
      } catch (e) {
        setCategories([]);
      }
    })();
  }, [refreshKey]);

  return (
    <div className="lc-card category-tabs-card">
      <div className="category-tabs">
        <button
          className={`cat-chip ${!selectedCategory ? "active" : ""}`}
          onClick={() => onSelect("")}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-chip ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}