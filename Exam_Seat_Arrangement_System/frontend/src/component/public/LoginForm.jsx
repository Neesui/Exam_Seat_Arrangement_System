import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa'; 
import { useNavigate } from'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/api/authApi';
import { loginSuccess } from '../../redux/features/authReduer';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // RTK Query mutation hook
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Call the login endpoint
      const result = await login({ email, password }).unwrap();
      
      // Update the auth state with the response
      dispatch(loginSuccess(result));
      
      // Redirect based on user role
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
      setError(err.data?.error || 'Failed to login');
    }
  };
  return (
    <div className="flex flex-col gap-4 w-full max-w-[300px]">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {/* Email input with icon */}
      <div className="relative">
        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 pr-4 py-4 w-full border rounded-md focus:outline-none"
        />
      </div>

      {/* Password input with icon */}
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 pr-4 py-4 w-full border rounded-md focus:outline-none"
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <label className="flex items-center gap-1">
          <input type="checkbox" />
          Remember me
        </label>
        <a href="#" className="text-red-500 text-[15px] hover:underline">Forgot Password?</a>
      </div>

      <button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white mt-1.5 px-4 py-4 rounded-md" onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
};

export default LoginForm;
