import { Server } from '@/types';
import { useNavigate as Navigate } from 'react-router-dom';

export const useNavigate = () => {
  const navigate = Navigate();
  const toGeneral = (server: Server) => {
    if (server) return navigate(`servers/${server.id}`);
  };

  return { toGeneral, navigate };
};
