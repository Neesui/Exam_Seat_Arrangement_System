import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetExamsQuery, useDeleteExamMutation } from "../../redux/api/examApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 15;

const ViewExamPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetExamsQuery();
  const [deleteExam] = useDeleteExamMutation();

  const [subjectSearch, setSubjectSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await deleteExam(Number(examId)).unwrap();
      toast.success("Exam deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete exam.");
    }
  };

  const handleUpdate = (examId) => {
    navigate(`/admin/updateExam/${examId}`);
  };

  const handleView = (examId) => {
    navigate(`/admin/viewExamDetails/${examId}`);
  };

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return "-";
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredExams = useMemo(() => {
    if (!data?.exams) return [];
    return data.exams.filter((exam) =>
      exam.subject?.subjectName.toLowerCase().includes(subjectSearch.toLowerCase())
    );
  }, [data, subjectSearch]);

  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 py-10">
      <div className="w-full bg-white p-8 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">View Exams</h2>

        {/* Search */}
        <div className="mb-6 w-full flex justify-start">
          <SearchBox
            value={subjectSearch}
            onChange={(val) => {
              setSubjectSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search by Subject Name"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <p>Loading exams...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load exams.</p>
        ) : filteredExams.length === 0 ? (
          <p className="text-center text-gray-600">No exams found.</p>
        ) : (
          <>
            <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">S.N.</th>
                  <th className="border border-gray-300 px-4 py-2">Subject</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Start Time</th>
                  <th className="border border-gray-300 px-4 py-2">End Time</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExams.map((exam, index) => (
                  <tr key={exam.id} className="text-center">
                    <td className="border px-4 py-2">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="border px-4 py-2">{exam.subject?.subjectName || "N/A"}</td>
                    <td className="border px-4 py-2">{exam.date?.split("T")[0]}</td>
                    <td className="border px-4 py-2">{formatTime(exam.startTime)}</td>
                    <td className="border px-4 py-2">{formatTime(exam.endTime)}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleUpdate(exam.id)}
                      >
                        Update
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(exam.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleView(exam.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
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

export default ViewExamPage;
