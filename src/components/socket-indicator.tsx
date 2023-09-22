import { useSocket } from '@/hooks/use-socket';
import { Badge } from './ui/badge';
import { useUser } from '@/features/authentification/use-user';

export const SocketIndicator = () => {
  const { user, isLoading } = useUser();
  const { isConnected, socket } = useSocket();
  if (!isLoading && !user) socket?.disconnect();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Live: Real-time updates
    </Badge>
  );
};
