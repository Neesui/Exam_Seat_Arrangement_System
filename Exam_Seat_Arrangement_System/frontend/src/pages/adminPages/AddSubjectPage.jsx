import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddSubjectMutation } from '../../redux/api/subjectApi'; 

const AddSubjectPage = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();

  const [subjectName, setSubjectName] = useState('');
  const [code, setCode] = useState('');
  const [addSubject, { isLoading }] = useAddSubjectMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectName.trim() || !code.trim()) {
      toast.error("Subject Name and Code are required");
      return;
    }

    try {
      await addSubject({ semesterId: Number(semesterId), subjectName, code }).unwrap();
      toast.success('Subject added successfully!');
      navigate('/admin/viewCourses');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to add subject');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Subject</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Subject Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {isLoading ? 'Saving...' : 'Add Subject'}
        </button>
      </form>
    </div>
  );
};

export default AddSubjectPage;
