import React from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaClipboardList,
} from "react-icons/fa";

import { useGetAllStudentsQuery } from "../../redux/api/studentApi";
import { useGetAllInvigilatorsQuery } from "../../redux/api/invigilatorApi";
import { useGetAllRoomAssignmentsQuery } from "../../redux/api/roomAssignApi";
import { useGetAllSeatingPlansQuery } from "../../redux/api/seatPlanApi";

const DashboardStats = () => {
  const { data: students = [], isLoading: loadingStudents } = useGetAllStudentsQuery();
  const { data: invigilators = [], isLoading: loadingInvigilators } = useGetAllInvigilatorsQuery();
  const { data: assignments = [], isLoading: loadingAssignments } = useGetAllRoomAssignmentsQuery();
  const { data: seatPlans = [], isLoading: loadingSeats } = useGetAllSeatingPlansQuery();

  const isLoading = loadingStudents || loadingInvigilators || loadingAssignments || loadingSeats;

  const statItems = [
    {
      label: "Students",
      value: students.length || 0,
      icon: <FaUserGraduate className="text-green-600" size={32} />,
      iconBg: "bg-green-100",
    },
    {
      label: "Invigilators",
      value: invigilators.length || 0,
      icon: <FaChalkboardTeacher className="text-blue-600" size={32} />,
      iconBg: "bg-blue-100",
    },
    {
      label: "Room Assigned",
      value: assignments.length || 0,
      icon: <FaDoorOpen className="text-yellow-600" size={32} />,
      iconBg: "bg-yellow-100",
    },
    {
      label: "Seat Plans",
      value: seatPlans.length || 0,
      icon: <FaClipboardList className="text-red-600" size={32} />,
      iconBg: "bg-red-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center py-10 text-gray-600">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-6">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        Home <span className="text-yellow-500">› Admin</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center bg-white shadow-sm rounded-lg p-5 hover:shadow-md transition"
          >
            <div className={`rounded-full p-4 ${item.iconBg} flex items-center justify-center`}>
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

export default DashboardStats;
