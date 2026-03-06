const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema(
  {
    userKey: { type: String, unique: true, default: "default" },
    profile: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      dailyGoal: { type: Number, default: 1 },
    },
    totalSolved: { type: Number, default: 0 },
    activeDates: [{ type: String }], // YYYY-MM-DD
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserStats", userStatsSchema);