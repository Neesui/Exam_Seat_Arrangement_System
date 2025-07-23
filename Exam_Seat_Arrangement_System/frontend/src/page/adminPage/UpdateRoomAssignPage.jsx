import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useUpdateRoomAssignMutation,
  useGetRoomAssignByExamQuery,
} from "../../redux/api/roomAssignApi";

const UpdateRoomAssignPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const {
    data: roomAssignData,
    isLoading: isLoadingRoomAssign,
    error: roomAssignError,
  } = useGetRoomAssignByExamQuery(Number(examId));

  const [updateRoomAssign, { isLoading: isUpdating }] = useUpdateRoomAssignMutation();

  const [formValues, setFormValues] = useState([]);

  useEffect(() => {
    if (roomAssignData?.assignments) {
      const prepared = roomAssignData.assignments.map((assign) => ({
        id: assign.id,
        isActive: assign.isActive,
        isCompleted: assign.isCompleted,
      }));
      setFormValues(prepared);
    }
  }, [roomAssignData]);

  const handleChange = (index, field, value) => {
    const updated = [...formValues];
    updated[index][field] = value === "true" || value === true;
    setFormValues(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Promise.all(
        formValues.map((assign) =>
          updateRoomAssign({
            id: assign.id,
            isActive: assign.isActive,
            isCompleted: assign.isCompleted,
          }).unwrap()
        )
      );

      toast.success("Room assignment(s) updated successfully!");
      navigate("/viewRoomAssign");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error?.data?.message || "Failed to update room assignment(s).");
    }
  };

  if (isLoadingRoomAssign) return <p className="text-center mt-10">Loading room assignment data...</p>;
  if (roomAssignError) return <p className="text-center mt-10 text-red-500">Failed to load room assignment data.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Room Assignments</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formValues.map((assign, index) => (
          <div
            key={assign.id}
            className="p-4 border rounded bg-gray-50 space-y-4"
          >
            <h3 className="font-semibold">
              Room Assignment #{index + 1}
            </h3>

            <div className="flex justify-between gap-4">
              <div className="w-full">
                <label className="block font-medium mb-1">Is Active</label>
                <select
                  value={assign.isActive}
                  onChange={(e) => handleChange(index, "isActive", e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>

              <div className="w-full">
                <label className="block font-medium mb-1">Is Completed</label>
                <select
                  value={assign.isCompleted}
                  onChange={(e) => handleChange(index, "isCompleted", e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={isUpdating}
          className={`w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUpdating ? "Updating..." : "Update Room Assignments"}
        </button>
      </form>
    </div>
  );
};

export default UpdateRoomAssignPage;
