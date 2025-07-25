import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useGenerateInvigilatorAssignmentsMutation,
  useGetAllInvigilatorAssignmentsQuery,
} from "../../redux/api/invigilatorAssignApi";
import ViewInvigilatorAssignPage from "../publicPage/ViewInvigilatorAssignPage";

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
    <div className="p-6">
      <h1 className="text-2xl mt-15 font-bold mb-6">Assigned Invigilators</h1>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {generating ? "Generating..." : "Generate Invigilator Assignments"}
      </button>
      <ViewInvigilatorAssignPage />
    </div>
  );
};

export default AssignedInvigilatorPage;
