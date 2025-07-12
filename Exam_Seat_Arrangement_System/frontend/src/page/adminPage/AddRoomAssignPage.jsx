import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddRoomAssignMutation } from "../../redux/api/roomAssignApi";
import { useGetRoomsQuery } from "../../redux/api/roomApi";
import { useGetExamsQuery } from "../../redux/api/examApi";

const AddRoomAssignPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [examId, setExamId] = useState("");

  const [addRoomAssign, { isLoading }] = useAddRoomAssignMutation();
  const { data: roomData, error: roomError, isLoading: roomLoading } = useGetRoomsQuery();
  const { data: examData, error: examError, isLoading: examLoading } = useGetExamsQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addRoomAssign({
        roomId: Number(roomId),
        examId: Number(examId),
      }).unwrap();

      if (result.success) {
        toast.success("Room assigned successfully!");
        navigate("/viewRoomAssign");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to assign room");
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Assign Room to Exam</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Room</label>
            {roomLoading ? (
              <p>Loading rooms...</p>
            ) : roomError ? (
              <p className="text-red-500">Failed to load rooms</p>
            ) : (
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Room</option>
                {roomData?.rooms?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.roomNumber} (Block {room.block || "N/A"}, Floor {room.floor || "N/A"})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Exam</label>
            {examLoading ? (
              <p>Loading exams...</p>
            ) : examError ? (
              <p className="text-red-500">Failed to load exams</p>
            ) : (
              <select
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Exam</option>
                {examData?.exams?.map((exam) => {
                  const subjectName = exam.subject?.name || "No Subject";
                  const semesterName = exam.subject?.semester?.name || "No Semester";
                  const courseName = exam.subject?.semester?.course?.name || "No Course";
                  const formattedDate = new Date(exam.date).toLocaleDateString();

                  return (
                    <option key={exam.id} value={exam.id}>
                      {subjectName} ({courseName} - {semesterName}) on {formattedDate}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          <button
            type="submit"
            className={`w-full p-3 rounded text-white font-semibold transition ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isLoading || roomLoading || examLoading}
          >
            {isLoading ? "Assigning..." : "Assign Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoomAssignPage;
