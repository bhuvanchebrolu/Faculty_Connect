import React from 'react';

const ProjectCard = ({ project, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Project Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {project.title}
      </h3>

      {/* Project Description */}
      <p className="text-sm text-gray-600 mb-4 flex-grow">
        {project.description}
      </p>

      {/* CV Required Badge */}
      <div className="mb-4">
        <span className="text-xs text-gray-500">CV Required</span>
        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
          project.cvRequired 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {project.cvRequired ? 'Yes' : 'No'}
        </span>
      </div>

      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(project.id)}
        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md font-medium hover:bg-yellow-700 transition-colors duration-200"
      >
        View Details & Apply
      </button>
    </div>
  );
};

export default ProjectCard;