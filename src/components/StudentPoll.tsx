"use client";

import { useState, useEffect } from "react";
import { Poll } from "@/lib/socket";

interface StudentPollProps {
  currentPoll: Poll;
  hasAnswered: boolean;
  timeRemaining: number | null;
  onSubmitAnswer: (optionIndex: number) => void;
}

export default function StudentPoll({
  currentPoll,
  hasAnswered,
  timeRemaining,
  onSubmitAnswer,
}: StudentPollProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an option");
      return;
    }

    onSubmitAnswer(selectedOption);
    setSelectedOption(null);
  };

  // Reset selected option when poll changes
  useEffect(() => {
    setSelectedOption(null);
  }, [currentPoll.id]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Current Poll</h2>
        {timeRemaining !== null && currentPoll.isActive && !hasAnswered && (
          <div className="flex items-center text-sm">
            <span className="text-gray-600 mr-2">Time remaining:</span>
            <span
              className={`font-mono font-bold ${
                timeRemaining <= 10 ? "text-red-600" : "text-indigo-600"
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900">
            {currentPoll.question}
          </h3>
        </div>

        {/* Answer Options */}
        {currentPoll.isActive &&
        !hasAnswered &&
        timeRemaining !== null &&
        timeRemaining > 0 ? (
          <div className="space-y-3">
            {currentPoll.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  selectedOption === index
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="font-medium text-gray-700 mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}

            <button
              onClick={handleAnswerSubmit}
              disabled={selectedOption === null}
              className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </button>
          </div>
        ) : hasAnswered ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center">
              ✓ Your answer has been submitted! Waiting for results...
            </p>
          </div>
        ) : !currentPoll.isActive ? (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-700 text-center">
              This poll has ended. Results are shown below.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center">
              ⏰ Time's up! You can no longer submit an answer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
