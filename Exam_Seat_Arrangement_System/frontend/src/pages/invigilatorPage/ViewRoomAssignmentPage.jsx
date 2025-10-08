import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useGetInvigilatorRoomAssignmentsQuery } from "../../redux/api/roomAssignApi";
import Pagination from "../../component/public/Pagination";
import SearchBox from "../../component/public/SearchBox";

const ITEMS_PER_PAGE = 10;

const ViewRoomAssignmentPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetInvigilatorRoomAssignmentsQuery();
  const assignments = data?.assignments || [];

  const [searchSubject, setSearchSubject] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const subjectMatch =
        searchSubject === "" ||
        assignment.subject?.toLowerCase().includes(searchSubject.toLowerCase());
      const roomMatch =
        searchRoom === "" ||
        assignment.roomNumber?.toLowerCase().includes(searchRoom.toLowerCase());
      return subjectMatch && roomMatch;
    });
  }, [assignments, searchSubject, searchRoom]);

  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    let colorClass = "";
    switch (status?.toLowerCase()) {
      case "active":
        colorClass = "bg-green-100 text-green-700";
        break;
      case "completed":
        colorClass = "bg-blue-100 text-blue-700";
        break;
      default:
        colorClass = "bg-gray-100 text-gray-700";
    }
    return (
      <span className={`${colorClass} px-2 py-1 text-xs rounded font-semibold`}>
        {status}
      </span>
    );
  };

  if (isLoading)
    return <p className="text-center mt-20 text-lg">Loading room assignments...</p>;

  if (isError)
    return (
      <p className="text-center mt-20 text-lg text-red-500">
        Failed to load assignments
      </p>
    );

  if (assignments.length === 0)
    return <p className="text-center mt-20 text-lg">No room assignments assigned.</p>;

  return (
    <div className="ml-2 mt-5 bg-white p-4 rounded-lg shadow-md max-w-[98%] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        My Room Assignments
      </h2>

      {/* Search Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox
          value={searchSubject}
          onChange={(val) => {
            setSearchSubject(val);
            setCurrentPage(1);
          }}
          placeholder="Search by subject"
        />
        <SearchBox
          value={searchRoom}
          onChange={(val) => {
            setSearchRoom(val);
            setCurrentPage(1);
          }}
          placeholder="Search by room number"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-gray-300 px-4 py-2">S.N.</th>
              <th className="border border-gray-300 px-4 py-2">Room No</th>
              <th className="border border-gray-300 px-4 py-2">Block</th>
              <th className="border border-gray-300 px-4 py-2">Floor</th>
              <th className="border border-gray-300 px-4 py-2">Subject</th>
              <th className="border border-gray-300 px-4 py-2">Exam Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAssignments.map((assignment, index) => (
              <tr
                key={assignment.id || index}
                className="hover:bg-gray-50 text-center transition"
              >
                <td className="border px-4 py-2">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="border px-4 py-2">{assignment.roomNumber}</td>
                <td className="border px-4 py-2">{assignment.block}</td>
                <td className="border px-4 py-2">{assignment.floor}</td>
                <td className="border px-4 py-2">{assignment.subject}</td>
                <td className="border px-4 py-2">{assignment.examDate}</td>
                <td className="border px-4 py-2">
                  {getStatusBadge(assignment.assignmentStatus)}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/invigilator/viewRoomAssignDetails/${assignment.examId}`
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <FaEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={changePage}
      />
    </div>
  );
};

export default ViewRoomAssignmentPage;
