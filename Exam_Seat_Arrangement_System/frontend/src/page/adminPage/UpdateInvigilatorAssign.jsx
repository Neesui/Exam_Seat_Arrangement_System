import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllInvigilatorAssignmentsQuery,
  useUpdateInvigilatorAssignMutation,
} from "../../redux/api/invigilatorAssignApi";

const UpdateInvigilatorAssign = () => {
  const { invigilatorAssignId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAllInvigilatorAssignmentsQuery();
  const [updateAssign, { isLoading: isUpdating }] = useUpdateInvigilatorAssignMutation();

  const [status, setStatus] = useState("ASSIGNED");

  useEffect(() => {
    if (data?.assignments && invigilatorAssignId) {
      const assignment = data.assignments.find(
        (a) => String(a.id) === String(invigilatorAssignId)
      );
      if (assignment) {
        setStatus(assignment.status || "ASSIGNED");
      }
    }
  }, [data, invigilatorAssignId]);

  const handleUpdateStatus = async () => {
    try {
      const result = await updateAssign({
        id: Number(invigilatorAssignId),
        status,
      }).unwrap();

      if (result.success) {
        toast.success("Status updated successfully.");
        navigate("/viewInvigilatorAssign");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Update Assignment Status</h2>

        <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
};

export default UpdateInvigilatorAssign;
