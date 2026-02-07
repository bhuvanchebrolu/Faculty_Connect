import React from 'react';

const FacultyCard = ({ faculty, onViewProjects }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Faculty Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {faculty.name}
      </h3>

      {/* Department */}
      <p className="text-sm text-gray-600 mb-4">
        {faculty.department}
      </p>

      {/* Available Projects */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Available Projects</p>
          <p className="text-2xl font-bold text-yellow-600">
            {faculty.availableProjects}
          </p>
        </div>
      </div>

      {/* View Projects Button */}
      <button
        onClick={() => onViewProjects(faculty.id)}
        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md font-medium hover:bg-yellow-700 transition-colors duration-200"
      >
        View Projects
      </button>
    </div>
  );
};

export default FacultyCard;