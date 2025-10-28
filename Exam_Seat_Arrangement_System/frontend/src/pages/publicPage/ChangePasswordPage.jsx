import React from "react";
import { FaLock } from "react-icons/fa";
import ChangePasswordForm from "../../component/public/ChangePasswordForm";

const ChangePasswordPage = () => {
  return (
    <div className="flex items-center ml-10 bg-gray-100 min-h-[50vh] py-6">
      <div className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden max-w-md w-full p-6 md:p-8">
        <div className="flex items-center justify-center mb-4 text-blue-600 text-2xl font-semibold">
          <FaLock className="mr-2" />
          Change Password
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
