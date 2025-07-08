import React from 'react';
import AddSubject from './AddSubject';

const AddSemester = ({
  semester,
  onSemesterNumChange,
  onAddSubject,
  onSubjectChange,
}) => {
  return (
    <div className="border p-4 rounded mb-6">
      <div className="flex items-center mb-4 gap-4">
        <label className="font-semibold">Semester Number:</label>
        <input
          type="number"
          min={1}
          value={semester.semesterNum}
          onChange={(e) => onSemesterNumChange(Number(e.target.value))}
          className="border p-2 rounded w-20"
        />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Subjects</h4>

        {semester.subjects.length === 0 && (
          <p className="text-gray-500 mb-2">No subjects added yet.</p>
        )}

        {semester.subjects.map((subject, idx) => (
          <AddSubject
            key={idx}
            subject={subject}
            onChange={(field, value) => onSubjectChange(idx, field, value)}
          />
        ))}

        <button
          type="button"
          onClick={onAddSubject}
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add Subject
        </button>
      </div>
    </div>
  );
};

export default AddSemester;
