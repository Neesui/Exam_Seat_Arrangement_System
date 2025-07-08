import React from 'react';

const AddSubject = ({ subject, onChange }) => {
  return (
    <div className="flex gap-2 mb-2 items-center">
      <input
        type="text"
        placeholder="Subject Name"
        value={subject.subjectName}
        onChange={(e) => onChange('subjectName', e.target.value)}
        className="border p-2 rounded w-1/2"
      />
      <input
        type="text"
        placeholder="Code"
        value={subject.code}
        onChange={(e) => onChange('code', e.target.value)}
        className="border p-2 rounded w-1/3"
      />
    </div>
  );
};

export default AddSubject;
