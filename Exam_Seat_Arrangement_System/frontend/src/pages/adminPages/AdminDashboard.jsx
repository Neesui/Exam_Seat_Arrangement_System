import React from "react";
import RecentInvigilator from "../../component/admin/RecentInvigilator";
import DashboardStatus from "../../component/admin/DashboardStatus";

const AdminDashboard = () => (
  <div className="h-full w-full border border-gray-300 bg-gray-100 p-6">
    <div className="w-full ">
      <DashboardStatus />
    </div>
    <div className="w-full flex justify-end">
      <div className="w-96">
        <RecentInvigilator />
      </div>
    </div>
  </div>
);

export default AdminDashboard;
