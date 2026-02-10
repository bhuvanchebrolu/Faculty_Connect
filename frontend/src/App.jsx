import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MessageProvider } from './contexts/MessageContext';
import ProtectedRoute from './contexts/ProtectedRoute';

// Public Pages

import LandingPage from "./Home/pages/LandingPage";
import FacultyAuth from "./Home/pages/FacultyAuth";
import StudentAuth from "./Home/pages/StudentAuth"

// Student Pages
import BrowseProjects from './Student/pages/BrowseProjects';
import ProfessorProjects from './Student/pages/ProfessorProjects';
import ProjectDetails from './Student/pages/ProjectDetails';
import AllProfessors from './Student/pages/AllProfessors';
import StudentProfile from './Student/pages/StudentProfile';


// Professor Pages
import ProfessorDashboard from './Faculty/pages/ProfessorDashboard';
import ProfessorProfile from './Faculty/pages/ProfessorProfile';
import AddProject from './Faculty/pages/AddProject';
import EditProject from './Faculty/pages/EditProject';
import AllStudents from './Faculty/pages/AllStudents';
import ApprovedStudents from './Faculty/pages/ApprovedStudents';
import RejectedStudents from './Faculty/pages/RejectedStudents';

// Admin Pages

import AdminDashboard from './admin/pages/AdminDashboard';
import AdminStudents from './admin/pages/AdminStudents';
import AdminProfessors from './admin/pages/AdminProfessors';
import AdminProjects from './admin/pages/AdminProjects';
import AdminAuth from './Home/pages/AdminAuth';
import PendingApplications from './admin/pages/PendingApplications';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MessageProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/student/auth" element={<StudentAuth />} />
            <Route path="/professor/auth" element={<FacultyAuth />} />
            <Route path="/admin/auth" element={<AdminAuth />} />

            {/* STUDENT ROUTES */}
            <Route
              path="/student/browse"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <BrowseProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/professors/:professorId/projects"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProfessorProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/projects/:projectId"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/professors/all"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AllProfessors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            {/* PROFESSOR ROUTES */}
            <Route
              path="/professor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/profile"
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/add-project"
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <AddProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/projects/:projectId/edit"
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <EditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/students/all"
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <AllStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/students/approved"
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ApprovedStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/students/rejected"
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <RejectedStudents />
                </ProtectedRoute>
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PendingApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/professors"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminProfessors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminProjects />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MessageProvider>
      </AuthProvider>
    </Router>
  );
}

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors">
        Back to Home
      </a>
    </div>
  </div>
);

export default App;