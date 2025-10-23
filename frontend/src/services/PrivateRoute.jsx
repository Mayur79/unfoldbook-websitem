// PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Save the current path so we can redirect after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
