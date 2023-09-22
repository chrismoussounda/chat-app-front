import React, { Suspense } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { getServers } from '@/features/server/use-servers';
import Loader from '@/components/loader';
import { useServer } from '@/features/server/use-server';
import { useEffect } from 'react';
import { isUUID } from '@/lib/utils';

const ServerSidebar = React.lazy(() => import('@/components/server/server-sidebar'));

const ServerLayout = () => {
  const servers = getServers();
  const { serverId = '' } = useParams();
  const navigate = useNavigate();
  const { server, isLoading } = useServer(serverId);
  const alternativeServer = servers.find((server) => server.id !== serverId);
  const generalChannel = alternativeServer?.channels?.find((channel) => channel.name === 'general');

  useEffect(() => {
    if (!isUUID(serverId) && alternativeServer && generalChannel)
      navigate(`/servers/${alternativeServer.id}/channels/${generalChannel.id}`);
    if (
      server &&
      server.channels &&
      !location.pathname.includes('conversations') &&
      !location.pathname.includes('channels')
    )
      navigate(`channels/${server.channels[0].id}`);
    if (!isLoading) {
      if (!server && !alternativeServer) {
        navigate('/');
      }
      if (!server && alternativeServer) {
        navigate(`/servers/${alternativeServer.id}`);
      }
    }
  }, [alternativeServer, generalChannel, isLoading, navigate, server, serverId]);
  if (isLoading) return <Loader />;

  return (
    <div className="h-full">
      <div className="hidden lg:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <Suspense fallback={<Loader />}>
          <ServerSidebar />
        </Suspense>
      </div>
      <main className="h-full lg:pl-60">
        <Outlet />
      </main>
    </div>
  );
};

export default ServerLayout;
