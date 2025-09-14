import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllStudentsQuery,
  useDeleteStudentMutation,
} from "../../redux/api/studentApi";
import SearchBox from "../../component/public/SearchBox";
import SelectFilter from "../../component/public/SelectFilter";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 15;

const ViewStudentPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAllStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const [collegeSearch, setCollegeSearch] = useState("");
  const [symbolSearch, setSymbolSearch] = useState("");
  const [searchType, setSearchType] = useState(""); // 
  const [filterSemester, setFilterSemester] = useState(null); // store as number
  const [currentPage, setCurrentPage] = useState(1);

  const semesters = useMemo(() => {
    if (!data?.students) return [];
    const unique = new Map();
    data.students.forEach((s) => {
      if (s.semester?.id && !unique.has(s.semester.id)) {
        unique.set(s.semester.id, s.semester.semesterNum);
      }
    });
    return Array.from(unique.entries())
      .map(([id, semesterNum]) => ({
        value: id, // keep numeric ID
        label: `Semester ${semesterNum}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(studentId).unwrap();
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete student.");
    }
  };

  const handleEdit = (studentId) => {
    navigate(`/updateStudent/${studentId}`);
  };

  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];

    return data.students.filter((student) => {
      const matchesSemester = filterSemester
        ? student.semester?.id === filterSemester // compare as number
        : true;

      if (searchType === "college") {
        return (
          student.college.toLowerCase().includes(collegeSearch.toLowerCase()) &&
          matchesSemester
        );
      }

      if (searchType === "symbol") {
        return (
          student.symbolNumber.toLowerCase().includes(symbolSearch.toLowerCase()) &&
          matchesSemester
        );
      }

      // Default case (no filtering)
      return matchesSemester;
    });
  }, [data, collegeSearch, symbolSearch, filterSemester, searchType]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-md mt-3">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 underline">
          All Students
        </h2>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6 gap-4">
          <div className="flex gap-2">
            <SearchBox
              value={collegeSearch}
              onChange={(val) => {
                setCollegeSearch(val);
                setSearchType("college");
              }}
              placeholder="Search by College"
            />
          </div>

          <div className="flex gap-2">
            <SearchBox
              value={symbolSearch}
              onChange={(val) => {
                setSymbolSearch(val);
                setSearchType("symbol");
              }}
              placeholder="Search by Symbol No."
            />
          </div>

          <SelectFilter
            label="All Semesters"
            options={semesters}
            value={filterSemester || ""}
            onChange={(val) => {
              setFilterSemester(val ? Number(val) : null); // ensure number
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-center">Loading students...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Failed to load students.</p>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center text-gray-600">No students found.</p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-2">S.N</th>
                  <th className="border px-2 py-2">Image</th>
                  <th className="border px-2 py-2">Name</th>
                  <th className="border px-2 py-2">Symbol No.</th>
                  <th className="border px-2 py-2">Reg. No.</th>
                  <th className="border px-2 py-2">College</th>
                  <th className="border px-2 py-2">Course</th>
                  <th className="border px-2 py-2">Semester</th>
                  <th className="border px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student, idx) => (
                  <tr key={student.id || student._id} className="hover:bg-gray-50">
                    <td className="border px-2 py-2">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="border px-2 py-2">
                      {student.imageUrl ? (
                        <img
                          src={student.imageUrl}
                          alt={student.studentName}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )}
                    </td>
                    <td className="border px-2 py-2">{student.studentName}</td>
                    <td className="border px-2 py-2">{student.symbolNumber}</td>
                    <td className="border px-2 py-2">{student.regNumber}</td>
                    <td className="border px-2 py-2">{student.college}</td>
                    <td className="border px-2 py-2">
                      {student.course?.name || "-"}
                    </td>
                    <td className="border px-2 py-2">
                      {student.semester?.semesterNum || "-"}
                    </td>
                    <td className="border px-2 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(student.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
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
  );
};

export default ViewStudentPage;
