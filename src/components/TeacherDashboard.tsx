"use client";

import { Poll, PollResults as PollResultsType } from "@/lib/socket";

interface TeacherDashboardProps {
  currentPoll: Poll | null;
  pollResults: PollResultsType | null;
  studentsCount: number;
  isConnected: boolean;
}

export default function TeacherDashboard({
  currentPoll,
  pollResults,
  studentsCount,
  isConnected,
}: TeacherDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Current Poll Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Current Poll Status
        </h2>

        {currentPoll ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">
                {currentPoll.question}
              </h3>
              <div className="mt-2 flex items-center text-sm text-blue-700">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    currentPoll.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                {currentPoll.isActive ? "Active" : "Ended"}
                <span className="mx-2">•</span>
                Time limit: {currentPoll.timeLimit}s
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No active poll</p>
        )}
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Connection:</span>
            {isConnected ? (
              <span className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Connected
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Disconnected
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-gray-600">Students online:</span>
            <span className="ml-2 font-semibold text-indigo-600">
              {studentsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Poll Results */}
      {pollResults && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Live Results - {pollResults.poll.question}
          </h2>
          <div className="space-y-3">
            {pollResults.results.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}. {result.option}
                  </span>
                  <span className="text-gray-600">
                    {result.count} votes ({result.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${result.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total responses: {pollResults.totalResponses} / {studentsCount}
          </div>
        </div>
      )}
    </div>
  );
}
