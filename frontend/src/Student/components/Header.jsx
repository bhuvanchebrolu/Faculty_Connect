import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // Temporary user data - replace with actual user context/state
  const currentUser = {
    name: 'Aditya Kumar',
    role: 'student'
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-4">
            {/* NIT Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">NIT</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">National Institute of Technology</h1>
                <p className="text-xs text-gray-500">Tiruchirappalli</p>
              </div>
            </div>

            {/* SCIENT Badge */}
            <div className="hidden md:flex items-center ml-4">
              <div className="bg-gray-700 px-3 py-1 rounded">
                <span className="text-yellow-500 font-semibold text-xs">SCIENT</span>
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-900">Internship Portal</p>
                <p className="text-xs text-gray-500">Student Access</p>
              </div>
            </div>
          </div>

          {/* Right Side - Navigation Icons and User */}
          <div className="flex items-center space-x-6">
            {/* Home Icon */}
            <button
              onClick={() => navigate('/student/home')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Home"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            {/* Notifications Icon */}
            <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            </button>

            {/* User Profile */}
            <button
              onClick={() => navigate('/student/profile')}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">{currentUser.name}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;