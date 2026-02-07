import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultyHeader from '../components/FacultyHeader';
import Footer from '../components/Footer';

const FacultyProfileDetails = () => {
  const navigate = useNavigate();

  // Temporary faculty data - replace with API call
  // TODO: Replace with fetch('/api/faculty/profile/details')
  const [facultyData, setFacultyData] = useState({
    name: 'Dr. Ramesh Kumar',
    designation: 'Associate Professor',
    department: 'Computer Science and Engineering',
    email: 'ramesh@nitt.edu',
    phone: '+91 9876543210',
    officeRoom: 'Block A, Room 305',
    researchInterests: 'Machine Learning, Artificial Intelligence, Healthcare Informatics, Data Science',
    qualifications: 'Ph.D. in Computer Science (IIT Madras), M.Tech in Computer Science (NIT Trichy)',
    experience: '12 years',
    activeProjects: 3,
    totalApplicationsReceived: 15,
    studentsAccepted: 8,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...facultyData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    // TODO: Replace with actual API call
    /*
    fetch('/api/faculty/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedData),
    })
      .then(response => response.json())
      .then(data => {
        setFacultyData(editedData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update profile. Please try again.');
      });
    */

    // Temporary success
    setFacultyData(editedData);
    setIsEditing(false);
    alert('Profile updated successfully! (This is a demo - no actual update)');
  };

  const handleCancel = () => {
    setEditedData({ ...facultyData });
    setIsEditing(false);
  };

  const handleLogout = () => {
    // TODO: Replace with actual API call
    /*
    fetch('/api/auth/logout', {
      method: 'POST',
    })
      .then(() => {
        localStorage.removeItem('authToken');
        navigate('/login');
      })
      .catch(error => {
        console.error('Error:', error);
      });
    */

    // Temporary logout
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully! (This is a demo)');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyHeader />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/faculty/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Details</h1>
          <p className="text-gray-600 mt-1">View and manage your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {facultyData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{facultyData.name}</h2>
                <p className="text-gray-600">{facultyData.designation}</p>
                <p className="text-sm text-gray-500">{facultyData.department}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{facultyData.activeProjects}</div>
              <div className="text-sm text-gray-600 mt-1">Active Projects</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{facultyData.totalApplicationsReceived}</div>
              <div className="text-sm text-gray-600 mt-1">Applications Received</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{facultyData.studentsAccepted}</div>
              <div className="text-sm text-gray-600 mt-1">Students Accepted</div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <p className="text-gray-900">{facultyData.name}</p>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="designation"
                    value={editedData.designation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{facultyData.designation}</p>
                )}
              </div>

              {/* Department (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <p className="text-gray-900">{facultyData.department}</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{facultyData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{facultyData.phone}</p>
                )}
              </div>

              {/* Office Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="officeRoom"
                    value={editedData.officeRoom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{facultyData.officeRoom}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Experience
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={editedData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{facultyData.experience}</p>
                )}
              </div>
            </div>

            {/* Research Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Research Interests
              </label>
              {isEditing ? (
                <textarea
                  name="researchInterests"
                  value={editedData.researchInterests}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-900">{facultyData.researchInterests}</p>
              )}
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications
              </label>
              {isEditing ? (
                <textarea
                  name="qualifications"
                  value={editedData.qualifications}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-900">{facultyData.qualifications}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={handleLogout}
              className="px-6 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              Logout
            </button>

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/faculty/profile')}
            className="flex items-center justify-center px-6 py-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-gray-900">View Projects</div>
              <div className="text-sm text-gray-500">Manage your research projects</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/faculty/add-project')}
            className="flex items-center justify-center px-6 py-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-gray-900">Add New Project</div>
              <div className="text-sm text-gray-500">Create a new research opportunity</div>
            </div>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyProfileDetails;