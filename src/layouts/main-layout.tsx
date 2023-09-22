import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@/hooks/use-query-client';
import Loader from '../components/loader';
import { useServers } from '@/features/server/use-servers';
import { useSocket } from '@/hooks/use-socket';

const NavigationSidebar = React.lazy(() => import('@/components/navigation/navigation-sidebar'));
const ModalProvider = React.lazy(() => import('@/components/provider/modal-provider'));
const SocketProvider = React.lazy(() => import('@/components/provider/socket-provider'));
const ServerLayout = React.lazy(() => import('./server-layout'));

const MainLayout = () => {
  const socket = useSocket();
  const { isLoading, servers } = useServers();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket.isConnected) {
      queryClient.refetchQueries();
    }
  }, [socket]);

  useEffect(() => {
    if (!servers.length && !isLoading) navigate('/');
  }, [isLoading, navigate, servers.length]);

  if (isLoading) return <Loader />;
  return (
    <Suspense fallback={<Loader />}>
      <SocketProvider>
        <ModalProvider />
        <div className="h-full">
          <div className="hidden lg:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
            <NavigationSidebar />
          </div>
          <main className="lg:pl-[72px] h-screen">
            <ServerLayout />
          </main>
        </div>
      </SocketProvider>
    </Suspense>
  );
};

export default MainLayout;
