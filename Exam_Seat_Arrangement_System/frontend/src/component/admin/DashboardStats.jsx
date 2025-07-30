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
  const {
    data: studentsData,
    isLoading: loadingStudents,
    isError: errorStudents,
  } = useGetAllStudentsQuery();

  const {
    data: invigilatorsData,
    isLoading: loadingInvigilators,
    isError: errorInvigilators,
  } = useGetAllInvigilatorsQuery();

  const {
    data: assignmentsData,
    isLoading: loadingAssignments,
    isError: errorAssignments,
  } = useGetAllRoomAssignmentsQuery();

  const {
    data: seatingPlansData,
    isLoading: loadingSeats,
    isError: errorSeats,
  } = useGetAllSeatingPlansQuery();

  const isLoading =
    loadingStudents || loadingInvigilators || loadingAssignments || loadingSeats;

  const isError =
    errorStudents || errorInvigilators || errorAssignments || errorSeats;

  // Extract arrays safely from API responses
  const students = studentsData?.students || [];
  const invigilators = invigilatorsData?.invigilators || [];

  // Room assignments and filter active ones
  const roomAssignments = assignmentsData?.assignments || [];
  const activeAssignments = roomAssignments.filter(
    (a) => a.status === "ACTIVE"
  );

  // Seating plans and filter active ones
  const seatingPlans = seatingPlansData?.data || [];
  const activeSeatingPlans = seatingPlans.filter((sp) => sp.isActive);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center py-10 text-gray-600">
        Loading Dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full w-full flex items-center justify-center py-10 text-red-600">
        Error loading dashboard data.
      </div>
    );
  }

  const statItems = [
    {
      label: "Students",
      value: students.length,
      icon: <FaUserGraduate className="text-green-600" size={32} />,
      iconBg: "bg-green-100",
    },
    {
      label: "Invigilators",
      value: invigilators.length,
      icon: <FaChalkboardTeacher className="text-blue-600" size={32} />,
      iconBg: "bg-blue-100",
    },
    {
      label: "Active Room Assignments",
      value: activeAssignments.length,
      icon: <FaDoorOpen className="text-yellow-600" size={32} />,
      iconBg: "bg-yellow-100",
    },
    {
      label: "Active Seating Plans",
      value: activeSeatingPlans.length,
      icon: <FaClipboardList className="text-red-600" size={32} />,
      iconBg: "bg-red-100",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-6">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        Home <span className="text-yellow-500">› Admin</span>
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center bg-white shadow-sm rounded-lg p-5 hover:shadow-md transition"
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

export default DashboardStats;
