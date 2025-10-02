import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaDoorOpen,
  FaClipboardList,
} from "react-icons/fa";

const InvDashboardStatus = () => {
  const navigate = useNavigate();

  // Static example data
  const students = Array(50).fill({});
  const invigilators = Array(10).fill({});
  const exams = Array(5).fill({});
  const activeAssignments = Array(3).fill({});
  const activeSeatingPlans = Array(2).fill({});
  const invAssignments = Array(8).fill({});

  // Dashboard cards
  const statItems = [
    {
      label: "Exams",
      value: exams.length,
      icon: <FaBookOpen className="text-purple-600" size={32} />,
      iconBg: "bg-purple-100",
      route: "/invigilator/viewExam",
    },
    {
      label: "Active Room Assignments",
      value: activeAssignments.length,
      icon: <FaDoorOpen className="text-yellow-600" size={32} />,
      iconBg: "bg-yellow-100",
      route: "/invigilator/viewRoomAssign",
    },
    {
      label: "Active Seating Plans",
      value: activeSeatingPlans.length,
      icon: <FaClipboardList className="text-red-600" size={32} />,
      iconBg: "bg-red-100",
      route: "/invigilator/viewSeatingPlan",
    },
    {
      label: "Invigilator Assignments",
      value: invAssignments.length,
      icon: <FaChalkboardTeacher className="text-indigo-600" size={32} />,
      iconBg: "bg-indigo-100",
      route: "/invigilator/viewInvigilatorAssignments",
    },
  ];

  return (
    <div className="bg-gray-100 py-6 px-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        Home <span className="text-yellow-500">› Dashboard</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.route)}
            className="cursor-pointer flex items-center bg-white shadow-sm rounded-lg p-5 hover:shadow-md transition"
            title={`Go to ${item.label}`}
            style={{ minHeight: "100px" }}
          >
            <div
              className={`rounded-full p-4 ${item.iconBg} flex items-center justify-center`}
            >
              {item.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvDashboardStatus;
