import React from 'react';

const AddCourse = ({ name, setName, duration, setDuration, batchYear, setBatchYear }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Course Name */}
      <div>
        <label className="block text-gray-700 mb-2 font-semibold">Course Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter course name"
        />
      </div>

      {/* Duration */}
      <div>
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

      {/* Batch Year */}
      <div>
        <label className="block text-gray-700 mb-2 font-semibold">Batch Year:</label>
        <input
          type="number"
          min={2000}
          max={2100}
          value={batchYear}
          onChange={(e) => setBatchYear(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter batch year (e.g., 2025)"
        />
      </div>
    </div>
  );
};

export default AddCourse;
