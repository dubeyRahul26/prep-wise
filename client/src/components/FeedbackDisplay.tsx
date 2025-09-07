import React from "react";
import jsPDF from "jspdf";

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
  const downloadPDF = () => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const maxWidth = pageWidth - 2 * margin;
  let y = 60;
  const lineHeight = 16;

  const addPageIfNeeded = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);  // Black text
  pdf.text("AI Resume Feedback", margin, y);
  y += 30;

  pdf.setFontSize(14);

  // Strengths
  addPageIfNeeded(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Strengths:", margin, y);
  y += 20;

  feedback.strengths.forEach(item => {
    const lines = pdf.splitTextToSize(`• ${item}`, maxWidth - 20);
    addPageIfNeeded(lines.length * lineHeight);
    pdf.text(lines, margin + 20, y);
    y += lines.length * lineHeight;
  });

  // Missing Skills
  y += 10;
  addPageIfNeeded(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Missing Skills:", margin, y);
  y += 20;

  feedback.missingSkills.forEach(item => {
    const lines = pdf.splitTextToSize(`• ${item}`, maxWidth - 20);
    addPageIfNeeded(lines.length * lineHeight);
    pdf.text(lines, margin + 20, y);
    y += lines.length * lineHeight;
  });

  // Suggestions
  y += 10;
  addPageIfNeeded(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Suggestions for Improvement:", margin, y);
  y += 20;

  feedback.suggestions.forEach(item => {
    const lines = pdf.splitTextToSize(`• ${item}`, maxWidth - 20);
    addPageIfNeeded(lines.length * lineHeight);
    pdf.text(lines, margin + 20, y);
    y += lines.length * lineHeight;
  });

  // Learning Resources
  if (feedback.learningResources.length > 0) {
    y += 10;
    addPageIfNeeded(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Learning Resources:", margin, y);
    y += 20;

    feedback.learningResources.forEach(res => {
      const lines = pdf.splitTextToSize(`• ${res.title}`, maxWidth - 20);

      addPageIfNeeded(lines.length * lineHeight);

      // Set link text color to blue
      pdf.setTextColor(0, 0, 255);
      pdf.textWithLink(lines[0], margin + 20, y, { url: res.url });
      y += lineHeight;

      // Subsequent lines in blue as well
      for (let i = 1; i < lines.length; i++) {
        addPageIfNeeded(lineHeight);
        pdf.text(lines[i], margin + 20, y);
        y += lineHeight;
      }

      // Reset color back to black after each resource
      pdf.setTextColor(0, 0, 0);
    });
  }

  pdf.save("AI_Feedback_Summary.pdf");
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 p-2 sm:p-4">
      <div className="w-full max-w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-10 relative transition-transform transform scale-95 animate-scale-in scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-2 sm:px-4 w-full">
          <h2 className="text-base sm:text-lg md:text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide truncate">
            📋 AI Resume Feedback
          </h2>

          <button
            onClick={onClose}
            aria-label="Close feedback modal"
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors text-lg sm:text-xl ml-3 flex-shrink-0"
          >
            ✖
          </button>
        </div>

        {/* Strengths Section */}
        <section className="mb-5 sm:mb-6">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 tracking-wide">
            ✅ Strengths
          </h3>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-800 dark:text-gray-300 text-xs sm:text-sm">
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
        <section className="mb-5 sm:mb-6">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 tracking-wide">
            ⚠️ Missing Skills
          </h3>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-800 dark:text-gray-300 text-xs sm:text-sm">
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
        <section className="mb-5 sm:mb-6">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 tracking-wide">
            💡 Suggestions for Improvement
          </h3>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-800 dark:text-gray-300 text-xs sm:text-sm">
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
          <section className="mb-6 sm:mb-7">
            <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 tracking-wide">
              📚 Learning Resources
            </h3>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-800 dark:text-gray-300 text-xs sm:text-sm">
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

        {/* Centered Download Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDisplay;
