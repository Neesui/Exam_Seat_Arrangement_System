import React from "react";
import { useGetInvigilatorProfileQuery } from "../../redux/api/invigilatorApi";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa"; // ✅ Correct import

const InvigilatorProfilePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetInvigilatorProfileQuery();

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

  const { user } = data;

  const imageUrl = user?.invigilator?.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}${user.invigilator.imageUrl}`
    : "https://via.placeholder.com/150";

  return (
    <div className="w-full mx-auto p-6 relative bg-blue-100">
      <button
        onClick={() => navigate("/invigilator/update-profile")}
        className="absolute right-6 top-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
      >
        <FaEdit size={18} />
        <span className="hidden sm:inline">Edit</span>
      </button>

      <h1 className="text-2xl font-bold mb-6">Invigilator Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6">
        {/*Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={user?.name || "Invigilator"}
            className="w-50 h-50 rounded-full object-cover border border-gray-300 shadow-sm gap-3"
          />
        </div>

        {/* Profile Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-gray-500 font-semibold">Name</h2>
            <p className="text-gray-800">{user?.name || "N/A"}</p>
          </div>

          <div>
            <h2 className="text-gray-500 font-semibold">Email</h2>
            <p className="text-gray-800">{user?.email || "N/A"}</p>
          </div>

          <div>
            <h2 className="text-gray-500 font-semibold">Course</h2>
            <p className="text-gray-800">{user?.invigilator?.course || "N/A"}</p>
          </div>

          <div>
            <h2 className="text-gray-500 font-semibold">Phone</h2>
            <p className="text-gray-800">{user?.invigilator?.phone || "N/A"}</p>
          </div>

          <div>
            <h2 className="text-gray-500 font-semibold">Address</h2>
            <p className="text-gray-800">{user?.invigilator?.address || "N/A"}</p>
          </div>

          <div>
            <h2 className="text-gray-500 font-semibold">Gender</h2>
            <p className="text-gray-800">{user?.invigilator?.gender || "N/A"}</p>
          </div>

          <div>
            <h2 className="text-gray-500 font-semibold">Joined At</h2>
            <p className="text-gray-800">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvigilatorProfilePage;
