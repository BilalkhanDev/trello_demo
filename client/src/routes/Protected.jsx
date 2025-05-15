import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Protected = () => {
  const { isAuthenticated, loading } = useAuth();

  // Wait until the authentication check is complete
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or other UI
  }

  return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
};

export default Protected;
