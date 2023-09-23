import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { getUser } from '@/features/authentification/get-user';
import { useLiveKit } from '@/features/livekit/use-lk';
import { Loading } from '../../components/loading';
import { CONSTANT } from '@/lib/constants';
import { Error } from '../../components/error';
import { getChannel } from '../channel/use-channel';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChannelType } from '@/types';
import { AudioConference } from './AudioConference';

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const MediaRoom = ({ audio, chatId, video }: MediaRoomProps) => {
  const [isAudioChannel, setIsAudioChannel] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isAsking, setIsAsking] = useState(true);
  const user = getUser();
  const { token, isLoading } = useLiveKit(chatId, user.name);
  const { channelId = '' } = useParams();
  const channel = getChannel(channelId);
  useEffect(() => {
    const isAudio = (channelId && channel.type === ChannelType.AUDIO) || false;
    if (channelId && channel) {
      setIsAudioChannel(isAudio);
    }
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          isAudio ? { audio: true } : { audio: true, video: true }
        );
        console.log(stream);
        setHasPermission(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsAsking(false);
      }
    })();
  }, [channel, channelId]);

  if (!token && isLoading && isAsking) return <Loading name="room" />;
  if (!isLoading && !token) return <Error />;
  if (!hasPermission && !isAsking) return <Loading name="Waiting  for permission" />;
  return (
    <LiveKitRoom
      serverUrl={CONSTANT.LK_URL as string}
      data-lk-theme="default"
      style={{ height: '90vh' }}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      {isAudioChannel ? <AudioConference className="flex flex-col  h-full" /> : <VideoConference />}
    </LiveKitRoom>
  );
};

export default MediaRoom;
