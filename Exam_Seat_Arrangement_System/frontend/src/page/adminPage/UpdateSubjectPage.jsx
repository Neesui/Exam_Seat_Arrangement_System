import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCoursesQuery } from "../../redux/api/courseApi";
import { useUpdateSubjectMutation } from "../../redux/api/subjectApi";
import { toast } from "react-toastify";

const UpdateSubjectPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const { data: courseData, isLoading, error } = useGetCoursesQuery();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();

  const [subjectName, setSubjectName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (courseData?.courses) {
      // Find the subject by ID in all courses and semesters
      for (const course of courseData.courses) {
        for (const semester of course.semesters || []) {
          const subject = semester.subjects?.find(
            (s) => s.id === subjectId || s.id === Number(subjectId)
          );
          if (subject) {
            setSubjectName(subject.subjectName);
            setCode(subject.code);
            return; // stop after found
          }
        }
      }
    }
  }, [courseData, subjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSubject({ subjectId, subjectName, code }).unwrap();
      toast.success("Subject updated successfully!");
      navigate("/viewCourse");
    } catch (err) {
      console.error("Error updating subject:", err);
      toast.error(err?.data?.message || "Failed to update subject.");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to fetch data.</p>;

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Subject</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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

export default UpdateSubjectPage;
