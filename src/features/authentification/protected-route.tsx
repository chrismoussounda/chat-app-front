import { useUser } from './use-user';
import { Outlet, useNavigate } from 'react-router-dom';
import Loader from '@/components/loader';

function ProtectedRoute() {
  const { isLoading, error: err, user } = useUser();
  const error = err as Error;
  const navigate = useNavigate();
  if (isLoading && !error && !user) return <Loader />;
  if (error && error.message.includes('Unauthorized')) {
    navigate('/sign-in');
    return <Loader />;
  }
  if (user) return <Outlet />;
}

export default ProtectedRoute;
