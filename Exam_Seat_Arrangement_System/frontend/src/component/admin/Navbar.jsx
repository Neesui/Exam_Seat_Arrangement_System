import React, { useState } from "react";
import { FaBell, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "./SideBar";
import { logout as logoutAction} from '../../redux/features/authReduer'
import { useLogoutMutation } from '../../redux/api/authApi';
import { useDispatch } from 'react-redux';
import { Outlet } from "react-router-dom";


const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSearch = () => setMobileSearchOpen(!mobileSearchOpen);

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      // toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      // toast.error(err?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
        {/* Left side */}
        {/* Mobile NC Admin */}
        <div className="md:hidden text-lg font-bold text-gray-800">
          NC Admin
        </div>

        {/* Desktop NC Admin */}
        <div className="hidden md:block text-lg font-bold text-gray-800">
          NC Admin
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Desktop Search Input */}
          <div className="relative hidden md:block w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Notifications"
          >
            <FaBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
              aria-label="User menu"
            >
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-50">
                <a
                  href="#"
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
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
            )}
          </div>

          {/* Mobile Search Icon/Input */}
          <div className="md:hidden relative">
            {!mobileSearchOpen && (
              <button
                onClick={toggleMobileSearch}
                className="text-gray-600 focus:outline-none"
                aria-label="Open Search"
              >
                <FaSearch className="h-6 w-6" />
              </button>
            )}
            {mobileSearchOpen && (
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search"
                  className="block w-48 pl-3 pr-10 py-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={toggleMobileSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
                  aria-label="Close Search"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Hamburger menu */}
          <div className="md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Page Content */}
      <div className="flex-1  ml-64 md:ml-64">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default Navbar;
