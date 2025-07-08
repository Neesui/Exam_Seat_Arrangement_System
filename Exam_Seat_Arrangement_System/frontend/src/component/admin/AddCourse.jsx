import React from 'react';

const AddCourse = ({ name, setName, duration, setDuration }) => {
  return (
    <div className="flex gap-6 mb-4">
      <div className="w-2/3">
        <label className="block text-gray-700 mb-2 font-semibold">Course Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter course name"
        />
      </div>

      <div className="w-1/3">
        <label className="block text-gray-700 mb-2 font-semibold">Duration (Semesters):</label>
        <input
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter duration"
        />
      </div>
    </div>
  );
};

export default AddCourse;
