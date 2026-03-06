import React, { useState } from "react";

export default function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-dropdown-wrap">
      <button
        className="profile-icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={user?.name || "Profile"}
      >
        {getInitials(user?.name)}
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <div className="profile-avatar-large">{getInitials(user?.name)}</div>
            <div className="profile-info">
              <div className="profile-name">{user?.name || "User"}</div>
              <div className="profile-email">{user?.email || ""}</div>
              <span className="profile-role-badge">{user?.role || "user"}</span>
            </div>
          </div>

          <div className="profile-dropdown-divider" />

          <button className="profile-dropdown-item" onClick={onLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      )}

      {isOpen && <div className="profile-dropdown-backdrop" onClick={() => setIsOpen(false)} />}
    </div>
  );
}