import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllInvigilatorAssignmentsQuery,
  useDeleteInvigilatorAssignMutation,
  useUpdateInvigilatorAssignMutation,
} from "../../redux/api/invigilatorAssignApi";

const UpdateInvigilatorAssign = () => {
  const { invigilatorAssignId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAllInvigilatorAssignmentsQuery();
  const [deleteAssign, { isLoading: isDeleting }] = useDeleteInvigilatorAssignMutation();
  const [updateAssign, { isLoading: isUpdating }] = useUpdateInvigilatorAssignMutation();

  const [invigilatorName, setInvigilatorName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (data && data.assignments && invigilatorAssignId) {
      const assignment = data.assignments.find(
        (a) => String(a.id) === String(invigilatorAssignId)
      );
      if (assignment) {
        setInvigilatorName(assignment.invigilator?.user?.name || "");
        setStatus(assignment.status || "");
      }
    }
  }, [data, invigilatorAssignId]);

  const handleDelete = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this assignment?");
      if (!confirm) return;

      const result = await deleteAssign(invigilatorAssignId).unwrap();

      if (result.success) {
        toast.success("Invigilator assignment deleted successfully.");
        navigate("/viewInvigilatorAssign");
      } else {
        toast.error(result.message || "Failed to delete assignment.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error deleting assignment.");
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const result = await updateAssign({
        id: invigilatorAssignId,
        status,
      }).unwrap();

      if (result.success) {
        toast.success("Status updated successfully.");
      } else {
        toast.error(result.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Error updating status.");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading assignment...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Failed to load data.</p>;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-xl p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Invigilator Assignment Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Invigilator Name</label>
            <input
              type="text"
              value={invigilatorName}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <button
            onClick={handleUpdateStatus}
            className={`w-full p-3 mt-2 text-white font-semibold rounded ${
              isUpdating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </button>

          <button
            onClick={handleDelete}
            className={`w-full p-3 mt-2 text-white font-semibold rounded ${
              isDeleting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvigilatorAssign;
