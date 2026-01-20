import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContextCore';
import LoadingSpinner from './common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { currentUser, userProfile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!currentUser) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to complete-profile if profile is incomplete
    // Don't redirect if we are already on the complete-profile page to avoid infinite loops
    if (userProfile && !userProfile.isComplete && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
