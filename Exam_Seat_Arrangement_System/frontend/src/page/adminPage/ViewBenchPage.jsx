import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetBenchesQuery, useDeleteBenchMutation } from "../../redux/api/benchApi";

const ViewBenchPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetBenchesQuery();
  const [deleteBench] = useDeleteBenchMutation();

  const handleDelete = async (benchId) => {
    try {
      await deleteBench(Number(benchId)).unwrap();
      toast.success("Bench deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete bench.");
    }
  };

  const handleUpdate = (benchId) => {
    navigate(`/updateBench/${benchId}`);
  };

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md w-full max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">View Benches</h2>

      {isLoading ? (
        <p>Loading benches...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load benches.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">S.N.</th>
              <th className="border border-gray-300 px-4 py-2">Room Number</th>
              <th className="border border-gray-300 px-4 py-2">Bench No</th>
              <th className="border border-gray-300 px-4 py-2">Row</th>
              <th className="border border-gray-300 px-4 py-2">Column</th>
              <th className="border border-gray-300 px-4 py-2">Capacity</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.benches?.length > 0 ? (
              data.benches.map((bench, index) => (
                <tr key={bench.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{bench.room?.roomNumber || "-"}</td>
                  <td className="border px-4 py-2">{bench.benchNo}</td>
                  <td className="border px-4 py-2">{bench.row}</td>
                  <td className="border px-4 py-2">{bench.column}</td>
                  <td className="border px-4 py-2">{bench.capacity}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleUpdate(bench.id)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(bench.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border px-4 py-2 text-center">
                  No benches available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewBenchPage;
