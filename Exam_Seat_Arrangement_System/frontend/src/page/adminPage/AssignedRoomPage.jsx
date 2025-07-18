import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useGetAllRoomAssignmentsQuery,
  useAddRoomAssignMutation,
} from "../../redux/api/roomAssignApi";

const AssignedRoomPage = () => {
  // Fetch all room assignments
  const {
    data: assignmentsData,
    error,
    isLoading,
    refetch,
  } = useGetAllRoomAssignmentsQuery();

  // Mutation to generate assignments (runs Python script and saves in DB)
  const [generateAssignments, { isLoading: generating }] = useAddRoomAssignMutation();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load room assignments");
    }
  }, [error]);

  const handleGenerate = async () => {
    try {
      await generateAssignments().unwrap();
      toast.success("Room assignments generated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate room assignments");
    }
  };

  const assignments = assignmentsData?.assignments || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assigned Rooms</h1>

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {generating ? "Generating..." : "Generate Room Assignments"}
      </button>

      {isLoading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p>No room assignments found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Exam Date</th>
              <th className="border border-gray-300 p-2">Subject</th>
              <th className="border border-gray-300 p-2">Course</th>
              <th className="border border-gray-300 p-2">Room Number</th>
              <th className="border border-gray-300 p-2">Total Benches</th>
              <th className="border border-gray-300 p-2">Total Capacity</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => {
              const { exam, room } = assignment;
              return (
                <tr key={assignment.id} className="even:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    {new Date(exam.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {exam.subject?.subjectName || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {exam.subject?.semester?.course?.name || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">{room.roomNumber}</td>
                  <td className="border border-gray-300 p-2">{room.totalBench}</td>
                  <td className="border border-gray-300 p-2">{room.totalCapacity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedRoomPage;
