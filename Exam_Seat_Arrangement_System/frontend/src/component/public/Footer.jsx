import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12">
      {/* Top 3-column layout */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-30 pb-8">

        {/* Left Section */}
        <div>
          <img
            src=""
            alt="ABC College Logo"
            className="h-16 mb-4"
          />
          <p>
            ABC College offers programs in Humanities, Management, and Computer Science
            affiliated with Tribhuvan University (TU) for both graduate and undergraduate degrees.
          </p>
          <p className="mt-4">
            <strong>Address:</strong> Bagbazar, Kathmandu
            <br />
            <strong>Email:</strong> info@abccollege.edu.np
            <br />
            <strong>Contact:</strong> +977‑1‑4141111
          </p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col md:flex-row md:space-x-45">
          <div>
            <h4 className="text-white font-bold mb-4">Programs</h4>
            <ul className="space-y-2">
              <li><a href="/programs/bit" className="hover:text-white">BIT</a></li>
              <li><a href="/programs/bim" className="hover:text-white">BIM</a></li>
              <li><a href="/programs/bca" className="hover:text-white">BCA</a></li>
              <li><a href="/programs/bbs" className="hover:text-white">BBS</a></li>
              <li><a href="/programs/bscsit" className="hover:text-white">BsCsit</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/exam_room" className="hover:text-white">View Exam Room</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <h4 className="text-white font-bold mb-4">Connect Us</h4>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="bg-gray-700 p-3 rounded-full hover:bg-teal-600 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="bg-gray-700 p-3 rounded-full hover:bg-teal-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="bg-gray-700 p-3 rounded-full hover:bg-teal-500 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom full-width copyright */}
      <div className="text-center text-sm text-gray-500 border-t border-gray-700 py-4">
        © 2025 ABC College. All rights reserved.
      </div>
    </footer>
  );
};
