import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  // Check if CV is required (you might need to add this field to backend)
  const cvRequired = project.cvRequired !== false; // Default to true

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {project.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">CV Required:</span>
          <span className={`text-xs font-medium px-2 py-1 rounded ${cvRequired ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
            {cvRequired ? 'Yes' : 'No'}
          </span>
        </div>

        <button
          onClick={() => navigate(`/student/projects/${project._id}`)}
          className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
        >
          View Details & Apply
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;