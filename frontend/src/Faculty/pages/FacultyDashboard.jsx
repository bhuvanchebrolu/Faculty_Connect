import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import FacultyHeader from '../components/FacultyHeader';
import Footer from '../../Student/components/Footer';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { error: showError } = useMessage();
  
  const [activeTab, setActiveTab] = useState('all');
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { apiRequest, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  if (!isLoading && isAuthenticated) {
    fetchApplications();
  }
}, [isLoading, isAuthenticated]);


  const fetchApplications = async () => {
    setIsLoading(true);
    
    // Get all professor's projects first
    const projectsResult = await apiRequest('/api/professors/projects');
    
    if (projectsResult.success) {
      const projects = projectsResult.data.data;
      
      // Fetch applications for each project
      const allApplications = [];
      for (const project of projects) {
        const appsResult = await apiRequest(`/api/professors/projects/${project._id}/applications`);
        if (appsResult.success) {
          // Add project title to each application
          const appsWithProject = appsResult.data.map(app => ({
            ...app,
            projectTitle: project.title,
            projectId: project._id,
          }));
          allApplications.push(...appsWithProject);
        }
      }
      
      setApplications(allApplications);
    } else {
      showError('Error', 'Failed to load applications');
    }
    
    setIsLoading(false);
  };

  const getFilteredApplications = () => {
    let filtered = applications;
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(app => app.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicantName?.toLowerCase().includes(search) ||
        app.applicantEmail?.toLowerCase().includes(search) ||
        app.rollNumber?.toLowerCase().includes(search) ||
        app.branch?.toLowerCase().includes(search) ||
        app.skills?.toLowerCase().includes(search) ||
        app.projectTitle?.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  };

  const filteredApplications = getFilteredApplications();

  const handleViewApplication = (applicationId) => {
    navigate(`/professor/applications/${applicationId}`);
  };

  const handleViewCV = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      showError('No CV', 'Resume not available for this application');
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Count applications by status
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Dashboard</h1>
          <p className="text-gray-600">Manage your projects and review student applications</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate('/professor/add-project/')}
            className="flex items-center px-6 py-3 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </button>
          <button
            onClick={() => navigate('/professor/profile')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            View Profile / Edit Projects
          </button>
        </div>

        {/* Received Applications Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Received Applications</h2>
            <p className="text-sm text-gray-600">{applications.length} applications received</p>
          </div>

          {/* SEARCH BAR */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by student name, email, roll number, branch, skills, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Found <span className="font-semibold">{filteredApplications.length}</span> result{filteredApplications.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'rejected'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : (
            <>
              {/* Applications Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skills
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CGPA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CV
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr 
                        key={application._id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewApplication(application._id)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{application.applicantName}</div>
                            <div className="text-sm text-gray-600">{application.rollNumber}</div>
                            <div className="text-sm text-gray-600">{application.applicantEmail}</div>
                            <div className="text-sm text-gray-600">{application.applicantPhone}</div>
                            <div className="mt-2">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(application.status)}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Applied to: <span className="font-medium">{application.projectTitle}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{application.branch}</div>
                          <div className="text-xs text-gray-500">Year {application.year}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{truncateText(application.skills)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{application.cgpa}</div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm text-gray-900">
                            {truncateText(application.statementOfInterest, 60)}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewApplication(application._id);
                            }}
                            className="text-xs text-yellow-600 hover:text-yellow-700 font-medium mt-1"
                          >
                            Read more
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCV(application.resumeUrl);
                            }}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {searchTerm ? 'No matching applications' : 'No applications'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? 'Try adjusting your search term' 
                      : activeTab === 'all' 
                        ? 'No applications have been received yet.' 
                        : `No ${activeTab} applications found.`}
                  </p>
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

export default FacultyDashboard;