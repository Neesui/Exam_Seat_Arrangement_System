import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye } from "react-icons/fa";

const SidebarSection = ({ icon, label, isOpen, setIsOpen, links }) => (
  <li className="p-2 hover:bg-gray-700 rounded-md">
    <button
      onClick={setIsOpen}
      className="w-full text-left flex items-center focus:outline-none"
      aria-expanded={isOpen}
      aria-controls={`${label}-submenu`}
    >
      {icon}
      <span className="flex-grow ml-2">{label}</span>
    </button>

    {isOpen && (
      <ul
        id={`${label}-submenu`}
        className="pl-6 mt-1 space-y-1 bg-gray-700 rounded-md"
      >
        {links.map((link, i) => (
          <li
            key={link.path}
            className="p-2 hover:bg-gray-600 flex items-center rounded"
          >
            {i === 0 ? (
              <FaPlus className="mr-2 text-sm" />
            ) : (
              <FaEye className="mr-2 text-sm" />
            )}
            <Link to={link.path} className="text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </li>
);

export default SidebarSection;
