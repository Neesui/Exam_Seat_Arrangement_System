import React from "react";
import { FaHome, FaUser, FaCog } from "react-icons/fa";

const Sidebar = () => (
  <aside className="w-64 h-screen bg-[#2E3A59] text-white fixed">
    <div className="p-6 text-2xl font-bold">📊 Admin Panel</div>
    <nav className="flex flex-col gap-4 mt-6 px-4">
      <a href="#" className="flex items-center gap-3 text-white hover:bg-[#1F2A3F] p-2 rounded">
        <FaHome /> Dashboard
      </a>
      <a href="#" className="flex items-center gap-3 text-white hover:bg-[#1F2A3F] p-2 rounded">
        <FaUser /> Users
      </a>
      <a href="#" className="flex items-center gap-3 text-white hover:bg-[#1F2A3F] p-2 rounded">
        <FaCog /> Settings
      </a>
    </nav>
  </aside>
);

export default Sidebar;
