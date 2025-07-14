import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAddStudentMutation } from "../../redux/api/studentApi";
import { useGetCoursesQuery } from "../../redux/api/courseApi";
import { useGetSemestersQuery } from "../../redux/api/semesterApi";

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    symbolNumber: "",
    regNumber: "",
    college: "",
    courseId: "",
    semesterId: "",
    imageUrl: "",
  });

  const [addStudent, { isLoading }] = useAddStudentMutation();
  const { data: coursesData, error: coursesError, isLoading: coursesLoading } = useGetCoursesQuery();
  const { data: semestersData, error: semestersError, isLoading: semestersLoading } = useGetSemestersQuery();

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
      const result = await addStudent({
        ...formData,
        courseId: Number(formData.courseId),
        semesterId: Number(formData.semesterId),
        imageUrl: formData.imageUrl.trim() === "" ? null : formData.imageUrl.trim(),
      }).unwrap();

      if (result.success) {
        toast.success("Student added successfully!");
        // Optionally clear form here
      } else {
        toast.error(result.message || "Failed to add student");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add student");
    }
  };

  return (
    <div className="mx-auto max-w-[95%] mt-20 bg-white p-8 rounded-lg shadow-md h-[75vh] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Add New Student</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-y-auto"
      >
        <div>
          <label className="block text-gray-600 mb-1">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Symbol Number</label>
          <input
            type="text"
            name="symbolNumber"
            value={formData.symbolNumber}
            onChange={handleChange}
            placeholder="Enter symbol number"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Registration Number</label>
          <input
            type="text"
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            placeholder="Enter registration number"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">College</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Enter college name"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Course</label>
          {coursesLoading ? (
            <p>Loading courses...</p>
          ) : coursesError ? (
            <p className="text-red-500">Failed to load courses</p>
          ) : (
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Course</option>
              {coursesData?.courses?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} {/* Adjusted field */}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Semester</label>
          {semestersLoading ? (
            <p>Loading semesters...</p>
          ) : semestersError ? (
            <p className="text-red-500">Failed to load semesters</p>
          ) : (
            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Semester</option>
              {semestersData?.semesters?.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  Semester {sem.semesterNum} {/* Adjusted display */}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-600 mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isLoading || coursesLoading || semestersLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? "Adding..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentPage;
