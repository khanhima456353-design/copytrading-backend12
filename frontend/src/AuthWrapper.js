import React from 'react';
import { Navigate } from 'react-router-dom';
import Landing from './Landing';
import authService from './services/authService';

const AuthWrapper = () => {
  const isAuthenticated = authService.isSessionValid();

  return isAuthenticated ? <Navigate to="/home" replace /> : <Landing />;
};

export default AuthWrapper;