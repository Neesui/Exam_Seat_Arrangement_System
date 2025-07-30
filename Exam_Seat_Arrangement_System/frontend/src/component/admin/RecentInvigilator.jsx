import React from "react";
import { useGetAllInvigilatorsQuery } from "../../redux/api/invigilatorApi"; 

const RecentInvigilator = () => {
  const {
    data: invigilators = [],
    isLoading,
    isError,
  } = useGetAllInvigilatorsQuery();

  const latest = invigilators[0]; 

  return (
    <div className="bg-white shadow-md p-6 rounded-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Recently Added</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error fetching data</p>
      ) : !latest ? (
        <p className="text-gray-500">No invigilator found.</p>
      ) : (
        <div className="flex items-center gap-4 p-4 rounded bg-red-200">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
            <img
              src={latest.avatar || "https://via.placeholder.com/150"}
              alt={latest.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold">{latest.name}</h3>
            <p className="text-sm text-gray-700">{latest.role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentInvigilator;
