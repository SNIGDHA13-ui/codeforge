const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const problems = require("../seeds/problems.json");
require("dotenv").config();

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Problem.deleteMany({});
    console.log("🗑️  Cleared old problems");

    const inserted = await Problem.insertMany(problems);
    console.log(`✅ Inserted ${inserted.length} problems`);

    await mongoose.disconnect();
    console.log("✅ Done");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seedDB();