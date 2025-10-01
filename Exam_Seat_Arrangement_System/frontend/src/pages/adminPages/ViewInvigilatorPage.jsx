import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllInvigilatorsQuery,
  useDeleteInvigilatorMutation,
} from "../../redux/api/invigilatorApi";
import SearchBox from "../../component/public/SearchBox";
import Pagination from "../../component/public/Pagination";

const ITEMS_PER_PAGE = 15;

const ViewInvigilatorPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAllInvigilatorsQuery();
  const [deleteInvigilator] = useDeleteInvigilatorMutation();

  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (invigilatorId) => {
    if (!window.confirm("Are you sure you want to delete this invigilator?")) return;
    try {
      await deleteInvigilator(invigilatorId).unwrap();
      toast.success("Invigilator deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete invigilator.");
    }
  };

  const handleEdit = (invigilatorId) => {
    navigate(`/admin/updateInvigilator/${invigilatorId}`);
  };

  const handleView = (invigilatorId) => {
    navigate(`/admin/viewInvigilatorDetails/${invigilatorId}`);
  };

  const filteredInvigilators = useMemo(() => {
    if (!data?.invigilators) return [];
    const nameLower = searchName.toLowerCase();
    const emailLower = searchEmail.toLowerCase();
    return data.invigilators.filter((inv) => {
      const matchName = nameLower === "" || inv.name.toLowerCase().includes(nameLower);
      const matchEmail = emailLower === "" || inv.email.toLowerCase().includes(emailLower);
      return matchName && matchEmail;
    });
  }, [data, searchName, searchEmail]);

  const totalPages = Math.ceil(filteredInvigilators.length / ITEMS_PER_PAGE);
  const paginatedInvigilators = filteredInvigilators.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="ml-8 mt-5 bg-white p-6 rounded-lg shadow-md max-w-[95%] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">View Invigilators</h2>

      {/* Search Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox
          value={searchName}
          onChange={(val) => {
            setSearchName(val);
            setCurrentPage(1);
          }}
          placeholder="Search by name"
        />
        <SearchBox
          value={searchEmail}
          onChange={(val) => {
            setSearchEmail(val);
            setCurrentPage(1);
          }}
          placeholder="Search by email"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading invigilators...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load invigilators.</p>
      ) : paginatedInvigilators.length === 0 ? (
        <p className="text-center text-gray-600">No invigilators found.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">S.N.</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Course</th>
                <th className="border border-gray-300 px-4 py-2">Status</th> {/* Status */}
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvigilators.map((invigilator, index) => (
                <tr key={invigilator.id || index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="border px-4 py-2">{invigilator.name}</td>
                  <td className="border px-4 py-2">{invigilator.email}</td>
                  <td className="border px-4 py-2">{invigilator.phone}</td>
                  <td className="border px-4 py-2">{invigilator.course}</td>
                  <td className="border px-4 py-2 text-center">
                    {invigilator.assignedStatus === "ASSIGNED" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs">
                        Assigned
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold text-xs">
                        Not Assigned
                      </span>
                    )}
                  </td>
                  <td className="border px-4 py-2 space-x-2 text-center">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleView(invigilator.id)}
                    >
                      View
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(invigilator.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(invigilator.id)}
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
  );
};

export default ViewInvigilatorPage;
