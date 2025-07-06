import React, { useState } from 'react';
import { useAddInvigilatorMutation } from '../../redux/api/invigilatorApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddInvigilatorPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
    phone: '',
    address: '',
    gender: '',
  });

  const navigate = useNavigate();
  const [addInvigilator, { isLoading }] = useAddInvigilatorMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addInvigilator(formData).unwrap();
      toast.success('Invigilator added successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        course: '',
        phone: '',
        address: '',
        gender: '',
      });
      setTimeout(() => navigate('/admin/ViewInvigilator'), 1000);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to add invigilator.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen px-4 md:px-0">
      <div className="w-full md:max-w-lg bg-white p-6 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Invigilator</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {['name', 'email', 'password', 'course', 'phone', 'address'].map((field) => (
            <div key={field}>
              <label className="block text-gray-600 mb-1 capitalize">{field}:</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field !== 'course' && field !== 'address'}
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-600 mb-1">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Adding...' : 'Add Invigilator'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInvigilatorPage;
