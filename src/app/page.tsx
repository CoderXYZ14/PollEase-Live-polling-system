"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LivePollingSystem = () => {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | null
  >(null);
  const router = useRouter();

  const handleRoleSelect = (role: "student" | "teacher") => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === "student") {
      router.push("/student");
    } else if (selectedRole === "teacher") {
      router.push("/teacher");
    }
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

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900 mb-4">
          Welcome to the <span className="font-bold">Live Polling System</span>
        </h1>

        <p className="text-gray-500 text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Please select the role that best describes you to begin using the live
          polling system
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <div
            onClick={() => handleRoleSelect("student")}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedRole === "student"
                ? "border-transparent bg-gradient-to-r from-[#7765DA] to-[#1D68BD] bg-clip-border"
                : "border-gray-200 hover:border-gray-300"
            }`}
            style={
              selectedRole === "student"
                ? {
                    background:
                      "linear-gradient(white, white) padding-box, linear-gradient(135deg, #7765DA, #1D68BD) border-box",
                    border: "2px solid transparent",
                  }
                : {}
            }
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              I&apos;m a Student
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </p>
          </div>

          <div
            onClick={() => handleRoleSelect("teacher")}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedRole === "teacher"
                ? "border-transparent bg-gradient-to-r from-[#7765DA] to-[#1D68BD] bg-clip-border"
                : "border-gray-200 hover:border-gray-300"
            }`}
            style={
              selectedRole === "teacher"
                ? {
                    background:
                      "linear-gradient(white, white) padding-box, linear-gradient(135deg, #7765DA, #1D68BD) border-box",
                    border: "2px solid transparent",
                  }
                : {}
            }
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              I&apos;m a Teacher
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`px-12 py-4 rounded-full text-white font-medium text-lg transition-all duration-200 bg-linear-to-r from-[#7765DA] to-[#8F64E1] ${
            selectedRole
              ? "cursor-pointer hover:shadow-lg transform hover:scale-105"
              : " cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LivePollingSystem;
