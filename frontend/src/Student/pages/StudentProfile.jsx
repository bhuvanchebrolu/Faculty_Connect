import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const StudentProfile = () => {
  const navigate = useNavigate();

  // Temporary student data - replace with API call later
  const [studentData, setStudentData] = useState({
    fullName: 'Aditya Kumar',
    rollNumber: '106120001',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    email: 'aditya@nitt.edu',
    phone: '+91 9876543210',
    cgpa: '8.5',
    skills: 'Python, JavaScript, React, Machine Learning',
    interests: 'AI, Web Development, Data Science',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...studentData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    // TODO: Uncomment and implement API call
    /*
    fetch('/api/student/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedData),
    })
      .then(response => response.json())
      .then(data => {
        setStudentData(editedData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update profile. Please try again.');
      });
    */

    // Temporary success
    setStudentData(editedData);
    setIsEditing(false);
    alert('Profile updated successfully! (This is a demo - no actual update)');
  };

  const handleCancel = () => {
    setEditedData({ ...studentData });
    setIsEditing(false);
  };

  const handleLogout = () => {
    // TODO: Uncomment and implement API call
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
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {studentData.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{studentData.fullName}</h2>
                <p className="text-gray-600">{studentData.rollNumber}</p>
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

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={editedData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{studentData.department}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              {isEditing ? (
                <select
                  name="year"
                  value={editedData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              ) : (
                <p className="text-gray-900">{studentData.year}</p>
              )}
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
                <p className="text-gray-900">{studentData.email}</p>
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
                <p className="text-gray-900">{studentData.phone}</p>
              )}
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGPA
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="cgpa"
                  value={editedData.cgpa}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{studentData.cgpa}</p>
              )}
            </div>

            {/* Roll Number (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number
              </label>
              <p className="text-gray-900">{studentData.rollNumber}</p>
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="skills"
                  value={editedData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., Python, JavaScript, Machine Learning"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{studentData.skills}</p>
              )}
            </div>

            {/* Interests */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Interest
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="interests"
                  value={editedData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., AI, Web Development, Data Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{studentData.interests}</p>
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
      </main>

      <Footer />
    </div>
  );
};

export default StudentProfile;