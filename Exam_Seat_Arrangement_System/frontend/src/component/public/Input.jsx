import React from 'react';

const Input = ({ id, label, type = 'text', name, value, onChange, placeholder, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-gray-600 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Input;
