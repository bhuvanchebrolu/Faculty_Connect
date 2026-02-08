import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import FacultyHeader from '../../components/FacultyHeader';
import FacultyFooter from '../../components/FacultyFooter';

const ProfessorProfile = () => {
  const navigate = useNavigate();
  const { user, apiRequest, logout, updateProfile } = useAuth();
  const { success, error: showError } = useMessage();

  const [projects, setProjects] = useState([]);
  const [applicationCounts, setApplicationCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    designation: user?.designation || '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    const result = await apiRequest('/api/professors/projects');

    if (result.success) {
      const projectsList = result.data.data;
      setProjects(projectsList);

      // Fetch application counts for each project
      const counts = {};
      for (const project of projectsList) {
        const appsResult = await apiRequest(`/api/professors/projects/${project._id}/applications`);
        if (appsResult.success) {
          const apps = appsResult.data.data;
          counts[project._id] = {
            total: apps.length,
            pending: apps.filter(a => a.status === 'pending').length,
            accepted: apps.filter(a => a.status === 'approved').length,
            rejected: apps.filter(a => a.status === 'rejected').length,
          };
        }
      }
      setApplicationCounts(counts);
    } else {
      showError('Error', 'Failed to load projects');
    }

    setIsLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await updateProfile({
      name: formData.name,
      designation: formData.designation,
    });

    if (result.success) {
      success('Profile Updated!', 'Your profile has been updated successfully');
      setIsEditing(false);
    } else {
      showError('Update Failed', result.error);
    }

    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/');
    }
  };

  const activeProjectsCount = projects.filter(p => p.status === 'open').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/professor/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Profile</h1>
          <p className="text-gray-600">{user?.name} - {user?.department}</p>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Department (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Active Projects (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Active Projects</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100">
                  <span className="text-2xl font-bold text-yellow-600">{activeProjectsCount}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {isEditing ? (
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      department: user?.department || '',
                      designation: user?.designation || '',
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-6 py-2 border border-red-300 text-red-600 font-medium rounded-md hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Active Projects & Applications Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Active Projects & Applications</h2>
            <p className="text-sm text-gray-600">Manage your research projects and track application status</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new project</p>
              <button
                onClick={() => navigate('/professor/add-project')}
                className="mt-4 px-6 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Breakdown
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => {
                    const counts = applicationCounts[project._id] || { total: 0, pending: 0, accepted: 0, rejected: 0 };
                    return (
                      <tr key={project._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{project.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              CV Required: {project.cvRequired ? 'Yes' : 'No'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 max-w-md">
                            {project.description.length > 80 
                              ? project.description.substring(0, 80) + '...' 
                              : project.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-2xl font-bold text-gray-900">{counts.total}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Pending:</span>
                              <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                                {counts.pending}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Accepted:</span>
                              <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                                {counts.accepted}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Rejected:</span>
                              <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                                {counts.rejected}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => navigate(`/professor/projects/${project._id}/edit`)}
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <FacultyFooter />
    </div>
  );
};

export default ProfessorProfile;