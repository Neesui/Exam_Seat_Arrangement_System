import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBenchesByRoomQuery } from "../../redux/api/benchApi";
import { useGetRoomByIdQuery } from "../../redux/api/roomApi";
import BenchLayout from "../../layout/BenchLayout";
import { FaArrowLeft } from "react-icons/fa";

const ViewBenchByRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const {
    data: benchesData,
    error: benchesError,
    isLoading: benchesLoading,
  } = useGetBenchesByRoomQuery(Number(roomId));

  const {
    data: roomData,
    error: roomError,
    isLoading: roomLoading,
  } = useGetRoomByIdQuery(Number(roomId));

  return (
    <div className="mt-20 bg-white p-6 rounded-lg shadow-md w-full max-w-screen-lg mx-auto">
      {/* Header with Back Button and Centered Title */}
      <div className="relative mb-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h2 className="text-3xl font-bold text-center underline text-gray-800">
          View Benches by Room
        </h2>
      </div>

      {/* Room Details */}
      {roomLoading ? (
        <p>Loading room details...</p>
      ) : roomError ? (
        <p className="text-red-500">Failed to load room details.</p>
      ) : roomData ? (
        <div className="mb-4 text-gray-700 flex justify-center text-center">
          <div>
            <strong>Room Number: </strong> {roomData.room.roomNumber} &nbsp; | &nbsp;
            <strong>Block:</strong> {roomData.room.block} &nbsp; | &nbsp;
            <strong>Floor:</strong> {roomData.room.floor} &nbsp; | &nbsp;
            <strong>Max Columns:</strong> {roomData.room.maxColumns}
          </div>
        </div>
      ) : null}

      {/* Bench Layout */}
      {benchesLoading ? (
        <p>Loading benches...</p>
      ) : benchesError ? (
        <p className="text-red-500">Failed to load benches.</p>
      ) : benchesData?.benches?.length > 0 ? (
        <div className="flex justify-center">
          <BenchLayout benches={benchesData.benches} />
        </div>
      ) : (
        <p>No benches found for this room.</p>
      )}
    </div>
  );
};

export default ViewBenchByRoomPage;
