import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useMessage } from "../../contexts/MessageContext";
import FacultyHeader from "../components/FacultyHeader";
import FacultyFooter from "../components/Footer";

const ApplicationsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const { error } = useMessage();

  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectAndApplications = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch all projects
        const projectsRes = await apiRequest("/api/professors/projects", { method: "GET" });
        if (!projectsRes.success) throw new Error(projectsRes.error || "Failed to fetch projects");

        const allProjects = projectsRes.data.data;
        const proj = allProjects.find(p => p._id === projectId);
        if (!proj) throw new Error("Project not found");

        setProject(proj);

        // 2. Fetch applications for this project
        const appsRes = await apiRequest(`/api/professors/projects/${projectId}/applications`, { method: "GET" });
        const apps = appsRes.success ? appsRes.data.data : [];
        setApplications(apps);
      } catch (err) {
        error("Error", err.message || "Something went wrong");
        navigate("/professor/profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAndApplications();
  }, [projectId, apiRequest, error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <FacultyHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
            <p className="text-gray-600">Loading project applications...</p>
          </div>
        </main>
        <FacultyFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FacultyHeader />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        {/* Project Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <p className="text-sm text-gray-500 mb-2">{project.domain}</p>
          <p className="text-gray-700">{project.description}</p>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span>{project.enrolledCount}/{project.maxStudents} Students</span>
            <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications ({applications.length})</h2>

          {applications.length === 0 ? (
            <p className="text-gray-500">No applications yet for this project.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-yellow-100 text-yellow-900">
                  <tr>
                    <th className="px-4 py-2 text-left">Student Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2">{app.studentName}</td>
                      <td className="px-4 py-2">{app.studentEmail}</td>
                      <td className={`px-4 py-2 font-medium ${
                        app.status === "approved" ? "text-green-600" :
                        app.status === "rejected" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <FacultyFooter />
    </div>
  );
};

export default ApplicationsPage;
