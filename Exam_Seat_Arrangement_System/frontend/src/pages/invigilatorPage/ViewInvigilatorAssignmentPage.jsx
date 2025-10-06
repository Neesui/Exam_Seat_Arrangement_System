import React from "react";
import { useGetAllInvigilatorAssignmentsQuery } from "../../redux/api/invigilatorAssignApi";

const ViewInvigilatorAssignmentPage = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllInvigilatorAssignmentsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading assignments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <p>Failed to fetch assignments.</p>
        <p className="text-sm text-gray-500">{error?.data?.message || "Something went wrong."}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const assignments = data?.assignments || [];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
        My Invigilator Assignments
      </h1>

      {assignments.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          You have no invigilator assignments yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => {
            const exam = assignment.roomAssignment?.exam;
            const subjectName = exam?.subjectName || "N/A";
            const roomNumber = assignment.roomAssignment?.room?.roomNumber || "N/A";
            const date = exam?.startTime
              ? new Date(exam.startTime).toLocaleDateString()
              : "N/A";
            const time = exam?.startTime
              ? new Date(exam.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A";

            return (
              <div
                key={assignment.id}
                className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {subjectName}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      assignment.status === "ASSIGNED"
                        ? "bg-blue-100 text-blue-700"
                        : assignment.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">Subject:</span>{" "}
                    {exam?.subject?.subjectName || subjectName}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Room:</span>{" "}
                    {roomNumber}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Date:</span>{" "}
                    {date}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Time:</span>{" "}
                    {time}
                  </p>
                </div>

                <div className="mt-4 border-t pt-3 text-sm text-gray-500">
                  Assigned At:{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(assignment.assignedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewInvigilatorAssignmentPage;
