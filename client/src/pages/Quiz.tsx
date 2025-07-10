import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Review from "../components/Review";
import ScoreFeedback from "../components/ScoreFeedback";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const Quiz: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<string | null>(null);
  const { subject } = useParams<{ subject: string }>();
  const currentQuestion = questions[current];
  const { user } = useAuthStore();

  const handleOptionClick = (option: string) => setSelected(option);

  const handleNext = async () => {
    if (selected !== null && currentQuestion) {
      const updatedAnswers = { ...answers, [current]: selected };
      setAnswers(updatedAnswers);

      const newScore = Object.entries(updatedAnswers).reduce((acc, [index, answer]) => {
        const q = questions[Number(index)];
        return acc + (q && answer === q.answer ? 1 : 0);
      }, 0);

      setScore(newScore);
      setSelected(null);

      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
      } else {
        try {
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/history`, {
            userId: user?.id,
            subject,
            score: newScore,
            total: questions.length,
            questions: questions.map((q, index) => ({
              question: q.question,
              options: q.options,
              answer: q.answer,
              selected: updatedAnswers[index],
              explanation: q.explanation,
              isCorrect: updatedAnswers[index] === q.answer,
            })),
          });
        } catch (err) {
          console.error("Failed to save quiz history:", err);
        }

        setShowScore(true);
      }
    }
  };

  const handleRetake = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setScore(0);
    setShowScore(false);
    setShowReview(false);
    setQuestions(originalQuestions);
    setError(null);
    setRetryAfter(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
         `${import.meta.env.VITE_BACKEND_URL}/api/generate`,
          { subject },
          { validateStatus: (status) => status < 500 }
        );

        if (response.status === 429) {
          const ra = response.headers["retry-after"] || null;
          setRetryAfter(ra);
          setError(`Rate limit exceeded. Try again after ${ra || "a few"} seconds.`);
        } else if (response.status !== 200) {
          setError(response.data?.error || "Failed to load questions.");
        } else {
          const fetched: Question[] = response.data;
          setQuestions(fetched);
          setOriginalQuestions(fetched);
        }
      } catch (err: any) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (subject) fetchData();
  }, [subject]);

  return (
    <div className="min-h-[100dvh] bg-gray-100 dark:bg-gray-900 px-4 py-6 text-black dark:text-white flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        {loading ? (
          <Loading />
        ) : error ? (
          <Error error={error} retryAfter={retryAfter} handleRetake={handleRetake} />
        ) : showReview ? (
          <Review questions={questions} answers={answers} handleRetake={handleRetake} />
        ) : showScore ? (
          <ScoreFeedback
            score={score}
            total={questions.length}
            onReview={() => setShowReview(true)}
          />
        ) : currentQuestion ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Question {current + 1} of {questions.length}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">Score: {score}</div>
            </div>

            <p className="text-base sm:text-lg font-medium">{currentQuestion.question}</p>

            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg border font-medium transition-all duration-200
                    ${
                      selected === opt
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-600 dark:hover:text-white"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                disabled={selected === null}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200
                  ${
                    selected
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
              >
                {current + 1 === questions.length ? "Submit" : "Next"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Quiz;
