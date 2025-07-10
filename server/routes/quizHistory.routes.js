import express from "express";
import QuizHistory from "../models/quizHistory.model.js"; 
import { getSingleHistoryRecord, getUserHistory, saveQuizHistory } from "../controllers/quizHistory.controller.js";
const router = express.Router();

// Save quiz history (POST /api/history)
router.post("/", saveQuizHistory);

// Get all quiz history for a user (GET /api/history/:userId)
router.get("/:userId", getUserHistory);

// Get one quiz review (GET /api/history/:userId/:historyId)
router.get("/:userId/:historyId", getSingleHistoryRecord);

export default router;
