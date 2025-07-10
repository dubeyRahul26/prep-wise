import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../store/useAuthStore";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="w-full fixed top-0 z-50 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
        >
          PrepWise
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <button
                onClick={() => navigate("/mock-test")}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              >
                Start Quiz
              </button>
              <button
                onClick={() => navigate("/quizHistory")}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              >
                History
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition"
              >
                Register
              </button>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-4 text-gray-700 dark:text-gray-200 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className="md:hidden bg-white dark:bg-gray-900 shadow-md rounded-b-xl py-4 px-6 space-y-4"
        >
          {user ? (
            <>
              <button
                onClick={() => {
                  navigate("/mock-test");
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              >
                Start Quiz
              </button>
              <button
                onClick={() => {
                  navigate("/quizHistory");
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              >
                History
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setMenuOpen(false);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
