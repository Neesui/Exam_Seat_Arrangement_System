import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllStudentsQuery,
  useDeleteStudentMutation,
} from "../../redux/api/studentApi"; 

const ViewStudentPage = () => {
  const navigate = useNavigate();

  // Fetch all students
  const { data, error, isLoading } = useGetAllStudentsQuery();

  // Delete mutation
  const [deleteStudent] = useDeleteStudentMutation();

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(studentId).unwrap();
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete student.");
    }
  };

  const handleUpdate = (studentId) => {
    navigate(`/updateStudent/${studentId}`); 
  };

  return (
    <div className="min-h-screen w-full mt-8 bg-gray-100 py-12 px-2 overflow-auto">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          All Students
        </h2>

        {isLoading ? (
          <p className="text-center">Loading students...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Failed to load students.</p>
        ) : (
          <>
            {data?.students?.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">#</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Symbol No.</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Registration No.</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">College</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Course</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Semester</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students.map((student, idx) => (
                    <tr key={student.id || student._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">{idx + 1}</td>
                      <td className="border border-gray-300 px-3 py-2">{student.studentName}</td>
                      <td className="border border-gray-300 px-3 py-2">{student.symbolNumber}</td>
                      <td className="border border-gray-300 px-3 py-2">{student.regNumber}</td>
                      <td className="border border-gray-300 px-3 py-2">{student.college}</td>
                      <td className="border border-gray-300 px-3 py-2">{student.course?.name || "-"}</td>
                      <td className="border border-gray-300 px-3 py-2">{student.semester?.semesterNum || "-"}</td>
                      <td className="border border-gray-300 px-3 py-2 space-x-4">
                        <button
                          onClick={() => handleUpdate(student.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Update
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
            ) : (
              <p className="text-center text-gray-600">No students available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewStudentPage;
