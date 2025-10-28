import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaDoorOpen,
  FaClipboardList,
  FaChalkboardTeacher,
} from "react-icons/fa";

import { useGetExamsForInvigilatorQuery } from "../../redux/api/examApi";
import { useGetInvigilatorRoomAssignmentsQuery } from "../../redux/api/roomAssignApi";
import { useGetActiveSeatingPlanQuery } from "../../redux/api/seatPlanApi";

const InvDashboardStatus = () => {
  const navigate = useNavigate();

  // Fetch dynamic data
  const { data: examsData, isLoading: loadingExams, isError: errorExams } =
    useGetExamsForInvigilatorQuery();

  const {
    data: roomAssignData,
    isLoading: loadingRooms,
    isError: errorRooms,
  } = useGetInvigilatorRoomAssignmentsQuery();

  const {
    data: seatPlanData,
    isLoading: loadingSeatPlan,
    isError: errorSeatPlan,
  } = useGetActiveSeatingPlanQuery();

  //Normalize counts
  const examCount = Array.isArray(examsData?.data)
    ? examsData.data.length
    : Array.isArray(examsData?.exams)
    ? examsData.exams.length
    : 0;

  const roomAssignCount = Array.isArray(roomAssignData?.assignments)
    ? roomAssignData.assignments.length
    : Array.isArray(roomAssignData?.data)
    ? roomAssignData.data.length
    : 0;

  // read seat plans from `data`
  const seatPlanCount = Array.isArray(seatPlanData?.data)
    ? seatPlanData.data.length
    : 0;

  const invAssignmentsCount = roomAssignCount;

  // Dashboard cards
  const statItems = [
    {
      label: "Exams",
      value: loadingExams ? "..." : examCount,
      icon: <FaBookOpen className="text-purple-600" size={32} />,
      iconBg: "bg-purple-100",
      route: "/invigilator/viewAssignedExams",
    },
    {
      label: "Active Room Assignments",
      value: loadingRooms ? "..." : roomAssignCount,
      icon: <FaDoorOpen className="text-yellow-600" size={32} />,
      iconBg: "bg-yellow-100",
      route: "/invigilator/viewRoomAssignment",
    },
    {
      label: "Active Seating Plans",
      value: loadingSeatPlan ? "..." : seatPlanCount,
      icon: <FaClipboardList className="text-red-600" size={32} />,
      iconBg: "bg-red-100",
      route: "/invigilator/viewActiveSeatPlan",
    },
    {
      label: "Invigilator Assignments",
      value: loadingRooms ? "..." : invAssignmentsCount,
      icon: <FaChalkboardTeacher className="text-indigo-600" size={32} />,
      iconBg: "bg-indigo-100",
      route: "/invigilator/viewInvigilatorAssignments",
    },
  ];

  //Loading/Error states
  if (loadingExams || loadingRooms || loadingSeatPlan)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading dashboard data...</p>
      </div>
    );

  if (errorExams || errorRooms || errorSeatPlan)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Failed to load dashboard data.</p>
      </div>
    );

  // Render dashboard
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
            style={{ minHeight: "100px" }}
          >
            <div
              className={`rounded-full p-4 ${item.iconBg} flex items-center justify-center`}
            >
              {item.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvDashboardStatus;
