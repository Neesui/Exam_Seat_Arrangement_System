import React, { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../../redux/api/authApi";
import { toast } from "react-toastify";

const ResetPasswordForm = ({ email: initialEmail }) => {
  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({
        email,
        otp,
        newPassword: password, 
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className="block mb-2 text-gray-700 font-medium">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        required
      />

      <label className="block mb-2 text-gray-700 font-medium">OTP</label>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        required
      />

      <label className="block mb-2 text-gray-700 font-medium">New Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        required
      />

      <button
        type="submit"
        className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPasswordForm;
