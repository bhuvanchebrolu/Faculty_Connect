import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import FacultyHeader from '../components/FacultyHeader';
import Footer from '../components/Footer';
import FacultyProjectCard from '../components/FacultyProjectCard';

const FacultyProfile = () => {
  const navigate = useNavigate();
  const { user, apiRequest } = useAuth();
  const { success, error } = useMessage();

  const [facultyInfo, setFacultyInfo] = useState({
    name: '',
    department: '',
    email: '',
    activeProjects: 0,
  });

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch faculty profile and projects
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Set faculty info from authenticated user
        setFacultyInfo({
          name: user?.name || '',
          department: user?.department || '',
          email: user?.email || '',
          activeProjects: 0, // Will be updated after fetching projects
        });

        // Fetch all projects from the professor
        const projectsResult = await apiRequest('/api/professors/projects', {
          method: 'GET',
        });

        if (projectsResult.success) {
          const projectsData = projectsResult.data.data;

          // For each project, fetch its applications to get counts
          const projectsWithCounts = await Promise.all(
            projectsData.map(async (project) => {
              const appResult = await apiRequest(
                `/api/professors/projects/${project._id}/applications`,
                { method: 'GET' }
              );

              const applications = appResult.success ? appResult.data.data : [];

              return {
                id: project._id,
                title: project.title,
                description: project.description,
                cvRequired: true, // Assuming all require CV for now
                totalApplications: applications.length,
                pending: applications.filter(app => app.status === 'pending').length,
                accepted: applications.filter(app => app.status === 'approved').length,
                rejected: applications.filter(app => app.status === 'rejected').length,
              };
            })
          );

          setProjects(projectsWithCounts);
          setFacultyInfo(prev => ({
            ...prev,
            activeProjects: projectsWithCounts.length,
          }));
        } else {
          error('Error', projectsResult.error || 'Failed to load projects');
        }
      } catch (err) {
        error('Error', 'An unexpected error occurred while loading data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, apiRequest, error]);

  const handleEditProject = (projectId) => {
    navigate(`/faculty/edit-project/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const result = await apiRequest(`/api/professors/projects/${projectId}`, {
          method: 'DELETE',
        });

        if (result.success) {
          success('Project Deleted', 'The project has been deleted successfully');
          // Remove project from local state
          setProjects(prev => prev.filter(p => p.id !== projectId));
          setFacultyInfo(prev => ({
            ...prev,
            activeProjects: prev.activeProjects - 1,
          }));
        } else {
          error('Delete Failed', result.error || 'Failed to delete project');
        }
      } catch (err) {
        error('Error', 'An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Profile</h1>
          <p className="text-gray-600">{facultyInfo.name} - {facultyInfo.department}</p>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <p className="text-gray-900 font-medium">{facultyInfo.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <p className="text-gray-900 font-medium">{facultyInfo.department}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900 font-medium">{facultyInfo.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Active Projects</label>
              <p className="text-2xl font-bold text-yellow-600">{facultyInfo.activeProjects}</p>
            </div>
          </div>
        </div>

        {/* Active Projects & Applications Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Active Projects & Applications</h2>
            <p className="text-sm text-gray-600">Manage your research projects and track application status</p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
                <p className="mt-4 text-gray-600">Loading projects...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              <div className="grid grid-cols-1 gap-6">
                {projects.map((project) => (
                  <FacultyProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>

              {/* Empty State */}
              {projects.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/faculty/add-project')}
                      className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Project
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyProfile;