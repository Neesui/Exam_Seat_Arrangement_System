import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { logout as logoutAction } from "../../redux/features/authReducer";
import { useLogoutMutation } from "../../redux/api/authApi";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import SearchBox from "../public/SearchBox";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSearch = () => setMobileSearchOpen(!mobileSearchOpen);

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log("Searching for:", term);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
        {/* Left side */}
        <div className="text-lg font-bold text-gray-800">
          NC Admin
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Desktop SearchBox */}
          <div className="hidden md:block w-100">
            <SearchBox
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
            />
          </div>

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

          {/* Mobile Search Toggle */}
          <div className="md:hidden relative">
            {!mobileSearchOpen && (
              <button
                onClick={toggleMobileSearch}
                className="text-gray-600 focus:outline-none"
                aria-label="Open Search"
              >
                <FaBars className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Input */}
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
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 ml-64 md:ml-64">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Navbar;
