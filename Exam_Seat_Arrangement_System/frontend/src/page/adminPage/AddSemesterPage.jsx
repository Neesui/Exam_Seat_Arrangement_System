import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddSemesterMutation } from '../../redux/api/courseApi';

const AddSemesterPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [semesterNum, setSemesterNum] = useState('');
  const [subjects, setSubjects] = useState([{ subjectName: '', code: '' }]);

  const [addSemester, { isLoading }] = useAddSemesterMutation();

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subjectName: '', code: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!semesterNum) return toast.error('Semester number is required');

    try {
      await addSemester({
        courseId,
        semesterNum: parseInt(semesterNum, 10),
        subjects,
      }).unwrap();

      toast.success('Semester added successfully!');
      navigate('/admin/viewCourses');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to add semester');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Semester</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Semester Number:</label>
          <input
            type="number"
            value={semesterNum}
            onChange={(e) => setSemesterNum(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter semester number"
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold">Subjects:</h4>
          {subjects.map((subject, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                value={subject.subjectName}
                onChange={(e) =>
                  handleSubjectChange(index, 'subjectName', e.target.value)
                }
                className="flex-1 border p-2 rounded"
                placeholder="Subject Name"
              />
              <input
                type="text"
                value={subject.code}
                onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Subject Code"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSubject}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-2"
          >
            + Add Subject
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {isLoading ? 'Saving...' : 'Add Semester'}
        </button>
      </form>
    </div>
  );
};

export default AddSemesterPage;
