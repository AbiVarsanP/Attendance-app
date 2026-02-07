import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type Props = { children: JSX.Element, role?: 'admin' | 'student' };

export default function ProtectedRoute({ children, role }: Props){
  const auth = useAuth();
  if (!auth?.token) return <Navigate to='/' replace />;
  if (role && auth.role !== role) return <Navigate to='/' replace />;
  return children;
}
