import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AllProfessors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  // Temporary data - replace with API call later
  const allProfessors = [
    {
      id: 1,
      name: 'Dr. Ramesh Kumar',
      department: 'Computer Science and Engineering',
      email: 'ramesh@nitt.edu',
      availableProjects: 3,
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      department: 'Electronics and Communication Engineering',
      email: 'priya@nitt.edu',
      availableProjects: 2,
    },
    {
      id: 3,
      name: 'Dr. Arun Krishnan',
      department: 'Mechanical Engineering',
      email: 'arun@nitt.edu',
      availableProjects: 3,
    },
    {
      id: 4,
      name: 'Dr. Lakshmi Venkat',
      department: 'Civil Engineering',
      email: 'lakshmi@nitt.edu',
      availableProjects: 2,
    },
    {
      id: 5,
      name: 'Dr. Suresh Babu',
      department: 'Electrical and Electronics Engineering',
      email: 'suresh@nitt.edu',
      availableProjects: 3,
    },
    {
      id: 6,
      name: 'Dr. Meena Iyer',
      department: 'Computer Science and Engineering',
      email: 'meena@nitt.edu',
      availableProjects: 2,
    },
    {
      id: 7,
      name: 'Dr. Vijay Anand',
      department: 'Chemical Engineering',
      email: 'vijay@nitt.edu',
      availableProjects: 2,
    },
    {
      id: 8,
      name: 'Dr. Kavitha Reddy',
      department: 'Electronics and Communication Engineering',
      email: 'kavitha@nitt.edu',
      availableProjects: 3,
    },
    {
      id: 9,
      name: 'Dr. Rajesh Patel',
      department: 'Computer Science and Engineering',
      email: 'rajesh@nitt.edu',
      availableProjects: 4,
    },
    {
      id: 10,
      name: 'Dr. Anjali Gupta',
      department: 'Electrical and Electronics Engineering',
      email: 'anjali@nitt.edu',
      availableProjects: 2,
    },
    {
      id: 11,
      name: 'Dr. Sanjay Nair',
      department: 'Mechanical Engineering',
      email: 'sanjay@nitt.edu',
      availableProjects: 3,
    },
    {
      id: 12,
      name: 'Dr. Deepa Sharma',
      department: 'Chemical Engineering',
      email: 'deepa@nitt.edu',
      availableProjects: 1,
    },
  ];

  const departments = [
    'All Departments',
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical and Electronics Engineering',
    'Chemical Engineering',
  ];

  const filteredProfessors = allProfessors.filter((prof) => {
    const matchesDept = selectedDepartment === 'All Departments' || prof.department === selectedDepartment;
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleViewProjects = (professorId) => {
    navigate(`/faculty/${professorId}/projects`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Professors</h1>
          <p className="text-gray-600">Complete list of faculty members with available research projects</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, department, or email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredProfessors.length}</span> professors
          </p>
        </div>

        {/* Professors Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professor Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Projects
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfessors.map((professor) => (
                  <tr key={professor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{professor.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{professor.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{professor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {professor.availableProjects}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewProjects(professor.id)}
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 transition-colors duration-200"
                      >
                        View Projects
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredProfessors.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No professors found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllProfessors;