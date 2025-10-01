import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllInvigilatorAssignmentsQuery,
  useDeleteInvigilatorAssignMutation,
} from "../../redux/api/invigilatorAssignApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 15;

const ViewAllInvigilatorAssignPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetAllInvigilatorAssignmentsQuery();
  const [deleteAssign, { isLoading: isDeleting }] = useDeleteInvigilatorAssignMutation();

  // Search states
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteAssign(assignmentId).unwrap();
      toast.success("Invigilator assignment deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete assignment.");
    }
  };

  const handleUpdate = (assignmentId) => navigate(`/admin/updateInvigilatorAssign/${assignmentId}`);
  const handleView = (examId) =>
    examId ? navigate(`/admin/viewInvigilatorAssignDetails/${examId}`) : toast.warning("Exam not found");

  const getStatusBadge = (status) => {
    const map = {
      ASSIGNED: "bg-green-100 text-green-700",
      COMPLETED: "bg-blue-100 text-blue-700",
    };
    return (
      <span className={`${map[status] || "bg-gray-100 text-gray-700"} px-2 py-1 text-xs rounded font-semibold`}>
        {status || "Unknown"}
      </span>
    );
  };

  // Use allAssignments from API data
  const assignments = data?.assignments || [];

  // Group by roomAssignmentId and include multiple invigilators
  const groupedAssignments = assignments.reduce((acc, curr) => {
    const roomAssignmentId = curr.roomAssignmentId;

    if (!acc[roomAssignmentId]) {
      acc[roomAssignmentId] = {
        roomAssignmentId,
        examId: curr.roomAssignment?.exam?.id,
        subject: curr.roomAssignment?.exam?.subject?.subjectName || "N/A",
        room: curr.roomAssignment?.room?.roomNumber || "N/A",
        invigilators: [],
      };
    }

    curr.invigilators.forEach((inv) => {
      acc[roomAssignmentId].invigilators.push({
        name: inv.invigilator?.user?.name || "N/A",
        email: inv.invigilator?.user?.email || "N/A",
        assignId: curr.id,
        status: curr.status,
      });
    });

    return acc;
  }, {});

  const groupedList = Object.values(groupedAssignments);

  // Filtered result based on search
  const filteredList = useMemo(() => {
    return groupedList.filter((group) => {
      const invigilatorNames = group.invigilators.map((i) => i.name.toLowerCase()).join(" ");
      const emails = group.invigilators.map((i) => i.email.toLowerCase()).join(" ");
      const room = group.room?.toLowerCase() || "";
      const subject = group.subject?.toLowerCase() || "";

      return (
        invigilatorNames.includes(searchName.toLowerCase()) &&
        emails.includes(searchEmail.toLowerCase()) &&
        room.includes(searchRoom.toLowerCase()) &&
        subject.includes(searchSubject.toLowerCase())
      );
    });
  }, [groupedList, searchName, searchEmail, searchRoom, searchSubject]);

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="w-full px-4 py-6 mt-5 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">All Invigilator Assignments</h2>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SearchBox
          value={searchName}
          onChange={(v) => {
            setSearchName(v);
            setCurrentPage(1);
          }}
          placeholder="Search by Name"
        />
        <SearchBox
          value={searchEmail}
          onChange={(v) => {
            setSearchEmail(v);
            setCurrentPage(1);
          }}
          placeholder="Search by Email"
        />
        <SearchBox
          value={searchRoom}
          onChange={(v) => {
            setSearchRoom(v);
            setCurrentPage(1);
          }}
          placeholder="Search by Room"
        />
        <SearchBox
          value={searchSubject}
          onChange={(v) => {
            setSearchSubject(v);
            setCurrentPage(1);
          }}
          placeholder="Search by Subject"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-center">Loading assignments...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load assignments.</p>
      ) : paginatedList.length === 0 ? (
        <p className="text-center text-gray-500">No invigilator assignments found.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">S.N.</th>
                <th className="border px-4 py-2">Invigilator Names</th>
                <th className="border px-4 py-2">Emails</th>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Room</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((group, index) => (
                <tr key={group.roomAssignmentId}>
                  <td className="border px-4 py-2 text-center">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="border px-4 py-2 whitespace-pre-line text-center">
                    {group.invigilators.map((i) => i.name).join("\n")}
                  </td>
                  <td className="border px-4 py-2 whitespace-pre-line text-center">
                    {group.invigilators.map((i) => i.email).join("\n")}
                  </td>
                  <td className="border px-4 py-2 text-center">{group.subject}</td>
                  <td className="border px-4 py-2 text-center">{group.room}</td>
                  <td className="border px-4 py-2 text-center">
                    {group.invigilators.map((i, idx) => (
                      <div key={idx} className="mb-1">
                        {getStatusBadge(i.status)}
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleUpdate(group.invigilators[0].assignId)}
                      disabled={isDeleting}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(group.invigilators[0].assignId)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => handleView(group.examId)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ViewAllInvigilatorAssignPage;
