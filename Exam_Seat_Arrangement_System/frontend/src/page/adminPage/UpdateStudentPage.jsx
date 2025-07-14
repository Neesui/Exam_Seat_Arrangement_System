import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useUpdateStudentMutation,
  useGetStudentByIdQuery,
} from "../../redux/api/studentApi";
import { useGetCoursesQuery } from "../../redux/api/courseApi";
import { useGetSemestersQuery } from "../../redux/api/semesterApi";

const UpdateStudentPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const { data: studentData, isLoading, error } = useGetStudentByIdQuery(studentId);
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const { data: coursesData } = useGetCoursesQuery();
  const { data: semestersData } = useGetSemestersQuery();

  const [formData, setFormData] = useState({
    studentName: "",
    symbolNumber: "",
    regNumber: "",
    college: "",
    courseId: "",
    semesterId: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (studentData?.student) {
      const student = studentData.student;
      setFormData({
        studentName: student.studentName || "",
        symbolNumber: student.symbolNumber || "",
        regNumber: student.regNumber || "",
        college: student.college || "",
        courseId: student.courseId?.toString() || "",
        semesterId: student.semesterId?.toString() || "",
        imageUrl: student.imageUrl || "",
      });
    }
  }, [studentData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseId || !formData.semesterId) {
      toast.error("Please select a course and a semester");
      return;
    }

    try {
      await updateStudent({
        id: Number(studentId),
        studentName: formData.studentName,
        symbolNumber: formData.symbolNumber,
        regNumber: formData.regNumber,
        college: formData.college,
        courseId: Number(formData.courseId),
        semesterId: Number(formData.semesterId),
        imageUrl: formData.imageUrl.trim() === "" ? null : formData.imageUrl.trim(),
      }).unwrap();

      toast.success("Student updated successfully!");
      navigate("/viewStudents");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.data?.message || "Failed to update student.");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading student data...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Failed to fetch student data.</p>;

  return (
    <div className="w-full min-h-screen mt-20 bg-white px-4 sm:px-10 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Update Student
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-full"
      >
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          placeholder="Student Name"
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="text"
          name="symbolNumber"
          value={formData.symbolNumber}
          onChange={handleChange}
          placeholder="Symbol Number"
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="text"
          name="regNumber"
          value={formData.regNumber}
          onChange={handleChange}
          placeholder="Registration Number"
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="College"
          className="w-full border p-3 rounded"
          required
        />
        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Course</option>
          {coursesData?.courses?.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <select
          name="semesterId"
          value={formData.semesterId}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Semester</option>
          {semestersData?.semesters?.map((sem) => (
            <option key={sem.id} value={sem.id}>
              Semester {sem.semesterNum}
            </option>
          ))}
        </select>
        <div className="sm:col-span-2">
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border p-3 rounded"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            {isUpdating ? "Updating..." : "Update Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudentPage;
