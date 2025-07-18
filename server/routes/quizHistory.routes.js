import express from "express";
import { getSingleHistoryRecord, getUserHistory, saveQuizHistory } from "../controllers/quizHistory.controller.js";
const router = express.Router();

// Save quiz history (POST /api/history)
router.post('/', saveQuizHistory);

// Get one quiz review (GET /api/history/:userId/:historyId)
router.get('/:userId/:historyId', getSingleHistoryRecord);

// Get all quiz history for a user (GET /api/history/:userId)
router.get('/:userId', getUserHistory);



export default router;
