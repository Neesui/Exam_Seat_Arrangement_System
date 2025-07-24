import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetInvigilatorByIdQuery,
  useUpdateInvigilatorMutation,
} from '../../redux/api/invigilatorApi';

const UpdateInvigilatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invigilatorData, error, isLoading } = useGetInvigilatorByIdQuery(id);
  const [updateInvigilator, { isLoading: isUpdating }] = useUpdateInvigilatorMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
    phone: '',
    address: '',
    gender: '',
  });

  const [image, setImage] = useState(null);         // new image
  const [preview, setPreview] = useState(null);     // for image preview

  useEffect(() => {
    if (invigilatorData) {
      setFormData({
        name: invigilatorData.name || '',
        email: invigilatorData.email || '',
        password: '',
        course: invigilatorData.course || '',
        phone: invigilatorData.phone || '',
        address: invigilatorData.address || '',
        gender: invigilatorData.gender || '',
      });

      // If backend returns image URL
      if (invigilatorData.image) {
        setPreview(`http://localhost:3000/uploads/${invigilatorData.image}`);
      }
    }
  }, [invigilatorData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      for (const key in formData) {
        fd.append(key, formData[key]);
      }
      if (image) fd.append('image', image);

      await updateInvigilator({ id, formData: fd }).unwrap();
      toast.success('Invigilator updated successfully!');
      navigate('/viewInvigilator');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update invigilator.');
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to load invigilator.</p>;

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Invigilator</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
        {["name", "email", "password", "course", "phone", "address"].map((field) => (
          <div key={field}>
            <label className="block mb-1 font-semibold capitalize">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        {/* Gender Select */}
        <div>
          <label className="block mb-1 font-semibold">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-semibold">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isUpdating}
          className={`w-full bg-green-600 text-white p-3 rounded font-semibold hover:bg-green-700 transition ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUpdating ? "Updating..." : "Update Invigilator"}
        </button>
      </form>
    </div>
  );
};

export default UpdateInvigilatorPage;
