import React, { useState } from "react";
import { loginApi, registerApi, forgotPasswordApi, resetPasswordApi } from "../api/authApi";

export default function LoginPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot" | "reset"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminCode: "",
    resetToken: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      if (mode === "login") {
        const data = await loginApi({ email: form.email, password: form.password });
        localStorage.setItem("auth", JSON.stringify(data));
        onAuth(data);
      } else if (mode === "register") {
        const data = await registerApi(form);
        localStorage.setItem("auth", JSON.stringify(data));
        onAuth(data);
      } else if (mode === "forgot") {
        const res = await forgotPasswordApi(form.email);
        setMessage(res.message || "Check your email for reset link");
        // In dev mode, show token (remove in production)
        if (res.devToken) {
          setForm({ ...form, resetToken: res.devToken });
          setMode("reset");
        }
      } else if (mode === "reset") {
        await resetPasswordApi(form.resetToken, form.newPassword);
        setMessage("Password reset successful! Please login.");
        setMode("login");
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>
          {mode === "login" && "Login"}
          {mode === "register" && "Create Account"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "reset" && "Reset Password"}
        </h2>

        {message && <div className="auth-message">{message}</div>}

        {mode === "register" && (
          <>
            <input
              className="lc-input"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={onChange}
              required
            />
            <select className="lc-select" name="role" value={form.role} onChange={onChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {form.role === "admin" && (
              <input
                className="lc-input"
                name="adminCode"
                placeholder="Admin invite code"
                value={form.adminCode}
                onChange={onChange}
                required
              />
            )}
          </>
        )}

        {(mode === "login" || mode === "register" || mode === "forgot") && (
          <input
            className="lc-input"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
        )}

        {(mode === "login" || mode === "register") && (
          <input
            className="lc-input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />
        )}

        {mode === "reset" && (
          <>
            <input
              className="lc-input"
              name="resetToken"
              placeholder="Reset token"
              value={form.resetToken}
              onChange={onChange}
              required
            />
            <input
              className="lc-input"
              name="newPassword"
              type="password"
              placeholder="New password"
              value={form.newPassword}
              onChange={onChange}
              required
            />
          </>
        )}

        <button type="submit" className="lc-btn btn-brand" style={{ width: "100%", marginTop: 10 }}>
          Submit
        </button>

        {mode === "login" && (
          <>
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => setMode("register")}
            >
              New user? Register
            </button>
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => setMode("forgot")}
            >
              Forgot password?
            </button>
          </>
        )}

        {(mode === "register" || mode === "forgot" || mode === "reset") && (
          <button
            type="button"
            className="auth-link-btn"
            onClick={() => setMode("login")}
          >
            Back to login
          </button>
        )}
      </form>
    </div>
  );
}