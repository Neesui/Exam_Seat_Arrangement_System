import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetExamByIdQuery } from "../../redux/api/examApi";
import { FaArrowLeft } from "react-icons/fa";

const ViewExamDetailsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetExamByIdQuery(Number(examId));
  const exam = data?.exam;

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !exam)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load exam details.
      </p>
    );

  const formatDate = (isoDate) => {
    return isoDate ? new Date(isoDate).toISOString().split("T")[0] : "-";
  };

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 p-4">
      <div className="bg-white rounded shadow-md border border-gray-200 p-6">

        <div className="relative mb-6">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Exam Details
          </h2>
        </div>

        {/* Exam Details Table */}
        <table className="w-full table-auto border border-gray-300 mb-6">
          <tbody className="text-gray-700">
            <tr>
              <td className="border px-4 py-2 font-semibold">Subject</td>
              <td className="border px-4 py-2">
                {exam.subject?.subjectName} ({exam.subject?.code})
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Course</td>
              <td className="border px-4 py-2">
                {exam.subject?.semester?.course?.name}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Semester</td>
              <td className="border px-4 py-2">
                {exam.subject?.semester?.semesterNum}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Date</td>
              <td className="border px-4 py-2">{formatDate(exam.date)}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Time</td>
              <td className="border px-4 py-2">
                {exam.startTime ? formatTime(exam.startTime) : "-"} -{" "}
                {exam.endTime ? formatTime(exam.endTime) : "-"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Room Assignments */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Room Assignments</h3>
          {exam.roomAssignments.length === 0 ? (
            <p className="text-gray-600">No room assignments found.</p>
          ) : (
            <table className="w-full border table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Room Number</th>
                  <th className="border px-4 py-2">Block</th>
                  <th className="border px-4 py-2">Floor</th>
                  <th className="border px-4 py-2">Invigilators</th>
                </tr>
              </thead>
              <tbody>
                {exam.roomAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="border px-4 py-2">
                      {assignment.room?.roomNumber}
                    </td>
                    <td className="border px-4 py-2">
                      {assignment.room?.block}
                    </td>
                    <td className="border px-4 py-2">
                      {assignment.room?.floor}
                    </td>
                    <td className="border px-4 py-2">
                      {assignment.invigilatorAssignments.length === 0
                        ? "None"
                        : assignment.invigilatorAssignments
                            .map(
                              (inv) =>
                                `${inv.invigilator?.user?.name || "N/A"} (${
                                  inv.invigilator?.user?.email
                                })`
                            )
                            .join(", ")}
                    </td>
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

export default ViewExamDetailsPage;
