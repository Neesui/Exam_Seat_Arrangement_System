import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      {/* Left Side */}
      <div className="text-center md:text-left md:w-1/2 space-y-4">
        <h1 className="text-7xl font-bold text-indigo-700">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          The page you were looking for is not found!
        </h2>
        <p className="text-gray-500">
          You may have mistyped the address or the page may have moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
        >
          Back to Home
        </button>
      </div>

      {/* Right Side */}
      <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
        <img
          src="/images/404-illustration.png"
          alt="404 Illustration"
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default NotFound;
