import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetInvigilatorProfileQuery,
  useUpdateInvigilatorMutation,
} from "../../redux/api/invigilatorApi";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const EditInvigilatorProfilePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetInvigilatorProfileQuery();
  const [updateInvigilator, { isLoading: isUpdating }] =
    useUpdateInvigilatorMutation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "",
    course: "",
    image: null,
  });

  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || "",
        phone: data.user.invigilator?.phone || "",
        address: data.user.invigilator?.address || "",
        gender: data.user.invigilator?.gender || "",
        course: data.user.invigilator?.course || "",
        image: null,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("phone", formData.phone);
      updateData.append("address", formData.address);
      updateData.append("gender", formData.gender);
      updateData.append("course", formData.course);
      if (formData.image) updateData.append("image", formData.image);

      await updateInvigilator({ formData: updateData }).unwrap();
      alert("✅ Profile updated successfully!");
      navigate("/invigilator/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">
          {error?.data?.message || "Failed to load profile"}
        </p>
      </div>
    );
  }

  return (
    <div className=" mt-5 w-[98%] mx-auto bg-blue-100">
      <form
        onSubmit={handleSubmit}
        className="w-full p-8 bg-white rounded-lg shadow-md relative"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/invigilator/profile")}
          className="absolute top-4 left-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft />
          <span className="hidden sm:inline">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">
          Edit Invigilator Profile
        </h1>

        {/* Form Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Course
            </label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-600 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-600 font-medium mb-2">
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FaSave />
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInvigilatorProfilePage;
