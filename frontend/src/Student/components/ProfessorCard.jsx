import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfessorCard = ({ professor, projectCount }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {professor.name}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{professor.department}</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Available Projects</p>
          <p className="text-2xl font-bold text-yellow-600">{projectCount}</p>
        </div>

        <button
          onClick={() => navigate(`/student/professors/${professor._id}/projects`)}
          className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
        >
          View Projects
        </button>
      </div>
    </div>
  );
};

export default ProfessorCard;