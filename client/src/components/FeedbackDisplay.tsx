import React from "react";

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

interface FeedbackDisplayProps {
  feedback: Feedback;
  onClose: () => void;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  feedback,
  onClose,
}) => {
  return (
  <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 p-4">
    <div
       id="feedback-scroll"
      className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-10 relative transition-transform transform scale-95 animate-scale-in
                  scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2 sm:px-4 w-full">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide truncate">
          📋 AI Resume Feedback
        </h2>

        <button
          onClick={onClose}
          aria-label="Close feedback modal"
          className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors text-xl sm:text-2xl ml-3 flex-shrink-0"
        >
          ✖
        </button>
      </div>

      {/* Strengths Section */}
      <section className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 tracking-wide">
          ✅ Strengths
        </h3>
        <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">
          {feedback?.strengths?.map((item, idx) => (
            <li
              key={idx}
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Missing Skills Section */}
      <section className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 tracking-wide">
          ⚠️ Missing Skills
        </h3>
        <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">
          {feedback?.missingSkills?.map((item, idx) => (
            <li
              key={idx}
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Suggestions Section */}
      <section className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 tracking-wide">
          💡 Suggestions for Improvement
        </h3>
        <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">
          {feedback?.suggestions?.map((item, idx) => (
            <li
              key={idx}
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Learning Resources Section */}
      {feedback?.learningResources?.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 tracking-wide">
            📚 Learning Resources
          </h3>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">
            {feedback?.learningResources?.map((res, idx) => (
              <li
                key={idx}
                className="hover:translate-x-1 transition-transform"
              >
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {res.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  </div>
);

};

export default FeedbackDisplay;
