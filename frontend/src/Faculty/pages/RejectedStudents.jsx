import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import FacultyHeader from '../components/FacultyHeader';
import FacultyFooter from '../components/Footer';

const RejectedStudents = () => {
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const { error: showError } = useMessage();

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRejectedApplications();
  }, []);

  const fetchRejectedApplications = async () => {
    setIsLoading(true);

    const projectsResult = await apiRequest('/api/professors/projects');

    if (projectsResult.success) {
      const projects = projectsResult.data.data;
      const allRejectedApps = [];

      for (const project of projects) {
        const appsResult = await apiRequest(`/api/professors/projects/${project._id}/applications`);
        if (appsResult.success) {
          const rejectedApps = appsResult.data.data.data
            .filter(app => app.status === 'rejected')
            .map(app => ({
              ...app,
              projectTitle: project.title,
              projectId: project._id,
            }));
          allRejectedApps.push(...rejectedApps);
        }
      }

      setApplications(allRejectedApps);
    } else {
      showError('Error', 'Failed to load applications');
    }

    setIsLoading(false);
  };

  // Filter by search
  const filteredApplications = applications.filter(app => {
    const search = searchTerm.toLowerCase();
    return (
      app.applicantName?.toLowerCase().includes(search) ||
      app.rollNumber?.toLowerCase().includes(search) ||
      app.applicantEmail?.toLowerCase().includes(search) ||
      app.branch?.toLowerCase().includes(search) ||
      app.projectTitle?.toLowerCase().includes(search)
    );
  });

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Rejected Students</h1>
          </div>
          <p className="text-gray-600">Students who were not selected for your projects</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search by student name, roll number, email, branch, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Found <span className="font-semibold">{filteredApplications.length}</span> rejected student{filteredApplications.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-red-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600">Loading rejected students...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'No matching rejected students' : 'No rejected students'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search' : 'Rejected students will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Branch/Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Applied For
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      CV
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-red-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{app.applicantName}</div>
                          <div className="text-sm text-gray-600">{app.rollNumber}</div>
                          <div className="text-xs text-gray-500">{app.applicantEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.branch}</div>
                        <div className="text-xs text-gray-500">Year {app.year}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{app.cgpa}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.projectTitle}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">No CV</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!isLoading && filteredApplications.length > 0 && (
            <div className="bg-red-50 px-6 py-4 border-t border-red-200">
              <p className="text-sm text-gray-700">
                Showing <span className="font-semibold">{filteredApplications.length}</span> rejected student{filteredApplications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </main>

      <FacultyFooter />
    </div>
  );
};

export default RejectedStudents;