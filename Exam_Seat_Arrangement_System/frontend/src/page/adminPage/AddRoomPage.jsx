import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddRoomPage = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomNumber || !block || !floor) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // You can replace the hard-coded token with your auth context / Redux auth state
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:3000/api/room",
        { roomNumber, block, floor },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success("Room added successfully!");
        navigate("/rooms"); // Change path as per your routing
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add room");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
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
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoomPage;
