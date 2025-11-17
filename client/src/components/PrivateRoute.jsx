import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  // quick guard - in real app check auth context or cookie
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
