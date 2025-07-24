"use client";

import React, { useState, useEffect } from "react";
import { useStudent } from "@/lib/socket";
import Link from "next/link";
import KickedOutPage from "@/components/KickedOutPage";
import WaitingPage from "@/components/WaitingPage";

interface PollOption {
  id: number;
  text: string;
  isSelected?: boolean;
}

const StudentPage = () => {
  const [name, setName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState("00:15");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Socket functionality
  const {
    isConnected,
    currentPoll,
    pollResults,
    timeRemaining,
    hasAnswered,
    answerResult,
    isKicked,
    chatMessages,
    error,
    submitAnswer,
    sendMessage,
    clearError,
  } = useStudent(name);

  // Check if name is already stored in sessionStorage
  useEffect(() => {
    const storedName = sessionStorage.getItem("studentName");
    if (storedName) {
      setName(storedName);
      setIsNameSet(true);
    }
  }, []);

  // Update poll data when socket receives new poll
  useEffect(() => {
    if (currentPoll) {
      setPollQuestion(currentPoll.question);
      setPollOptions(
        currentPoll.options.map((option, index) => ({
          id: index + 1,
          text: option,
        }))
      );
      // setHasAnswered(currentPoll.hasAnswered || false); // This is now handled by the hook
      setShowResults(false);
    }
  }, [currentPoll]);

  // Update results when socket receives poll results
  useEffect(() => {
    if (pollResults) {
      setShowResults(true);
    }
  }, [pollResults]);

  // Update time remaining
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const mins = Math.floor(timeRemaining / 60);
      const secs = timeRemaining % 60;
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    }
  }, [timeRemaining]);

  const handleContinue = () => {
    if (name.trim()) {
      const trimmedName = name.trim();
      setName(trimmedName);
      sessionStorage.setItem("studentName", trimmedName);
      setIsNameSet(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleOptionSelect = (optionId: number) => {
    if (!hasAnswered && currentPoll?.isActive) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption !== null && currentPoll?.isActive && !hasAnswered) {
      submitAnswer(selectedOption - 1); // Convert to 0-based index
      // setHasAnswered(true); // This is now handled by the hook
      setSelectedOption(null);
    }
  };

  // Show kicked message if student was kicked
  if (isKicked) {
    return <KickedOutPage />;
  }

  // Show waiting page if no poll is active or poll has ended
  if (!currentPoll || !currentPoll.isActive) {
    return <WaitingPage />;
  }

  // Show name entry if no name is set
  if (!isNameSet) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div
              className="px-6 py-2 rounded-full text-white font-medium text-sm"
              style={{
                background: "linear-gradient(135deg, #7565D9 0%, #4D0ACD 100%)",
              }}
            >
              ✨ Intervue Poll
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            <span className="font-normal">Let's</span> Get Started
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            If you're a student, you'll be able to{" "}
            <span className="font-semibold text-gray-900">
              submit your answers
            </span>
            , participate in live polls, and see how your responses compare with
            your classmates
          </p>

          <div className="mb-12">
            <label className="block text-left text-gray-900 text-lg font-medium mb-4 max-w-md mx-auto">
              Enter your Name
            </label>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Rahul Bajaj"
                className="w-full px-6 py-4 text-lg text-gray-900 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className={`px-12 py-4 rounded-full text-white font-medium text-lg transition-all duration-200 ${
              name.trim()
                ? "cursor-pointer hover:shadow-lg transform hover:scale-105"
                : " cursor-not-allowed"
            }`}
            style={{
              background: name.trim()
                ? "linear-gradient(135deg, #8F64E1 0%, #1D68BD 100%)"
                : "linear-gradient(135deg, #8F64E1 0%, #1D68BD 100%)",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Show poll interface
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto mt-16">
        {/* Connection Status */}
        <div className="mb-4 text-center">
          {isConnected ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Disconnected
            </span>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-red-800">{error}</span>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Question 1</h2>
            {currentPoll.isActive &&
              !hasAnswered &&
              timeRemaining !== null &&
              timeRemaining > 0 && (
                <div className="flex items-center gap-2 text-red-500">
                  <span className="w-4 h-4">⏱</span>
                  <span>{timeLeft}</span>
                </div>
              )}
          </div>
          <div
            className="text-white p-4 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #343434 0%, #6E6E6E 100%)",
            }}
          >
            <p className="text-lg">{pollQuestion}</p>
          </div>
        </div>

        {/* Show poll options if poll is active and student hasn't answered */}
        {currentPoll.isActive &&
        !hasAnswered &&
        timeRemaining !== null &&
        timeRemaining > 0 ? (
          <>
            <div className="space-y-3">
              {pollOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`p-4 rounded-xl flex items-center cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? "border border-[#6766D5]"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center font-semibold rounded-full mr-3 text-xs border text-white${
                      selectedOption === option.id ? "" : " bg-gray-400"
                    }`}
                    style={
                      selectedOption === option.id
                        ? {
                            background:
                              "linear-gradient(135deg, #8F64E1 0%, #4E377B 100%)",
                          }
                        : {}
                    }
                  >
                    {option.id}
                  </div>
                  <span className="text-gray-900 font-semibold">
                    {option.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-8 py-3 text-white rounded-full font-medium hover:shadow-lg transition-all ${
                  selectedOption !== null
                    ? "bg-[#6766D5] cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          </>
        ) : currentPoll.isActive && hasAnswered ? (
          // Student answered but poll is still active
          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {answerResult?.isCorrect ? "✅" : "❌"}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {answerResult?.isCorrect ? "Correct Answer!" : "Wrong Answer"}
            </h2>
            <p className="text-gray-600">
              Your answer has been submitted. Waiting for poll to end...
            </p>
            {timeRemaining !== null && timeRemaining > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Time remaining: {timeLeft}
              </p>
            )}
            {answerResult && !answerResult.isCorrect && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Correct answer(s):{" "}
                  {answerResult.correctAnswers
                    .map((index) => String.fromCharCode(65 + index))
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StudentPage;
