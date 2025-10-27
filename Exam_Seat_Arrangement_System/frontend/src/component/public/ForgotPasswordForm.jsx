import React, { useState } from "react";
import { useForgotPasswordMutation } from "../../redux/api/authApi";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message);
      navigate("/forgotPassword/resetPassword", { state: { email } });
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className="block mb-2 text-gray-700 font-medium">Email Address</label>
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-white">
        <FaEnvelope className="text-gray-500 mr-2" />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 outline-none"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Send OTP
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
