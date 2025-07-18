import React, { useState } from "react";
import { useGenerateSeatingPlanMutation } from "../../redux/api/seatPlanApi";
import { useGetExamsQuery } from "../../redux/api/examApi";
import { toast } from "react-toastify";

const GenerateSeatingPlan = () => {
  const [examId, setExamId] = useState("");

  const { data: examsData, isLoading: examsLoading, isError: examsError } = useGetExamsQuery();

  const [generateSeatingPlan, { isLoading }] = useGenerateSeatingPlanMutation();

  const examsList = examsData?.exams?.map((exam, index) => ({
    key: exam.id || `exam-${index}`,
    value: exam.id || `exam-${index}`,
    name: exam.subject?.subjectName || "Unnamed Subject",
  })) || [];

  const handleGenerate = async () => {
    if (!examId) {
      toast.error("Please select an exam");
      return;
    }

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
        <select
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option key="default" value="">
            Select Exam (Subject)
          </option>

          {examsLoading && (
            <option key="loading" disabled>
              Loading exams...
            </option>
          )}

          {examsError && (
            <option key="error" disabled>
              Error loading exams
            </option>
          )}

          {examsList.map(({ key, value, name }) => (
            <option key={key} value={value}>
              {name}
            </option>
          ))}
        </select>

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
