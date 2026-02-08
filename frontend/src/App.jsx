import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import StudentHome from "./Student/pages/Studenthome";
import FacultyProjects from "./Student/pages/FacultyProjects";
import ProjectDetails from "./Student/pages/ProjectDetails";
import StudentProfile from "./Student/pages/StudentProfile";
import AllProfessors from "./Student/pages/AllProfessors";

import "./App.css";
import LandingPage from "./Home/pages/LandingPage";
import StudentAuth from "./Home/pages/StudentAuth";
import FacultyAuth from "./Home/pages/FacultyAuth";
import FacultyDashboard from "./Faculty/pages/FacultyDashboard";
import AddProject from "./Faculty/pages/AddProject";
import FacultyProfile from "./Faculty/pages/FacultyProfile";
import EditProject from "./Faculty/pages/EditProject.jsx";
import FacultyProfileDetails from "./Faculty/pages/FacultyProfileDetails";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { MessageProvider } from "./contexts/MessageContext.jsx";
import ApplicationsPage from "./Faculty/pages/ApplicationsPage.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MessageProvider>
          <Routes>
            {/* Student Routes */}
            <Route path="/student/auth" element={<StudentAuth />} />
            <Route path="/student/dashboard" element={<StudentHome />} />
            <Route
              path="/faculty/:facultyId/projects"
              element={<FacultyProjects />}
            />
            <Route path="/project/:projectId" element={<ProjectDetails />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/all-professors" element={<AllProfessors />} />

            {/* Faculty Routes */}
            <Route path="/professor/auth" element={<FacultyAuth />} />
            <Route path="/professor/dashboard" element={<FacultyDashboard />} />
            <Route path="/professor/add-project" element={<AddProject />} />
            <Route path="/professor/profile" element={<FacultyProfile />} />
            <Route
              path="/professor/edit-project/:projectId"
              element={<EditProject />}
            />
            <Route
              path="/professor/profile-details"
              element={<FacultyProfileDetails />}
            />
             <Route
              path="/professor/projects/:projectId/applications"
              element={<ApplicationsPage />}
            />
            {/* Default redirect */}
            <Route path="/" element={<LandingPage />} />

            {/* ═══════════════════════════════════════════════════════ */}
            {/* 404 NOT FOUND */}
            {/* ═══════════════════════════════════════════════════════ */}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MessageProvider>
      </AuthProvider>
    </Router>
  );
}

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default App;
