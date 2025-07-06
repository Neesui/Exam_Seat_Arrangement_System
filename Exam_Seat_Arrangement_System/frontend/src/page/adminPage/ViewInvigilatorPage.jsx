import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetInvigilatorsQuery,
  useDeleteInvigilatorMutation,
} from '../../redux/api/invigilatorApi';

const ViewInvigilatorPage = () => {
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetInvigilatorsQuery();
  const [deleteInvigilator] = useDeleteInvigilatorMutation();

  // Delete handler
  const handleDelete = async (invigilatorId) => {
    try {
      await deleteInvigilator(invigilatorId).unwrap();
      toast.success('Invigilator deleted successfully!');
    } catch (err) {
      console.error('Error deleting invigilator:', err);
      toast.error(err?.data?.message || 'Failed to delete invigilator.');
    }
  };

  // Update handler
  const handleUpdate = (invigilatorId) => {
    navigate(`/admin/UpdateInvigilator/${invigilatorId}`);
  };

  return (
    <>
      <div className="ml-8 mt-5 bg-white p-6 rounded-lg shadow-md w-full max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">View Invigilators</h2>

        {isLoading ? (
          <p>Loading invigilators...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load invigilators.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">S.N.</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Course</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.invigilators?.length > 0 ? (
                data.invigilators.map((invigilator, index) => (
                  <tr key={invigilator._id}>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{invigilator.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{invigilator.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{invigilator.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">{invigilator.course}</td>
                    <td className="border border-gray-300 px-4 py-2">{invigilator.gender}</td>
                    <td className="border border-gray-300 px-4 py-2">{invigilator.address}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => handleUpdate(invigilator._id)}
                      >
                        Update
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(invigilator._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="border border-gray-300 px-4 py-2 text-center">
                    No invigilators available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ViewInvigilatorPage;
