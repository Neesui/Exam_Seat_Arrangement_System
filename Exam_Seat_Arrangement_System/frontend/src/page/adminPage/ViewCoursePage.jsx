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

  // Delete handler
  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId).unwrap();
      toast.success('Course deleted successfully!');
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error(err?.data?.message || 'Failed to delete course.');
    }
  };

  // Update handler
  const handleUpdate = (courseId) => {
    navigate(`/admin/UpdateCourse/${courseId}`);
  };

  return (
    <>
      <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md w-full max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">View Courses</h2>

        {isLoading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load courses.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">S.N.</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Course Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((course, index) => (
                  <tr key={course.id || course._id}>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{course.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{course.duration}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => handleUpdate(course.id || course._id)}
                      >
                        Update
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(course.id || course._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                    No courses available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ViewCoursePage;
