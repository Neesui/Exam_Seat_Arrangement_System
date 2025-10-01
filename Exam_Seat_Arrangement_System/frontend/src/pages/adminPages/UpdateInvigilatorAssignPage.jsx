import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetInvigilatorAssignmentsByIdQuery,
  useUpdateInvigilatorAssignMutation,
} from "../../redux/api/invigilatorAssignApi";
import Input from "../../component/public/Input";

const UpdateInvigilatorAssignPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // Fetch single assignment
  const { data, isLoading, error } =
    useGetInvigilatorAssignmentsByIdQuery(id);
  const [updateAssign, { isLoading: isUpdating }] =
    useUpdateInvigilatorAssignMutation();

  const [status, setStatus] = useState("ASSIGNED");
  const [completedAt, setCompletedAt] = useState("");

  // Populate form with assignment data
  useEffect(() => {
    if (data?.assignment) {
      const a = data.assignment;
      setStatus(a.status || "ASSIGNED");
      setCompletedAt(
        a.completedAt ? new Date(a.completedAt).toISOString().split("T")[0] : ""
      );
    }
  }, [data]);

  // Auto fill completedAt
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (status === "COMPLETED" || status === "CANCELED") {
      setCompletedAt(today);
    } else {
      setCompletedAt("");
    }
  }, [status]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!id) {
      toast.error("Invalid assignment selected.");
      return;
    }

    try {
      await updateAssign({
        id: id,
        status,
        completedAt: completedAt ? new Date(completedAt).toISOString() : null,
      }).unwrap();

      toast.success("Assignment updated successfully!");
      navigate("/viewInvigilatorAssign");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update assignment.");
    }
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading assignment...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center mt-10">Failed to load data.</p>
    );

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="bg-white w-full max-w-xl p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Invigilator Assignment
        </h2>

        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </div>

          <Input
            id="completedAt"
            label="Completed Date"
            type="date"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
            disabled={status === "ASSIGNED"}
            required={status === "COMPLETED" || status === "CANCELED"}
          />

          <button
            type="submit"
            className={`w-full p-3 mt-2 text-white font-semibold rounded ${
              isUpdating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
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

export default UpdateInvigilatorAssignPage;
