import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGenerateRoomAssignmentsMutation } from "../../redux/api/roomAssignApi";
import { useGetExamsQuery } from "../../redux/api/examApi";
import { useGetAllRoomAssignmentsQuery } from "../../redux/api/roomAssignApi"; // ✅ Import API for assignments

const AssignedRoomPage = () => {
  const {
    data: examsData,
    error: examsError,
    isLoading: examsLoading,
  } = useGetExamsQuery();

  const {
    data: roomAssignmentsData,
    isLoading: assignmentsLoading,
    refetch: refetchAssignments,
  } = useGetAllRoomAssignmentsQuery(); // ✅ Get all room assignments

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
      const response = await generateAssignments({ examId: Number(selectedExam) }).unwrap();

      // ✅ Show backend success message dynamically
      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("Room assignments generated successfully");
      }

      // ✅ Refresh the assignment data so the dropdown updates immediately
      refetchAssignments();
      setSelectedExam(""); // clear the selection after assignment

    } catch (err) {
      // ✅ Show backend error message dynamically
      const backendMessage =
        err?.data?.message ||
        err?.error ||
        "Failed to generate room assignments";
      toast.error(backendMessage);
    }
  };

  // ✅ Filter exams that are upcoming
  const today = new Date().setHours(0, 0, 0, 0);
  const upcomingExams = examsData?.exams?.filter(
    (exam) => new Date(exam.date) >= new Date(today)
  );

  // ✅ Get exam IDs that already have ACTIVE room assignments
  const assignedExamIds =
    roomAssignmentsData?.assignments
      ?.filter((a) => a.status === "ACTIVE")
      ?.map((a) => a.examId) || [];

  // ✅ Filter exams that do not have active room assignments
  const availableExams = upcomingExams?.filter(
    (exam) => !assignedExamIds.includes(exam.id)
  );

  return (
    <div className="mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-md mt-3">
      <h1 className="text-2xl font-bold mb-5 underline">Assigned Rooms</h1>

      {examsLoading || assignmentsLoading ? (
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

            {availableExams?.length > 0 ? (
              availableExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.subject?.subjectName || `Exam ID: ${exam.id}`}
                </option>
              ))
            ) : (
              <option disabled>No available exams to assign</option>
            )}
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
