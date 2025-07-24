"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StudentNameEntryProps {
  onNameSubmit: (name: string) => void;
}

export default function StudentNameEntry({
  onNameSubmit,
}: StudentNameEntryProps) {
  const [studentName, setStudentName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  // Check if name is already stored in sessionStorage
  useEffect(() => {
    const storedName = sessionStorage.getItem("studentName");
    if (storedName) {
      setStudentName(storedName);
      setIsNameSet(true);
      onNameSubmit(storedName);
    }
  }, [onNameSubmit]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert("Please enter your name");
      return;
    }

    const trimmedName = studentName.trim();
    setStudentName(trimmedName);
    sessionStorage.setItem("studentName", trimmedName);
    setIsNameSet(true);
    onNameSubmit(trimmedName);
  };

  if (isNameSet) {
    return null; // Don't render anything if name is already set
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join as Student
          </h1>
          <p className="text-gray-600">
            Enter your name to participate in polls
          </p>
        </div>

        <form onSubmit={handleNameSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            Join Polling System
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
