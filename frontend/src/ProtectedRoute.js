import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isSessionValid, logout } from './services/authService';

const ProtectedRoute = ({ children }) => {
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

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
