import React from "react";

const Hero = () => {
  return (
    <section className="bg-white min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-16 font-arimo">
      {/* Left Content */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-6xl md:text-7xl font-extrabold text-[#0A2540] leading-tight mb-4">
          EXAM SEAT <br />
          ARRANGEMENT SYSTEM
        </h1>
        <h2 className="text-4xl text-[#0A2540] font-bold mb-4">
          FOR CENTRALIZED EXAMS
        </h2>
        <p className="text-gray-600 max-w-md text-xl">
          A centralized solution to automatically assign seats for students in exam halls.
        </p>
        <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>

      {/* Right Image */}
      <div className="flex-1 mt-4 md:mt-0 flex justify-center">
        <img
          src="/seatting_girl.png"
          alt="Exam Illustration"
          className="w-full max-w-md"
        />
      </div>
    </section>
  );
};

export default Hero;
