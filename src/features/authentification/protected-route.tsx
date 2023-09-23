import { clearUser, useUser } from './use-user';
import { Outlet, useNavigate } from 'react-router-dom';
import Loader from '@/components/loader';
import { useEffect } from 'react';

function ProtectedRoute() {
  const { isLoading, error: err, user } = useUser();
  const error = err as Error;
  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      navigate('/sign-in');
    }
    return () => clearUser();
  }, [error, navigate]);
  if (error || (isLoading && !error && !user)) return <Loader />;
  if (user) return <Outlet />;
}

export default ProtectedRoute;
