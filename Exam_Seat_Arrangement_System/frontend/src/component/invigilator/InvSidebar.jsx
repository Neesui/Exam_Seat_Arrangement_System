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
  FaClipboardList,
  FaTable,
} from "react-icons/fa";
import SidebarSection from "../admin/Sidebarsection";

const InvSidebar = ({ isOpen, toggleSidebar }) => {
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
        <div className="flex justify-between items-center p-4 md:hidden">
          <button onClick={toggleSidebar} className="text-xl">
            <FaTimes />
          </button>
        </div>

        <div className="p-5 text-lg ml-4 font-bold hidden md:block">NC Invigilator</div>

        <ul className="ml-4 mt-4 md:mt-0">
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <FaTachometerAlt className="mr-3" />
            <Link to="/invigilator">Dashboard</Link>
          </li>

          <SidebarSection
            icon={<FaUserGraduate className="mr-3" />}
            label="profile"
            isOpen={activeSection === "profile"}
            setIsOpen={() => handleSectionToggle("profile")}
            links={[
              { path: "/invigilator/profile", label: "View Profile" },
            ]}
          />
{/* 
          <SidebarSection
            icon={<FaDoorOpen className="mr-3" />}
            label="Room"
            isOpen={activeSection === "Room"}
            setIsOpen={() => handleSectionToggle("Room")}
            links={[
              { path: "/invigilator/viewRoom", label: "View Room Details" },
            ]}
          /> */}

          <SidebarSection
            icon={<FaBookOpen className="mr-3" />}
            label="Exam"
            isOpen={activeSection === "Exam"}
            setIsOpen={() => handleSectionToggle("Exam")}
            links={[
              { path: "/invigilator/viewAssignedExams", label: "View Assigned Exams" },
            ]}
          />

          <SidebarSection
            icon={<FaClipboardList className="mr-3" />}
            label="Room Assign"
            isOpen={activeSection === "Room Assign"}
            setIsOpen={() => handleSectionToggle("Room Assign")}
            links={[
              { path: "/invigilator/viewRoomAssign", label: "View Room Assign" },
            ]}
          />

          {/* <SidebarSection
            icon={<FaClipboardList className="mr-3" />}
            label="Invigilator Assign"
            isOpen={activeSection === "Invigilator Assign"}
            setIsOpen={() => handleSectionToggle("Invigilator Assign")}
            links={[
              { path: "/invigilator/viewInvigilatorAssign", label: "View Invigilator Assignment" },
            ]}
          /> */}

          <SidebarSection
            icon={<FaTable className="mr-3" />}
            label="Seat Plan"
            isOpen={activeSection === "Seat Plan"}
            setIsOpen={() => handleSectionToggle("Seat Plan")}
            links={[
              { path: "/admin/viewActiveSeatPlan", label: "View Active Seat Plan" },

            ]}
          />
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default InvSidebar;
