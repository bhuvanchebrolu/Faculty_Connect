import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication and/or specific roles.
 * 
 * Usage:
 * <Route path="/student/dashboard" element={
 *   <ProtectedRoute allowedRoles={['student']}>
 *     <StudentDashboard />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on their actual role
    const redirectPath = user?.role === 'student' 
      ? '/student/dashboard' 
      : user?.role === 'professor'
      ? '/professor/dashboard'
      : '/admin/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has correct role
  return children;
};

export default ProtectedRoute;