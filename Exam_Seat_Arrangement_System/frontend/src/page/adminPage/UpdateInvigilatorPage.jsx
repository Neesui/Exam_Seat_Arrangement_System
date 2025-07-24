import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetInvigilatorByIdQuery,
  useUpdateInvigilatorMutation,
} from '../../redux/api/invigilatorApi';

const UpdateInvigilatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invigilatorData, error, isLoading } = useGetInvigilatorByIdQuery(id);
  const [updateInvigilator, { isLoading: isUpdating }] = useUpdateInvigilatorMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
    phone: '',
    address: '',
    gender: '',
  });

  const [image, setImage] = useState(null); // ✅ Image state

  useEffect(() => {
    if (invigilatorData) {
      setFormData({
        name: invigilatorData.name || '',
        email: invigilatorData.email || '',
        password: '',
        course: invigilatorData.course || '',
        phone: invigilatorData.phone || '',
        address: invigilatorData.address || '',
        gender: invigilatorData.gender || '',
      });
    }
  }, [invigilatorData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      for (const key in formData) {
        fd.append(key, formData[key]);
      }
      if (image) fd.append("image", image); // ✅ Append image

      await updateInvigilator({ id, formData: fd }).unwrap();
      toast.success('Invigilator updated successfully!');
      navigate('/viewInvigilator');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update invigilator.');
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading invigilator details.</p>;

  return (
    <div className="mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Update Invigilator</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5" encType="multipart/form-data">
        {["name", "email", "password", "course", "phone", "address", "gender"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-gray-600 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            {field === "gender" ? (
              <select
                id={field}
                name={field}
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <input
                id={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        {/* ✅ Image Upload */}
        <div>
          <label htmlFor="image" className="block text-gray-600 mb-1">
            Image:
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {isUpdating ? 'Updating...' : 'Update Invigilator'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInvigilatorPage;
