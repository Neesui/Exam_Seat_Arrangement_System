import React from "react";
import { FaKey } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import ResetPasswordForm from "../../component/public/ResetPasswordForm";

const ResetPasswordPage = () => {
  const location = useLocation();
  const email = location.state?.email || ""; 

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-[80vh] py-6">
      <div className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden max-w-md w-full p-6 md:p-8">
        <div className="flex items-center justify-center mb-4 text-green-600 text-2xl font-semibold">
          <FaKey className="mr-2" />
          Reset Password
        </div>
        {/* Pass email to ResetPasswordForm */}
        <ResetPasswordForm email={email} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
