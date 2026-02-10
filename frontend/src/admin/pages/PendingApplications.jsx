import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

const PendingApplications = () => {
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const { error: showError, success: showSuccess } = useMessage();

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    setIsLoading(true);

    const result = await apiRequest('/api/admin/applications/pending');

    if (result.success) {
      setApplications(result.data.data || []);
    } else {
      showError('Error', 'Failed to load pending applications');
    }

    setIsLoading(false);
  };

  const handleApplicationStatus = async (applicationId, status, e) => {
    e.stopPropagation();
    
    const confirmMessage = status === 'approved' 
      ? 'Are you sure you want to approve this application?'
      : 'Are you sure you want to reject this application?';
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setProcessingId(applicationId);

    try {
      const result = await apiRequest(`/api/admin/applications/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      if (result.success) {
        showSuccess('Success', `Application ${status} successfully`);
        // Refresh applications
        await fetchPendingApplications();
      } else {
        showError('Error', result.message || `Failed to ${status} application`);
      }
    } catch (error) {
      showError('Error', `Failed to ${status} application`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewCV = (resumeUrl, e) => {
    e.stopPropagation();
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      showError('No CV', 'Resume not available for this application');
    }
  };

  // Filter applications by search
  console.log(applications)
  const filteredApplications = applications.filter(app => {
    const search = searchTerm.toLowerCase();
    return (
      app.applicantName?.toLowerCase().includes(search) ||
      app.rollNumber?.toLowerCase().includes(search) ||
      app.applicantEmail?.toLowerCase().includes(search) ||
      app.branch?.toLowerCase().includes(search) ||
      app.skills?.toLowerCase().includes(search) ||
      app.projectTitle?.toLowerCase().includes(search)
    );
  });

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Applications</h1>
              <p className="text-gray-600">Review and manage applications awaiting your decision</p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Pending Applications</p>
              <p className="text-4xl font-bold text-yellow-900">{applications.length}</p>
              <p className="text-sm text-yellow-700 mt-2">Applications awaiting your review</p>
            </div>
            <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by student name, roll number, email, branch, skills, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-3 text-sm text-gray-600">
              Found <span className="font-semibold text-yellow-700">{filteredApplications.length}</span> result{filteredApplications.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
              <p className="text-gray-600">Loading pending applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm ? 'No matching applications' : 'No pending applications'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search term' 
                  : 'All applications have been reviewed. Great work!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-yellow-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Academic Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Statement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      CV
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">{app.applicantName}</div>
                          <div className="text-sm text-gray-600 mb-0.5">
                            <span className="font-medium">Roll:</span> {app.rollNumber}
                          </div>
                          <div className="text-sm text-gray-600 mb-0.5">
                            <span className="font-medium">Email:</span> {app.applicantEmail}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {app.applicantPhone}
                          </div>
                          <div className="mt-2 inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            Applied to: {app.projectTitle}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{app.branch}</div>
                          <div className="text-gray-600">Year {app.year}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {truncateText(app.skills, 80)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-base font-bold text-gray-900">{app.cgpa}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm text-gray-900">
                          {truncateText(app.statementOfInterest, 100)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => handleViewCV(app.resumeUrl, e)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View CV
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={(e) => handleApplicationStatus(app._id, 'approved', e)}
                            disabled={processingId === app._id}
                            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          >
                            {processingId === app._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => handleApplicationStatus(app._id, 'rejected', e)}
                            disabled={processingId === app._id}
                            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          >
                            {processingId === app._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        {!isLoading && filteredApplications.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing <span className="font-semibold text-gray-900">{filteredApplications.length}</span> pending application{filteredApplications.length !== 1 ? 's' : ''}
              </span>
              <span className="text-gray-500">
                Review applications to help students advance their academic journey
              </span>
            </div>
          </div>
        )}
      </main>

      <AdminFooter />
    </div>
  );
};

export default PendingApplications;