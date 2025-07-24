"use client";
import React, { useState } from "react";

const TeacherPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);

      setCorrectAnswers(correctAnswers.filter((answer) => answer !== index));
    }
  };

  const toggleCorrectAnswer = (index: number) => {
    if (correctAnswers.includes(index)) {
      setCorrectAnswers(correctAnswers.filter((answer) => answer !== index));
    } else {
      setCorrectAnswers([...correctAnswers, index]);
    }
  };

  const handleAskQuestion = () => {
    if (question.trim() && options.every((opt) => opt.trim())) {
      // Navigate to poll page instead of showing overlay
      window.open("/poll", "_blank");
    }
  };

  const isFormValid =
    question.trim() &&
    options.every((opt) => opt.trim()) &&
    correctAnswers.length > 0;

  return (
    <div className="min-h-screen bg-white pt-2 pb-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 mt-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div
              className="px-6 py-2 rounded-full text-white font-medium text-sm "
              style={{
                background: "linear-gradient(135deg, #7565D9 0%, #4D0ACD 100%)",
              }}
            >
              ✨ Intervue Poll
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Let's Get Started
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed">
            you'll have the ability to create and manage polls, ask questions,
            and monitor your students' responses in real-time.
          </p>
        </div>

        <div className="space-y-6">
          {/* Question Input */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium text-gray-900">
                Enter your question
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                  <option value={120}>2 minutes</option>
                </select>
              </div>
            </div>
            <textarea
              value={question}
              onChange={handleQuestionChange}
              placeholder="Enter your question here..."
              className="w-full h-32 px-4 py-3 text-gray-900 bg-gray-100 border-0 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {question.length}/100
            </div>
          </div>

          {/* Options and Correct Answers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edit Options */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Edit Options
              </h3>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{
                        background:
                          "linear-gradient(135deg, #8F64E1 0%, #4E377B 100%)",
                      }}
                    >
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-3 text-gray-900 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="w-8 h-8 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 4 && (
                <button
                  onClick={addOption}
                  className="mt-4 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  + Add More option
                </button>
              )}
            </div>

            {/* Is it Correct? */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Is it Correct?
              </h3>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center h-12  py-3  rounded-xl"
                  >
                    <div className="flex space-x-4 ">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={correctAnswers.includes(index)}
                          onChange={() => toggleCorrectAnswer(index)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            correctAnswers.includes(index)
                              ? "bg-purple-600 border-purple-600"
                              : "border-gray-300 bg-white hover:border-purple-400"
                          }`}
                        >
                          {correctAnswers.includes(index) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!correctAnswers.includes(index)}
                          onChange={() => toggleCorrectAnswer(index)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            !correctAnswers.includes(index)
                              ? "bg-purple-600 border-purple-600"
                              : "border-gray-300 bg-white hover:border-purple-400"
                          }`}
                        >
                          {!correctAnswers.includes(index) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">No</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleAskQuestion}
            disabled={!isFormValid}
            className={`px-8 py-4 rounded-full text-white font-medium text-lg transition-all duration-200 ${
              isFormValid
                ? "cursor-pointer hover:shadow-lg transform hover:scale-105"
                : "cursor-not-allowed"
            }`}
            style={{
              background: "linear-gradient(135deg, #8F64E1 0%, #1D68BD 100%)",
            }}
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
