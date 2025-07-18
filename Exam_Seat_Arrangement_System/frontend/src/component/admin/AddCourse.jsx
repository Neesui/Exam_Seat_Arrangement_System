import React from 'react';
import Input from '../../component/public/Input';

const AddCourse = ({ name, setName, duration, setDuration, batchYear, setBatchYear }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        id="course-name"
        label="Course Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. B.Sc. Computer Science"
        required
      />

      <Input
        id="course-duration"
        label="Duration (Semesters)"
        type="number"
        name="duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="e.g. 3"
        required
      />

      <Input
        id="batch-year"
        label="Batch Year"
        type="number"
        name="batchYear"
        value={batchYear}
        onChange={(e) => setBatchYear(e.target.value)}
        placeholder="e.g. 2025"
        required
      />
    </div>
  );
};

export default AddCourse;
