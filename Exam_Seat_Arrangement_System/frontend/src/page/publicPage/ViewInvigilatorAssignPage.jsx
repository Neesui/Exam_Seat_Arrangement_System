import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllInvigilatorAssignmentsQuery,
  useDeleteInvigilatorAssignMutation,
} from "../../redux/api/invigilatorAssignApi";

const ViewInvigilatorAssignPage = () => {
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useGetAllInvigilatorAssignmentsQuery();
  const [deleteAssign, { isLoading: isDeleting }] = useDeleteInvigilatorAssignMutation();

  // Delete an assignment by its ID
  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await deleteAssign(assignmentId).unwrap();
      toast.success("Invigilator assignment deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete assignment.");
    }
  };

  // Navigate to update assignment page
  const handleUpdate = (assignmentId) => {
    navigate(`/updateInvigilatorAssign/${assignmentId}`);
  };

  // Navigate to view details page by examId
  const handleView = (examId) => {
    if (examId) {
      navigate(`/viewInvigilatorAssignDetails/${examId}`);
    } else {
      toast.warning("Exam not found for this assignment");
    }
  };

  // Render status badges with colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "ASSIGNED":
        return (
          <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded font-semibold">
            Assigned
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded font-semibold">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded font-semibold">
            Unknown
          </span>
        );
    }
  };

  // Group assignments by roomAssignmentId
  const groupedAssignments = data?.assignments?.reduce((acc, curr) => {
    const roomAssignmentId = curr.roomAssignmentId;
    if (!acc[roomAssignmentId]) {
      acc[roomAssignmentId] = {
        roomAssignmentId,
        examId: curr.roomAssignment?.exam?.id,
        subject: curr.roomAssignment?.exam?.subject?.subjectName,
        room: curr.roomAssignment?.room?.roomNumber,
        invigilators: [],
      };
    }
    acc[roomAssignmentId].invigilators.push({
      name: curr.invigilator?.user?.name || "N/A",
      email: curr.invigilator?.user?.email || "N/A",
      assignId: curr.id,
      status: curr.status,
    });
    return acc;
  }, {}) || {};

  const groupedList = Object.values(groupedAssignments);

  return (
    <div className="w-full px-4 py-6 mt-5 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        All Invigilator Assignments
      </h2>

      {isLoading ? (
        <p className="text-center">Loading assignments...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load assignments.</p>
      ) : groupedList.length === 0 ? (
        <p className="text-center text-gray-500">No invigilator assignments found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">S.N.</th>
              <th className="border px-4 py-2">Invigilator Names</th>
              <th className="border px-4 py-2">Emails</th>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Room</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedList.map((group, index) => (
              <tr key={group.roomAssignmentId}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 whitespace-pre-line text-center">
                  {group.invigilators.map(i => i.name).join("\n")}
                </td>
                <td className="border px-4 py-2 whitespace-pre-line text-center">
                  {group.invigilators.map(i => i.email).join("\n")}
                </td>
                <td className="border px-4 py-2 text-center">
                  {group.subject || "N/A"}
                </td>
                <td className="border px-4 py-2 text-center">
                  {group.room || "N/A"}
                </td>
                <td className="border px-4 py-2 text-center">
                  {group.invigilators.map((i, idx) => (
                    <div key={idx} className="mb-1">
                      {getStatusBadge(i.status)}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleUpdate(group.invigilators[0].assignId)}
                    disabled={isDeleting}
                  >
                    Update
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(group.invigilators[0].assignId)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => handleView(group.examId)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewInvigilatorAssignPage;
