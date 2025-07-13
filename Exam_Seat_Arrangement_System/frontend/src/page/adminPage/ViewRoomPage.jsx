import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetRoomsQuery, useDeleteRoomMutation } from '../../redux/api/roomApi';

const ViewRoomPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetRoomsQuery();
  const [deleteRoom] = useDeleteRoomMutation();

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(Number(roomId)).unwrap();
      toast.success('Room deleted successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete room.');
    }
  };

  const handleUpdate = (roomId) => {
    navigate(`/updateRoom/${roomId}`);
  };

  const handleViewBenches = (roomId) => {
    navigate(`/viewBenchByRoom/${roomId}`);
  };

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md w-[99%] max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">View Rooms</h2>

      {isLoading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load rooms.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">S.N.</th>
              <th className="border border-gray-300 px-4 py-2">Room Number</th>
              <th className="border border-gray-300 px-4 py-2">Block</th>
              <th className="border border-gray-300 px-4 py-2">Floor</th>
              <th className="border border-gray-300 px-4 py-2">Total Benches</th>
              <th className="border border-gray-300 px-4 py-2">Total Capacity</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.rooms?.length > 0 ? (
              data.rooms.map((room, index) => (
                <tr key={room.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{room.roomNumber}</td>
                  <td className="border px-4 py-2">{room.block}</td>
                  <td className="border px-4 py-2">{room.floor}</td>
                  <td className="border px-4 py-2">{room.benches?.length || 0}</td>
                  <td className="border px-4 py-2">{room.capacity || 0}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleUpdate(room.id)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 mr-2"
                      onClick={() => handleDelete(room.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleViewBenches(room.id)}
                    >
                      View Benches
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border px-4 py-2 text-center">
                  No rooms available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewRoomPage;
