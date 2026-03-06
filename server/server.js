const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/users");
const problemRoutes = require("./routes/problems");
const statsRoutes = require("./routes/stats");
const dailyChallengeRoutes = require("./routes/dailyChallenge");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) =>
  res.json({ ok: true, timestamp: new Date().toISOString() })
);

app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/daily", dailyChallengeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5050;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
}

startServer();