import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetExamsQuery, useDeleteExamMutation } from "../../redux/api/examApi";

const ViewExamPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetExamsQuery();
  const [deleteExam] = useDeleteExamMutation();

  const handleDelete = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await deleteExam(Number(examId)).unwrap();
      toast.success("Exam deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete exam.");
    }
  };

  const handleUpdate = (examId) => {
    navigate(`/updateExam/${examId}`);
  };

  const handleView = (examId) => {
    navigate(`/viewExamDetails/${examId}`);
  };

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md w-[99%] max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">View Exams</h2>

      {isLoading ? (
        <p>Loading exams...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load exams.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">S.N.</th>
              <th className="border border-gray-300 px-4 py-2">Subject</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Start Time</th>
              <th className="border border-gray-300 px-4 py-2">End Time</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.exams?.length > 0 ? (
              data.exams.map((exam, index) => (
                <tr key={exam.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{exam.subject?.subjectName || "N/A"}</td>
                  <td className="border px-4 py-2">{exam.date.split('T')[0]}</td>
                  <td className="border px-4 py-2">{exam.startTime || "-"}</td>
                  <td className="border px-4 py-2">{exam.endTime || "-"}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleUpdate(exam.id)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 mr-2"
                      onClick={() => handleDelete(exam.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleView(exam.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border px-4 py-2 text-center">
                  No exams available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewExamPage;
