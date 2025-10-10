import Question from "../models/question.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Retry logic for flash model
async function generateWithRetry(
  model,
  prompt,
  maxRetries = 3,
  baseDelay = 500
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      if (err.status === 503 && attempt < maxRetries - 1) {
        const delay = baseDelay * 2 ** attempt;
        console.warn(
          `Flash attempt ${attempt + 1} failed, retrying in ${delay}ms...`
        );
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

export const generateQuestions = async (req, res) => {
  const { subject } = req.body;
  if (!subject) return res.status(400).json({ error: "Subject is required." });

  const prompt = `You are an exam generator.

Your task is to generate exactly 15 multiple-choice questions for the subject: ${subject}.

Requirements:
- 5 Easy questions
- 5 Medium questions
- 5 Hard questions
- All 15 questions should be randomly ordered (not grouped by difficulty).
- The correct answer must appear at a **random position** in the "options" array (not always the first).
- The question set must be **different each time**, even if the same subject is provided multiple times (introduce variations).
- Each question must follow this **strict JSON structure**:

{
  "question": "What is the capital of France?",
  "options": ["Paris", "London", "Berlin", "Rome"],
  "answer": "Paris",
  "explanation": "Paris is the capital of France."
}

Only return a valid JSON **array** of exactly 15 such objects.
Ensure output is strictly formatted JSON with no extra text.`;

  try {
    let text;

    try {
      const flashModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });
      text = await generateWithRetry(flashModel, prompt);
    } catch (flashErr) {
      console.warn("Flash failed, falling back to pro:", flashErr.message);
      const proModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      try {
        const proResult = await proModel.generateContent(prompt);
        text = proResult.response.text();
      } catch (proErr) {
        console.error("Pro fallback failed:", proErr.message);
        if (proErr.status === 429 && Array.isArray(proErr.errorDetails)) {
          const retryInfo = proErr.errorDetails.find((d) =>
            d["@type"]?.includes("RetryInfo")
          );
          const retryAfter = retryInfo?.retryDelay || "60s";
          return res
            .status(429)
            .set("Retry-After", retryAfter.toString())
            .json({
              error: `Rate limit exceeded. Try again after ${retryAfter} seconds.`,
            });
        }

        return res.status(500).json({
          error: "Failed to generate questions: " + proErr.message,
        });
      }
    }

    // Clean and extract valid JSON array
    const cleanedText = text
      .replace(/```(?:json|javascript)?\s*/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = cleanedText.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!jsonMatch) {
      throw new Error("Generated text does not contain a valid JSON array.");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const formatted = parsed.map((item, index) => ({
      id: index + 1,
      subject,
      question: item.question,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation,
    }));

    await Question.insertMany(formatted);

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Question generation error:", err.message);
    res.status(500).json({ error: "Failed to generate questions." });
  }
};
