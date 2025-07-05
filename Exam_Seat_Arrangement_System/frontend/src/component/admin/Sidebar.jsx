// src/components/Sidebar.js
import React, { useState } from 'react';
import { logout as logoutAction } from '../../redux/features/authReduer';
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
  FaTimes,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useLogoutMutation } from '../../redux/api/authApi';
import { useDispatch } from 'react-redux';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isBenchOpen, setIsBenchOpen] = useState(false);
  const [isInvigilatorOpen, setIsInvigilatorOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCourses = () => setIsCoursesOpen(!isCoursesOpen);
  const toggleStudentDetails = () => setIsStudentDetailsOpen(!isStudentDetailsOpen);
  const toggleRoom = () => setIsRoomOpen(!isRoomOpen);
  const toggleBench = () => setIsBenchOpen(!isBenchOpen);
  const toggleInvigilator = () => setIsInvigilatorOpen(!isInvigilatorOpen);

  const handleLinkClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Mobile header */}
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

      {/* Sidebar wrapper with shadow */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          shadow-xl rounded-r-lg
        `}
      >
        {/* Sidebar */}
        <nav className="w-64 h-full bg-gray-800 text-white overflow-y-auto flex flex-col">
          <div className="p-5 text-lg ml-4 font-bold hidden md:block">EduAdmin</div>

          <ul className="ml-4 mt-4 md:mt-0">
            {/* Dashboard */}
            <li className="p-4 hover:bg-gray-700 flex items-center">
              <FaTachometerAlt className="mr-3" />
              <Link to="/admin" onClick={handleLinkClick}>Dashboard</Link>
            </li>

            {/* Students */}
            <li className="p-4 hover:bg-gray-700">
              <button onClick={toggleStudentDetails} className="w-full text-left flex items-center focus:outline-none">
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
              <button onClick={toggleInvigilator} className="w-full text-left flex items-center focus:outline-none">
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
              <button onClick={toggleCourses} className="w-full text-left flex items-center focus:outline-none">
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
              <button onClick={toggleRoom} className="w-full text-left flex items-center focus:outline-none">
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
              <button onClick={toggleBench} className="w-full text-left flex items-center focus:outline-none">
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

          {/* Logout */}
          <div className="mb-4 px-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/20 transition w-full text-left"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
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
