import React from "react";


type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

interface ReviewProps {
  questions: Question[];
  answers: {[index: number]: string };
  handleRetake: () => void;
}


const Review : React.FC<ReviewProps> = ({questions , answers , handleRetake}) => {
  return (
    <>
      <h2 className="text-3xl font-bold text-indigo-600 text-center dark:text-indigo-400">
        Review Answers
      </h2>
      <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
        {questions.map((q : Question, index : number) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer === q.answer;

          return (
            <div
              key={q.id}
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
            >
              <p className="font-semibold mb-2">{q.question}</p>
              <p>
                <span className="font-medium">Your Answer: </span>
                <span className={isCorrect ? "text-green-600" : "text-red-500"}>
                  {userAnswer || "No answer"}
                </span>
              </p>
              {!isCorrect && (
                <p className="text-green-600">
                  <span className="font-medium">Correct Answer:</span>{" "}
                  {q.answer}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic">
                Explanation: {q.explanation}
              </p>
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <button
          onClick={handleRetake}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          Retake Quiz
        </button>
      </div>
    </>
  );
};

export default Review;
