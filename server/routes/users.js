// filepath: /Users/snigdha/codeforge/server/routes/users.js
const express = require("express");
const router = express.Router();

// Example: GET all users
router.get("/", (req, res) => {
    res.json({ message: "Users endpoint" });
});

// Add more routes as needed (e.g., POST /register)

module.exports = router;