import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddBenchMutation } from "../../redux/api/benchApi";
import { useGetRoomsQuery } from "../../redux/api/roomApi";
import Input from "../../component/public/Input";
import Select from "../../component/public/Select";

const AddBenchPage = () => {
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams();

  const [roomId, setRoomId] = useState(roomIdParam || "");
  const [row, setRow] = useState("");
  const [column, setColumn] = useState("");
  const [capacity, setCapacity] = useState("");

  const [addBench, { isLoading }] = useAddBenchMutation();
  const {
    data: roomData,
    error: roomError,
    isLoading: roomLoading,
  } = useGetRoomsQuery();

  useEffect(() => {
    if (roomIdParam) {
      setRoomId(roomIdParam);
    }
  }, [roomIdParam]);

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
        // navigate(`/viewBenchByRoom/${roomId}`);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add bench");
    }
  };

  return (
    <div className="mx-auto  max-w-[99%]  bg-white p-6 rounded-lg shadow-md mt-3">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 underline">Add New Bench</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-1">Room</label>
            {roomLoading ? (
              <p>Loading rooms...</p>
            ) : roomError ? (
              <p className="text-red-500">Failed to load rooms</p>
            ) : (
              <Select
                id="room"
                label=""
                name="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                options={
                  roomData?.rooms?.map((room) => ({
                    value: room.id,
                    label: `${room.roomNumber} (Block ${room.block || "N/A"}, Floor ${room.floor || "N/A"})`,
                  })) || []
                }
                required
              />
            )}
          </div>

          {/* Row Input */}
          <Input
            id="row"
            label="Row"
            type="number"
            name="row"
            value={row}
            onChange={(e) => setRow(e.target.value)}
            placeholder="Enter row number"
            required
          />

          {/* Column Input */}
          <Input
            id="column"
            label="Column"
            type="number"
            name="column"
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            placeholder="Enter column number"
            required
          />

          {/* Capacity Input */}
          <Input
            id="capacity"
            label="Capacity"
            type="number"
            name="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Enter bench capacity (e.g., 2, 3, 4)"
            required
          />

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
  );
};

export default AddBenchPage;
