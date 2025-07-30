import React from "react";
import { useGetAllInvigilatorsQuery } from "../../redux/api/invigilatorApi"; // adjust path if needed

const RecentInvigilator = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetAllInvigilatorsQuery(undefined, {
    pollingInterval: 10000, // auto-refresh every 10 seconds (optional)
  });

  const latest = data?.invigilators?.[0]; // get most recent invigilator

  return (
    <div className="bg-white shadow-md p-6 rounded-md max-w-md mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Invigilator</h2>
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
      ) : !latest ? (
        <p className="text-gray-500">No invigilator found.</p>
      ) : (
        <div className="flex items-center gap-4 p-4 rounded bg-red-200">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
            <img
              src={latest.image || "https://via.placeholder.com/150"}
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
