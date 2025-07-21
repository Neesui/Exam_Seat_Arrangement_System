import React from "react";

const SeatingPlanFilter = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search by course, subject, or room..."
      className="w-full sm:max-w-md p-2 border rounded"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SeatingPlanFilter;
