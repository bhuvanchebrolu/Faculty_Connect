import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import Header from '../components/StudentHeader';
import Footer from '../components/StudentFooter';
import FacultyCard from '../components/ProfessorCard';

const StudentHome = () => {
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const { error: showError } = useMessage();

  const [facultyData, setFacultyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch professors from API
  const fetchProfessors = async () => {
    // setIsLoading(true);

    try {
      const query = searchQuery
        ? `/api/students/professors?search=${encodeURIComponent(searchQuery)}`
        : '/api/students/professors';

      const result = await apiRequest(query);

      console.log('FETCH PROFESSORS RESULT:', result);

      if (result.success) {
        // Handle 200 or 304 properly
        const professors = result.data?.data || [];
        setFacultyData(professors);
      } else {
        showError('Error', result.error || 'Failed to load professors');
        setFacultyData([]);
      }
    } catch (err) {
      showError('Error', err.message || 'Failed to load professors');
      setFacultyData([]);
    } finally {
      console.log("Finally");
      setIsLoading(false);
    }
  };

  // Fetch professors whenever the search query changes
  useEffect(() => {
    fetchProfessors();
  }, [searchQuery]);

  // Generate departments dynamically from data
  const departments = [
    'All Departments',
    ...new Set(facultyData.map((f) => f.department).filter(Boolean)),
  ];

  const filteredFaculty = facultyData.filter((faculty) => {
    const matchesDept =
      selectedDepartment === 'All Departments' || faculty.department === selectedDepartment;

    const matchesSearch =
      faculty.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.department?.toLowerCase().includes(searchQuery.toLowerCase());

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Academic Internship Portal
          </h1>
          <p className="text-gray-600">
            Browse research projects and connect with faculty members
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Professors
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or department"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Faculty Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Faculty Members
            <span className="ml-3 text-sm font-normal text-gray-500">
              {filteredFaculty.length} professors found
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
            <p className="text-gray-600">Loading professors...</p>
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No professors found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredFaculty.map((faculty) => (
              <FacultyCard
                key={faculty._id}
                faculty={{
                  id: faculty._id,
                  name: faculty.displayName || faculty.name,
                  department: faculty.department,
                  availableProjects: faculty.availableProjects || 0,
                }}
                onViewProjects={handleViewProjects}
              />
            ))}
          </div>
        )}

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
