import { Navigate, Outlet } from 'react-router-dom';
import { isStoredUserAuthenticated } from '@/utils/auth';

export function ProtectedRoute() {
  const isAuthenticated = isStoredUserAuthenticated();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
