import { joinServer } from '@/services/server';
import { Server } from '@/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const JoinServer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [successed, setSuccessed] = useState(false);
  const [server, setServer] = useState<Server>();
  const { inviteCode = '' } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const join = async () => {
      try {
        const data = await joinServer(inviteCode);
        setSuccessed(true);
        setServer(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    join();
  }, [inviteCode]);

  useEffect(() => {
    if (!isLoading && !successed) navigate('/');
  }, [isLoading, navigate, successed]);

  useEffect(() => {
    if (server) navigate(`/servers/${server.id}/channels/${server.channels[0].id}`);
  }, [navigate, server]);

  return (
    <div className="h-screen">
      <div className="text-lg flex h-full flex-col justify-center items-center text-zinc-500 dark:text-zinc-400 text-center">
        <Loader2 className="h-10 w-10 text-zinc-500 data:text-zinc-300 animate-spin" />
        <p className="my-2">Adding you to the server</p>
        <p>Invite Code : {inviteCode}</p>
      </div>
    </div>
  );
};

export default JoinServer;
