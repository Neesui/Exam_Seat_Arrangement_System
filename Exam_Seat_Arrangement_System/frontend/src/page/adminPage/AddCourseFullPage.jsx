import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddCoursesMutation } from '../../redux/api/courseApi';
import AddCourse from '../../component/admin/AddCourse';
import AddSemester from '../../component/admin/AddSemester';

const AddCourseFullPage = () => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [semester, setSemester] = useState({
    semesterNum: 1,
    subjects: [{ subjectName: '', code: '' }],
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [addCourse, { isLoading }] = useAddCoursesMutation();

  const handleSemesterNumChange = (value) => {
    setSemester({ ...semester, semesterNum: value });
  };

  const handleSubjectChange = (subjectIndex, field, value) => {
    const updatedSubjects = [...semester.subjects];
    updatedSubjects[subjectIndex][field] = value;
    setSemester({ ...semester, subjects: updatedSubjects });
  };

  const handleAddSubject = () => {
    setSemester({
      ...semester,
      subjects: [...semester.subjects, { subjectName: '', code: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !duration.trim()) {
      setError('Course name and duration are required.');
      return;
    }

    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration)) {
      setError('Duration must be a number.');
      return;
    }

    if (!semester.semesterNum || semester.semesterNum <= 0) {
      setError('Semester number must be valid.');
      return;
    }

    for (const sub of semester.subjects) {
      if (!sub.subjectName.trim() || !sub.code.trim()) {
        setError('All subject fields are required.');
        return;
      }
    }

    try {
      await addCourse({
        name: name.trim(),
        duration: parsedDuration,
        semesters: [semester],
      }).unwrap();

      toast.success('Course created successfully!');
      setName('');
      setDuration('');
      setSemester({ semesterNum: 1, subjects: [{ subjectName: '', code: '' }] });
      setError('');

      setTimeout(() => navigate('/admin/viewCourses'), 1000);
    } catch (err) {
      console.error('Failed to create course:', err);
      toast.error(err.data?.message || 'Failed to create course');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add Course with Semesters & Subjects</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AddCourse name={name} setName={setName} duration={duration} setDuration={setDuration} />

        <div>
          <h3 className="text-xl font-semibold mb-4">Semesters & Subjects</h3>
          <AddSemester
            semester={semester}
            onSemesterNumChange={handleSemesterNumChange}
            onSubjectChange={handleSubjectChange}
            onAddSubject={handleAddSubject}
          />
        </div>

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-0 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          {isLoading ? 'Saving...' : 'Save Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourseFullPage;
