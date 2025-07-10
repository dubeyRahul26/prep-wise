import { useEffect, useState } from "react";
import { setTheme, applyTheme } from "../theme";

export default function ThemeToggle() {
  const [theme, setLocalTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    setLocalTheme(newTheme);
  };

  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
        isDark ? "bg-gray-700" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
          isDark ? "translate-x-8" : "translate-x-1"
        }`}
      />
      <span className="absolute left-1 text-xs">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
