import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllRoomAssignmentsQuery,
  useDeleteRoomAssignMutation,
} from "../../redux/api/roomAssignApi";

const ViewRoomAssignPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetAllRoomAssignmentsQuery();

  const [deleteRoomAssign, { isLoading: isDeleting }] = useDeleteRoomAssignMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room assignment?")) return;

    try {
      await deleteRoomAssign(id).unwrap();
      toast.success("Room assignment deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete room assignment.");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updateRoomAssign/${id}`);
  };

  const handleView = (examId) => {
    navigate(`/viewRoomAssignDetails/${examId}`); // ✅ examId instead of assignment.id
  };

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md w-[99%] max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Room Assignments</h2>

      {isLoading ? (
        <p>Loading room assignments...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load room assignments.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">S.N.</th>
              <th className="border border-gray-300 px-4 py-2">Room Number</th>
              <th className="border border-gray-300 px-4 py-2">Block</th>
              <th className="border border-gray-300 px-4 py-2">Floor</th>
              <th className="border border-gray-300 px-4 py-2">Is Active</th>
              <th className="border border-gray-300 px-4 py-2">Is Completed</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.assignments?.length > 0 ? (
              data.assignments.map((assign, index) => (
                <tr key={assign.id}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">
                    {assign.room?.roomNumber || "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {assign.room?.block || "-"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {assign.room?.floor || "-"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        assign.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {assign.isActive ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        assign.isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {assign.isCompleted ? "Yes" : "No"}
                    </span>
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
                      onClick={() => handleView(assign.exam?.id)} // ✅ Pass examId here
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border px-4 py-4 text-center text-gray-500">
                  No room assignments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewRoomAssignPage;
