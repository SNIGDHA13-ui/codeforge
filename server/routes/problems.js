const express = require("express");
const Problem = require("../models/Problem");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public: list problems
router.get("/", async (req, res, next) => {
  try {
    const { category = "", difficulty = "", q = "" } = req.query;
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (q) query.title = { $regex: q, $options: "i" };

    const rows = await Problem.find(query).sort({ createdAt: -1 });
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Public: get one
router.get("/:id", async (req, res, next) => {
  try {
    const row = await Problem.findById(req.params.id);
    if (!row) return res.status(404).json({ message: "Problem not found" });
    res.json(row);
  } catch (e) {
    next(e);
  }
});

// Admin only: create
router.post("/", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const row = await Problem.create(req.body);
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
});

// Admin only: update
router.put("/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const row = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!row) return res.status(404).json({ message: "Problem not found" });
    res.json(row);
  } catch (e) {
    next(e);
  }
});

// Admin only: delete
router.delete("/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const row = await Problem.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ message: "Problem not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;