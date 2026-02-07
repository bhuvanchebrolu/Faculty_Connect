import React from 'react';

const FacultyProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Project Details */}
        <div className="lg:col-span-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            CV Required: <span className={project.cvRequired ? 'text-yellow-700 font-medium' : 'text-gray-700'}>
              {project.cvRequired ? 'Yes' : 'No'}
            </span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {project.description}
          </p>
        </div>

        {/* Middle Column - Applications Count */}
        <div className="lg:col-span-3 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {project.totalApplications}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="lg:col-span-3">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-3">Status Breakdown</div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending:</span>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                {project.pending}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accepted:</span>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                {project.accepted}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rejected:</span>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                {project.rejected}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Action Button */}
        <div className="lg:col-span-1 flex items-center justify-center lg:justify-end">
          <button
            onClick={() => onEdit(project.id)}
            className="inline-flex items-center justify-center px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyProjectCard;