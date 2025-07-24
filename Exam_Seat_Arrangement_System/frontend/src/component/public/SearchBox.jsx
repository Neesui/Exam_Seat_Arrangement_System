import React from "react";

const SearchBox = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder || "Search..."}
    className="flex-grow p-2 border rounded"
  />
);

export default SearchBox;
