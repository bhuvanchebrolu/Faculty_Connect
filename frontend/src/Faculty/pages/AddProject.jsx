import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import FacultyHeader from '../components/FacultyHeader';
import Footer from '../../Student/components/Footer';

const AddProject = () => {
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const { success, error: showError } = useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    skillsRequired: '',
    maxStudents: 2,
    deadline: '',
    attachmentUrl: '', // Optional
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for backend
      const projectData = {
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
        maxStudents: parseInt(formData.maxStudents),
        deadline: new Date(formData.deadline).toISOString(),
        attachmentUrl: formData.attachmentUrl || undefined,
      };

      const result = await apiRequest('/api/professors/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });

      if (result.success) {
        success('Project Created!', `${formData.title} has been created successfully`);
        navigate('/professor/profile');
      } else {
        showError('Creation Failed', result.error);
      }
    } catch (err) {
      showError('Error', 'Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyHeader />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Project</h1>
          <p className="text-gray-600">Create a new research project for student applications</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Machine Learning for Healthcare Diagnostics"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Brief overview of the project and its objectives"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain/Field <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                required
                placeholder="e.g., Machine Learning, IoT, Natural Language Processing"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Skills Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleInputChange}
                required
                placeholder="e.g., Python, TensorFlow, Machine Learning, Data Analysis"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
            </div>

            {/* Max Students */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Students <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleInputChange}
                required
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Number of students you want to recruit (1-10)</p>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Attachment URL (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachment URL (Optional)
              </label>
              <input
                type="url"
                name="attachmentUrl"
                value={formData.attachmentUrl}
                onChange={handleInputChange}
                placeholder="e.g., https://drive.google.com/file/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Link to detailed project document (Google Drive, Dropbox, etc.)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default AddProject;