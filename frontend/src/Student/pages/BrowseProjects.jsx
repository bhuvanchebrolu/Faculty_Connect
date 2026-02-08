import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import StudentHeader from '../components/StudentHeader';
import StudentFooter from '../components/StudentFooter';
import ProfessorCard from '../components/ProfessorCard';

const BrowseProjects = () => {
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const { error: showError } = useMessage();

  const [professors, setProfessors] = useState([]);
  const [projectCounts, setProjectCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Get unique departments for filter
  const departments = ['all', ...new Set(professors.map(p => p.department).filter(Boolean))];

  useEffect(() => {
    fetchProfessorsAndProjects();
  }, []);

  const fetchProfessorsAndProjects = async () => {
    setIsLoading(true);

    // Fetch all professors
    const profsResult = await apiRequest('/api/students/professors');
    
    if (profsResult.success) {
      const profsList = profsResult.data.data;
      setProfessors(profsList);

      // Fetch all projects to count per professor
      const projectsResult = await apiRequest('/api/projects');
      
      if (projectsResult.success) {
        const projects = projectsResult.data.data;
        
        // Count projects per professor (only open projects)
        const counts = {};
        projects.forEach(project => {
          if (project.status === 'open' && project.createdBy) {
            const profId = project.createdBy._id || project.createdBy;
            counts[profId] = (counts[profId] || 0) + 1;
          }
        });
        
        setProjectCounts(counts);
      }
    } else {
      showError('Error', 'Failed to load professors');
    }

    setIsLoading(false);
  };

  // Filter professors
  const filteredProfessors = professors.filter(prof => {
    const matchesDepartment = departmentFilter === 'all' || prof.department === departmentFilter;
    const matchesSearch = !searchTerm || 
      prof.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Only show professors with projects
    const hasProjects = projectCounts[prof._id] > 0;
    
    return matchesDepartment && matchesSearch && hasProjects;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Internship Portal</h1>
          <p className="text-gray-600">Browse research projects and connect with faculty members</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.slice(1).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Projects
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by keyword, professor, or project title"
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
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Members Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Faculty Members</h2>
            <p className="text-sm text-gray-600">{filteredProfessors.length} professors found</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
              <p className="text-gray-600">Loading professors...</p>
            </div>
          ) : filteredProfessors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No professors found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <>
              {/* Professor Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfessors.slice(0, 8).map((professor) => (
                  <ProfessorCard
                    key={professor._id}
                    professor={professor}
                    projectCount={projectCounts[professor._id] || 0}
                  />
                ))}
              </div>

              {/* View All Professors Button */}
              {filteredProfessors.length > 8 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate('/student/professors/all')}
                    className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    View All Professors ({filteredProfessors.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default BrowseProjects;