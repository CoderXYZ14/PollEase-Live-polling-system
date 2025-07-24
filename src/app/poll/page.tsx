"use client";
import React, { useState } from "react";
import { Eye, MessageCircle, Users } from "lucide-react";

interface PollOption {
  id: number;
  text: string;
  percentage: number;
  isCorrect?: boolean;
}

interface Participant {
  id: number;
  name: string;
  selectedOption?: number;
}

const LivePollResults = () => {
  const [showParticipants, setShowParticipants] = useState(false);

  const pollQuestion = "Which planet is known as the Red Planet?";

  const [pollOptions] = useState<PollOption[]>([
    { id: 1, text: "Mars", percentage: 75, isCorrect: true },
    { id: 2, text: "Venus", percentage: 5 },
    { id: 3, text: "Jupiter", percentage: 5 },
    { id: 4, text: "Saturn", percentage: 15 },
  ]);

  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "Rahul Arora", selectedOption: 1 },
    { id: 2, name: "Pushpender Rautela", selectedOption: 1 },
    { id: 3, name: "Rijul Zalpuri", selectedOption: 4 },
    { id: 4, name: "Nadeem N", selectedOption: 1 },
    { id: 5, name: "Ashwin Sharma", selectedOption: 2 },
  ]);

  const handleKickOut = (participantId: number) => {
    setParticipants(participants.filter((p) => p.id !== participantId));
  };

  const handleViewPollHistory = () => {
    console.log("View poll history clicked");
  };

  const handleAskNewQuestion = () => {
    console.log("Ask new question clicked");
  };

  const maxPercentage = Math.max(
    ...pollOptions.map((option) => option.percentage)
  );

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 mt-16">
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
                  <button
                    onClick={() => setShowParticipants(false)}
                    className="flex-1 px-6 py-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <MessageCircle size={20} className="inline mr-2" />
                    Chat
                  </button>
                  <button className="flex-1 px-6 py-4 text-purple-600 border-b-2 border-purple-600 font-medium">
                    <Users size={20} className="inline mr-2" />
                    Participants
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
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="px-6 py-3 border-b border-gray-50 last:border-b-0 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-900 font-medium">
                      {participant.name}
                    </span>
                    <button
                      onClick={() => handleKickOut(participant.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                    >
                      Kick out
                    </button>
                  </div>
                ))}
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
                <p className="text-lg">{pollQuestion}</p>
              </div>
            </div>

            <div
              className="rounded-b-xl overflow-hidden mb-8"
              style={{ backgroundColor: "#F6F6F6" }}
            >
              {pollOptions.map((option, index) => (
                <div
                  key={option.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center p-0">
                    <div className="flex items-center min-w-0 flex-1">
                      <div
                        className="flex-1 h-16 flex items-center px-4 relative"
                        style={{
                          background: `linear-gradient(to right, #6766D5 ${option.percentage}%, transparent ${option.percentage}%)`,
                        }}
                      >
                        <div className="w-6 h-6 flex items-center justify-center font-medium bg-white rounded-full  mr-2 text-[#6766D5] text-xs">
                          {index + 1}
                        </div>
                        <span className="text-black font-medium relative z-10">
                          {option.text}
                        </span>
                      </div>
                    </div>
                    <div className="pr-4">
                      <span className="text-lg font-semibold text-gray-900">
                        {option.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center flex justify-end">
              <button
                onClick={handleAskNewQuestion}
                className={`px-8 py-4 rounded-full text-white font-medium text-lg transition-all duration-200 
                  cursor-pointer hover:shadow-lg transform hover:scale-105`}
                style={{
                  background:
                    "linear-gradient(135deg, #8F64E1 0%, #1D68BD 100%)",
                }}
              >
                + Ask a new question
              </button>
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
};

export default LivePollResults;
