import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-500">
      
      <main className="flex flex-col items-center justify-center px-6 pt-24 sm:pt-32 text-center animate-fadeIn">

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-300">
          Welcome to PrepWise
        </h1>

        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
          Your AI-driven learning and career companion:{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            personalized quizzes, resume analysis, and job application management
          </span>{" "}
          — all at your fingertips.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

          {user ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/mock-test")}
                className="px-6 py-3 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md transition transform hover:scale-105"
              >
                Take Quiz
              </button>

              <button
                type="button"
                onClick={() => navigate("/quizHistory")}
                className="border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition duration-300 px-6 py-3 rounded-xl text-base sm:text-lg shadow-sm hover:scale-105"
              >
                View History
              </button>

              <button
                type="button"
                onClick={() => navigate("/resumeUpload")}
                className="border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition duration-300 px-6 py-3 rounded-xl text-base sm:text-lg shadow-sm hover:scale-105"
              >
                Analyze Resume
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-6 py-3 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md transition transform hover:scale-105"
            >
              Get Started
            </button>
          )}

        </div>
      </main>

      <footer className="text-center mt-16 mb-6 text-sm text-gray-600 dark:text-gray-400 animate-fadeIn delay-100">
        © {new Date().getFullYear()} <strong>PrepWise</strong>. Crafted with care by{" "}
        <a
          href="https://portfolio-sigma-five-98.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Rahul Dubey
        </a>
      </footer>
    </div>
  );
};

export default Home;
