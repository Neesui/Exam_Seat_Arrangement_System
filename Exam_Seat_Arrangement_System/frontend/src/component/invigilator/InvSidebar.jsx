import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaDoorOpen,
  FaChair,
  FaTimes,
} from "react-icons/fa";
import SidebarSection from "../invigilator/InvNavbar";

const InvSidebar = ({ isOpen, toggleInvSidebar }) => {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionToggle = (sectionName) => {
    setActiveSection((prev) => (prev === sectionName ? null : sectionName));
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white overflow-y-auto transform transition-transform duration-300 ease-in-out z-50 rounded-r-lg border-r border-gray-700 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 md:hidden">
          <div className="font-bold text-lg">NC Admin</div>
          <button onClick={toggleInvSidebar} className="text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="p-5 text-lg ml-4 font-bold hidden md:block">NC Admin</div>

        <ul className="ml-4 mt-4 md:mt-0">
          {/* Dashboard */}
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <FaTachometerAlt className="mr-3" />
            <Link to="/admin">Dashboard</Link>
          </li>

          <SidebarSection
            icon={<FaUserGraduate className="mr-3" />}
            label="Students"
            isOpen={activeSection === "Students"}
            setIsOpen={() => handleSectionToggle("Students")}
            links={[
              { path: "/AddStudents", label: "Add Students" },
              { path: "/ViewStudents", label: "View Student Details" },
            ]}
          />

          <SidebarSection
            icon={<FaChalkboardTeacher className="mr-3" />}
            label="Invigilator"
            isOpen={activeSection === "Invigilator"}
            setIsOpen={() => handleSectionToggle("Invigilator")}
            links={[
              { path: "/addInvigilator", label: "Add Invigilator" },
              { path: "/ViewInvigilator", label: "View Invigilator" },
            ]}
          />

          <SidebarSection
            icon={<FaBookOpen className="mr-3" />}
            label="Courses"
            isOpen={activeSection === "Courses"}
            setIsOpen={() => handleSectionToggle("Courses")}
            links={[
              { path: "/addfullCourse", label: "Add Courses" },
              { path: "/viewCourse", label: "View Courses" },
            ]}
          />

          <SidebarSection
            icon={<FaDoorOpen className="mr-3" />}
            label="Room"
            isOpen={activeSection === "Room"}
            setIsOpen={() => handleSectionToggle("Room")}
            links={[
              { path: "/addRoom", label: "Add Room" },
              { path: "/ViewRooms", label: "View Room Details" },
            ]}
          />

          <SidebarSection
            icon={<FaChair className="mr-3" />}
            label="Bench"
            isOpen={activeSection === "Bench"}
            setIsOpen={() => handleSectionToggle("Bench")}
            links={[
              { path: "/AddBenchForm", label: "Add Bench" },
              { path: "/ViewBench", label: "View Bench Details" },
            ]}
          />
        </ul>
      </div>

      {/* Overlay for mobile when sidebar is open */}
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
