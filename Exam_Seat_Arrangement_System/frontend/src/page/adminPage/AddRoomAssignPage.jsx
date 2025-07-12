import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddRoomAssignMutation } from "../../redux/api/roomAssignApi";
import { useGetRoomsQuery } from "../../redux/api/roomApi";
import { useGetExamsQuery } from "../../redux/api/examApi"; // Assuming you have examApi

const AddRoomAssignPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [examId, setExamId] = useState("");

  const [addRoomAssign, { isLoading }] = useAddRoomAssignMutation();
  const { data: roomData, isLoading: roomLoading } = useGetRoomsQuery();
  const { data: examData, isLoading: examLoading } = useGetExamsQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addRoomAssign({ roomId: Number(roomId), examId: Number(examId) }).unwrap();
      toast.success("Room assigned to exam successfully!");
      navigate("/viewRoomAssign");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to assign room");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl mb-4">Assign Room to Exam</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Room:</label>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
            <option value="">Select Room</option>
            {roomData?.rooms?.map((room) => (
              <option key={room.id} value={room.id}>{room.roomNumber}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Exam:</label>
          <select value={examId} onChange={(e) => setExamId(e.target.value)} required>
            <option value="">Select Exam</option>
            {examData?.exams?.map((exam) => (
              <option key={exam.id} value={exam.id}>{exam.name}</option>
            ))}
          </select>
        </div>
        <button disabled={isLoading} className="bg-green-600 text-white p-2 rounded">
          {isLoading ? "Assigning..." : "Assign Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoomAssignPage;