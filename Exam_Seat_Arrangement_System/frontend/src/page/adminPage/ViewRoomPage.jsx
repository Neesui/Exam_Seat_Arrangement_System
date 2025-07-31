import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetRoomsQuery, useDeleteRoomMutation } from "../../redux/api/roomApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 15;

const ViewRoomPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetRoomsQuery();
  const [deleteRoom] = useDeleteRoomMutation();

  const [roomSearch, setRoomSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteRoom(Number(roomId)).unwrap();
      toast.success("Room deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete room.");
    }
  };

  const handleUpdate = (roomId) => {
    navigate(`/updateRoom/${roomId}`);
  };

  const handleViewBenches = (roomId) => {
    navigate(`/viewBenchByRoom/${roomId}`);
  };

  const filteredRooms = useMemo(() => {
    if (!data?.rooms) return [];
    return data.rooms.filter((room) =>
      room.roomNumber.toLowerCase().includes(roomSearch.toLowerCase())
    );
  }, [data, roomSearch]);

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen w-full mt-5 bg-gray-100 py-12 px-2 overflow-auto">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">All Rooms</h2>

        {/* Search */}
        <div className="mb-6 w-full flex justify-start">
          <SearchBox
            value={roomSearch}
            onChange={(val) => {
              setRoomSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search by Room Number"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-center">Loading rooms...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Failed to load rooms.</p>
        ) : filteredRooms.length === 0 ? (
          <p className="text-center text-gray-600">No rooms found.</p>
        ) : (
          <>
            <table className="w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2">S.N</th>
                  <th className="border px-2 py-2">Room Number</th>
                  <th className="border px-2 py-2">Block</th>
                  <th className="border px-2 py-2">Floor</th>
                  <th className="border px-2 py-2">Total Benches</th>
                  <th className="border px-2 py-2">Capacity</th>
                  <th className="border px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRooms.map((room, idx) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-2">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td className="border px-2 py-2">{room.roomNumber}</td>
                    <td className="border px-2 py-2">{room.block}</td>
                    <td className="border px-2 py-2">{room.floor}</td>
                    <td className="border px-2 py-2">{room.benches?.length || 0}</td>
                    <td className="border px-2 py-2">{room.capacity || 0}</td>
                    <td className="border px-2 py-2 space-x-2">
                      <button
                        onClick={() => handleUpdate(room.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewBenches(room.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        View Benches
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewRoomPage;
