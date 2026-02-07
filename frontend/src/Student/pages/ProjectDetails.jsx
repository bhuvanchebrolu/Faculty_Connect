import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    rollNumber: '',
    email: 'student@nitt.edu',
    phone: '',
    skills: '',
    interests: '',
    statement: '',
    resume: null,
  });

  const [wordCount, setWordCount] = useState(0);

  // Temporary project data - replace with API call later
  const projectDetails = {
    title: 'Machine Learning for Healthcare Diagnostics',
    professor: 'Dr. Ramesh Kumar',
    department: 'Computer Science and Engineering',
    email: 'ramesh@nitt.edu',
    overview: 'Develop ML models for early disease detection using medical imaging data',
    objectives: [
      'Conduct comprehensive research in the specified domain',
      'Develop practical solutions to real-world problems',
      'Collaborate with faculty and research team members',
      'Document findings and present results',
    ],
    requirements: [
      'Strong foundation in relevant technical skills',
      'Commitment to regular research meetings and deadlines',
      'Ability to work independently and as part of a team',
      'Excellent communication and documentation skills',
      'CV/Resume submission is required for this project',
    ],
    duration: 'This internship typically runs for one semester (approximately 4-6 months) and requires a minimum commitment of 10-15 hours per week.',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'statement') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      resume: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate word count
    if (wordCount < 50) {
      alert('Please write at least 50 words explaining why you want to attend this internship.');
      return;
    }

    // TODO: Uncomment and implement API call
    /*
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('projectId', projectId);

    fetch('/api/applications/submit', {
      method: 'POST',
      body: formDataToSend,
    })
      .then(response => response.json())
      .then(data => {
        alert('Application submitted successfully!');
        navigate('/student/applications');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit application. Please try again.');
      });
    */

    // Temporary success message
    alert('Application submitted successfully! (This is a demo - no actual submission)');
    console.log('Form data:', formData);
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
          Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Project Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {projectDetails.title}
              </h1>

              {/* Professor Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Professor: </span>
                    <span className="text-gray-600">{projectDetails.professor}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Department: </span>
                    <span className="text-gray-600">{projectDetails.department}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email: </span>
                    <span className="text-gray-600">{projectDetails.email}</span>
                  </div>
                </div>
              </div>

              {/* Project Overview */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Project Overview</h2>
                <p className="text-gray-600">{projectDetails.overview}</p>
              </div>

              {/* Objectives & Goals */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Objectives & Goals</h2>
                <ul className="space-y-2">
                  {projectDetails.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className="text-gray-600">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements & Expectations */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements & Expectations</h2>
                <ul className="space-y-2">
                  {projectDetails.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className={`text-gray-600 ${
                        requirement.includes('CV/Resume') ? 'font-medium text-yellow-700' : ''
                      }`}>
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duration & Commitment */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Duration & Commitment</h2>
                <p className="text-gray-600">{projectDetails.duration}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Application</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Institute Webmail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute Webmail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="student@nitt.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Areas of Interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Areas of Interest <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., AI, Robotics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Why Statement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Why do you want to attend this internship? <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-1">(min. 50 words)</span>
                  </label>
                  <textarea
                    name="statement"
                    value={formData.statement}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Word count: {wordCount} / 50 minimum
                  </p>
                </div>

                {/* Upload CV/Resume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload CV / Resume <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-1">(PDF or DOC)</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md font-medium hover:bg-yellow-700 transition-colors duration-200 mt-6"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;