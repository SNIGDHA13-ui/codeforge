const express = require("express");
const UserStats = require("../models/UserStats");

const router = express.Router();
const USER_KEY = "default";

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function prevDayKey(key) {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function dayDiff(a, b) {
  const da = new Date(`${a}T00:00:00Z`);
  const db = new Date(`${b}T00:00:00Z`);
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

function computeCurrentStreak(activeSet, today) {
  let streak = 0;
  let k = today;
  while (activeSet.has(k)) {
    streak += 1;
    k = prevDayKey(k);
  }
  return streak;
}

function computeLongestStreak(activeDates) {
  if (!activeDates.length) return 0;
  const sorted = [...new Set(activeDates)].sort();
  let best = 1;
  let cur = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (dayDiff(sorted[i - 1], sorted[i]) === 1) {
      cur += 1;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}

async function getOrCreateStats() {
  let stats = await UserStats.findOne({ userKey: USER_KEY });
  if (!stats) stats = await UserStats.create({ userKey: USER_KEY });
  return stats;
}

router.get("/", async (req, res, next) => {
  try {
    const stats = await getOrCreateStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.put("/profile", async (req, res, next) => {
  try {
    const { name, email, dailyGoal } = req.body;
    const stats = await getOrCreateStats();

    if (name !== undefined) stats.profile.name = name;
    if (email !== undefined) stats.profile.email = email;
    if (dailyGoal !== undefined) stats.profile.dailyGoal = Number(dailyGoal) || 1;

    await stats.save();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.post("/activity", async (req, res, next) => {
  try {
    const { solvedInc = 1 } = req.body || {};
    const stats = await getOrCreateStats();

    const today = dayKey();
    const set = new Set(stats.activeDates || []);
    set.add(today);

    stats.activeDates = Array.from(set).sort();
    stats.totalSolved += Math.max(0, Number(solvedInc) || 0);
    stats.lastActiveDate = today;

    const activeSet = new Set(stats.activeDates);
    stats.currentStreak = computeCurrentStreak(activeSet, today);
    stats.longestStreak = Math.max(
      stats.longestStreak || 0,
      computeLongestStreak(stats.activeDates)
    );

    await stats.save();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;