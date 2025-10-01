import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useGenerateInvigilatorAssignmentsMutation,
  useGetAllInvigilatorAssignmentsQuery,
} from "../../redux/api/invigilatorAssignApi";
import ViewCurrentInvigilatorAssignPage from "./ViewCurrentInvigilatorAssignPage";

const AssignedInvigilatorPage = () => {
  const { error, isLoading, refetch } = useGetAllInvigilatorAssignmentsQuery();
  const [generateAssignments, { isLoading: generating }] = useGenerateInvigilatorAssignmentsMutation();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load invigilator assignments");
    }
  }, [error]);

  const handleGenerate = async () => {
    try {
      await generateAssignments().unwrap();
      toast.success("Invigilator assignments generated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate invigilator assignments");
    }
  };

  return (
    <div className="mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-md mt-3">
      <h1 className="text-2xl font-bold mb-6 underline">Assigned Invigilators</h1>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {generating ? "Generating..." : "Generate Invigilator Assignments"}
      </button>
      <ViewCurrentInvigilatorAssignPage />
    </div>
  );
};

export default AssignedInvigilatorPage;
