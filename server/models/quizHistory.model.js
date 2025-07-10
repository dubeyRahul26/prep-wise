import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String], // optional: if you want to store them
  answer: { type: String, required: true },
  selected: { type: String }, 
  explanation: { type: String },
  isCorrect: { type: Boolean, required: true },
});

const QuizHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // or email/username
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    dateTaken: { type: Date, default: Date.now },
    questions: [AnswerSchema],
  },
  { timestamps: true }
);

export default mongoose.model("QuizHistory", QuizHistorySchema);
