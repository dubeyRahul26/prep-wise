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

Compare the resume below with the job description and provide a JSON response in the exact following format:

{
  "strengths": ["List of strengths as plain text strings without any markdown or special formatting."],
  "missingSkills": ["List of missing skills as plain text strings."],
  "suggestions": ["List of actionable suggestions as plain text strings."],
  "learningResources": [
    { "title": "Descriptive resource title", "url": "https://example.com" }
  ]
}

Important Requirements:
- Do NOT include any markdown syntax (no **bold**, no bullet points, no special characters in string items).
- Each item must be a plain text string without any code blocks or backticks.
- The learningResources field must be an array of objects, each with:
    - "title": A concise, descriptive title of the resource.
    - "url": A fully working URL that is currently valid and points to a helpful online resource related to the missing skills or suggestions.
- Ensure the JSON is well-formatted, valid, and parsable by JSON.parse() without errors.
- Do not wrap the output in code blocks or add extra text outside of the JSON object.

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
