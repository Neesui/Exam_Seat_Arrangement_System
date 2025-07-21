import React, { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSection from "./SidebarSection";
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

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isBenchOpen, setIsBenchOpen] = useState(false);
  const [isInvigilatorOpen, setIsInvigilatorOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isRoomAssignOpen, setIsRoomAssignOpen] = useState(false);
  const [isSeatPlanOpen, setIsSeatPlanOpen] = useState(false);
  const [isInvigilatorAssignOpen, setIsInvigilatorAssignOpen] = useState(false);
  const [isAssignedInvigilatorOpen, setIsAssignedInvigilatorOpen] = useState(false); // ✅ New

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white overflow-y-auto transform transition-transform duration-300 ease-in-out z-50 rounded-r-lg border-r border-gray-700 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center p-4 md:hidden">
          <div className="font-bold text-lg">NC Admin</div>
          <button onClick={toggleSidebar} className="text-xl">
            <FaTimes />
          </button>
        </div>

        <div className="p-5 text-lg ml-4 font-bold hidden md:block">NC Admin</div>

        <ul className="ml-4 mt-4 md:mt-0">
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <FaTachometerAlt className="mr-3" />
            <Link to="/admin">Dashboard</Link>
          </li>

          <SidebarSection
            icon={<FaUserGraduate className="mr-3" />}
            label="Students"
            isOpen={isStudentDetailsOpen}
            setIsOpen={setIsStudentDetailsOpen}
            links={[
              { path: "/addStudents", label: "Add Students" },
              { path: "/viewStudents", label: "View Student Details" },
            ]}
          />

          <SidebarSection
            icon={<FaChalkboardTeacher className="mr-3" />}
            label="Invigilator"
            isOpen={isInvigilatorOpen}
            setIsOpen={setIsInvigilatorOpen}
            links={[
              { path: "/addInvigilator", label: "Add Invigilator" },
              { path: "/viewInvigilator", label: "View Invigilator" },
            ]}
          />

          <SidebarSection
            icon={<FaBookOpen className="mr-3" />}
            label="Courses"
            isOpen={isCoursesOpen}
            setIsOpen={setIsCoursesOpen}
            links={[
              { path: "/addfullCourse", label: "Add Courses" },
              { path: "/viewCourse", label: "View Courses" },
            ]}
          />

          <SidebarSection
            icon={<FaDoorOpen className="mr-3" />}
            label="Room"
            isOpen={isRoomOpen}
            setIsOpen={setIsRoomOpen}
            links={[
              { path: "/addRoom", label: "Add Room" },
              { path: "/viewRoom", label: "View Room Details" },
            ]}
          />

          <SidebarSection
            icon={<FaChair className="mr-3" />}
            label="Bench"
            isOpen={isBenchOpen}
            setIsOpen={setIsBenchOpen}
            links={[
              { path: "/addBench", label: "Add Bench" },
              { path: "/viewBench", label: "View Bench Details" },
            ]}
          />

          <SidebarSection
            icon={<FaBookOpen className="mr-3" />}
            label="Exam"
            isOpen={isExamOpen}
            setIsOpen={setIsExamOpen}
            links={[
              { path: "/createExam", label: "Create Exam" },
              { path: "/viewExam", label: "View Exam" },
            ]}
          />

          <SidebarSection
            icon={<FaClipboardList className="mr-3" />}
            label="Room Assign"
            isOpen={isRoomAssignOpen}
            setIsOpen={setIsRoomAssignOpen}
            links={[
              { path: "/assignRoom", label: "Assign Room for Exam" },
              { path: "/viewRoomAssign", label: "View Room Assign" },
            ]}
          />

          <SidebarSection
            icon={<FaClipboardList className="mr-3" />}
            label="Invigilator Assign"
            isOpen={isInvigilatorAssignOpen}
            setIsOpen={setIsInvigilatorAssignOpen}
            links={[
              { path: "/assignInvigilator", label: "Assign Invigilator" },
              { path: "/viewInvigilatorAssign", label: "View Invigilator Assignment" },
            ]}
          />

          <SidebarSection
            icon={<FaTable className="mr-3" />}
            label="Seat Plan"
            isOpen={isSeatPlanOpen}
            setIsOpen={setIsSeatPlanOpen}
            links={[
              { path: "/generateSeatingPlan", label: "Generate Seat Plan" },
              { path: "/viewSeatingPlan", label: "View Seat Plan" },
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

export default Sidebar;
