import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { allowedSubjects } from "../utils/subjects";

const MockTestSetup: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const filteredSubjects = allowedSubjects.filter((subj) =>
    subj.toLowerCase().includes(subject.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = subject.trim();

    if (!allowedSubjects.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      alert("Please select a valid subject from the list.");
      return;
    }

    navigate(`/quiz/${trimmed}`);
  };

  const handleSelect = (value: string) => {
    setSubject(value);
    setShowOptions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      <div className="relative">
        <input
          type="text"
          name="subject"
          autoComplete="off"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setShowOptions(true);
          }}
          onFocus={() => setShowOptions(true)}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your subject"
          required
        />
        {showOptions && subject.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600">
            {filteredSubjects.length === 0 ? (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-400">No matches found</li>
            ) : (
              filteredSubjects.map((subj, idx) => (
                <li
                  key={idx}  
                  onClick={() => handleSelect(subj)}
                  className="cursor-pointer px-4 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-700 text-black dark:text-white"
                >
                  {subj}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
      >
        Start Test
      </button>
    </form>
  );
};

export default MockTestSetup;
