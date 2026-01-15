import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/main-page', icon: 'M5 12l-2 0l9 -9l9 9l-2 0 M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7 M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6' },
    { name: 'Favorites', path: '/favorites', icon: 'M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' },
    { name: 'Profile', path: '/profile', icon: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855' }
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[65%] max-w-md bg-[#FEF3E2] border border-[#f2e9da] rounded-3xl shadow-2xl flex justify-evenly items-center py-1 px-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`nav-item flex flex-col items-center justify-center gap-1 text-[#fa9500] p-1 rounded-2xl cursor-pointer transition-all duration-200 ${
            location.pathname === item.path ? 'text-[#eb6424]' : ''
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 transition-colors duration-200"
            fill={location.pathname === item.path ? '#eb6424' : 'none'}
            viewBox="0 0 24 24"
            stroke={location.pathname === item.path ? '#FAF3E2' : 'currentColor'}
            strokeWidth="2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d={item.icon} />
          </svg>
          <span className="hidden md:inline text-xs font-medium">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}

export default Navbar;
