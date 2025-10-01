import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllRoomAssignmentsQuery,
  useDeleteRoomAssignMutation,
} from "../../redux/api/roomAssignApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 15;

const ViewRoomAssignPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetAllRoomAssignmentsQuery();
  const [deleteRoomAssign, { isLoading: isDeleting }] = useDeleteRoomAssignMutation();

  // Separate search states
  const [searchRoom, setSearchRoom] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const assignments = data?.assignments || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const colorMap = {
      ACTIVE: "bg-green-100 text-green-700",
      COMPLETED: "bg-blue-100 text-blue-700",
      CANCELED: "bg-red-100 text-red-700",
    };
    return (
      <span className={`${colorMap[status] || "bg-gray-100 text-gray-700"} px-2 py-1 text-xs rounded font-semibold`}>
        {status}
      </span>
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room assignment?")) return;
    try {
      await deleteRoomAssign(id).unwrap();
      toast.success("Room assignment deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete room assignment.");
    }
  };

  const handleUpdate = (id) => navigate(`/admin/updateRoomAssign/${id}`);
  const handleView = (examId) => navigate(`/admin/viewRoomAssignDetails/${examId}`);

  // Filtered based on 3 search fields
  const filteredAssignments = useMemo(() => {
    return assignments.filter((assign) => {
      const room = assign.room?.roomNumber?.toLowerCase() || "";
      const subject = assign.exam?.subject?.subjectName?.toLowerCase() || "";
      const date = assign.exam?.startTime
        ? new Date(assign.exam.startTime).toLocaleDateString().toLowerCase()
        : "";

      return (
        room.includes(searchRoom.toLowerCase()) &&
        subject.includes(searchSubject.toLowerCase()) &&
        date.includes(searchDate.toLowerCase())
      );
    });
  }, [assignments, searchRoom, searchSubject, searchDate]);

  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssignments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssignments, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="bg-white p-6 mt-5 rounded-lg shadow-md w-full max-w-full overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Room Assignments</h2>

      {/* Search Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
        <SearchBox
          value={searchRoom}
          onChange={(val) => {
            setSearchRoom(val);
            setCurrentPage(1);
          }}
          placeholder="Search by Room Number"
        />
        <SearchBox
          value={searchSubject}
          onChange={(val) => {
            setSearchSubject(val);
            setCurrentPage(1);
          }}
          placeholder="Search by Subject"
        />
        <SearchBox
          value={searchDate}
          onChange={(val) => {
            setSearchDate(val);
            setCurrentPage(1);
          }}
          placeholder="Search by Date (e.g., 2025)"
        />
      </div>

      {isLoading ? (
        <p>Loading room assignments....</p>
      ) : error ? (
        <p className="text-red-500">Failed to load room assignments.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">S.N.</th>
                <th className="border border-gray-300 px-4 py-2">Room Number</th>
                <th className="border border-gray-300 px-4 py-2">Block</th>
                <th className="border border-gray-300 px-4 py-2">Floor</th>
                <th className="border border-gray-300 px-4 py-2">Subject</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssignments.length > 0 ? (
                paginatedAssignments.map((assign, index) => (
                  <tr key={assign.id}>
                    <td className="border px-4 py-2 text-center">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="border px-4 py-2 text-center">{assign.room?.roomNumber || "N/A"}</td>
                    <td className="border px-4 py-2 text-center">{assign.room?.block || "-"}</td>
                    <td className="border px-4 py-2 text-center">{assign.room?.floor || "-"}</td>
                    <td className="border px-4 py-2 text-center">{assign.exam?.subject?.subjectName || "N/A"}</td>
                    <td className="border px-4 py-2 text-center">{formatDate(assign.exam?.startTime)}</td>
                    <td className="border px-4 py-2 text-center">{getStatusBadge(assign.status)}</td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleUpdate(assign.id)}
                        disabled={isDeleting}
                      >
                        Update
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(assign.id)}
                        disabled={isDeleting}
                      >
                        Delete
                      </button>
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => handleView(assign.exam?.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="border px-4 py-4 text-center text-gray-500">
                    No room assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ViewRoomAssignPage;
