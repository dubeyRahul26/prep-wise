
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import DB and routes
import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.routes.js";
import generateRoutes from "./routes/generate.routes.js";
import quizHistoryRoutes from "./routes/quizHistory.routes.js";

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname (for ES module environments)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS (for dev or Render if frontend is on another domain)
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5000",
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/history", quizHistoryRoutes);

// Serve static files from client
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("DB Connection Failed:", err);
});
