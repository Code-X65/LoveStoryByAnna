import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Firebase/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    // If user is logged in, redirect to profile or home
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default PublicRoute;