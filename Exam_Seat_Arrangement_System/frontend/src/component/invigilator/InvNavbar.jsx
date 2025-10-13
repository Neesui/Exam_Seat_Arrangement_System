import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import { logout as logoutAction } from "../../redux/features/authReducer";
import { useLogoutMutation } from "../../redux/api/authApi";
import { useGetInvigilatorProfileQuery } from "../../redux/api/invigilatorApi";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import SearchBox from "../public/SearchBox";
import InvSidebar from "./InvSidebar";
import { BACKEND_URL } from "../../constant";

const InvNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [invSidebarOpen, setInvSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const { data: invData } = useGetInvigilatorProfileQuery();
  const invigilator = invData?.invigilator;

  const toggleInvSidebar = () => setInvSidebarOpen(!invSidebarOpen);
  const toggleMobileSearch = () => setMobileSearchOpen(!mobileSearchOpen);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      localStorage.removeItem("invigilator");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/80 border-gray-200 px-6 py-2.5 flex justify-between items-center">
        {/* Left — Logo / Sidebar */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleInvSidebar}
            className="text-gray-700 hover:text-gray-900 focus:outline-none md:hidden">
            <FaBars className="h-5 w-5" />
          </button>
        </div>

        {/* Right — Notification + Profile */}
        <div className="flex items-center space-x-6">
          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <FaBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                <p className="px-4 py-2 text-sm text-gray-700 border-b">
                  Notifications
                </p>
                <p className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
                  No new notifications
                </p>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
            >
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
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-50">
                <a
                  href="/invigilator/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="#"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      {mobileSearchOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white px-4 py-2 shadow-md md:hidden">
          <div className="flex justify-between items-center">
            <SearchBox
              value={searchTerm}
              onChange={(term) => {
                handleSearch(term);
                setMobileSearchOpen(false);
              }}
              placeholder="Search..."
            />
            <button
              onClick={toggleMobileSearch}
              className="ml-2 text-gray-600 focus:outline-none"
              aria-label="Close Search"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex min-h-screen bg-gray-100 pt-14">
        <InvSidebar isOpen={invSidebarOpen} toggleSidebar={toggleInvSidebar} />
        <div className="flex-1 ml-64 md:ml-64">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default InvNavbar;
