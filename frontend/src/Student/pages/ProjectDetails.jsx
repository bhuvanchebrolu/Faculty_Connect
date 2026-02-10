import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import StudentHeader from '../components/StudentHeader';
import StudentFooter from '../components/StudentFooter';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { apiRequest, user } = useAuth();
  const { success, error: showError } = useMessage();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Application Form Data
  const [formData, setFormData] = useState({
    applicantName: user?.name || '',
    department: '',
    rollNumber: user?.rollNumber || '',
    applicantEmail: user?.email || '',
    applicantPhone: '',
    skills: '',
    areasOfInterest: '',
    statementOfInterest: '',
    resumeUrl: '',
    cgpa: '',
  });

  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    setIsLoading(true);
    const result = await apiRequest(`/api/projects/${projectId}`);

    if (result.success) {
      setProject(result.data.data);
    } else {
      showError('Error', 'Failed to load project details');
      navigate('/student/browse');
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update word count for statement
    if (name === 'statementOfInterest') {
      const words = value.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate word count
    if (wordCount < 50) {
      showError('Validation Error', 'Statement must be at least 50 words');
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        ...formData,
        projectId: project._id,
        year: user?.year || 1,
        branch: formData.department,
        cgpa: parseFloat(formData.cgpa),
      };

      const result = await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify(applicationData),
      });

      if (result.success) {
        success('Application Submitted!', 'Your application has been sent to the professor');
        navigate('/student/browse');
      } else {
        showError('Submission Failed', result.error);
      }
    } catch (err) {
      showError('Error', 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <StudentHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
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
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Project Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h1>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div>
                  <span className="font-medium">Professor: </span>
                  {project.createdBy?.name}
                </div>
                <div>
                  <span className="font-medium">Department: </span>
                  {project.createdBy?.department}
                </div>
                <div>
                  <span className="font-medium">Email: </span>
                  {project.createdBy?.email}
                </div>
              </div>

              {/* Project Overview */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Overview</h2>
                <p className="text-gray-700">{project.description}</p>
              </div>

              {/* Skills Required */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(project.skillsRequired) ? project.skillsRequired : []).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Domain */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Domain</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {project.domain}
                </span>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Max Students</h3>
                  <p className="text-gray-900">{project.maxStudents}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Deadline</h3>
                  <p className="text-gray-900">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Attachment */}
              {project.attachmentUrl && (
                <div className="mb-6">
                  <a
                    href={project.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Project Document →
                  </a>
                </div>
              )}

              {/* CV Required Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <span className="font-semibold">Note: </span>
                  CV/Resume submission is required for this project
                </p>
              </div>
            </div>
          </div>

          {/* Right: Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Application</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Computer Science"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute Webmail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="applicantEmail"
                    value={formData.applicantEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="student@nitt.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="applicantPhone"
                    value={formData.applicantPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* CGPA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CGPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 8.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Python, Machine Learning"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Areas of Interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Areas of Interest <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="areasOfInterest"
                    value={formData.areasOfInterest}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., AI, Robotics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Statement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Why do you want to attend this internship? <span className="text-red-500">* (min. 50 words)</span>
                  </label>
                  <textarea
                    name="statementOfInterest"
                    value={formData.statementOfInterest}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    Word count: {wordCount} / 50 minimum
                  </p>
                </div>

                {/* Resume URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload CV / Resume <span className="text-red-500">* (PDF or DOC)</span>
                  </label>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="Paste Google Drive/Dropbox link"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Share link to your resume (Google Drive, Dropbox, etc.)
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || wordCount < 50}
                  className="w-full px-4 py-3 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default ProjectDetails;