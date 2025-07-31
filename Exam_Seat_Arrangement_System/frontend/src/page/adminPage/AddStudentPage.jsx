import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAddStudentMutation } from "../../redux/api/studentApi";
import { useGetCoursesQuery } from "../../redux/api/courseApi";
import { useGetSemestersQuery } from "../../redux/api/semesterApi";
import Input from "../../component/public/Input";
import Select from "../../component/public/Select";

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
  const { data: coursesData } = useGetCoursesQuery();
  const { data: semestersData } = useGetSemestersQuery();
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    setUploading(true);

    try {
      const { data } = await axios.post("http://localhost:3000/api/upload/file", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      const imageUrl = `http://localhost:3000${data.url}`;
      setFormData((prev) => ({ ...prev, imageUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseId || !formData.semesterId) {
      toast.error("Please select both course and semester.");
      return;
    }

    try {
      const result = await addStudent({
        ...formData,
        courseId: Number(formData.courseId),
        semesterId: Number(formData.semesterId),
        imageUrl: formData.imageUrl || null,
      }).unwrap();

      if (result.success) {
        toast.success("Student added successfully!");
        setFormData({
          studentName: "",
          symbolNumber: "",
          regNumber: "",
          college: "",
          courseId: "",
          semesterId: "",
          imageUrl: "",
        });
        // navigate("/viewStudents");
      } else {
        toast.error(result.message || "Failed to add student");
      }
    } catch (error) {
      if (error?.status === 409) {
        toast.error("Student already exists with the same symbol number and college.");
      } else {
        toast.error(error?.data?.message || "Error adding student");
      }
    }
  };

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-lg shadow-md mt-5">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Student</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="studentName"
          label="Student Name"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          required
        />

        <Input
          id="symbolNumber"
          label="Symbol Number"
          name="symbolNumber"
          value={formData.symbolNumber}
          onChange={handleChange}
          required
        />

        <Input
          id="regNumber"
          label="Registration Number"
          name="regNumber"
          value={formData.regNumber}
          onChange={handleChange}
          required
        />

        <Input
          id="college"
          label="College"
          name="college"
          value={formData.college}
          onChange={handleChange}
          required
        />

        <Select
          id="courseId"
          label="Course"
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          options={
            coursesData?.courses?.map((course) => ({
              value: course.id,
              label: course.name,
            })) || []
          }
          required
        />

        <Select
          id="semesterId"
          label="Semester"
          name="semesterId"
          value={formData.semesterId}
          onChange={handleChange}
          options={
            semestersData?.semesters?.map((sem) => ({
              value: sem.id,
              label: `Semester ${sem.semesterNum}`,
            })) || []
          }
          required
        />

        {/* Image Upload (no icon, no preview) */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={uploadFileHandler}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isLoading || uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {isLoading ? "Adding..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentPage;
