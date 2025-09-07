import React from "react";
import MockTestSetup from "../components/MockTestSetup";
import Navbar from "../components/Navbar";

const StartMockTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-all">
          <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Take a Practice Quiz
          </h2>
          <MockTestSetup />
        </div>
      </main>
    </div>
  );
};

export default StartMockTest;
