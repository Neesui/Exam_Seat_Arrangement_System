import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetAllInvigilatorsQuery,
  useDeleteInvigilatorMutation,
} from '../../redux/api/invigilatorApi';

const ViewInvigilatorPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAllInvigilatorsQuery();
  const [deleteInvigilator] = useDeleteInvigilatorMutation();

  const handleDelete = async (invigilatorId) => {
    try {
      await deleteInvigilator(invigilatorId).unwrap();
      toast.success('Invigilator deleted successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete invigilator.');
    }
  };

  const handleEdit = (invigilatorId) => {
    navigate(`/updateInvigilator/${invigilatorId}`);
  };

  const handleView = (invigilatorId) => {
    navigate(`/viewInvigilatorDetails/${invigilatorId}`);
  };

  return (
    <div className="ml-8 mt-20 bg-white p-6 rounded-lg shadow-md max-w-[90%]-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">View Invigilators</h2>

      {isLoading ? (
        <p>Loading invigilators...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load invigilators.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">S.N.</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Course</th>
              <th className="border border-gray-300 px-4 py-2">Gender</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.invigilators?.length > 0 ? (
              data.invigilators.map((invigilator, index) => (
                <tr key={invigilator.id || index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{invigilator.name}</td>
                  <td className="border px-4 py-2">{invigilator.email}</td>
                  <td className="border px-4 py-2">{invigilator.phone}</td>
                  <td className="border px-4 py-2">{invigilator.course}</td>
                  <td className="border px-4 py-2">{invigilator.gender}</td>
                  <td className="border px-4 py-2">{invigilator.address}</td>
                  <td className="border px-4 py-2 space-x-2">
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border px-4 py-2 text-center">
                  No invigilators available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewInvigilatorPage;
