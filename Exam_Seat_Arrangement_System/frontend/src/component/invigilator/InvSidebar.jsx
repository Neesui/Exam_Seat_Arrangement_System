import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaDoorOpen,
  FaChair,
  FaPlus,
  FaEye,
  FaTimes,
} from "react-icons/fa";

const InvSidebar = ({ isOpen, toggleInvSidebar }) => {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isBenchOpen, setIsBenchOpen] = useState(false);
  const [isInvigilatorOpen, setIsInvigilatorOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white overflow-y-auto transform transition-transform duration-300 ease-in-out z-50 rounded-r-lg border-r border-gray-700 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center p-4 md:hidden">
          <div className="font-bold text-lg">NC Admin</div>
          <button onClick={toggleInvSidebar} className="text-xl">
            <FaTimes />
          </button>
        </div>

        <div className="p-5 text-lg ml-4 font-bold hidden md:block">NC Admin</div>

        <ul className="ml-4 mt-4 md:mt-0">
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <FaTachometerAlt className="mr-3" />
            <Link to="/admin">Dashboard</Link>
          </li>

          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={() => setIsStudentDetailsOpen(!isStudentDetailsOpen)}
              className="w-full text-left flex items-center"
            >
              <FaUserGraduate className="mr-3" />
              Students
            </button>
            {isStudentDetailsOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/AddStudents">Add Students</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewStudents">View Student Details</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={() => setIsInvigilatorOpen(!isInvigilatorOpen)}
              className="w-full text-left flex items-center"
            >
              <FaChalkboardTeacher className="mr-3" />
              Invigilator
            </button>
            {isInvigilatorOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/addInvigilator">Add Invigilator</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewInvigilator">View Invigilator</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={() => setIsCoursesOpen(!isCoursesOpen)}
              className="w-full text-left flex items-center"
            >
              <FaBookOpen className="mr-3" />
              Courses
            </button>
            {isCoursesOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/addfullCourse">Add Courses</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/viewCourse">View Courses</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={() => setIsRoomOpen(!isRoomOpen)}
              className="w-full text-left flex items-center"
            >
              <FaDoorOpen className="mr-3" />
              Room
            </button>
            {isRoomOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/addRoom">Add Room</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewRooms">View Room Details</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="p-4 hover:bg-gray-700">
            <button
              onClick={() => setIsBenchOpen(!isBenchOpen)}
              className="w-full text-left flex items-center"
            >
              <FaChair className="mr-3" />
              Bench
            </button>
            {isBenchOpen && (
              <ul className="pl-4 mt-2 bg-gray-700">
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaPlus className="mr-3" />
                  <Link to="/AddBenchForm">Add Bench</Link>
                </li>
                <li className="p-4 hover:bg-gray-600 flex items-center">
                  <FaEye className="mr-3" />
                  <Link to="/ViewBench">View Bench Details</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleInvSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default InvSidebar;
