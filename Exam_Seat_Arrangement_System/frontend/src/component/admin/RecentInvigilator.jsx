import React from "react";
import { useGetAllInvigilatorsQuery } from "../../redux/api/invigilatorApi";
import { FaEye } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

const RecentInvigilator = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetAllInvigilatorsQuery(undefined, {
    pollingInterval: 10000,
  });

  const navigate = useNavigate();

  const recentInvigilators = data?.invigilators
    ? data.invigilators.slice(0, 4)
    : [];

  const handleViewDetails = (id) => {
    navigate(`/admin/viewInvigilatorDetails/${id}`); 
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-md max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Invigilators</h2>
        <button
          onClick={refetch}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error fetching data</p>
      ) : recentInvigilators.length === 0 ? (
        <p className="text-gray-500">No invigilators found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {recentInvigilators.map((invigilator) => (
            <div
              key={invigilator.id}
              className="flex items-center justify-between gap-4 p-4 rounded bg-red-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={invigilator.image || "https://via.placeholder.com/150"}
                    alt={invigilator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{invigilator.name}</h3>
                  <p className="text-sm text-gray-700">{invigilator.role}</p>
                </div>
              </div>

              {/* 👁️ View Icon */}
              <button
                onClick={() => handleViewDetails(invigilator.id)}
                className="text-blue-700 hover:text-blue-900 transition"
                title="View Details"
              >
                <FaEye size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentInvigilator;
