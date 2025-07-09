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
      setTimeout(() => {
        navigate('/viewInvigilator');
      }, 1000);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to add invigilator.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Invigilator</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-gray-600 mb-1">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-600 mb-1">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-600 mb-1">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="course" className="block text-gray-600 mb-1">Course:</label>
          <input
            id="course"
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Enter course name"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-600 mb-1">Phone:</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-600 mb-1">Address:</label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        

        <div>
          <label htmlFor="gender" className="block text-gray-600 mb-1">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Adding...' : 'Add Invigilator'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInvigilatorPage;
