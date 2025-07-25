import React from "react";

const KickedOutPage = () => {
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
          You&apos;ve been <span className="font-bold">Kicked out !</span>
        </h1>

        <p className="text-gray-500 text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Looks like the teacher had removed you from the poll system .Please
          Try again sometime.
        </p>
      </div>
    </div>
  );
};

export default KickedOutPage;
