import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetRoomAssignByExamQuery } from "../../redux/api/roomAssignApi";

const ViewRoomAssignDetailsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetRoomAssignByExamQuery(Number(examId));
  const assignments = data?.assignments || [];
  const exam = assignments.length > 0 ? assignments[0].exam : null;

  const formatDate = (isoDate) => {
    return isoDate ? new Date(isoDate).toISOString().split("T")[0] : "-";
  };

  const formatTime = (isoDateTime) => {
    if (!isoDateTime) return "-";
    const dateObj = new Date(isoDateTime);
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !data?.success)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load room assignment details.
      </p>
    );

  // Flatten all invigilator assignments with room info for invigilator table
  const allInvigilatorAssignments = assignments.flatMap(
    (assignment) =>
      assignment.invigilatorAssignments?.map((inv) => ({
        ...inv,
        roomNumber: assignment.room?.roomNumber,
        block: assignment.room?.block,
        floor: assignment.room?.floor,
      })) || []
  );

  return (
    <div className="max-w-6xl mx-auto mt-20 p-4">
      <div className="bg-white shadow rounded border border-gray-200 p-6">
        {/* Header */}
        <div className="relative mb-6">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Room Assignment Details
          </h2>
        </div>

        {/* Exam Details */}
        {exam ? (
          <>
            <div className="border border-gray-300 rounded p-4 mb-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Exam Information
              </h3>
              <table className="table-auto w-full text-sm text-gray-800">
                <tbody>
                  <tr>
                    <td className="font-semibold w-1/3 py-1">Subject</td>
                    <td className="py-1">
                      {exam.subject?.subjectName} ({exam.subject?.code})
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">Course</td>
                    <td className="py-1">{exam.subject?.semester?.course?.name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">Semester</td>
                    <td className="py-1">{exam.subject?.semester?.semesterNum}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">Batch</td>
                    <td className="py-1">{exam.subject?.semester?.course?.batchYear || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">Date</td>
                    <td className="py-1">{formatDate(exam.date)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">Start Time</td>
                    <td className="py-1">{formatTime(exam.startTime)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">End Time</td>
                    <td className="py-1">{formatTime(exam.endTime)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-1">College</td>
                    <td className="py-1">{exam.subject?.semester?.course?.college || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Room Assignments Table */}
            {assignments.length === 0 ? (
              <p className="text-center text-gray-600">No room assignments found.</p>
            ) : (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Room Informations
                </h3>
                <table className="w-full table-auto border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Room Number</th>
                      <th className="border px-4 py-2">Block</th>
                      <th className="border px-4 py-2">Floor</th>
                      <th className="border px-4 py-2">Total Benches</th>
                      <th className="border px-4 py-2">Total Capacity</th>
                      <th className="border px-4 py-2">Status</th>
                      {/* Removed Invigilators column */}
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className="border px-4 py-2">{assignment.room?.roomNumber}</td>
                        <td className="border px-4 py-2">{assignment.room?.block}</td>
                        <td className="border px-4 py-2">{assignment.room?.floor}</td>
                        <td className="border px-4 py-2 text-center">{assignment.room?.totalBench || 0}</td>
                        <td className="border px-4 py-2 text-center">{assignment.room?.totalCapacity || 0}</td>
                        <td className="border px-4 py-2 text-center">
                          {assignment.isCompleted
                            ? "Completed"
                            : assignment.isActive
                            ? "Active"
                            : "Inactive"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Invigilator Assignments Table WITHOUT Room Number, Block, Floor */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Invigilator Informations
              </h3>
              {allInvigilatorAssignments.length === 0 ? (
                <p className="text-center text-gray-600">No invigilator assignments found.</p>
              ) : (
                <table className="w-full table-auto border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Invigilator Name</th>
                      <th className="border px-4 py-2">Email</th>
                      <th className="border px-4 py-2">Phone</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Assigned At</th>
                      <th className="border px-4 py-2">Completed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInvigilatorAssignments.map((inv) => (
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
          </>
        ) : (
          <p className="text-center text-gray-600">No exam details found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewRoomAssignDetailsPage;
