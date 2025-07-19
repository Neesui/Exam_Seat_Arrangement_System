import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye } from "react-icons/fa";

const SidebarSection = ({ icon, label, isOpen, setIsOpen, links }) => (
  <li className="p-4 hover:bg-gray-700">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="w-full text-left flex items-center"
    >
      {icon}
      {label}
    </button>
    {isOpen && (
      <ul className="pl-4 mt-2 bg-gray-700 rounded-md">
        {links.map((link, i) => (
          <li key={i} className="p-3 hover:bg-gray-600 flex items-center">
            {i === 0 ? <FaPlus className="mr-2" /> : <FaEye className="mr-2" />}
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    )}
  </li>
);

export default SidebarSection;
