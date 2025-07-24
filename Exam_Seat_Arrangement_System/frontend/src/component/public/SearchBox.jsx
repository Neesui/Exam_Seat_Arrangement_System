import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBox = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(inputValue.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="flex-grow p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Search"
      >
        <FiSearch size={20} />
      </button>
    </form>
  );
};

export default SearchBox;
