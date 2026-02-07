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

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/student/auth" element={<StudentAuth />} />
        <Route path="/student/home" element={<StudentHome />} />
        <Route
          path="/faculty/:facultyId/projects"
          element={<FacultyProjects />}
        />
        <Route path="/project/:projectId" element={<ProjectDetails />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/all-professors" element={<AllProfessors />} />

        {/* Faculty Routes */}
        <Route path="/faculty/auth" element={<FacultyAuth />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/add-project" element={<AddProject />} />
        <Route path="/faculty/profile" element={<FacultyProfile />} />
        <Route
          path="/faculty/edit-project/:projectId"
          element={<EditProject />}
        />
        <Route
          path="/faculty/profile-details"
          element={<FacultyProfileDetails />}
        />
        {/* Default redirect */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
