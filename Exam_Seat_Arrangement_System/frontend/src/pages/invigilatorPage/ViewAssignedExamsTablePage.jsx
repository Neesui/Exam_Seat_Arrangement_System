import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useGetExamsForInvigilatorQuery } from "../../redux/api/examApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 10;

const ViewAssignedExamsTablePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetExamsForInvigilatorQuery();
  const exams = data?.exams || [];

  const [searchSubject, setSearchSubject] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const subjectMatch =
        searchSubject === "" ||
        exam.subject.subjectName.toLowerCase().includes(searchSubject.toLowerCase());
      const courseMatch =
        searchCourse === "" ||
        exam.subject.semester.course.name.toLowerCase().includes(searchCourse.toLowerCase());
      return subjectMatch && courseMatch;
    });
  }, [exams, searchSubject, searchCourse]);

  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleViewDetails = (examId) => {
    navigate(`/invigilator/viewExamDetails/${examId}`);
  };

  const getStatusBadge = (isActive) => {
    const colorClass = isActive
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"; 
    return (
      <span className={`${colorClass} px-2 py-1 text-xs rounded font-semibold`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="ml-2 mt-5 bg-white p-2 rounded-lg shadow-md max-w-[98%] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Assigned Exams</h2>

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
          value={searchCourse}
          onChange={(val) => {
            setSearchCourse(val);
            setCurrentPage(1);
          }}
          placeholder="Search by course"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading exams...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load exams.</p>
      ) : paginatedExams.length === 0 ? (
        <p className="text-center text-gray-600">No exams found.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-300 px-4 py-2">S.N.</th>
                <th className="border border-gray-300 px-4 py-2">Subject</th>
                <th className="border border-gray-300 px-4 py-2">Course</th>
                <th className="border border-gray-300 px-4 py-2">Exam Date</th>
                <th className="border border-gray-300 px-4 py-2">Start Time</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExams.map((exam, idx) => (
                <tr key={exam.id} className="hover:bg-gray-50 text-center">
                  <td className="border px-4 py-2">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td className="border px-4 py-2">{exam.subject.subjectName}</td>
                  <td className="border px-4 py-2">{exam.subject.semester.course.name}</td>
                  <td className="border px-4 py-2">{new Date(exam.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">
                    {exam.startTime
                      ? new Date(exam.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewDetails(exam.id)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
        </>
      )}
    </div>
  );
};

export default ViewAssignedExamsTablePage;
