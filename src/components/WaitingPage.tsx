import React from "react";

const WaitingPage = () => {
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

        {/* Loading Spinner */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto">
            <div
              className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin"
              style={{
                borderTopColor: "#7565D9",
              }}
            ></div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900">
          Wait for the teacher to ask questions..
        </h1>
      </div>
    </div>
  );
};

export default WaitingPage;
