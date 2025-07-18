import React, { useState } from 'react';
import { useAddInvigilatorMutation } from '../../redux/api/invigilatorApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../../component/public/Input';
import Select from '../../component/public/Select';

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
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Invigilator</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="name"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          required
        />

        <Input
          id="email"
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />

        <Input
          id="course"
          label="Course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="Enter course name"
        />

        <Input
          id="phone"
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <Input
          id="address"
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
        />

        <Select
          id="gender"
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
        />

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
