import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import StudentHeader from '../components/StudentHeader';
import StudentFooter from '../components/StudentFooter';
import ProjectCard from '../components/ProjectCard';

const ProfessorProjects = () => {
  const navigate = useNavigate();
  const { professorId } = useParams();
  const { apiRequest } = useAuth();
  const { error: showError } = useMessage();

  const [professor, setProfessor] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfessorAndProjects();
  }, [professorId]);

  const fetchProfessorAndProjects = async () => {
    setIsLoading(true);

    // Fetch professor details
    const profResult = await apiRequest(`/api/students/professors?search=${professorId}`);
    
    // Fetch all projects and filter by this professor
    const projectsResult = await apiRequest('/api/projects');

    if (profResult.success && projectsResult.success) {
      const allProfessors = profResult.data.data;
      const foundProf = allProfessors.find(p => p._id === professorId);
      setProfessor(foundProf);

      const allProjects = projectsResult.data.data;
      const profProjects = allProjects.filter(p => 
        p.status === 'open' && 
        (p.createdBy._id === professorId || p.createdBy === professorId)
      );
      setProjects(profProjects);
    } else {
      showError('Error', 'Failed to load professor details');
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <StudentHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </main>
        <StudentFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/browse')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Faculty List
        </button>

        {/* Professor Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{professor?.name}</h1>
              <p className="text-gray-600">{professor?.department}</p>
              <p className="text-sm text-gray-500 mt-1">{professor?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Available Projects</p>
              <p className="text-3xl font-bold text-yellow-600">{projects.length}</p>
            </div>
          </div>
        </div>

        {/* Research Projects Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Research Projects</h2>

          {projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects available</h3>
              <p className="mt-1 text-sm text-gray-500">This professor currently has no open projects</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default ProfessorProjects;