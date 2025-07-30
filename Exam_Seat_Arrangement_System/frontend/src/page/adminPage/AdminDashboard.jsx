import React from "react";
import RecentInvigilator from "../../component/admin/RecentInvigilator";
import DashboardStats from "../../component/admin/DashboardStats";

const AdminDashboard = () => (
  <div className="h-full w-full border border-gray-300 bg-white ">
    <DashboardStats />
    <RecentInvigilator />
  </div>
);

export default AdminDashboard;
