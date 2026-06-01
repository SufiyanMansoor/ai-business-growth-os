import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { LoadingState } from '@/components/ui/States';
import type { UserRole } from '@/store/slices/authSlice';
import { hasRequiredRole } from '@/lib/rbac';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { isAuthenticated, isLoading, user } = useAppSelector((s) => s.auth);

  if (isLoading) return <LoadingState message="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !hasRequiredRole(user?.role, allowedRoles)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
