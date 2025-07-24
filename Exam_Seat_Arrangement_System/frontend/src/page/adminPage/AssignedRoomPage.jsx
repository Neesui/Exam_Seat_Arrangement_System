import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useGetAllRoomAssignmentsQuery,
  useGenerateRoomAssignmentsMutation,
} from "../../redux/api/roomAssignApi";
import ViewRoomAssignPage from "./ViewRoomAssignPage ";

const AssignedRoomPage = () => {
  const { error } = useGetAllRoomAssignmentsQuery();
  const [generateAssignments, { isLoading: generating }] = useGenerateRoomAssignmentsMutation();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load room assignments");
    }
  }, [error]);

  const handleGenerate = async () => {
    try {
      await generateAssignments().unwrap();
      toast.success("Room assignments generated successfully");
      // RTK Query invalidation triggers refetch automatically
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate room assignments");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assigned Rooms</h1>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {generating ? "Generating..." : "Generate Room Assignments"}
      </button>
      <ViewRoomAssignPage />
    </div>
  );
};

export default AssignedRoomPage;
