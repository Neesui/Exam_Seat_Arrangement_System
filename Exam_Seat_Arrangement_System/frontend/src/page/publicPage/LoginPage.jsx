import React from 'react';
import LoginForm from '../../component/public/LoginForm'; 

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-100">
      <div className="w-[50%] max-w-4xl min-h-[400px] bg-white shadow-lg rounded-lg overflow-hidden flex">
        
        {/* Left welcome panel */}
        <div className="w-1/2 bg-purple-600 text-white flex flex-col justify-center items-center p-10 rounded-r-[100px]">
          <h1 className="text-4xl font-bold mb-1 text-center">Welcome Back!</h1>
          
          <img
            src="/girl.png"
            alt="Welcome Illustration"
            className="w-40 h-auto object-contain mb-1"
          />

          <p className="text-lg max-w-xs text-center mt-1 font-bold font-arimo">
            We're glad to see you again. Please login with your credentials to access your dashboard.
          </p>
        </div>

        {/* Right login form panel */}
        <div className="w-1/2 p-10 flex justify-center items-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
