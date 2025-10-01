import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetBenchesQuery,
  useUpdateBenchMutation,
} from "../../redux/api/benchApi";
import { useGetRoomsQuery } from "../../redux/api/roomApi";

const UpdateBenchPage = () => {
  const { benchId } = useParams();
  const navigate = useNavigate();

  const { data: benchesData, isLoading: benchLoading, error: benchError } = useGetBenchesQuery();
  const [updateBench, { isLoading: isUpdating }] = useUpdateBenchMutation();
  const { data: roomData, error: roomError, isLoading: roomLoading } = useGetRoomsQuery();

  const [roomId, setRoomId] = useState("");
  const [row, setRow] = useState("");
  const [column, setColumn] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (benchesData?.benches) {
      const bench = benchesData.benches.find((b) => String(b.id) === String(benchId));
      if (bench) {
        setRoomId(bench.roomId);
        setRow(bench.row);
        setColumn(bench.column);
        setCapacity(bench.capacity);
      }
    }
  }, [benchesData, benchId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateBench({
        id: Number(benchId),
        roomId: Number(roomId),
        row: Number(row),
        column: Number(column),
        capacity: Number(capacity),
      }).unwrap();

      if (result.success) {
        toast.success("Bench updated successfully!");
        navigate(`/viewBenchByRoom/${roomId}`);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update bench");
    }
  };

  if (benchLoading || roomLoading) return <p className="text-center mt-10">Loading...</p>;
  if (benchError || roomError) return <p className="text-center mt-10 text-red-500">Failed to load data.</p>;

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Update Bench</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">Room</label>
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
              isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Bench"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBenchPage;
