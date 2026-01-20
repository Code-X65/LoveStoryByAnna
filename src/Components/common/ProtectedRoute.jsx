import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isDemoMode] = useState(true); // Set to false to simulate protected behavior

  // For demo purposes, always allow access
  // Set isDemoMode to false to see the redirect behavior
  if (!isDemoMode) {
    // This simulates what would happen if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;