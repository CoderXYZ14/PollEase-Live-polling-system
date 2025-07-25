"use client";
import React, { useState, useEffect } from "react";
import { useTeacher } from "@/lib/socket";
import { Eye, MessageCircle, Users } from "lucide-react";

const TeacherPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  // Socket functionality
  const {
    isConnected,
    currentPoll,
    pollResults,
    studentsCount,
    studentsList,

    error,
    createPoll,

    kickStudent,

    clearError,
  } = useTeacher();

  // Show results when poll is created
  useEffect(() => {
    if (currentPoll && currentPoll.isActive) {
      setShowResults(true);
    }
  }, [currentPoll]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
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
    if (
      question.trim() &&
      options.every((opt) => opt.trim()) &&
      correctAnswers.length > 0
    ) {
      const validOptions = options.filter((opt) => opt.trim());
      createPoll(question.trim(), validOptions, correctAnswers, timeLimit);

      // Immediately show results UI
      setShowResults(true);

      // Reset form
      setQuestion("");
      setOptions(["", ""]);
      setCorrectAnswers([]);
      setTimeLimit(60);
    }
  };

  const handleAskNewQuestion = () => {
    setShowResults(false);
  };

  const handleViewPollHistory = () => {
    console.log("View poll history clicked");
    // Could implement past polls view here
  };

  const isFormValid =
    question.trim() &&
    options.every((opt) => opt.trim()) &&
    correctAnswers.length > 0;

  const canCreateNewPoll = !currentPoll || !currentPoll.isActive;

  // Debug: log students list
  console.log("Teacher page - studentsList:", studentsList);
  console.log("Teacher page - studentsCount:", studentsCount);

  // Show poll results UI (like /poll page)
  if (showResults && currentPoll && pollResults) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Connection Status */}
          <div className="mb-4 mt-8 text-center">
            {isConnected ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Connected • {studentsCount} students online
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Disconnected
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mb-8 mt-8">
            <div></div>
            <button
              onClick={handleViewPollHistory}
              className="flex items-center space-x-2 px-6 py-3 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200 bg-[#8F64E1]"
            >
              <Eye size={20} />
              <span>View Poll history</span>
            </button>
          </div>

          <div className="relative">
            {showParticipants && (
              <div className="fixed bottom-24 right-4 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="border-b border-gray-100">
                  <div className="flex">
                    <button className="flex-1 px-6 py-4 text-purple-600 border-b-2 border-purple-600 font-medium">
                      <Users size={20} className="inline mr-2" />
                      Participants ({studentsCount})
                    </button>
                  </div>
                </div>

                {/* Participants Header */}
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Name</span>
                    <span>Action</span>
                  </div>
                </div>

                {/* Participants List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {studentsList.length === 0 ? (
                    studentsCount > 0 ? (
                      <div className="px-6 py-8 text-center text-gray-500">
                        {studentsCount} students connected
                        <br />
                        <small className="text-xs text-gray-400">
                          (Names loading...)
                        </small>
                      </div>
                    ) : (
                      <div className="px-6 py-8 text-center text-gray-500">
                        No students connected
                      </div>
                    )
                  ) : (
                    studentsList.map((student) => (
                      <div
                        key={student.id}
                        className="px-6 py-3 border-b border-gray-50 last:border-b-0 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="text-gray-900 font-medium">
                          {student.name}
                        </span>
                        <button
                          onClick={() => {
                            console.log(
                              "Kicking student:",
                              student.id,
                              student.name
                            );
                            kickStudent(student.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 cursor-pointer"
                        >
                          Kick out
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Question
                </h2>
                <div
                  className="text-white p-4 rounded-t-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #343434 0%, #6E6E6E 100%)",
                  }}
                >
                  <p className="text-lg">{currentPoll.question}</p>
                </div>
              </div>

              <div
                className="rounded-b-xl overflow-hidden mb-8"
                style={{ backgroundColor: "#F6F6F6" }}
              >
                {pollResults.results.map((result, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center p-0">
                      <div className="flex items-center min-w-0 flex-1">
                        <div
                          className="flex-1 h-16 flex items-center px-4 relative"
                          style={{
                            background: `linear-gradient(to right, #6766D5 ${result.percentage}%, transparent ${result.percentage}%)`,
                          }}
                        >
                          <div className="w-6 h-6 flex items-center justify-center font-medium bg-white rounded-full mr-2 text-[#6766D5] text-xs">
                            {index + 1}
                          </div>
                          <span className="text-black font-medium relative z-10">
                            {result.option}
                          </span>
                        </div>
                      </div>
                      <div className="pr-4">
                        <span className="text-lg font-semibold text-gray-900">
                          {result.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Poll Status */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      currentPoll.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  {currentPoll.isActive ? "Poll Active" : "Poll Ended"}
                  <span className="mx-2">•</span>
                  Responses: {pollResults.totalResponses} / {studentsCount}
                </div>
              </div>

              <div className="text-center flex justify-end">
                {canCreateNewPoll ? (
                  <button
                    onClick={handleAskNewQuestion}
                    className="px-8 py-4 rounded-full text-white font-medium text-lg transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #8F64E1 0%, #1D68BD 100%)",
                    }}
                  >
                    + Ask a new question
                  </button>
                ) : (
                  <div className="px-8 py-4 rounded-full bg-gray-300 text-gray-600 font-medium text-lg">
                    Waiting for current poll to finish...
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            style={{ backgroundColor: "#5A66D1" }}
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Show poll creation form
  return (
    <div className="min-h-screen bg-white pt-2 pb-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Connection Status */}
        <div className="mb-4 mt-16 text-center">
          {isConnected ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Connected • {studentsCount} students online
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

        <div className="mb-4">
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
            Let&apos;s Get Started
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed">
            you&apos;ll have the ability to create and manage polls, ask
            questions, and monitor your students&apos; responses in real-time.
          </p>
        </div>

        {/* Cannot create poll warning */}
        {!canCreateNewPoll && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800">
              Cannot create a new poll while another poll is active. Wait for
              all students to answer or for the timer to expire.
            </p>
          </div>
        )}

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
                  <option value={300}>5 minutes</option>
                </select>
              </div>
            </div>
            <textarea
              value={question}
              onChange={handleQuestionChange}
              placeholder="Enter your question here..."
              className="w-full h-32 px-4 py-3 text-gray-900 bg-gray-100 border-0 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
              disabled={!canCreateNewPoll}
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
                      disabled={!canCreateNewPoll}
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="w-8 h-8 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        disabled={!canCreateNewPoll}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 6 && (
                <button
                  onClick={addOption}
                  className="mt-4 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                  disabled={!canCreateNewPoll}
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
                          disabled={!canCreateNewPoll}
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
                          disabled={!canCreateNewPoll}
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
            disabled={!isFormValid || !canCreateNewPoll}
            className={`px-8 py-4 rounded-full text-white font-medium text-lg transition-all duration-200 ${
              isFormValid && canCreateNewPoll
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
