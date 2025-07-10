import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register, error, loading } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(form.name, form.email, form.password);
    if (success) navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 text-gray-900 dark:text-white transition-colors duration-500">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl p-8 animate-fadeIn">
        <h2 className="text-4xl font-extrabold text-center text-indigo-600 dark:text-indigo-400 mb-8">
          Join PrepWise ✨
        </h2>

        {error && (
          <div className="mb-5 flex items-start bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
            <svg
              className="w-5 h-5 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.675-1.36 3.44 0l5.518 9.828c.75 1.336-.213 3.073-1.72 3.073H4.459c-1.507 0-2.47-1.737-1.72-3.073L8.257 3.1zm.743 3.401a1 1 0 10-2 0v3a1 1 0 102 0v-3zm0 6a1 1 0 10-2 0 1 1 0 002 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold rounded-xl transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-[1.02]"
            }`}
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
