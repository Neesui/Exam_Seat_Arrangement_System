import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 1, text: 'Home', link: '/' },
    { id: 2, text: 'About', link: '/about' },
    { id: 3, text: 'View Exam Room', link: '/exam-room' },
  ];

  return (
    <div className='bg-[#150671] flex justify-between items-center h-24 mx-auto px-4 text-white'>
      {/* Logo */}
      <h1 className='text-3xl ml-25 font-bold text-white'>ABC College</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex mr-25 items-center'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 m-2 font-bold text-xl hover:bg-[#87c8de] rounded-xl cursor-pointer duration-300 hover:text-black'
          >
            <Link to={item.link}>{item.text}</Link>
          </li>
        ))}
        {/* Login Button */}
        <li className='ml-4 font-bold text-xl'>
          <Link
            to='/login'
            className='bg-[#ff0000] text-white px-4 py-2 rounded-sm hover:bg-[#51a48f] duration-300'
          >
            Login
          </Link>
        </li>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#150671] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        <h1 className='text-3xl font-bold text-white m-4'>ABC College</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b border-gray-300 font-bold text-lg hover:bg-[#00df9a] rounded-xl duration-300 hover:text-black cursor-pointer'
          >
            <Link to={item.link} onClick={() => setNav(false)}>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
