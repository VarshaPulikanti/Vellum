import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resumes.js";
import aiRoutes from "./routes/ai.js";
import { errorHandler } from "./utils/async.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mongo: mongoose.connection.readyState === 1,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

async function start() {
  app.listen(port, () => {
    console.log(`Vellum API running on http://localhost:${port}`);
  });

  try {
    if (process.env.MONGO_URI) {
      await connectDB(process.env.MONGO_URI);
    } else {
      console.warn("MONGO_URI missing — auth and saved resumes will fail.");
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error("Start MongoDB or set MONGO_URI. AI routes still work.");
  }
}

start();
