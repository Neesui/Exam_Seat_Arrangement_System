import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaChartBar,
  FaUserGraduate,
} from "react-icons/fa";
import Sidebar from "../component/invigilator/Sidebar";

const InvigilatorLayout = () => {

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-emerald-500 transition-colors">
                <span className="sr-only">Notifications</span>
                <FaChartBar className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-emerald-500 transition-colors">
                <span className="sr-only">Settings</span>
                <FaUsers className="w-6 h-6" />
              </button>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InvigilatorLayout;