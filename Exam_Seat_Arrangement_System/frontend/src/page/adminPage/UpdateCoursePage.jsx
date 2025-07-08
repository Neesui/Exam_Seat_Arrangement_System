import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCoursesQuery, useUpdateCoursesMutation } from "../../redux/api/courseApi";
import { toast } from "react-toastify";

const UpdateCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: courseData, isLoading, error } = useGetCoursesQuery();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCoursesMutation();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (courseData?.courses) {
      // Convert courseId to number if your IDs are numbers, else keep as string
      const course = courseData.courses.find((c) => c.id === Number(courseId) || c.id === courseId);
      if (course) {
        setName(course.name);
        setDuration(course.duration);
      }
    }
  }, [courseData, courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIX: pass { id, name, duration }
      await updateCourse({ id: Number(courseId), name, duration }).unwrap();
      toast.success("Course updated successfully!");
      navigate("/viewCourse");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.data?.message || "Failed to update course.");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to fetch course data.</p>;

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Course Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCoursePage;
