import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddExamMutation } from "../../redux/api/examApi";

const AddExamPage = () => {
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();
  const [addExam, { isLoading }] = useAddExamMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId || !date) {
      toast.error("Subject ID and Date are required.");
      return;
    }

    try {
      const res = await addExam({ subjectId, date, startTime, endTime }).unwrap();
      if (res.success) {
        toast.success("Exam added successfully!");
        navigate("/viewExam"); // change as needed
      } else {
        toast.error(res.message || "Failed to add exam");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error adding exam");
    }
  };

  return (
    <div className="w-[90%] mt-20 p-6 ml-6 bg-white rounded shadow">
      <h2 className="text-2xl text-center font-bold mb-4">Add New Exam</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Subject ID</label>
          <input
            type="number"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Subject ID"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Start Time</label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="09:00 AM"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">End Time</label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="12:00 PM"
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Exam"}
        </button>
      </form>
    </div>
  );
};

export default AddExamPage;
