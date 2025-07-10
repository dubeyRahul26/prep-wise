import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  subject: String,
  question: String,
  options: [String],
  answer: String,
  explanation: String,
});

export default mongoose.model("Question", questionSchema);
