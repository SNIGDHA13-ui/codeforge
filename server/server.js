const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const problemRoutes = require("./routes/problems");
const statsRoutes = require("./routes/stats");
const dailyChallengeRoutes = require("./routes/dailyChallenge");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send(`
    <html>
      <body style="font-family: Arial; padding: 24px;">
        <h1>Backend is running ✅</h1>
        <p>Try <a href="/api/health">/api/health</a></p>
      </body>
    </html>
  `);
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "API healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/problems", problemRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/daily", dailyChallengeRoutes);

// Optional backward-compatible alias
app.use("/api/daily-challenge", dailyChallengeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5050;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
}

startServer();