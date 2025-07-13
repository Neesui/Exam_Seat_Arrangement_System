import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetExamByIdQuery, useUpdateExamMutation } from "../../redux/api/examApi";
import { useGetSubjectsQuery } from "../../redux/api/subjectApi";

const UpdateExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const { data: examData, isLoading: isExamLoading, error: examError } = useGetExamByIdQuery(Number(examId));
  const {
    data: subjectData,
    isLoading: isSubjectsLoading,
    error: subjectError,
  } = useGetSubjectsQuery();

  const [updateExam, { isLoading: isUpdating }] = useUpdateExamMutation();

  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (examData?.exam) {
      const { subjectId, date, startTime, endTime } = examData.exam;
      setSubjectId(subjectId.toString());
      setDate(date?.split("T")[0] || "");

      // Convert to HH:MM format
      const toTimeOnly = (dateTimeStr) => {
        if (!dateTimeStr) return "";
        const d = new Date(dateTimeStr);
        return d.toISOString().substr(11, 5); // HH:MM
      };

      setStartTime(toTimeOnly(startTime));
      setEndTime(toTimeOnly(endTime));
    }
  }, [examData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectId || !date) {
      toast.error("Subject and Date are required.");
      return;
    }

    const toDateTime = (timeStr) => {
      return timeStr ? new Date(`${date}T${timeStr}:00`).toISOString() : null;
    };

    try {
      await updateExam({
        id: Number(examId),
        subjectId: Number(subjectId),
        date: new Date(date).toISOString(),
        startTime: toDateTime(startTime),
        endTime: toDateTime(endTime),
      }).unwrap();

      toast.success("Exam updated successfully!");
      navigate("/viewExam");
    } catch (error) {
      console.error("Update Exam Error:", error);
      toast.error(error?.data?.message || "Failed to update exam.");
    }
  };

  if (isExamLoading) return <p className="text-center mt-10">Loading exam data...</p>;
  if (examError) return <p className="text-center mt-10 text-red-500">Failed to load exam data.</p>;

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Exam</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Select */}
        <div>
          <label className="block mb-1 font-semibold">Subject</label>
          {isSubjectsLoading ? (
            <p>Loading subjects...</p>
          ) : subjectError ? (
            <p className="text-red-500">Failed to load subjects</p>
          ) : (
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Subject</option>
              {subjectData?.data?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName} ({subject.code})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block mb-1 font-semibold">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block mb-1 font-semibold">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Exam"}
        </button>
      </form>
    </div>
  );
};

export default UpdateExamPage;
