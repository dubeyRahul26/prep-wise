// controllers/quizHistory.controller.js
import QuizHistory from "../models/quizHistory.model.js";

export const saveQuizHistory = async (req, res) => {
  try {
    const { userId, subject, score, total, questions } = req.body;

    const quiz = await QuizHistory.create({
      userId,
      subject,
      score,
      total,
      questions,
    });

    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save quiz history." });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const history = await QuizHistory.find({ userId: req.params.userId }).sort({ dateTaken: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
};

export const getSingleHistoryRecord = async (req, res) => {
  try {
    const record = await QuizHistory.findOne({
      _id: req.params.historyId,
      userId: req.params.userId,
    });
    if (!record) return res.status(404).json({ error: "Not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Error fetching review." });
  }
};
