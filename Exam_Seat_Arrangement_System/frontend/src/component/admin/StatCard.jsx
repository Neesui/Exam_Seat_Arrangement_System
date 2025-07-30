import React from "react";

const StatCard = ({ icon, label, value, iconBg, isCurrency = false }) => {
  return (
    <div className="bg-white shadow-sm p-4 rounded-md flex items-center justify-between">
      <div className={`w-14 h-14 ${iconBg} flex items-center justify-center rounded-full`}>
        {icon}
      </div>
      <div className="text-right ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">
          {isCurrency ? `$${value}` : value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
