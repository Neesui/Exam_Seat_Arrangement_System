import React, { useEffect } from "react";
import LoginForm from "../../component/public/LoginForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { user } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      navigate("/admin");
    } else if (user?.role === "INVIGILATOR") {
      navigate("/invigilator");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-100">
      <div className="w-full max-w-6xl min-h-[500px] bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-[#038884] text-white flex flex-col justify-center items-center p-10 rounded-b-[100px] md:rounded-r-[100px] md:rounded-bl-none">
          <h1 className="text-4xl font-bold mb-3 text-center">Welcome Back!</h1>
          <img
            src="/girl.png"
            alt="Welcome Illustration"
            className="w-40 h-auto object-contain mb-4"
          />
          <p className="text-lg max-w-xs text-center font-bold font-arimo">
            We're glad to see you again. Please login with your credentials to access your dashboard.
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-10 flex justify-center items-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
