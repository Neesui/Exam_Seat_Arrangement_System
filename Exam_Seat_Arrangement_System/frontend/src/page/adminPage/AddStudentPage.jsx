import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddStudentMutation } from "../../redux/api/studentApi";
import { useGetCoursesQuery } from "../../redux/api/courseApi";
import { useGetSemestersQuery } from "../../redux/api/semesterApi";

const AddStudentPage = () => {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [symbolNumber, setSymbolNumber] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [college, setCollege] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [addStudent, { isLoading }] = useAddStudentMutation();

  const {
    data: coursesData,
    error: coursesError,
    isLoading: coursesLoading,
  } = useGetCoursesQuery();

  const {
    data: semestersData,
    error: semestersError,
    isLoading: semestersLoading,
  } = useGetSemestersQuery();

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: check file type/size here

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      setImageUrl(data.imageUrl); // Adjust based on your API response shape
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId || !semesterId) {
      toast.error("Please select a course and a semester");
      return;
    }

    try {
      const result = await addStudent({
        studentName,
        symbolNumber,
        regNumber,
        college,
        courseId: Number(courseId),
        semesterId: Number(semesterId),
        imageUrl: imageUrl.trim() === "" ? null : imageUrl.trim(),
      }).unwrap();

      if (result.success) {
        toast.success("Student added successfully!");
        navigate("/students"); // change as per your route to view students
      } else {
        toast.error(result.message || "Failed to add student");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add student");
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 mt-32 flex flex-col justify-center px-4">
      <div className="w-full bg-white p-6 md:p-10 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Add New Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter student name"
              required
            />
          </div>

          {/* Symbol Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Symbol Number</label>
            <input
              type="text"
              value={symbolNumber}
              onChange={(e) => setSymbolNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter symbol number"
              required
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Registration Number</label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter registration number"
              required
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-semibold mb-1">College</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter college name"
              required
            />
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">Course</label>
            {coursesLoading ? (
              <p>Loading courses...</p>
            ) : coursesError ? (
              <p className="text-red-500">Failed to load courses</p>
            ) : (
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Course</option>
                {coursesData?.courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseName} ({course.courseCode})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Semester Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">Semester</label>
            {semestersLoading ? (
              <p>Loading semesters...</p>
            ) : semestersError ? (
              <p className="text-red-500">Failed to load semesters</p>
            ) : (
              <select
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Semester</option>
                {semestersData?.semesters?.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.semesterName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1">Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {uploading && <p className="text-blue-500 mt-1">Uploading image...</p>}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-2 h-24 w-24 object-cover rounded border"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 rounded text-white font-semibold transition ${
              isLoading || uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading || coursesLoading || semestersLoading || uploading}
          >
            {isLoading ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;
