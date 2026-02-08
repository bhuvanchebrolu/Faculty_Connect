import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FacultyProjectCard - Displays a professor's project with application statistics
 * 
 * Props:
 * - project: Project object from backend with structure:
 *   {
 *     _id,
 *     title,
 *     description,
 *     domain,
 *     maxStudents,
 *     enrolledCount,
 *     deadline,
 *     status,
 *     skillsRequired,
 *     attachmentUrl,
 *     applications: [] // Array of applications for this project
 *   }
 * - applications: Array of applications for this project (optional, can be part of project)
 * - onEdit: Function to handle edit action
 * - onDelete: Function to handle delete action (optional)
 */
const FacultyProjectCard = ({ project, applications = [], onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Calculate application statistics
  // Applications can be passed separately or be part of project object
  const projectApplications = applications.length > 0 ? applications : (project.applications || []);
  
  const totalApplications = projectApplications.length;
  const pending = projectApplications.filter(app => app.status === 'pending').length;
  const accepted = projectApplications.filter(app => app.status === 'approved').length;
  const rejected = projectApplications.filter(app => app.status === 'rejected').length;

  // Navigate to applications page for this project
  const handleViewApplications = () => {
    navigate(`/professor/projects/${project._id}/applications`);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Project Details */}
        <div className="lg:col-span-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          
          {/* Domain Badge */}
          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {project.domain}
            </span>
          </div>

          {/* CV Required - Backend doesn't have this field, so we'll remove it or add logic */}
          {/* You can add this field to backend if needed */}
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Additional Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{project.enrolledCount}/{project.maxStudents} Students</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Middle Column - Applications Count */}
        <div className="lg:col-span-3 flex items-center justify-center">
          <button
            onClick={handleViewApplications}
            className="text-center hover:bg-gray-50 rounded-lg p-4 transition-colors"
          >
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {totalApplications}
            </div>
            <div className="text-sm text-gray-600">Total Applications</div>
            <div className="text-xs text-blue-600 mt-1">Click to view →</div>
          </button>
        </div>

        {/* Status Breakdown */}
        <div className="lg:col-span-3">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-3">Status Breakdown</div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending:</span>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                {pending}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accepted:</span>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                {accepted}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rejected:</span>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                {rejected}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Action Button */}
        <div className="lg:col-span-1 flex items-center justify-center lg:justify-end">
          <button
            onClick={() => onEdit(project._id)}
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