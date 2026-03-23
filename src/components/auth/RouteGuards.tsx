import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/components/auth/AuthContext';

function GuardShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <GuardShell>{children}</GuardShell>;
}

export function RequireOwner({ children }: { children: ReactNode }) {
  const { loading, user, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role !== 'owner') {
    return <Navigate to="/portaal" replace />;
  }

  return <GuardShell>{children}</GuardShell>;
}
