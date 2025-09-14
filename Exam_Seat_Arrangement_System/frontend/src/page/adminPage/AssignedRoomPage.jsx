import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGenerateRoomAssignmentsMutation } from "../../redux/api/roomAssignApi";
import { useGetExamsQuery } from "../../redux/api/examApi";

const AssignedRoomPage = () => {
  const {
    data: examsData,
    error: examsError,
    isLoading: examsLoading,
  } = useGetExamsQuery();

  const [selectedExam, setSelectedExam] = useState("");

  const [generateAssignments, { isLoading: generating }] =
    useGenerateRoomAssignmentsMutation();

  useEffect(() => {
    if (examsError) {
      toast.error("Failed to load exams");
    }
  }, [examsError]);

  const handleGenerate = async () => {
    if (!selectedExam) {
      toast.error("Please select an exam first");
      return;
    }
    try {
      // Pass examId inside an object to match API expectations
      await generateAssignments({ examId: Number(selectedExam) }).unwrap();
      toast.success("Room assignments generated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate room assignments");
    }
  };

  const filteredExams = examsData?.exams?.filter((exam) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return new Date(exam.date) >= new Date(today);
  });

  return (
    <div className="mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-md mt-3">
      <h1 className="text-2xl font-bold mb-5 underline">Assigned Rooms</h1>

      {examsLoading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="mb-4">
          <select
            className="px-4 py-2 border rounded w-full"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="" disabled>
              Select Exam
            </option>
            {filteredExams?.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.subject?.subjectName || `Exam ID: ${exam.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <button
          onClick={handleGenerate}
          disabled={generating || !selectedExam}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {generating ? "Generating..." : "Generate Room Assignments"}
        </button>
      </div>
    </div>
  );
};

export default AssignedRoomPage;
