import React from "react";
import InvDashboardStatus from "../../component/invigilator/InvDashboardStatus";
import { useGetInvigilatorProfileQuery } from "../../redux/api/invigilatorApi";

const InvigilatorDashboard = () => {
  const { data, isLoading, isError } = useGetInvigilatorProfileQuery();

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (isError || !data?.user) {
    return <div className="text-center text-red-500">Failed to load profile</div>;
  }

  const invigilatorName = data.user?.name || "Invigilator";

  return (
    <div className="h-full w-full border bg-gray-50 p-6">
      {/* Welcome Section */}
      <div className="mb-6 text-start">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome back, <span className="text-blue-600">{invigilatorName}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Here’s your dashboard overview.</p>
      </div>

      {/* Dashboard Status */}
      <div className="w-full">
        <InvDashboardStatus />
      </div>
    </div>
  );
};

export default InvigilatorDashboard;
