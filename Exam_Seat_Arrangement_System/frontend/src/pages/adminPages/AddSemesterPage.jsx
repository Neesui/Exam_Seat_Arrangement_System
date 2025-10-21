import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddSemesterMutation } from '../../redux/api/semesterApi';

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

    if (!semesterNum) {
      toast.error('Semester number is required');
      return;
    }

    // Validate subjects - no empty names or codes allowed
    const isSubjectsValid = subjects.every(
      (sub) => sub.subjectName.trim() !== '' && sub.code.trim() !== ''
    );
    if (!isSubjectsValid) {
      toast.error('Please fill all subject fields');
      return;
    }

    const numericCourseId = Number(courseId);
    if (isNaN(numericCourseId)) {
      toast.error('Invalid course ID');
      return;
    }

    // Clean subjects: trim all fields
    const cleanedSubjects = subjects.map((sub) => ({
      subjectName: sub.subjectName.trim(),
      code: sub.code.trim(),
    }));

    const payload = {
      courseId: numericCourseId,
      semesterNum: Number(semesterNum),
      subjects: cleanedSubjects,
    };

    console.log('Submitting semester payload:', payload);

    try {
      await addSemester(payload).unwrap();

      toast.success('Semester added successfully!');
      navigate('/viewCourse'); 
    } catch (err) {
      console.error('Error adding semester:', err);
      toast.error(err?.data?.message || 'Failed to add semester');
    }
  };

  return (
    <div className="mx-auto  max-w-[99%]  bg-white p-6 rounded-lg shadow-md mt-3">
      <h2 className="text-2xl font-bold mb-4 underline">Add Semester</h2>

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
          <h4 className="text-lg font-semibold mb-2">Subjects:</h4>
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
