import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated } from '../../services/selectors';
import { useAppSelector } from '../../services/hooks';

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
