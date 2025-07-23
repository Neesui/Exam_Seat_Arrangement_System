import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddExamMutation } from "../../redux/api/examApi";
import { useGetSubjectsQuery } from "../../redux/api/subjectApi";
import Input from "../../component/public/Input";

const AddExamPage = () => {
  const navigate = useNavigate();

  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [addExam, { isLoading }] = useAddExamMutation();
  const {
    data: subjectData,
    error: subjectError,
    isLoading: subjectLoading,
  } = useGetSubjectsQuery();

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
      const result = await addExam({
        subjectId: Number(subjectId),
        date: new Date(date).toISOString(),
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
      }).unwrap();

      if (result.success) {
        toast.success("Exam added successfully!");
        // navigate("/viewExam");
      } else {
        toast.error(result.message || "Failed to add exam");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Error adding exam");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 py-10 flex flex-col justify-center">
      <div className="w-full bg-white p-10 rounded-lg shadow-xl max-w-screen-lg mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Add New Exam
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">Subject</label>
            {subjectLoading ? (
              <p>Loading subjects...</p>
            ) : subjectError ? (
              <p className="text-red-500">Failed to load subjects</p>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={isLoading}
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
          <Input
            id="date"
            label="Date"
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isLoading}
          />

          {/* Start Time */}
          <Input
            id="startTime"
            label="Start Time"
            type="time"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isLoading}
          />

          {/* End Time */}
          <Input
            id="endTime"
            label="End Time"
            type="time"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isLoading}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 rounded text-white font-semibold transition ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading || subjectLoading}
          >
            {isLoading ? "Adding..." : "Add Exam"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExamPage;
