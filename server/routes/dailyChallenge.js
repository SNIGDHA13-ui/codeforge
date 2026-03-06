const express = require("express");
const DailyChallenge = require("../models/DailyChallenge");
const UserSubmission = require("../models/UserSubmission");

const router = express.Router();
const USER_KEY = "default";

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

// GET /api/daily/today
router.get("/today", async (req, res, next) => {
  try {
    const today = dayKey();

    let challenge = await DailyChallenge.findOne({ date: today });
    if (!challenge) {
      challenge = await DailyChallenge.create({
        date: today,
        title: "Two Sum",
        difficulty: "Easy",
        category: "Array",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
      });
    }

    const solved = await UserSubmission.exists({
      userKey: USER_KEY,
      challengeDate: today,
      status: "solved",
    });

    res.json({ challenge, solved: Boolean(solved) });
  } catch (err) {
    next(err);
  }
});

// GET /api/daily/submissions
router.get("/submissions", async (req, res, next) => {
  try {
    const submissions = await UserSubmission.find({
      userKey: USER_KEY,
      status: "solved",
    }).select("challengeDate -_id");

    res.json({ solvedDates: submissions.map((s) => s.challengeDate) });
  } catch (err) {
    next(err);
  }
});

// POST /api/daily/submit
router.post("/submit", async (req, res, next) => {
  try {
    const today = dayKey();

    await UserSubmission.findOneAndUpdate(
      { userKey: USER_KEY, challengeDate: today },
      { $set: { status: "solved", submittedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ solved: true, challengeDate: today });
  } catch (err) {
    next(err);
  }
});

module.exports = router;