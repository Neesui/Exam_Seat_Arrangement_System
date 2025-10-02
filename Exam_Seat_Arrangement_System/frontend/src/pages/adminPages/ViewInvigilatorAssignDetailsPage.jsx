import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetInvigilatorAssignmentsByIdQuery } from "../../redux/api/invigilatorAssignApi";

const ViewInvigilatorAssignDetailsPage = () => {
  const { assignmentId: rawId } = useParams();
  const navigate = useNavigate();
  const assignmentId = Number(rawId);

  const { data, error, isLoading } = useGetInvigilatorAssignmentsByIdQuery(
    assignmentId,
    { skip: !assignmentId }
  );

  if (isLoading) {
    return <div className="p-6">Loading assignment details...</div>;
  }
  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading assignment: {error.message}
      </div>
    );
  }
  if (!data?.assignment) {
    return <div className="p-6">No assignment found.</div>;
  }

  const { assignment } = data;

  // Format date like "2 Oct 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time like "09:00 AM" without using Date object
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    let [hour, minute] = timeString.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <FaArrowLeft /> Back
      </button>
      <h1 className="text-2xl font-bold text-center">
        Invigilator Assignment Details
      </h1>

      {/* Room Information Table */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Room Information</h2>
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Room Number</th>
              <th className="p-2 border">Block</th>
              <th className="p-2 border">Floor</th>
              <th className="p-2 border">Total Benches</th>
              <th className="p-2 border">Total Capacity</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{assignment.roomAssignment?.room?.roomNumber || "N/A"}</td>
              <td className="p-2 border">{assignment.roomAssignment?.room?.block || "N/A"}</td>
              <td className="p-2 border">{assignment.roomAssignment?.room?.floor || "N/A"}</td>
              <td className="p-2 border">{assignment.roomAssignment?.room?.totalBench ?? 0}</td>
              <td className="p-2 border">{assignment.roomAssignment?.room?.totalCapacity ?? 0}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Exam Information Table */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Exam Information</h2>
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Semester</th>
              <th className="p-2 border">Batch</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Start Time</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{assignment.roomAssignment?.exam?.subjectName || "N/A"}</td>
              <td className="p-2 border">{assignment.roomAssignment?.exam?.courseName || "N/A"}</td>
              <td className="p-2 border">{assignment.roomAssignment?.exam?.semesterName || "N/A"}</td>
              <td className="p-2 border">{assignment.roomAssignment?.exam?.batchName || "N/A"}</td>
              <td className="p-2 border">{formatDate(assignment.roomAssignment?.exam?.date)}</td>
              <td className="p-2 border">{formatTime(assignment.roomAssignment?.exam?.startTime)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Invigilators Table */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Invigilators</h2>
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Assigned At</th>
              <th className="p-2 border">Completed At</th>
            </tr>
          </thead>
          <tbody>
            {assignment.invigilators?.length > 0 ? (
              assignment.invigilators.map((inv, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{inv.invigilator?.user?.name || "N/A"}</td>
                  <td className="p-2 border">{inv.invigilator?.user?.email || "-"}</td>
                  <td className="p-2 border">{inv.invigilator?.phone || "-"}</td>
                  <td className="p-2 border">{inv.status || "-"}</td>
                  <td className="p-2 border">{inv.assignedAt ? formatDate(inv.assignedAt) : "-"}</td>
                  <td className="p-2 border">{inv.completedAt ? formatDate(inv.completedAt) : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-2 text-center border">No invigilators assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Students Table */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Students</h2>
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">College</th>
            </tr>
          </thead>
          <tbody>
            {assignment.roomAssignment?.exam?.students?.length > 0 ? (
              assignment.roomAssignment.exam.students.map((student, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{student.studentName}</td>
                  <td className="p-2 border">{student.college}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-2 text-center border">No students assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ViewInvigilatorAssignDetailsPage;
