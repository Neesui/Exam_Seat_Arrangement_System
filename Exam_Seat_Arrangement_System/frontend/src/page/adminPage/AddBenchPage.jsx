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
    <div className="h-screen w-full bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Bench</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Selection */}
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

          {/* Row */}
          <div>
            <label className="block text-sm font-semibold mb-1">Row</label>
            <input
              type="number"
              value={row}
              onChange={(e) => setRow(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter row number"
              required
              min="1"
            />
          </div>

          {/* Column */}
          <div>
            <label className="block text-sm font-semibold mb-1">Column</label>
            <input
              type="number"
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter column number"
              required
              min="1"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-semibold mb-1">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter bench capacity (e.g., 2, 3, 4)"
              required
              min="1"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 rounded text-white font-semibold transition ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isLoading || roomLoading}
          >
            {isLoading ? "Adding..." : "Add Bench"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBenchPage;
 