"use client";

import { PollResults as PollResultsType } from "@/lib/socket";

interface PollResultsProps {
  results: PollResultsType;
  showTitle?: boolean;
}

export default function PollResults({
  results,
  showTitle = true,
}: PollResultsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {showTitle && (
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Results - {results.poll.question}
        </h2>
      )}

      <div className="space-y-3">
        {results.results.map((result, index) => (
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
        Total responses: {results.totalResponses}
      </div>
    </div>
  );
}
