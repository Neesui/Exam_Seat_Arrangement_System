import React from "react";
import { FaLock } from "react-icons/fa";
import ForgotPasswordForm from "../../component/public/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-[50vh] py-2">
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden max-w-[300px] w-full">
        {/* Right Side - Form Section */}
        <div className=" flex flex-col justify-center p-6 md:p-8">
          <div className="flex items-center justify-center mb-4 text-blue-600 text-2xl font-semibold">
            <FaLock className="mr-2" />
            Forgot Password
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
