// components/GuestRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/home" />;
};

export default GuestRoute;
