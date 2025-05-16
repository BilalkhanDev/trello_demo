import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LayoutSkeleton from '../components/loader/layoutSkelton';

const Protected = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LayoutSkeleton/>; 
  }

  return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
};

export default Protected;
