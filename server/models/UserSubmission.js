const mongoose = require("mongoose");

const userSubmissionSchema = new mongoose.Schema(
  {
    userKey: { type: String, default: "default", index: true },
    challengeDate: { type: String, required: true }, // YYYY-MM-DD
    status: { type: String, enum: ["solved", "attempted"], default: "solved" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSubmissionSchema.index({ userKey: 1, challengeDate: 1 }, { unique: true });

module.exports = mongoose.model("UserSubmission", userSubmissionSchema);