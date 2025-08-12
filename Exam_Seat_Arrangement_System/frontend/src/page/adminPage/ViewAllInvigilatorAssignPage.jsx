import React, { useState, useMemo } from "react";
import { useGetAllInvigilatorAssignmentsQuery } from "../../redux/api/invigilatorAssignApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 15;

const ViewAllInvigilatorAssignPage = () => {
  const { data, error, isLoading } = useGetAllInvigilatorAssignmentsQuery();

  // Search states
  const [searchName, setSearchName] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allAssignments = data?.allAssignments || [];

  // Filter assignments based on search inputs
  const filteredAssignments = useMemo(() => {
    return allAssignments.filter((a) => {
      const invigilatorName = a.invigilator?.user?.name?.toLowerCase() || "";
      const roomNumber = a.roomAssignment?.room?.roomNumber?.toLowerCase() || "";
      const subjectName = a.roomAssignment?.exam?.subject?.subjectName?.toLowerCase() || "";
      const status = a.status?.toLowerCase() || "";

      return (
        invigilatorName.includes(searchName.toLowerCase()) &&
        roomNumber.includes(searchRoom.toLowerCase()) &&
        subjectName.includes(searchSubject.toLowerCase()) &&
        status.includes(searchStatus.toLowerCase())
      );
    });
  }, [allAssignments, searchName, searchRoom, searchSubject, searchStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssignments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssignments, currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderTable = () => (
    <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="px-4 py-2 border">S.N</th>
          <th className="px-4 py-2 border">Invigilator</th>
          <th className="px-4 py-2 border">Room</th>
          <th className="px-4 py-2 border">Exam</th>
          <th className="px-4 py-2 border">Status</th>
          <th className="px-4 py-2 border">Assigned At</th>
        </tr>
      </thead>
      <tbody>
        {paginatedAssignments.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-4">
              No data available
            </td>
          </tr>
        ) : (
          paginatedAssignments.map((a) => (
            <tr key={a.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{a.id}</td>
              <td className="px-4 py-2 border">{a.invigilator?.user?.name || "N/A"}</td>
              <td className="px-4 py-2 border">{a.roomAssignment?.room?.roomNumber || "N/A"}</td>
              <td className="px-4 py-2 border">{a.roomAssignment?.exam?.subject?.subjectName || "N/A"}</td>
              <td className="px-4 py-2 border">{a.status}</td>
              <td className="px-4 py-2 border">
                {a.assignedAt ? new Date(a.assignedAt).toLocaleString() : "N/A"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6">All Invigilator Assignments</h1>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SearchBox
          value={searchName}
          onChange={(v) => {
            setSearchName(v);
            setCurrentPage(1);
          }}
          placeholder="Search by Invigilator Name"
        />
        <SearchBox
          value={searchRoom}
          onChange={(v) => {
            setSearchRoom(v);
            setCurrentPage(1);
          }}
          placeholder="Search by Room Number"
        />
        <SearchBox
          value={searchSubject}
          onChange={(v) => {
            setSearchSubject(v);
            setCurrentPage(1);
          }}
          placeholder="Search by Exam Subject"
        />
        <SearchBox
          value={searchStatus}
          onChange={(v) => {
            setSearchStatus(v);
            setCurrentPage(1);
          }}
          placeholder="Search by Status"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load assignments</p>
      ) : (
        <>
          {renderTable()}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ViewAllInvigilatorAssignPage;
