import React from "react";

interface ErrorProps {
  error: string;
  retryAfter?: string | null;
  handleRetake: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, retryAfter, handleRetake }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 p-6 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 shadow-sm">
      <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
        {error}
      </p>

      {retryAfter && (
        <button
          onClick={handleRetake}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
        >
          Retry After {retryAfter}
        </button>
      )}
    </div>
  );
};

export default Error;
