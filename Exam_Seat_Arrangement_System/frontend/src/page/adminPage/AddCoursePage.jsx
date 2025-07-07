import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddCoursesMutation } from '../../redux/api/courseApi';
const AddCoursePage = () => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [addCourse, { isLoading }] = useAddCoursesMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !duration) {
      setError('All fields are required');
      return;
    }

    // ✅ Validate and convert duration to an integer
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration)) {
      setError('Duration must be a valid number');
      return;
    }

    const formData = {
      name,
      duration: parsedDuration,
    };

    try {
      await addCourse(formData).unwrap();
      toast.success('Course added successfully!');
      setName('');
      setDuration('');
      setError('');

      setTimeout(() => {
        navigate('/admin/viewCourses'); // Change this path according to your routing
      }, 1000);
    } catch (err) {
      console.error('Error adding course:', err);
      toast.error(err.data?.message || 'Failed to add course');
    }
  };

  return (
    <>
      <div className="ml-[20vh] w-[100vh] h-[70vh] mt-5 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Course Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course name"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Duration:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter duration"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Adding...' : 'Add Course'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default AddCoursePage;
