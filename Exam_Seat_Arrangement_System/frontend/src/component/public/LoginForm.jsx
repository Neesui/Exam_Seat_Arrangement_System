import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/api/authApi';
import { loginSuccess } from '../../redux/features/authReducer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(loginSuccess(result));

      switch (result.user.role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'INVIGILATOR':
          navigate('/invigilator');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      const message = err?.data?.error || 'Failed to login';
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-white p-8 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

      {/* Email */}
      <div className="relative mb-5">
        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 pr-5 py-5 w-full border rounded-md focus:outline-none"
        />
      </div>

      {/* Password */}
      <div className="relative mb-5">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 pr-5 py-5 w-full border rounded-md focus:outline-none"
        />
      </div>

      {/* Remember & Forgot Password */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[15px] gap-2 mb-5">
        <label className="flex items-center gap-1">
          <input type="checkbox" />
          Remember me
        </label>
        <a href="/forgot-password" className="text-red-500 text-[16px] hover:underline">Forgot Password?</a>
      </div>

      {/* Submit Button */}
      <button
        className="bg-gradient-to-r from-[#038884] to-purple-800 text-white text-xl px-4 py-4 rounded-md w-full font-semibold"
        onClick={handleSubmit}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default LoginForm;
