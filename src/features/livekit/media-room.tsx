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
  const user = getUser();
  const { token, isLoading } = useLiveKit(chatId, user.name);
  const { channelId = '' } = useParams();
  const channel = getChannel(channelId);
  useEffect(() => {
    if (channelId && channel) {
      setIsAudioChannel(channel.type === ChannelType.AUDIO);
    }
  }, [channel, channelId]);

  if (!token && isLoading) return <Loading name="room" />;
  if (!isLoading && !token) return <Error />;
  return (
    <LiveKitRoom
      serverUrl={CONSTANT.LK_URL as string}
      data-lk-theme="default"
      style={{ height: '100%' }}
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
