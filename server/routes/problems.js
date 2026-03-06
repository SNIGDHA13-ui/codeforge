const express = require("express");
const mongoose = require("mongoose");
const Problem = require("../models/Problem");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { difficulty, category, search } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const problems = await Problem.find(filter).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.json(problem);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, difficulty, category } = req.body;
    const created = await Problem.create({ title, difficulty, category });
    res.status(201).json(created);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const updated = await Problem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Problem not found" });
    res.json(updated);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await Problem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Problem not found" });

    res.json({ message: "Deleted", problem: deleted });
  } catch (err) {
    next(err);
  }
});

module.exports = router;