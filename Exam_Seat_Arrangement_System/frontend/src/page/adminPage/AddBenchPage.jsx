import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddBenchMutation } from "../../redux/api/benchApi";
import { useGetRoomsQuery } from "../../redux/api/roomApi";

const AddBenchPage = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [row, setRow] = useState("");
  const [column, setColumn] = useState("");
  const [capacity, setCapacity] = useState("");

  const [addBench, { isLoading }] = useAddBenchMutation();
  const { data: roomData, error: roomError, isLoading: roomLoading } = useGetRoomsQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await addBench({
        roomId: Number(roomId),
        row: Number(row),
        column: Number(column),
        capacity: Number(capacity),
      }).unwrap();

      if (result.success) {
        toast.success("Bench added successfully!");
        navigate("/viewBench");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to add bench");
    }
  };

  return (
    <div className="max-w-lg mt-20 p-6 ml-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Bench</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Room</label>
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
                  {room.roomNumber} (Block {room.block}, Floor {room.floor})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Row</label>
          <input
            type="number"
            value={row}
            onChange={(e) => setRow(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Row Number"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Column</label>
          <input
            type="number"
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Column Number"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Capacity</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Capacity"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={isLoading || roomLoading}
        >
          {isLoading ? "Adding..." : "Add Bench"}
        </button>
      </form>
    </div>
  );
};

export default AddBenchPage;
