import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetRoomsQuery, useUpdateRoomMutation } from "../../redux/api/roomApi";
import { toast } from "react-toastify";

const UpdateRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { data: roomData, isLoading, error } = useGetRoomsQuery();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();

  const [roomNumber, setRoomNumber] = useState("");
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");

  useEffect(() => {
    if (roomData?.rooms) {
      const room = roomData.rooms.find((r) => String(r.id) === String(roomId)); 
      if (room) {
        setRoomNumber(room.roomNumber);
        setBlock(room.block);
        setFloor(room.floor);
      }
    }
  }, [roomData, roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomNumber || !block || !floor) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await updateRoom({ id: Number(roomId), roomNumber, block, floor }).unwrap(); 
      toast.success("Room updated successfully!");
      // navigate("/viewRoom");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.data?.message || "Failed to update room.");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to fetch room data.</p>;

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Block"
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Floor"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateRoomPage;
