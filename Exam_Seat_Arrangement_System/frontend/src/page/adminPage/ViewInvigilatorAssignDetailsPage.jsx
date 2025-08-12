import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetInvigilatorAssignmentsByRoomQuery } from "../../redux/api/invigilatorAssignApi";

const ViewInvigilatorAssignDetailsPage = () => {
  const { roomAssignmentId: rawId } = useParams();
  const navigate = useNavigate();

  const roomAssignmentId = isNaN(Number(rawId)) ? rawId : Number(rawId);
  const { data, error, isLoading } = useGetInvigilatorAssignmentsByRoomQuery(roomAssignmentId);

  // Format to show date only YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !data?.success)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load invigilator assignments.
      </p>
    );

  // Extract assignments array from response
  const assignments = data?.assignments || [];
  // Extract roomAssignment info from the first assignment (all share same roomAssignment)
  const roomAssignment = assignments.length > 0 ? assignments[0].roomAssignment : null;
  // The list of invigilator assignments
  const invigilatorAssignments = assignments;

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded shadow">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-700 hover:text-blue-900"
      >
        <FaArrowLeft className="mr-2" />
        Back to Assignments
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">Room & Invigilator Details</h2>

      {/* Exam Information in table */}
      <div className="border rounded p-4 mb-3 bg-gray-50">
        <h3 className="font-semibold text-lg mb-3">Exam Information</h3>
        <table className="w-full table-auto text-left text-sm text-gray-800">
          <tbody>
            <tr>
              <td className="font-semibold py-1 w-1/3">College Name</td>
              <td>{roomAssignment?.exam?.collegeName || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1 w-1/3">Subject</td>
              <td>
                {roomAssignment?.exam?.subject?.subjectName || "N/A"} (
                {roomAssignment?.exam?.subject?.code || "N/A"})
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Course</td>
              <td>{roomAssignment?.exam?.subject?.semester?.course?.name || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Semester</td>
              <td>{roomAssignment?.exam?.subject?.semester?.semesterNum || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Date</td>
              <td>{roomAssignment?.exam?.date ? formatDate(roomAssignment.exam.date) : "-"}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Start Time</td>
              <td>
                {roomAssignment?.exam?.startTime
                  ? new Date(roomAssignment.exam.startTime).toLocaleTimeString()
                  : "-"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">End Time</td>
              <td>
                {roomAssignment?.exam?.endTime
                  ? new Date(roomAssignment.exam.endTime).toLocaleTimeString()
                  : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Room Assignment Information as a table with headers */}
      <div className="p-4 mb-3">
        <h3 className="font-semibold text-lg mb-3">Room Assignment Information</h3>
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Room Number</th>
              <th className="border px-4 py-2">Block</th>
              <th className="border px-4 py-2">Floor</th>
              <th className="border px-4 py-2">Total Benches</th>
              <th className="border px-4 py-2">Total Capacity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">{roomAssignment?.room?.roomNumber || "N/A"}</td>
              <td className="border px-4 py-2">{roomAssignment?.room?.block || "N/A"}</td>
              <td className="border px-4 py-2">{roomAssignment?.room?.floor || "N/A"}</td>
              {/* Here check the exact field names for benches and capacity */}
              <td className="border px-4 py-2 text-center">{roomAssignment?.room?.totalBench ?? "-"}</td>
              <td className="border px-4 py-2 text-center">{roomAssignment?.room?.totalCapacity ?? "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Invigilators */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Invigilators</h3>
        {invigilatorAssignments.length === 0 ? (
          <p className="text-center text-gray-600">No invigilators assigned to this room.</p>
        ) : (
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Assigned At</th>
                <th className="border px-4 py-2">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {invigilatorAssignments.map((inv) => (
                <tr key={inv.id}>
                  <td className="border px-4 py-2">{inv.invigilator?.user?.name || "N/A"}</td>
                  <td className="border px-4 py-2">{inv.invigilator?.user?.email || "-"}</td>
                  <td className="border px-4 py-2">{inv.invigilator?.phone || "-"}</td>
                  <td className="border px-4 py-2">{inv.status || "-"}</td>
                  <td className="border px-4 py-2">{formatDate(inv.assignedAt)}</td>
                  <td className="border px-4 py-2">{formatDate(inv.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewInvigilatorAssignDetailsPage;
