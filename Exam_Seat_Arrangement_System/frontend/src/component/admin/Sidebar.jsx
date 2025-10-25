import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaDoorOpen,
  FaChair,
  FaClipboardList,
  FaTable,
  FaTimes, // ✅ added missing icon
} from "react-icons/fa";
import SidebarSection from "./Sidebarsection";

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
          <button onClick={toggleSidebar} className="text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Header */}
        <div className="p-5 text-lg ml-4 font-bold hidden md:block">NC Admin</div>

        <ul className="ml-4 mt-4 md:mt-0">
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <FaTachometerAlt className="mr-3" />
            <Link to="/admin">Dashboard</Link>
          </li>

          {/* Students */}
          <SidebarSection
            icon={<FaUserGraduate className="mr-3" />}
            label="Students"
            isOpen={activeSection === "Students"}
            setIsOpen={() => handleSectionToggle("Students")}
            links={[
              { path: "/admin/addStudents", label: "Add Students" },
              { path: "/admin/viewStudents", label: "View Student Details" },
            ]}
          />

          {/* Invigilator */}
          <SidebarSection
            icon={<FaChalkboardTeacher className="mr-3" />}
            label="Invigilator"
            isOpen={activeSection === "Invigilator"}
            setIsOpen={() => handleSectionToggle("Invigilator")}
            links={[
              { path: "/admin/addInvigilator", label: "Add Invigilator" },
              { path: "/admin/viewInvigilator", label: "View Invigilator" },
            ]}
          />

          {/* Courses */}
          <SidebarSection
            icon={<FaBookOpen className="mr-3" />}
            label="Courses"
            isOpen={activeSection === "Courses"}
            setIsOpen={() => handleSectionToggle("Courses")}
            links={[
              { path: "/admin/addfullCourse", label: "Add Courses" },
              { path: "/admin/viewCourse", label: "View Courses" },
            ]}
          />

          {/* Room */}
          <SidebarSection
            icon={<FaDoorOpen className="mr-3" />}
            label="Room"
            isOpen={activeSection === "Room"}
            setIsOpen={() => handleSectionToggle("Room")}
            links={[
              { path: "/admin/addRoom", label: "Add Room" },
              { path: "/admin/viewRoom", label: "View Room Details" },
            ]}
          />

          {/* Bench */}
          <SidebarSection
            icon={<FaChair className="mr-3" />}
            label="Bench"
            isOpen={activeSection === "Bench"}
            setIsOpen={() => handleSectionToggle("Bench")}
            links={[
              { path: "/admin/addBench", label: "Add Bench" },
              { path: "/admin/viewBench", label: "View Bench Details" },
            ]}
          />

          {/* Exam */}
          <SidebarSection
            icon={<FaBookOpen className="mr-3" />}
            label="Exam"
            isOpen={activeSection === "Exam"}
            setIsOpen={() => handleSectionToggle("Exam")}
            links={[
              { path: "/admin/createExam", label: "Create Exam" },
              { path: "/admin/viewExam", label: "View Exam" },
            ]}
          />

          {/* Room Assignment */}
          <SidebarSection
            icon={<FaClipboardList className="mr-3" />}
            label="Room Assign"
            isOpen={activeSection === "Room Assign"}
            setIsOpen={() => handleSectionToggle("Room Assign")}
            links={[
              { path: "/admin/assignRoom", label: "Assign Room for Exam" },
              { path: "/admin/viewRoomAssign", label: "View Room Assign" },
            ]}
          />

          {/* Invigilator Assignment */}
          <SidebarSection
            icon={<FaClipboardList className="mr-3" />}
            label="Invigilator Assign"
            isOpen={activeSection === "Invigilator Assign"}
            setIsOpen={() => handleSectionToggle("Invigilator Assign")}
            links={[
              { path: "/admin/assignInvigilator", label: "Assign Invigilator" },
              {
                path: "/admin/viewAllInvigilatorAssign",
                label: "View All Invigilator Assignment",
              },
            ]}
          />

          {/* Seat Plan */}
          <SidebarSection
            icon={<FaTable className="mr-3" />}
            label="Seat Plan"
            isOpen={activeSection === "Seat Plan"}
            setIsOpen={() => handleSectionToggle("Seat Plan")}
            links={[
              { path: "/admin/generateSeatingPlan", label: "Generate Seat Plan" },
              { path: "/admin/viewSeatingPlan", label: "View Seat Plan" },
              { path: "/admin/viewActiveSeatPlan", label: "View Active Seat Plan" },
            ]}
          />

          {/* Notification */}
          <SidebarSection
            icon={<FaClipboardList className="mr-3" />}
            label="Notification"
            isOpen={activeSection === "Notification"}
            setIsOpen={() => handleSectionToggle("Notification")}
            links={[{ path: "/admin/notification", label: "Send Notification" }]}
          />
        </ul>
      </div>

      {/* Overlay for mobile */}
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

export default Sidebar;
