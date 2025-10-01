import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetBenchesQuery, useDeleteBenchMutation } from "../../redux/api/benchApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 15;

const ViewBenchPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetBenchesQuery();
  const [deleteBench] = useDeleteBenchMutation();

  const [roomSearch, setRoomSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (benchId) => {
    if (!window.confirm("Are you sure you want to delete this bench?")) return;
    try {
      await deleteBench(Number(benchId)).unwrap();
      toast.success("Bench deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete bench.");
    }
  };

  const handleUpdate = (benchId) => {
    navigate(`/admin/updateBench/${benchId}`);
  };

  const filteredBenches = useMemo(() => {
    if (!data?.benches) return [];
    return data.benches.filter((bench) =>
      bench.room?.roomNumber.toLowerCase().includes(roomSearch.toLowerCase())
    );
  }, [data, roomSearch]);

  const totalPages = Math.ceil(filteredBenches.length / ITEMS_PER_PAGE);
  const paginatedBenches = filteredBenches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 py-10">
      <div className="w-full bg-white p-8 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">View Benches</h2>

        {/* Search Box */}
        <div className="mb-6 w-full flex justify-start">
          <SearchBox
            value={roomSearch}
            onChange={(val) => {
              setRoomSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search by Room Number"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <p>Loading benches...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load benches.</p>
        ) : filteredBenches.length === 0 ? (
          <p className="text-center text-gray-600">No benches found.</p>
        ) : (
          <>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-sm">
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
                {paginatedBenches.map((bench, index) => (
                  <tr key={bench.id} className="text-sm text-center">
                    <td className="border px-4 py-2">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="border px-4 py-2">{bench.room?.roomNumber || "-"}</td>
                    <td className="border px-4 py-2">{bench.benchNo}</td>
                    <td className="border px-4 py-2">{bench.row}</td>
                    <td className="border px-4 py-2">{bench.column}</td>
                    <td className="border px-4 py-2">{bench.capacity}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleUpdate(bench.id)}
                      >
                        Update
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(bench.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewBenchPage;
