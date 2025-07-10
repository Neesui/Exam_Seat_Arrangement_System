import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddRoomMutation } from "../../redux/api/roomApi"; // adjust path as needed

const AddRoomPage = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const navigate = useNavigate();

  const [addRoom, { isLoading }] = useAddRoomMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomNumber || !block || !floor) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await addRoom({ roomNumber, block, floor }).unwrap();

      if (result.success) {
        toast.success("Room added successfully!");
        navigate("/viewRoom"); // Change this to your room list route
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to add room");
    }
  };

  return (
    <div className="max-w-lg mt-20 p-6 ml-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Room Number</label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Room Number"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Block</label>
          <input
            type="text"
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Block"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Floor</label>
          <input
            type="text"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Floor"
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoomPage;
