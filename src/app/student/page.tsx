"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const StudentPage = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (name.trim()) {
      // Navigate to the next step or dashboard
      console.log(`Student name: ${name}`);
      // In a real app, you might save the name to state/context and navigate
      // router.push('/student/dashboard');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

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
};

export default StudentPage;
