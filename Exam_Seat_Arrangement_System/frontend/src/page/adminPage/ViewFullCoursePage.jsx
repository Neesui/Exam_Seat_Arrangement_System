import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetCoursesQuery,
  useDeleteCoursesMutation,
} from '../../redux/api/courseApi';

const ViewCoursePage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetCoursesQuery();
  const [deleteCourse] = useDeleteCoursesMutation();

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId).unwrap();
      toast.success('Course deleted successfully!');
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error(err?.data?.message || 'Failed to delete course.');
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

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">View Courses</h2>

      {isLoading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load courses.</p>
      ) : (
        <>
          {data?.courses?.length > 0 ? (
            data.courses.map((course, courseIndex) => (
              <div
                key={course.id || course._id}
                className="mb-8 border border-gray-300 rounded p-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {courseIndex + 1}. {course.name} (Duration: {course.duration})
                  </h3>
                  <button
                    onClick={() => handleAddSemester(course.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    + Add Semester
                  </button>
                </div>

                {course.semesters?.length > 0 ? (
                  <div className="ml-6 mt-4">
                    {course.semesters.map((semester) => (
                      <div key={semester.id || semester._id} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">
                            Semester {semester.semesterNum}
                          </h4>
                          <button
                            onClick={() => handleAddSubject(semester.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            + Add Subject
                          </button>
                        </div>

                        {semester.subjects?.length > 0 ? (
                          <table className="w-full border-collapse border border-gray-200 mt-2">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-3 py-1 text-left">
                                  Subject Name
                                </th>
                                <th className="border border-gray-300 px-3 py-1 text-left">
                                  Code
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {semester.subjects.map((subject) => (
                                <tr key={subject.id || subject._id}>
                                  <td className="border border-gray-300 px-3 py-1">
                                    {subject.subjectName}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-1">
                                    {subject.code}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500 italic ml-2">
                            No subjects available.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic ml-2 mt-2">
                    No semesters available.
                  </p>
                )}

                <div className="mt-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 mr-4"
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
            ))
          ) : (
            <p>No courses available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ViewCoursePage;
