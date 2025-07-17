import React, { useState } from "react";
import { useGenerateSeatingPlanMutation } from "../../redux/api/seatPlanApi";
import { toast } from "react-toastify";

const GenerateSeatingPlan = () => {
  const [examId, setExamId] = useState("");
  const [generateSeatingPlan, { isLoading }] = useGenerateSeatingPlanMutation();

  const handleGenerate = async () => {
    if (!examId) return toast.error("Enter a valid exam ID");

    try {
      const res = await generateSeatingPlan(examId).unwrap();
      toast.success(res.message);
      setExamId("");
    } catch (error) {
      toast.error(error?.data?.message || "Error generating seating plan");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Generate Seating Plan</h2>
      <div className="flex items-center gap-4">
        <input
          type="number"
          placeholder="Exam ID"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
};

export default GenerateSeatingPlan;
