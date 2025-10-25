import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGenerateSeatingPlanMutation } from "../../redux/api/seatPlanApi";
import { useGetExamsQuery } from "../../redux/api/examApi";
import { parseISO, isBefore } from "date-fns";

const GenerateSeatingPlan = () => {
  const [examId, setExamId] = useState("");

  // Fetch exams
  const {
    data: examsData,
    isLoading: examsLoading,
    error: examsError,
    refetch: refetchExams,
  } = useGetExamsQuery();

  const [generateSeatingPlan, { isLoading: generating }] = useGenerateSeatingPlanMutation();

  useEffect(() => {
    if (examsError) toast.error("Failed to load exams");
  }, [examsError]);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!examId) {
      toast.error("Please select an exam");
      return;
    }

    try {
      const res = await generateSeatingPlan(examId).unwrap();
      toast.success(res.message || "Seating plan generated successfully!");
      setExamId("");
      refetchExams(); // refresh exams so dropdown updates
    } catch (err) {
      toast.error(err?.data?.message || "Error generating seating plan");
    }
  };

  // Filter exams: only show exams that already have a seating plan
  const availableExams =
    examsData?.exams
      ?.filter((exam) => exam.seatingPlans && exam.seatingPlans.length > 0)
      .map((exam) => ({
        id: exam.id,
        name: `${exam.subject?.subjectName || "Unnamed Subject"} (${exam.subject?.code || ""}) - ${exam.date}`,
      })) || [];

  return (
    <div className="mx-auto max-w-[99%] bg-white p-6 rounded-lg shadow-md mt-3">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 underline">
        Generate Seating Plan
      </h2>

      {examsLoading ? (
        <p>Loading exams...</p>
      ) : (
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Select Exam</label>
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={generating || availableExams.length === 0}
              required
            >
              <option value="">-- Select Exam --</option>
              {availableExams.length > 0 ? (
                availableExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))
              ) : (
                <option disabled>No exams available for room assignment</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={generating || availableExams.length === 0}
            className={`w-full p-3 rounded text-white font-semibold transition ${
              generating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {generating ? "Generating..." : "Generate Seating Plan"}
          </button>
        </form>
      )}
    </div>
  );
};

export default GenerateSeatingPlan;
