import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddRoomMutation } from "../../redux/api/roomApi"; 
import Input from "../../component/public/Input";

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
        navigate("/viewRoom"); 
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to add room");
    }
  };

  return (
    <div className="w-[90%] mt-20 p-6 ml-6 bg-white rounded shadow">
      <h2 className="text-2xl text-center font-bold mb-4">Add New Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="roomNumber"
          label="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="Enter Room Number"
          required
          disabled={isLoading}
        />

        <Input
          id="block"
          label="Block"
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          placeholder="Enter Block"
          required
          disabled={isLoading}
        />

        <Input
          id="floor"
          label="Floor"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          placeholder="Enter Floor"
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
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
