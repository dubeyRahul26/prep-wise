
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col items-center space-y-6 animate-fadeIn">
        <div className="relative w-20 h-20"> {/* Increased size */}
          <div className="absolute inset-0 border-[6px] border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-1.5 bg-indigo-500 rounded-full blur-md opacity-20"></div>
        </div>
        <p className="text-indigo-600 dark:text-indigo-400 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
