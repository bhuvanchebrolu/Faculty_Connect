import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import FacultyHeader from '../components/FacultyHeader';

import Footer from '../../Student/components/Footer';

const FacultyProfileDetails = () => {
  const navigate = useNavigate();
  const { user, apiRequest, logout } = useAuth();
  const { success, error } = useMessage();

  const [facultyData, setFacultyData] = useState({
    name: '',
    designation: '',
    department: '',
    email: '',
    phone: '',
    officeRoom: '',
    researchInterests: '',
    qualifications: '',
    experience: '',
    profileImage: '',
    activeProjects: 0,
    totalApplicationsReceived: 0,
    studentsAccepted: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...facultyData });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profile data and statistics
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch professor profile
        const profileResult = await apiRequest('/api/professors/profile', {
          method: 'GET',
        });

        if (profileResult.success) {
          const profile = profileResult.data.data;

          // Fetch projects for statistics
          const projectsResult = await apiRequest('/api/professors/projects', {
            method: 'GET',
          });

          let totalApplications = 0;
          let acceptedStudents = 0;
          let activeProjects = 0;

          if (projectsResult.success) {
            activeProjects = projectsResult.data.data.length;

            // Fetch applications for each project to calculate statistics
            for (const project of projectsResult.data.data) {
              const appResult = await apiRequest(
                `/api/professors/projects/${project._id}/applications`,
                { method: 'GET' }
              );

              if (appResult.success) {
                const applications = appResult.data.data;
                totalApplications += applications.length;
                acceptedStudents += applications.filter(
                  app => app.status === 'approved'
                ).length;
              }
            }
          }

          // Set faculty data
          const data = {
            name: profile.name || '',
            designation: profile.designation || '',
            department: profile.department || '',
            email: profile.email || '',
            phone: profile.phone || '',
            officeRoom: profile.officeRoom || '',
            researchInterests: profile.researchInterests || '',
            qualifications: profile.qualifications || '',
            experience: profile.experience || '',
            profileImage: profile.profileImage || '',
            activeProjects,
            totalApplicationsReceived: totalApplications,
            studentsAccepted: acceptedStudents,
          };

          setFacultyData(data);
          setEditedData(data);
        } else {
          error('Error', profileResult.error || 'Failed to load profile data');
        }
      } catch (err) {
        error('Error', 'An unexpected error occurred while loading profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, apiRequest, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setIsSaving(true);

    try {
      // Prepare update data (only fields that can be updated)
      const updateData = {
        name: editedData.name,
        designation: editedData.designation,
        department: editedData.department,
        profileImage: editedData.profileImage,
      };

      const result = await apiRequest('/api/professors/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (result.success) {
        setFacultyData(editedData);
        setIsEditing(false);
        success('Profile Updated', 'Your profile has been updated successfully!');
        
        // Update user in localStorage
        const updatedUser = { ...user, ...result.data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        error('Update Failed', result.error || 'Failed to update profile');
      }
    } catch (err) {
      error('Error', 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData({ ...facultyData });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
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

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {getInitials(facultyData.name)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{facultyData.name}</h2>
                    <p className="text-gray-600">{facultyData.designation || 'Faculty'}</p>
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
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedData.name}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    ) : (
                      <p className="text-gray-900">{facultyData.name}</p>
                    )}
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
                        disabled={isSaving}
                        placeholder="e.g., Associate Professor"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    ) : (
                      <p className="text-gray-900">{facultyData.designation || 'Not specified'}</p>
                    )}
                  </div>

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
                        disabled={isSaving}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    ) : (
                      <p className="text-gray-900">{facultyData.department}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900">{facultyData.email}</p>
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    )}
                  </div>

                  {/* Phone (Read-only from backend) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <p className="text-gray-900">{facultyData.phone || 'Not provided'}</p>
                  </div>

                  {/* Office Room (Read-only from backend) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Office Location
                    </label>
                    <p className="text-gray-900">{facultyData.officeRoom || 'Not provided'}</p>
                  </div>

                  {/* Experience (Read-only from backend) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teaching Experience
                    </label>
                    <p className="text-gray-900">{facultyData.experience || 'Not provided'}</p>
                  </div>
                </div>

                {/* Research Interests (Read-only from backend) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Interests
                  </label>
                  <p className="text-gray-900">{facultyData.researchInterests || 'Not provided'}</p>
                </div>

                {/* Qualifications (Read-only from backend) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <p className="text-gray-900">{facultyData.qualifications || 'Not provided'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handleLogout}
                  disabled={isSaving}
                  className="px-6 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Logout
                </button>

                {isEditing && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FacultyProfileDetails;