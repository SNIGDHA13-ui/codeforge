const mongoose = require("mongoose");

const dailyChallengeSchema = new mongoose.Schema(
  {
    date: { type: String, unique: true, required: true }, // YYYY-MM-DD
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    category: { type: String, default: "Array" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyChallenge", dailyChallengeSchema);