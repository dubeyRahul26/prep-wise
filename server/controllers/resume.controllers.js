import { GoogleGenerativeAI } from "@google/generative-ai";

import mammoth from "mammoth";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No resume uploaded" });

    let resumeText = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text;
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      resumeText = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const jobDescription = req.body["Job-description"];

    
    const prompt = `
You are a career assistant.

Compare the resume below with the job description and provide a JSON response in the following format:

{
  "strengths": ["List of strengths as plain text strings without any markdown or special formatting."],
  "missingSkills": ["List of missing skills as plain text strings."],
  "suggestions": ["List of actionable suggestions as plain text strings."],
  "learningResources": [
    { "title": "Descriptive resource title", "url": "https://example.com" }
  ]
}

Important Requirements:
- Do NOT include any markdown syntax (no **bold**, no bullet points, no lists in the string items).
- Each item should be a plain text string.
- The learningResources field should be an array of objects, each with a "title" and a valid "url".
- Make sure the JSON is well-formatted and parsable without additional post-processing.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    res.json({ feedback });
  } catch (err) {
    console.error("Resume analysis error:", err.message);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
};
