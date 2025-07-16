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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invigilator assignment?")) return;

    try {
      await deleteAssign(id).unwrap();
      toast.success("Invigilator assignment deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete assignment.");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updateInvigilatorAssign/${id}`);
  };

  const handleView = (examId) => {
    if (examId) {
      navigate(`/viewInvigilatorAssignDetails/${examId}`);
    } else {
      toast.warning("Exam not found for this assignment");
    }
  };

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md w-[99%] max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Invigilator Assignments
      </h2>

      {isLoading ? (
        <p>Loading assignments...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load assignments.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">S.N.</th>
              <th className="border border-gray-300 px-4 py-2">Invigilator Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Subject Name</th>
              <th className="border border-gray-300 px-4 py-2">Room Number</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.assignments?.length > 0 ? (
              data.assignments.map((assign, index) => (
                <tr key={assign.id}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">
                    {assign.invigilator?.user?.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {assign.invigilator?.user?.email || "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {assign.roomAssignment?.exam?.subject?.subjectName || "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {assign.roomAssignment?.room?.roomNumber || "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleUpdate(assign.id)}
                      disabled={isDeleting}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(assign.id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() =>
                        handleView(assign.roomAssignment?.exam?.id)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border px-4 py-4 text-center text-gray-500">
                  No invigilator assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewInvigilatorAssignPage;
