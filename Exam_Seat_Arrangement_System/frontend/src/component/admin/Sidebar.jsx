// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaDoorOpen,
  FaChair,
  FaPlus,
  FaEye,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Sidebar = () => {
  // Mobile sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Submenu states (same for mobile & desktop)
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isBenchOpen, setIsBenchOpen] = useState(false);
  const [isInvigilatorOpen, setIsInvigilatorOpen] = useState(false);

  // Toggles
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCourses = () => setIsCoursesOpen(!isCoursesOpen);
  const toggleStudentDetails = () => setIsStudentDetailsOpen(!isStudentDetailsOpen);
  const toggleRoom = () => setIsRoomOpen(!isRoomOpen);
  const toggleBench = () => setIsBenchOpen(!isBenchOpen);
  const toggleInvigilator = () => setIsInvigilatorOpen(!isInvigilatorOpen);

  // Close sidebar after click on mobile links
  const handleLinkClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4">
        <div className="font-bold text-lg">EduAdmin</div>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="text-2xl focus:outline-none"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white overflow-y-auto
          transform transition-transform duration-300 ease-in-out z-50
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:flex md:flex-col
        `}
      >
        <div className="p-5 text-lg ml-4 font-bold hidden md:block">EduAdmin</div>
        <ul className="ml-4 mt-4 md:mt-0">
          {/* Dashboard */}
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <FaTachometerAlt className="mr-3" />
            <Link to="/AdminDashboard" onClick={handleLinkClick}>Dashboard</Link>
          </li>

          {/* Students */}
          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={toggleStudentDetails}
              className="w-full text-left flex items-center focus:outline-none"
            >
              <FaUserGraduate className="mr-3" />
              Students
            </button>
            {isStudentDetailsOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/AddStudents" onClick={handleLinkClick}>Add Students</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewStudentDetails" onClick={handleLinkClick}>View Student Details</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Invigilator */}
          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={toggleInvigilator}
              className="w-full text-left flex items-center focus:outline-none"
            >
              <FaChalkboardTeacher className="mr-3" />
              Invigilator
            </button>
            {isInvigilatorOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/AddInvigilator" onClick={handleLinkClick}>Add Invigilator</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewInvigilator" onClick={handleLinkClick}>View Invigilator</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Courses */}
          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={toggleCourses}
              className="w-full text-left flex items-center focus:outline-none"
            >
              <FaBookOpen className="mr-3" />
              Courses
            </button>
            {isCoursesOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/AddCourse" onClick={handleLinkClick}>Add Courses</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewCourses" onClick={handleLinkClick}>View Courses</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Room */}
          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={toggleRoom}
              className="w-full text-left flex items-center focus:outline-none"
            >
              <FaDoorOpen className="mr-3" />
              Room
            </button>
            {isRoomOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/AddRoomForm" onClick={handleLinkClick}>Add Room</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewRooms" onClick={handleLinkClick}>View Room Details</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Bench */}
          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={toggleBench}
              className="w-full text-left flex items-center focus:outline-none"
            >
              <FaChair className="mr-3" />
              Bench
            </button>
            {isBenchOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/AddBenchForm" onClick={handleLinkClick}>Add Bench</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewBench" onClick={handleLinkClick}>View Bench Details</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};
 
export default Sidebar;
