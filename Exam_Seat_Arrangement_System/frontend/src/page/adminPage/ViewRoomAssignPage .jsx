import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetRoomAssignByExamQuery,
  useDeleteRoomAssignMutation,
} from "../../redux/api/roomAssignApi";

const ViewRoomAssignPage = ({ examId }) => {
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetRoomAssignByExamQuery(examId);

  const [deleteRoomAssign] = useDeleteRoomAssignMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room assignment?")) return;

    try {
      await deleteRoomAssign(id).unwrap();
      toast.success("Room assignment deleted successfully!");
      refetch(); // Refresh the list
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete room assignment.");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updateRoomAssign/${id}`);
  };

  const handleView = (id) => {
    navigate(`/viewRoomAssignDetails/${id}`);
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
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{assign.room?.roomNumber || "N/A"}</td>
                  <td className="border px-4 py-2">{assign.room?.block || "-"}</td>
                  <td className="border px-4 py-2">{assign.room?.floor || "-"}</td>
                  <td className="border px-4 py-2">{assign.isActive ? "Yes" : "No"}</td>
                  <td className="border px-4 py-2">{assign.isCompleted ? "Yes" : "No"}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleUpdate(assign.id)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 mr-2"
                      onClick={() => handleDelete(assign.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleView(assign.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border px-4 py-2 text-center">
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
