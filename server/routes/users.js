const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

function sign(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "user", adminCode = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    let safeRole = "user";
    if (role === "admin") {
      if (adminCode !== process.env.ADMIN_INVITE_CODE) {
        return res.status(403).json({ message: "Invalid admin code" });
      }
      safeRole = "admin";
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: safeRole,
    });

    const token = sign(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error("Register error:", e.message);
    res.status(500).json({ message: "Register failed" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = sign(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error("Login error:", e.message);
    res.status(500).json({ message: "Login failed" });
  }
});

// POST /api/users/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: "If account exists, reset link sent to email" });
    }

    // Generate reset token (valid 1 hour)
    const resetToken = jwt.sign(
      { id: user._id.toString(), purpose: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // In production, send email with: http://yourapp.com/reset-password?token=${resetToken}
    // For now, return token in response (ONLY for development)
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    res.json({ 
      message: "If account exists, reset link sent to email",
      // Remove this line in production:
      devToken: resetToken 
    });
  } catch (e) {
    console.error("Forgot password error:", e.message);
    res.status(500).json({ message: "Request failed" });
  }
});

// POST /api/users/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "token and newPassword required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    if (payload.purpose !== "reset") {
      return res.status(403).json({ message: "Invalid reset token" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(payload.id, { passwordHash });

    res.json({ message: "Password reset successful" });
  } catch (e) {
    console.error("Reset password error:", e.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// GET /api/users/me
router.get("/me", authenticate, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;