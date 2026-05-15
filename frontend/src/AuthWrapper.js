import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Landing from './Landing';
import { isSessionValid, logout } from './services/authService';

const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const valid = isSessionValid();
    if (!valid) {
      logout();
    }
    setIsAuthenticated(valid);
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <Landing />;
};

export default AuthWrapper;