import React from "react";
import { useParams } from "react-router-dom";
import { useGetStudentsByCollegeQuery } from "../../redux/api/studentApi";

const ViewStudentsByCollege = () => {
  const { collegeName } = useParams();
  const { data, isLoading, error } = useGetStudentsByCollegeQuery(collegeName);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading students.</p>;

  const students = data?.students || [];

  return (
    <div className="p-6 max-w-5xl mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Students from {collegeName}</h2>

      {students.length === 0 ? (
        <p className="text-center text-gray-500">No students found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Symbol No</th>
              <th className="border px-4 py-2">Reg No</th>
              <th className="border px-4 py-2">Course</th>
              <th className="border px-4 py-2">Semester</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.studentName}</td>
                <td className="border px-4 py-2">{student.symbolNumber}</td>
                <td className="border px-4 py-2">{student.regNumber}</td>
                <td className="border px-4 py-2">{student.course?.name}</td>
                <td className="border px-4 py-2">Semester {student.semester?.semesterNum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewStudentsByCollege;
