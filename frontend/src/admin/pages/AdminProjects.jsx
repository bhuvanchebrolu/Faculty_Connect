import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

const AdminProjects = () => {
  const { apiRequest } = useAuth();
  const { success, error: showError } = useMessage();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    professorEmail: '',
    title: '',
    description: '',
    domain: '',
    skillsRequired: '',
    maxStudents: 2,
    deadline: '',
    attachmentUrl: '',
    cvRequired: true,
  });

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const fetchProjects = async () => {
    setIsLoading(true);
    const endpoint =
      statusFilter === 'all'
        ? '/api/admin/projects'
        : `/api/admin/projects?status=${statusFilter}`;

    const result = await apiRequest(endpoint);

    if (result.success) {
      setProjects(result.data.data);
    } else {
      showError('Error', 'Failed to load projects');
    }
    setIsLoading(false);
  };

  const handleDeleteProject = async (projectId, projectTitle) => {
    if (
      !window.confirm(
        `⚠️ Delete Project?\n\n"${projectTitle}"\n\nThis will permanently delete:\n• The project\n• All student applications\n• All related data\n\nThis action cannot be undone. Continue?`
      )
    ) {
      return;
    }

    const result = await apiRequest(`/api/admin/projects/${projectId}`, {
      method: 'DELETE',
    });

    if (result.success) {
      success('Project Deleted', `${projectTitle} has been removed successfully`);
      fetchProjects();
    } else {
      showError('Delete Failed', result.error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate professor email
      if (!formData.professorEmail.endsWith('@nitt.edu')) {
        showError('Invalid Email', 'Professor email must end with @nitt.edu');
        setIsSubmitting(false);
        return;
      }

      const projectData = {
        professorEmail: formData.professorEmail,
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
        maxStudents: parseInt(formData.maxStudents),
        deadline: new Date(formData.deadline).toISOString(),
        attachmentUrl: formData.attachmentUrl || undefined,
        cvRequired: formData.cvRequired,
      };

      const result = await apiRequest('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });

      if (result.success) {
        success('Project Created!', `${formData.title} has been created successfully`);
        setIsModalOpen(false);
        resetForm();
        fetchProjects();
      } else {
        showError('Creation Failed', result.error);
      }
    } catch (err) {
      showError('Error', 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      professorEmail: '',
      title: '',
      description: '',
      domain: '',
      skillsRequired: '',
      maxStudents: 2,
      deadline: '',
      attachmentUrl: '',
      cvRequired: true,
    });
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(
    (project) =>
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          styles[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects Management</h1>
              <p className="text-gray-600">View and manage all research projects</p>
            </div>
            
            {/* Add Project Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Project
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, domain, or professor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
                <p className="text-gray-600">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 font-medium">No projects found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Professor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Domain
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <motion.tr
                        key={project._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {project.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {project.description?.substring(0, 60)}...
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{project.createdBy?.name}</div>
                          <div className="text-xs text-gray-500">{project.createdBy?.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {project.domain}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {project.enrolledCount} / {project.maxStudents}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(project.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDeleteProject(project._id, project.title)}
                            className="inline-flex items-center px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md font-medium text-sm transition-all"
                            title="Delete Project"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table Footer */}
            {!isLoading && filteredProjects.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredProjects.length}</span> of{' '}
                  <span className="font-semibold">{projects.length}</span> projects
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AdminFooter />

      {/* ADD PROJECT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4 border-b border-yellow-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Add New Project</h2>
                    <button
                      onClick={() => !isSubmitting && setIsModalOpen(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                      disabled={isSubmitting}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmitProject} className="p-6">
                  <div className="space-y-5">
                    {/* Professor Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Professor Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="professorEmail"
                        value={formData.professorEmail}
                        onChange={handleInputChange}
                        required
                        placeholder="professor@nitt.edu"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Professor must exist in the system with this email
                      </p>
                    </div>

                    {/* Project Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Machine Learning for Healthcare"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        placeholder="Brief overview of the project"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                      />
                    </div>

                    {/* Domain */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Domain <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Machine Learning, IoT, NLP"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    {/* Skills Required */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Skills Required <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="skillsRequired"
                        value={formData.skillsRequired}
                        onChange={handleInputChange}
                        required
                        placeholder="Python, TensorFlow, Data Analysis"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Max Students */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Max Students <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="maxStudents"
                          value={formData.maxStudents}
                          onChange={handleInputChange}
                          required
                          min="1"
                          max="10"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>

                      {/* Deadline */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Deadline <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                    </div>

                    {/* Attachment URL */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Attachment URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="attachmentUrl"
                        value={formData.attachmentUrl}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    {/* CV Required */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="cvRequired"
                        checked={formData.cvRequired}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        CV/Resume Required
                      </label>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => !isSubmitting && setIsModalOpen(false)}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        'Create Project'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjects;