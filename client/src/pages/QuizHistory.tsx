import React, { useState, useEffect } from "react";
import axios from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import Loading from "../components/Loading";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';


interface Question {
  question: string;
  selected: string;
  answer: string;
  explanation: string;
  isCorrect: Boolean;
}

interface Quiz {
  _id: string;
  subject: string;
  dateTaken?: string;
  createdAt?: string;
  score: number;
  total: number;
  questions: Question[];
}

const QuizHistory: React.FC = () => {
  const [quizHistory, setQuizHistory] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/history/${user?.id}`);
        setQuizHistory(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch quiz history.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHistory();
    }
  }, [user]);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="text-center text-red-500 py-10">{error}</div>
    );

  if (selectedQuiz) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-black dark:text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center">
            Review: {selectedQuiz.subject}
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-300">
            Score:{" "}
            <span className="font-semibold">{selectedQuiz.score}</span> /{" "}
            {selectedQuiz.total}
          </p>

          <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
            {selectedQuiz.questions.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No detailed answers available for this quiz.
              </p>
            ) : (
              selectedQuiz.questions.map((q, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                >
                  <p className="font-semibold mb-2">{q.question}</p>
                  <p>
                    <span className="font-medium">Your Answer: </span>
                    <span
                      className={
                        q.isCorrect ? "text-green-600" : "text-red-500"
                      }
                    >
                      {q.selected || "No answer"}
                    </span>
                  </p>
                  {!q.isCorrect && (
                    <p className="text-green-600">
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {q.answer}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic">
                    Explanation: {q.explanation}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => setSelectedQuiz(null)}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Back to History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-black dark:text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-10">
          Quiz History
        </h1>

        {quizHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <ExclamationCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Quiz History Found
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 max-w-md">
              You haven’t taken any quizzes yet. Start a new quiz to see your history here and track your progress over time.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizHistory.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {quiz.subject}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Date Taken:{" "}
                    {new Date(
                      quiz.dateTaken || quiz.createdAt || ""
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Score:{" "}
                    <span
                      className={`font-semibold ${
                        quiz.score / quiz.total >= 0.6
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {quiz.score} / {quiz.total}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedQuiz(quiz)}
                  className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
