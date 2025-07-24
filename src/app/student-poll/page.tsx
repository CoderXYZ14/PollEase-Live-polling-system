"use client";
import React, { useState } from "react";

interface PollOption {
  id: number;
  text: string;
  isSelected?: boolean;
}

const StudentPoll = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState("00:15");

  const pollQuestion = "Which planet is known as the Red Planet?";
  const [pollOptions] = useState<PollOption[]>([
    { id: 1, text: "Mars" },
    { id: 2, text: "Venus" },
    { id: 3, text: "Jupiter" },
    { id: 4, text: "Saturn" },
  ]);

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto mt-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Question 1</h2>
            <div className="flex items-center gap-2 text-red-500">
              <span className="w-4 h-4">⏱</span>
              <span>{timeLeft}</span>
            </div>
          </div>
          <div
            className=" text-white p-4 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #343434 0%, #6E6E6E 100%)",
            }}
          >
            <p className="text-lg">{pollQuestion}</p>
          </div>
        </div>

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
              <span className="text-gray-900 font-semibold">{option.text}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button className="px-8 py-3 bg-[#6766D5] text-white rounded-full font-medium hover:shadow-lg transition-all">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPoll;
