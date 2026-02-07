import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultyHeader from '../components/FacultyHeader';
import Footer from '../components/Footer';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Temporary data - replace with API call later
  // TODO: Replace with fetch('/api/faculty/applications')
  const applications = [
    {
      id: 1,
      studentName: 'Rahul Sharma',
      rollNumber: '106121045',
      email: 'rahul@nitt.edu',
      phone: '+91 9876543210',
      department: 'Computer Science and Engineering',
      skills: 'Python, TensorFlow, Machine Learning',
      interests: 'Artificial Intelligence, Healthcare',
      whyInternship: 'I am deeply passionate about applying machine learning to solve real-world healthcare challenges...',
      cvFilename: 'Rahul_Sharma_CV.pdf',
      projectTitle: 'Machine Learning for Healthcare Diagnostics',
      status: 'pending',
      appliedDate: '2026-02-05',
    },
    {
      id: 2,
      studentName: 'Priya Nair',
      rollNumber: '106121033',
      email: 'priya.n@nitt.edu',
      phone: '+91 9876543211',
      department: 'Computer Science and Engineering',
      skills: 'NLP, Python, NLTK, spaCy, Deep Learning',
      interests: 'Natural Language Processing, Regional Languages',
      whyInternship: 'Growing up in Kerala, I have witnessed firsthand the digital divide...',
      cvFilename: 'Priya_Nair_Resume.pdf',
      projectTitle: 'Natural Language Processing for Regional Languages',
      status: 'approved',
      appliedDate: '2026-02-04',
    },
    {
      id: 3,
      studentName: 'Aditya Patel',
      rollNumber: '107121018',
      email: 'aditya.p@nitt.edu',
      phone: '+91 9876543212',
      department: 'Electronics and Communication Engineering',
      skills: 'IoT, Arduino, Raspberry Pi, Python',
      interests: 'Internet of Things, Smart Cities',
      whyInternship: 'I am fascinated by the potential of IoT to transform campus infrastructure...',
      cvFilename: 'Aditya_Patel_CV.pdf',
      projectTitle: 'IoT-based Smart Campus Management',
      status: 'rejected',
      appliedDate: '2026-02-03',
    },
  ];

  const getFilteredApplications = () => {
    if (activeTab === 'all') return applications;
    return applications.filter(app => app.status === activeTab);
  };

  const filteredApplications = getFilteredApplications();

  const handleViewCV = (cvFilename) => {
    // TODO: Replace with actual CV viewing logic
    // window.open(`/api/applications/cv/${cvFilename}`, '_blank');
    alert(`Opening CV: ${cvFilename}`);
  };

  const truncateText = (text, maxLength = 50) => {
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
            onClick={() => navigate('/faculty/add-project')}
            className="flex items-center px-6 py-3 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </button>
          <button
            onClick={() => navigate('/faculty/profile')}
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
              Pending ({applications.filter(a => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved ({applications.filter(a => a.status === 'approved').length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'rejected'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected ({applications.filter(a => a.status === 'rejected').length})
            </button>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Why Internship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CV
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{application.studentName}</div>
                        <div className="text-sm text-gray-600">{application.rollNumber}</div>
                        <div className="text-sm text-gray-600">{application.email}</div>
                        <div className="text-sm text-gray-600">{application.phone}</div>
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
                      <div className="text-sm text-gray-900">{application.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{truncateText(application.skills)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{truncateText(application.interests)}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-900">
                        {truncateText(application.whyInternship, 60)}
                      </div>
                      <button className="text-xs text-yellow-600 hover:text-yellow-700 font-medium mt-1">
                        Read more
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewCV(application.cvFilename)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View
                      </button>
                      <div className="text-xs text-gray-500 mt-1">{application.cvFilename}</div>
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'all' 
                  ? 'No applications have been received yet.' 
                  : `No ${activeTab} applications found.`}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyDashboard;