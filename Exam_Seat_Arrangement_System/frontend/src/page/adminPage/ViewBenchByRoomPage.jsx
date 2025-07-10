import React from "react";
import { useParams } from "react-router-dom";
import { useGetBenchesByRoomQuery } from "../../redux/api/benchApi";
import { useGetRoomByIdQuery } from "../../redux/api/roomApi";
import BenchLayout from "../../layout/BenchLayout";

const ViewBenchByRoomPage = () => {
  const { roomId } = useParams();

  const { data: benchesData, error: benchesError, isLoading: benchesLoading } = useGetBenchesByRoomQuery(Number(roomId));
  const { data: roomData, error: roomError, isLoading: roomLoading } = useGetRoomByIdQuery(Number(roomId));

  return (
    <div className="mt-20 bg-white p-6 rounded-lg shadow-md w-full max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">View Benches by Room</h2>

      {/* Room Details */}
      {roomLoading ? (
        <p>Loading room details...</p>
      ) : roomError ? (
        <p className="text-red-500">Failed to load room details.</p>
      ) : roomData ? (
        <div className="mb-4 text-gray-700">
          <strong>Room Number:</strong> {roomData.room.roomNumber} &nbsp; | &nbsp;
          <strong>Block:</strong> {roomData.room.block} &nbsp; | &nbsp;
          <strong>Floor:</strong> {roomData.room.floor} &nbsp; | &nbsp;
          <strong>Max Columns:</strong> {roomData.room.maxColumns}
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
