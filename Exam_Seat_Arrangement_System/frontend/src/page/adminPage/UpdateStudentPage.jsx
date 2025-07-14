import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllStudentsQuery,
  useUpdateStudentMutation,
} from "../../redux/api/studentApi";
import { useGetCoursesQuery } from "../../redux/api/courseApi";
import { useGetSemestersQuery } from "../../redux/api/semesterApi";

const UpdateStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useGetAllStudentsQuery();
  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useGetCoursesQuery();
  const { data: semestersData, isLoading: semestersLoading, error: semestersError } = useGetSemestersQuery();

  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  const [formData, setFormData] = useState({
    studentName: "",
    symbolNumber: "",
    regNumber: "",
    college: "",
    courseId: "",
    semesterId: "",
    imageUrl: "",
  });

  // Load current student data into form
  useEffect(() => {
    if (studentsData?.students) {
      const student = studentsData.students.find((s) => String(s.id) === String(id));
      if (student) {
        setFormData({
          studentName: student.studentName || "",
          symbolNumber: student.symbolNumber || "",
          regNumber: student.regNumber || "",
          college: student.college || "",
          courseId: student.courseId ? String(student.courseId) : "",
          semesterId: student.semesterId ? String(student.semesterId) : "",
          imageUrl: student.imageUrl || "",
        });
      }
    }
  }, [studentsData, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.studentName || !formData.symbolNumber || !formData.regNumber || !formData.college || !formData.courseId || !formData.semesterId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateStudent({
        id: Number(id),
        studentName: formData.studentName,
        symbolNumber: formData.symbolNumber,
        regNumber: formData.regNumber,
        college: formData.college,
        courseId: Number(formData.courseId),
        semesterId: Number(formData.semesterId),
        imageUrl: formData.imageUrl.trim() === "" ? null : formData.imageUrl.trim(),
      }).unwrap();

      toast.success("Student updated successfully!");
      navigate("/students"); // adjust this to your students list page route
    } catch (error) {
      console.error("Update student error:", error);
      toast.error(error?.data?.message || "Failed to update student");
    }
  };

  if (studentsLoading || coursesLoading || semestersLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (studentsError || coursesError || semestersError) {
    return <p className="text-center mt-10 text-red-500">Failed to load data</p>;
  }

  return (
    <div className="max-w-full mx-auto mt-10 p-6 bg-white rounded shadow min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Update Student</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div>
          <label className="block mb-2 font-semibold">Student Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Symbol Number <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="symbolNumber"
            value={formData.symbolNumber}
            onChange={handleChange}
            placeholder="Enter symbol number"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Registration Number <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            placeholder="Enter registration number"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">College <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Enter college name"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Course <span className="text-red-500">*</span></label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Course</option>
            {coursesData?.courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} {/* Adjust field name if different */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Semester <span className="text-red-500">*</span></label>
          <select
            name="semesterId"
            value={formData.semesterId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Semester</option>
            {semestersData?.semesters?.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.semesterNum ? `Semester ${sem.semesterNum}` : sem.id}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL (optional)"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300"
          >
            {isUpdating ? "Updating..." : "Update Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudentPage;
