import React, { useState } from "react";
import { useChangePasswordMutation } from "../../redux/api/authApi";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const [changePassword] = useChangePasswordMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword(formData).unwrap();
      toast.success(res.message || "Password changed successfully");
      setFormData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className="block mb-2 text-gray-700 font-medium">Old Password</label>
      <input
        type="password"
        name="oldPassword"
        value={formData.oldPassword}
        onChange={handleChange}
        placeholder="Enter old password"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        required
      />

      <label className="block mb-2 text-gray-700 font-medium">New Password</label>
      <input
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="Enter new password"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        required
      />

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200"
      >
        Change Password
      </button>
    </form>
  );
};

export default ChangePasswordForm;
