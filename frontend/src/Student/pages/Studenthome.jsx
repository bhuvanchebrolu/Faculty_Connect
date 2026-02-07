import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FacultyCard from '../components/FacultyCard';

const StudentHome = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');

  // Temporary data - replace with API call later
  const facultyData = [
    {
      id: 1,
      name: 'Dr. Ramesh Kumar',
      department: 'Computer Science and Engineering',
      availableProjects: 3,
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      department: 'Electronics and Communication Engineering',
      availableProjects: 2,
    },
    {
      id: 3,
      name: 'Dr. Arun Krishnan',
      department: 'Mechanical Engineering',
      availableProjects: 3,
    },
    {
      id: 4,
      name: 'Dr. Lakshmi Venkat',
      department: 'Civil Engineering',
      availableProjects: 2,
    },
    {
      id: 5,
      name: 'Dr. Suresh Babu',
      department: 'Electrical and Electronics Engineering',
      availableProjects: 3,
    },
    {
      id: 6,
      name: 'Dr. Meena Iyer',
      department: 'Computer Science and Engineering',
      availableProjects: 2,
    },
    {
      id: 7,
      name: 'Dr. Vijay Anand',
      department: 'Chemical Engineering',
      availableProjects: 2,
    },
    {
      id: 8,
      name: 'Dr. Kavitha Reddy',
      department: 'Electronics and Communication Engineering',
      availableProjects: 3,
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

  const filteredFaculty = facultyData.filter((faculty) => {
    const matchesDept = selectedDepartment === 'All Departments' || faculty.department === selectedDepartment;
    const matchesSearch = faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faculty.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleViewProjects = (facultyId) => {
    navigate(`/faculty/${facultyId}/projects`);
  };

  const handleViewAllProfessors = () => {
    navigate('/all-professors');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Internship Portal</h1>
          <p className="text-gray-600">Browse research projects and connect with faculty members</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Search Projects
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
                  placeholder="Search by keyword, professor, or project title"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Members Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Faculty Members
            <span className="ml-3 text-sm font-normal text-gray-500">
              {filteredFaculty.length} professors found
            </span>
          </h2>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredFaculty.map((faculty) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              onViewProjects={handleViewProjects}
            />
          ))}
        </div>

        {/* View All Professors Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleViewAllProfessors}
            className="px-8 py-3 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors duration-200 shadow-sm"
          >
            View All Professors
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentHome;