// src/components/layouts/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; // adjust path if needed

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Habits', path: '/habits' },
  { name: 'Reminders', path: '/reminders' },
  { name: 'Timetable', path: '/timetable' },
  { name: 'Tools', path: '/tools' },
  { name: 'AI Checkup', path: '/ai-checkup' },
  { name: 'Analytics', path: '/analytics' },
];

const Navbar = () => {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className={`fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-600 bg-opacity-30 backdrop-blur-lg bg-gray-900/40 text-gray-100 shadow-lg px-4 md:px-6 py-3 transition-colors duration-300 border-b-1 border-white/10`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-extrabold tracking-widest hover:opacity-80 transition flex-shrink-0"
        >
          WLBA
        </Link>

        {/* Center nav links */}
        <div className="hidden lg:flex space-x-6 flex-1 justify-center mx-8">
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium tracking-wide transition whitespace-nowrap ${location.pathname === item.path
                ? 'border-b-2 pb-1 border-current'
                : 'hover:opacity-70'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${darkMode ? 'border-yellow-400 hover:bg-yellow-400 hover:text-gray-900'
              : 'border-gray-400 hover:bg-gray-400 hover:text-white'
              } transition`}
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Settings icon */}
          <Link
            to="/settings"
            title="Settings"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-current hover:opacity-80 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.82 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.82 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.82-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.82-3.31 2.37-2.37.526.321 1.026.541 1.526.541zm-1.874 5.378a2 2 0 11-2 2 2 2 0 012-2z"
              />
            </svg>
          </Link>

          {/* Profile placeholder */}
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold shadow-md ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'
            }`}>
            G
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
