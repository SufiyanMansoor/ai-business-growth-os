import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { LoadingState } from '@/components/ui/States';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) return <LoadingState message="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
