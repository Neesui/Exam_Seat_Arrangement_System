import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetInvigilatorAssignmentsByIdQuery } from "../../redux/api/invigilatorAssignApi";

const ViewInvigilatorAssignDetailsPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const numericId = Number(assignmentId);

  const { data, error, isLoading } = useGetInvigilatorAssignmentsByIdQuery(numericId);
  const assignment = data?.assignment || null;

  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatTime = (isoDate) => {
    if (!isoDate) return "-";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  if (isNaN(numericId)) return <p className="text-center mt-10 text-red-500">Invalid Assignment ID</p>;
  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !data?.success) return <p className="text-center mt-10 text-red-500">Failed to load assignment details.</p>;
  if (!assignment) return <p className="text-center mt-10 text-gray-600">No assignment found.</p>;

  const room = assignment.roomAssignment?.room || {};
  const exam = assignment.roomAssignment?.exam || {};
  const invigilators = assignment.invigilators || [];
  const students = exam.students || [];

  return (
    <div className="max-w-6xl mx-auto mt-5 p-4">
      <div className="bg-white shadow rounded border border-gray-200 p-6">
        {/* Header */}
        <div className="relative mb-6">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800">Room & Invigilator Details</h2>
        </div>

        {/* Exam Details */}
        {exam ? (
          <div className="border border-gray-300 rounded p-4 mb-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Exam Information</h3>
            <table className="table-auto w-full text-sm text-gray-800">
              <tbody>
                <tr>
                  <td className="font-semibold w-1/3 py-1">Subject</td>
                  <td className="py-1">{exam.subject?.subjectName || "N/A"}</td>
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
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-6">No exam details found.</p>
        )}

        {/* Room Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Room Assignment</h3>
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
                <td className="border px-4 py-2">{room.roomNumber || "N/A"}</td>
                <td className="border px-4 py-2">{room.block || "N/A"}</td>
                <td className="border px-4 py-2">{room.floor || "N/A"}</td>
                <td className="border px-4 py-2">{room.totalBench ?? "-"}</td>
                <td className="border px-4 py-2">{room.totalCapacity ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Invigilators Table */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Invigilators</h3>
          {invigilators.length === 0 ? (
            <p className="text-center text-gray-600">No invigilators assigned.</p>
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
                {invigilators.map((i) => (
                  <tr key={i.id}>
                    <td className="border px-4 py-2">{i.invigilator?.user?.name || "N/A"}</td>
                    <td className="border px-4 py-2">{i.invigilator?.user?.email || "-"}</td>
                    <td className="border px-4 py-2">{i.invigilator?.phone || "-"}</td>
                    <td className="border px-4 py-2">{i.status || "-"}</td>
                    <td className="border px-4 py-2">{formatDate(i.assignedAt)} {formatTime(i.assignedAt)}</td>
                    <td className="border px-4 py-2">{formatDate(i.completedAt)} {formatTime(i.completedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Students Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Students</h3>
          {students.length === 0 ? (
            <p className="text-center text-gray-600">No students found for this exam.</p>
          ) : (
            <table className="w-[550px] table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">College</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="border px-4 py-2">{s.studentName || "N/A"}</td>
                    <td className="border px-4 py-2">{s.college || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewInvigilatorAssignDetailsPage;
