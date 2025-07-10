import confetti from "canvas-confetti";
import type React from "react";
import { useEffect } from "react";

const ScoreFeedback: React.FC<{
  score: number;
  total: number;
  onReview: () => void;
}> = ({ score, total, onReview }) => {
  const percentage = (score / total) * 100;

  useEffect(() => {
    if (percentage >= 80) {
      confetti({
        particleCount: 200,
        spread: 100,
        angle: 60,
        origin: { x: 0, y: 0.6 },
      });
      confetti({
        particleCount: 200,
        spread: 100,
        angle: 120,
        origin: { x: 1, y: 0.6 },
      });
    } else if (percentage >= 60) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [percentage]);

  const getEmoji = () => {
    if (percentage >= 80)
      return <span className="animate-bounce text-7xl">🤩</span>;
    if (percentage >= 60)
      return <span className="animate-bounce text-7xl">😄</span>;
    return <span className="animate-pulse text-7xl">😢</span>;
  };

  const getMessage = () => {
    if (percentage >= 80) return "Outstanding!";
    if (percentage >= 60) return "Good job!";
    return "Don't worry, try again!";
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
        Quiz Completed!
      </h2>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        You scored {score} out of {total}
      </p>
      <div>{getEmoji()}</div>
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        {getMessage()}
      </p>
      <button
        onClick={onReview}
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
      >
        Review Answers
      </button>
    </div>
  );
};

export default ScoreFeedback ;