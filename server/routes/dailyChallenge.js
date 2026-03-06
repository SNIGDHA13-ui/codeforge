const express = require("express");
const DailyChallenge = require("../models/DailyChallenge");
const UserSubmission = require("../models/UserSubmission");
const Problem = require("../models/Problem");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function getOrCreateTodayChallenge() {
  const today = dayKey();
  let challenge = await DailyChallenge.findOne({ date: today });
  if (challenge) return challenge;

  const allProblems = await Problem.find({}).select("title difficulty category").lean();
  const fallback = {
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description:
      "Given an array of integers nums and a target, return indices of two numbers that add to target.",
  };

  let picked = fallback;
  if (allProblems.length > 0) {
    const seed = Number(today.replace(/-/g, ""));
    const idx = seed % allProblems.length;
    const p = allProblems[idx];
    picked = {
      title: p.title,
      difficulty: p.difficulty || "Easy",
      category: p.category || "General",
      description: "",
    };
  }

  challenge = await DailyChallenge.create({ date: today, ...picked });
  return challenge;
}

// GET /api/daily/today
router.get("/today", authenticate, async (req, res, next) => {
  try {
    const today = dayKey();
    const challenge = await getOrCreateTodayChallenge();

    const solved = await UserSubmission.exists({
      userKey: req.user.id,
      challengeDate: today,
      status: "solved",
    });

    res.json({ challenge, solved: Boolean(solved) });
  } catch (err) {
    next(err);
  }
});

// GET /api/daily/submissions
router.get("/submissions", authenticate, async (req, res, next) => {
  try {
    const rows = await UserSubmission.find({
      userKey: req.user.id,
      status: "solved",
    }).select("challengeDate -_id");

    res.json({ solvedDates: rows.map((r) => r.challengeDate) });
  } catch (err) {
    next(err);
  }
});

// POST /api/daily/submit
router.post("/submit", authenticate, async (req, res, next) => {
  try {
    const today = dayKey();

    await UserSubmission.findOneAndUpdate(
      { userKey: req.user.id, challengeDate: today },
      { $set: { status: "solved", submittedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ solved: true, challengeDate: today });
  } catch (err) {
    next(err);
  }
});

module.exports = router;