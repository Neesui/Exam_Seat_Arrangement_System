import React from "react";

const SelectFilter = ({ label, options, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="p-2 border rounded"
    aria-label={label}
  >
    <option value="">{label || "Select"}</option>
    {options.map(({ value: val, label: lbl }) => (
      <option key={val} value={val}>
        {lbl}
      </option>
    ))}
  </select>
);

export default SelectFilter;
