import { useState, type ChangeEvent } from "react";
import axios from "../lib/axios.ts";
import FeedbackDisplay from "../components/FeedbackDisplay.tsx";

interface LearningResource {
  title: string;
  url: string;
}

interface Feedback {
  strengths: string[];
  missingSkills: string[];
  suggestions: string[];
  learningResources: LearningResource[];
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select or drop a resume file.");
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("Job-description", jobDescription);
    setIsUploading(true);

    try {
      const response = await axios.post("/upload-resume", formData);
      console.log("Response : " , response.data.feedback )
      const feedbackObj = JSON.parse(response.data.feedback);

      setUploadSuccess(true);
      console.log("Extracted Text parsed:", feedbackObj);
      setFeedback(feedbackObj);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setFile(null);
      setJobDescription("");
      setUploadSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      <form
        onDragOver={(e: React.DragEvent<HTMLFormElement>) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e: React.DragEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleDrop(e);
          setDragOver(false);
        }}
        className={`w-full max-w-xl flex flex-col gap-6
      border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer p-6
      ${
        dragOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900 ring-4 ring-blue-200 dark:ring-blue-700"
          : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      >
        {/* Hidden file input */}
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Resume Upload Section */}
        <label
          htmlFor="resume-upload"
          className="flex flex-col items-center justify-center text-center py-6"
        >
          <img
            src="resume-upload-illustration.svg"
            alt="Upload Illustration"
            className="w-28 mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Upload Resume
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
            PDF or DOCX only
          </p>

          {/* File Info */}
          <div className="text-gray-700 dark:text-gray-300">
            {file ? (
              <p className="font-medium">📄 {file.name}</p>
            ) : (
              <p className="text-sm">Click or drag file here</p>
            )}
          </div>
        </label>

        {/* Job Description Field */}
        <div className="flex flex-col">
          <label
            htmlFor="job-description"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Paste Job Description
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full min-h-[8rem] p-3 rounded-lg border border-gray-300 dark:border-gray-600 
               bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
               focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || !jobDescription || isUploading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Sending..." : "Get AI Feedback"}
        </button>

        {/* Success message */}
        {uploadSuccess && (
          <p className="text-green-600 dark:text-green-400 font-medium text-center">
            ✅ Resume and Job Description sent!
          </p>
        )}
      </form>

      {feedback && (
        <FeedbackDisplay
          feedback={feedback}
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
}
