import React from 'react';
import Input from '../../component/public/Input';

const AddSemester = ({ semester, onSemesterNumChange, onSubjectChange, onAddSubject }) => {
  return (
    <div className="space-y-4">
      <Input
        id="semester-num" 
        label="Semester Number"
        type="number"
        name="semesterNum"
        value={semester.semesterNum}
        onChange={(e) => onSemesterNumChange(Number(e.target.value))}
        required
      />

      <div className="space-y-4">
        {semester.subjects.map((subject, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50"
          >
            <h4 className="font-semibold text-gray-700 mb-2">Subject {index + 1}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id={`subject-${index}-name`}
                label="Subject Name"
                name={`subjectName-${index}`}
                value={subject.subjectName}
                onChange={(e) => onSubjectChange(index, 'subjectName', e.target.value)}
                required
              />

              <Input
                id={`subject-${index}-code`}
                label="Subject Code"
                name={`code-${index}`}
                value={subject.code}
                onChange={(e) => onSubjectChange(index, 'code', e.target.value)}
                required
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddSubject}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Subject
        </button>
      </div>
    </div>
  );
};

export default AddSemester;
