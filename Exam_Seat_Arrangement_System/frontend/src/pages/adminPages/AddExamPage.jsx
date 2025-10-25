import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAddExamMutation, useGetExamsQuery } from "../../redux/api/examApi";
import { useGetSubjectsQuery } from "../../redux/api/subjectApi";
import Input from "../../component/public/Input";

const AddExamPage = () => {
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Fetch subjects and exams
  const {
    data: subjectData,
    error: subjectError,
    isLoading: subjectLoading,
  } = useGetSubjectsQuery();

  const {
    data: examData,
    error: examError,
    isLoading: examLoading,
    refetch: refetchExams, 
  } = useGetExamsQuery();

  const [addExam, { isLoading: addingExam }] = useAddExamMutation();

  // Show error toast if API fails
  useEffect(() => {
    if (subjectError) toast.error("Failed to load subjects");
    if (examError) toast.error("Failed to load exams");
  }, [subjectError, examError]);

  // Filter available subjects (subjects that don’t have an exam)
  const availableSubjects = subjectData?.data?.filter((subject) => {
    const hasExam = examData?.exams?.some(
      (exam) => exam.subjectId === subject.id
    );
    return !hasExam; // show only those without exam
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectId || !date) {
      toast.error("Subject and Date are required.");
      return;
    }

    const formatDateTime = (time) => {
      if (!time) return null;
      return new Date(`${date}T${time}:00`).toISOString();
    };

    try {
      const response = await addExam({
        subjectId: Number(subjectId),
        date: new Date(date).toISOString(),
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
      }).unwrap();

      if (response?.success) {
        toast.success(response.message || "Exam added successfully!");
        // Clear form
        setSubjectId("");
        setDate("");
        setStartTime("");
        setEndTime("");
        //Refetch exams so dropdown updates immediately
        refetchExams();
      } else {
        toast.error(response?.message || "Failed to add exam");
      }
    } catch (err) {
      const backendMessage =
        err?.data?.message || err?.error || "Error adding exam";
      toast.error(backendMessage);
    }
  };

  return (
    <div className="mx-auto max-w-[99%] bg-white p-6 rounded-lg shadow-md mt-3">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 underline">
        Add New Exam
      </h2>

      {subjectLoading || examLoading ? (
        <p>Loading data...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={addingExam}
            >
              <option value="">Select Subject</option>
              {availableSubjects && availableSubjects.length > 0 ? (
                availableSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectName} ({subject.code})
                  </option>
                ))
              ) : (
                <option disabled>No available subjects to assign exam</option>
              )}
            </select>
          </div>

          {/* Date */}
          <Input
            id="date"
            label="Date"
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={addingExam}
          />

          {/* Start Time */}
          <Input
            id="startTime"
            label="Start Time"
            type="time"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={addingExam}
          />

          {/* End Time */}
          <Input
            id="endTime"
            label="End Time"
            type="time"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={addingExam}
          />

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={addingExam || subjectLoading}
            className={`w-full p-3 rounded text-white font-semibold transition ${
              addingExam
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {addingExam ? "Adding..." : "Add Exam"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddExamPage;
