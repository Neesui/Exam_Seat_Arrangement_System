import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllRoomAssignmentsQuery,
  useUpdateRoomAssignMutation,
} from "../../redux/api/roomAssignApi"; 
import Input from "../../component/public/Input";

const UpdateRoomAssignPage = () => {
  const { id } = useParams(); // assignment ID
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAllRoomAssignmentsQuery();
  const [updateRoomAssign, { isLoading: isUpdating }] = useUpdateRoomAssignMutation();

  const [status, setStatus] = useState("");
  const [completedAt, setCompletedAt] = useState("");

  useEffect(() => {
    if (data?.assignments) {
      const assignment = data.assignments.find((a) => String(a.id) === String(id));
      if (assignment) {
        setStatus(assignment.status || "");
        setCompletedAt(
          assignment.completedAt ? new Date(assignment.completedAt).toISOString().split("T")[0] : ""
        );
      }
    }
  }, [data, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateRoomAssign({
        id: Number(id),
        status,
        completedAt: completedAt ? new Date(completedAt).toISOString() : null,
      }).unwrap();

      if (result.success) {
        toast.success("Room assignment updated successfully!");
        navigate("/viewRoomAssign");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update room assignment");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading assignment...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Failed to load data.</p>;

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Update Room Assignment</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>

          {/* Completed At using Input.jsx */}
          <Input
            id="completedAt"
            label="Completed Date"
            type="date"
            name="completedAt"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
            required={status === "COMPLETED"}
            disabled={status !== "COMPLETED"}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 rounded text-white font-semibold transition ${
              isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoomAssignPage;
