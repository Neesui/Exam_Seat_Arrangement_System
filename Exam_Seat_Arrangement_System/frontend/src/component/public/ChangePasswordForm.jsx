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
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <input
        type="password"
        name="oldPassword"
        placeholder="Old Password"
        value={formData.oldPassword}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <button type="submit" className="w-full p-2 bg-yellow-600 text-white rounded">
        Change Password
      </button>
    </form>
  );
};

export default ChangePasswordForm;
