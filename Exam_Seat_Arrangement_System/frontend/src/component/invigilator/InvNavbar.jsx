import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../redux/features/authReducer";
import { useLogoutMutation } from "../../redux/api/authApi";
import { useGetInvigilatorProfileQuery } from "../../redux/api/invigilatorApi";
import { BACKEND_URL } from "../../constant.js";
import InvSidebar from "./InvSidebar";
import Notification from "./Notification";

const InvNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const { data: invData } = useGetInvigilatorProfileQuery();

  const invigilator = invData?.invigilator;
  const userId = invData?.user?.id; 
  console.log(userId);

  const handleLogout = async () => {
    await logout().unwrap();
    dispatch(logoutAction());
    localStorage.removeItem("invigilator");
    window.location.href = "/";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/80 px-6 py-2.5 flex justify-between items-center shadow">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-700 md:hidden">
            <FaBars className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-6">
          {/* Notification */}
          <Notification />

          {/* Profile */}
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={
                  invigilator?.imageUrl
                    ? `${BACKEND_URL}/${invigilator.imageUrl}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
                <a href="/invigilator/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </a>
                <a href="#" onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100">
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen bg-gray-100 pt-14">
        <InvSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 ml-64 md:ml-64">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default InvNavbar;
