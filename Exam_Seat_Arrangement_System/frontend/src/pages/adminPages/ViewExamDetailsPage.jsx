import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetExamByIdQuery } from "../../redux/api/examApi";
import { FaArrowLeft } from "react-icons/fa";

const ViewExamDetailsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetExamByIdQuery(Number(examId));
  const exam = data?.exam;

  // Format date as "2 Oct 2025"
  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time as "10:30 AM"
  const formatTime = (isoTime) => {
    if (!isoTime) return "-";
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !exam)
    return <p className="text-center mt-10 text-red-500">Failed to load exam details.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded shadow">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-700 hover:text-blue-900"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">Exam Details</h2>

      {/* Exam Information */}
      <div className="border rounded p-4 mb-6 bg-gray-50">
        <h3 className="font-semibold text-lg mb-3">Exam Information</h3>
        <table className="w-full table-auto text-left text-sm text-gray-800">
          <tbody>
            <tr>
              <td className="font-semibold py-1 w-1/3">Subject</td>
              <td>{exam.subject?.subjectName || "N/A"} ({exam.subject?.code || "N/A"})</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Course</td>
              <td>{exam.subject?.semester?.course?.name || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Semester</td>
              <td>{exam.subject?.semester?.semesterNum || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Date</td>
              <td>{formatDate(exam.date)}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Start Time</td>
              <td>{formatTime(exam.startTime)}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">End Time</td>
              <td>{formatTime(exam.endTime)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Room Assignments */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Room Assignments</h3>
        {exam.roomAssignments.length === 0 ? (
          <p className="text-gray-600">No room assignments found.</p>
        ) : (
          exam.roomAssignments.map((assignment) => (
            <div key={assignment.id} className="mb-4 border rounded p-4 bg-gray-50">
              <h4 className="font-semibold mb-2">
                Room: {assignment.room?.roomNumber || "N/A"} | Block: {assignment.room?.block || "N/A"} | Floor: {assignment.room?.floor || "-"}
              </h4>
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
                  {assignment.invigilatorAssignments.length === 0 ? (
                    <tr>
                      <td className="border px-4 py-2 text-center" colSpan={6}>No invigilators assigned</td>
                    </tr>
                  ) : (
                    assignment.invigilatorAssignments.flatMap((invAssignment) =>
                      invAssignment.invigilators.map((inv) => (
                        <tr key={inv.id}>
                          <td className="border px-4 py-2">{inv.invigilator?.user?.name || "N/A"}</td>
                          <td className="border px-4 py-2">{inv.invigilator?.user?.email || "-"}</td>
                          <td className="border px-4 py-2">{inv.invigilator?.phone || "-"}</td>
                          <td className="border px-4 py-2">{invAssignment.status || "-"}</td>
                          <td className="border px-4 py-2">{formatDate(invAssignment.assignedAt)}</td>
                          <td className="border px-4 py-2">{formatDate(invAssignment.completedAt)}</td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ViewExamDetailsPage;
