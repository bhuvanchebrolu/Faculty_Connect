import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';

const FacultyProjects = () => {
  const navigate = useNavigate();
  const { facultyId } = useParams();

  // Temporary data - replace with API call later
  const facultyInfo = {
    name: 'Dr. Ramesh Kumar',
    department: 'Computer Science and Engineering',
    email: 'ramesh@nitt.edu',
    availableProjects: 3,
  };

  const projects = [
    {
      id: 1,
      title: 'Machine Learning for Healthcare Diagnostics',
      description: 'Develop ML models for early disease detection using medical imaging data',
      cvRequired: true,
    },
    {
      id: 2,
      title: 'Natural Language Processing for Regional Languages',
      description: 'Build NLP tools for Tamil and Telugu language processing',
      cvRequired: true,
    },
    {
      id: 3,
      title: 'IoT-based Smart Campus Management',
      description: 'Design and implement IoT solutions for campus resource optimization',
      cvRequired: false,
    },
  ];

  const handleViewDetails = (projectId) => {
    navigate(`/project/${projectId}`);
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
          Back to Faculty List
        </button>

        {/* Faculty Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {facultyInfo.name}
              </h1>
              <p className="text-gray-600 mb-1">{facultyInfo.department}</p>
              <p className="text-sm text-gray-500">{facultyInfo.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Available Projects</p>
              <p className="text-3xl font-bold text-yellow-600">
                {facultyInfo.availableProjects}
              </p>
            </div>
          </div>
        </div>

        {/* Research Projects Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Research Projects</h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyProjects;