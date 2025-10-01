import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetCoursesQuery,
  useDeleteCoursesMutation,
} from "../../redux/api/courseApi";
import { useDeleteSubjectMutation } from "../../redux/api/subjectApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 10;

const ViewFullCoursePage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetCoursesQuery();
  const [deleteCourse] = useDeleteCoursesMutation();
  const [deleteSubject] = useDeleteSubjectMutation();

  // Search states
  const [courseSearch, setCourseSearch] = useState("");
  const [semesterSearch, setSemesterSearch] = useState("");
  const [searchType, setSearchType] = useState(""); 

  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete course.");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(subjectId).unwrap();
      toast.success("Subject deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete subject.");
    }
  };

  const handleUpdate = (courseId) => {
    navigate(`/admin/UpdateCourse/${courseId}`);
  };

  const handleAddSemester = (courseId) => {
    navigate(`/addSemester/${courseId}`);
  };

  const handleAddSubject = (semesterId) => {
    navigate(`/addSubject/${semesterId}`);
  };

  const handleUpdateSubject = (subjectId) => {
    navigate(`/updateSubject/${subjectId}`);
  };

  // Filter courses based on search type
  const filteredCourses = useMemo(() => {
    if (!data?.courses) return [];

    return data.courses.filter((course) => {
      if (searchType === "course") {
        return course.name.toLowerCase().includes(courseSearch.toLowerCase());
      }

      if (searchType === "semester") {
        return course.semesters?.some(
          (sem) =>
            sem.semesterNum
              .toString()
              .toLowerCase()
              .includes(semesterSearch.toLowerCase())
        );
      }

      return true; 
    });
  }, [data, courseSearch, semesterSearch, searchType]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 py-12 px-6 overflow-auto">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">All Courses</h2>

        {/* Search inputs and buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6 gap-4">
          <div className="flex gap-2">
            <SearchBox
              value={courseSearch}
              onChange={(val) => setCourseSearch(val)}
              placeholder="Search by Course Name"
            />

          </div>

          <div className="flex gap-2">
            <SearchBox
              value={semesterSearch}
              onChange={(val) => setSemesterSearch(val)}
              placeholder="Search by Semester"
            />
           
          </div>
        </div>

        {isLoading ? (
          <p className="text-center">Loading courses...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Failed to load courses.</p>
        ) : paginatedCourses.length === 0 ? (
          <p className="text-center text-gray-600">No courses found.</p>
        ) : (
          <>
            {paginatedCourses.map((course, courseIndex) => (
              <div
                key={course.id || course._id}
                className="mb-10 border border-gray-300 rounded-lg p-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">
                      {(currentPage - 1) * ITEMS_PER_PAGE + courseIndex + 1}. {course.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Duration: {course.duration} semester(s) | Batch Year: {course.batchYear}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddSemester(course.id)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
                  >
                    + Add Semester
                  </button>
                </div>

                {course.semesters?.length > 0 ? (
                  <div className="ml-4 mt-4 space-y-6">
                    {course.semesters.map((semester) => (
                      <div key={semester.id || semester._id}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-md font-semibold text-gray-600">
                            Semester {semester.semesterNum}
                          </h4>
                          <button
                            onClick={() => handleAddSubject(semester.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            + Add Subject
                          </button>
                        </div>

                        {semester.subjects?.length > 0 ? (
                          <table className="w-full border-collapse border border-gray-200">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-3 py-2 text-left">Subject Name</th>
                                <th className="border border-gray-300 px-3 py-2 text-left">Code</th>
                                <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {semester.subjects.map((subject) => (
                                <tr key={subject.id || subject._id}>
                                  <td className="border border-gray-300 px-3 py-2">{subject.subjectName}</td>
                                  <td className="border border-gray-300 px-3 py-2">{subject.code}</td>
                                  <td className="border border-gray-300 px-3 py-2 space-x-4">
                                    <button
                                      className="text-blue-600 hover:text-blue-800"
                                      onClick={() => handleUpdateSubject(subject.id || subject._id)}
                                    >
                                      Update
                                    </button>
                                    <button
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => handleDeleteSubject(subject.id || subject._id)}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500 italic">No subjects available.</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic ml-2 mt-4">No semesters available.</p>
                )}

                <div className="mt-4 flex gap-6">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleUpdate(course.id)}
                  >
                    Update
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

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

export default ViewFullCoursePage;
