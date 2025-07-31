import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetInvigilatorByIdQuery } from "../../redux/api/invigilatorApi";

const ViewInvigilatorDetailsPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetInvigilatorByIdQuery(id);

  if (isLoading)
    return <p className="text-center mt-10">Loading invigilator details...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load invigilator details.
      </p>
    );

  const inv = data?.invigilator || {};

  return (
    <div className="max-w-6xl mx-auto mt-5 p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="relative mb-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Invigilator Details
        </h2>
      </div>

      <div className="flex gap-10">
        {/* Left side: photo */}
        <div className="flex-shrink-0 w-48 h-60 bg-gray-200 rounded-md flex items-center justify-center">
          <img
            src={inv.image || "https://via.placeholder.com/150x200?text=Photo"}
            alt={`${inv.name || "Invigilator"} photo`}
            className="object-cover w-full h-full rounded-md"
          />
        </div>

        {/* Right side: details */}
        <div className="flex-grow">
          <h3 className="text-xl font-semibold mb-4">{inv.name || "N/A"}</h3>
          <p className="mb-6 text-gray-700">
            {/* You can replace this with actual bio/description if available */}
            {inv.bio || "No bio available."}
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-800">
            <div>
              <span className="font-semibold">Name:</span>
              <span className="ml-2">{inv.name || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Gender:</span>
              <span className="ml-2">{inv.gender || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Course:</span>
              <span className="ml-2">{inv.course || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Email:</span>
              <span className="ml-2">{inv.email || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Phone:</span>
              <span className="ml-2">{inv.phone || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Address:</span>
              <span className="ml-2">{inv.address || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvigilatorDetailsPage;
