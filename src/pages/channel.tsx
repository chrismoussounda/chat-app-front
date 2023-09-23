import Loader from '@/components/loader';
import { getUser } from '@/features/authentification/get-user';
import { useChannel } from '@/features/channel/use-channel';
import { getServer } from '@/features/server/use-server';
import { CONSTANT } from '@/lib/constants';
import { ChannelType, Member } from '@/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { isUUID } from '@/lib/utils';
import React from 'react';

const ChatHeader = React.lazy(() => import('@/components/chat/chat-header'));
const ChatInput = React.lazy(() => import('@/components/chat/chat-input'));
const ChatMessages = React.lazy(() => import('@/components/chat/chat-messages'));
const MediaRoom = React.lazy(() => import('@/features/livekit/media-room'));

const ChannelPage = () => {
  const { channelId = '', serverId = '' } = useParams();
  const { channel, isLoading } = useChannel(channelId);
  const navigate = useNavigate();
  const user = getUser();
  const server = getServer(serverId);
  const generalChannel = server?.channels.find((channel) => channel.name === 'general');
  const member = server?.members?.find((member) => member.userId === user.id) as Member;

  useEffect(() => {
    if (!isUUID(channelId) && generalChannel)
      navigate(`/servers/${serverId}/channels/${generalChannel.id}`);
    if (!isLoading) {
      if (!channel && generalChannel)
        navigate(`/servers/${serverId}/channels/${generalChannel.id}`);
      if (!channel && !generalChannel) navigate(`/servers/${serverId}`);
    }
  }, [channel, channelId, generalChannel, isLoading, navigate, serverId]);

  if (isLoading) return <Loader />;
  return (
    <Suspense fallback={<Loader />}>
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <div className="h-14 xs:hidden"></div>
        <ChatHeader name={channel?.name} imageUrl={user.imageUrl} type="channel" />
        {channel?.type === ChannelType.TEXT && (
          <>
            <ChatMessages
              member={member}
              name={channel?.name}
              type="channel"
              apiUrl={CONSTANT.MESSAGE_URL}
              socketQuery={{
                channelId: channel?.id,
                serverId: serverId,
              }}
              paramKey="channelId"
              chatId={channel?.id}
              paramValue={channel?.id}
            />
            <ChatInput name={channel?.name} type="channel" />
          </>
        )}
        {channel?.type === ChannelType.AUDIO && (
          <MediaRoom audio={true} video={false} chatId={channel?.id} />
        )}
        {channel?.type === ChannelType.VIDEO && (
          <MediaRoom audio={false} video={true} chatId={channel?.id} />
        )}
      </div>
    </Suspense>
  );
};

export default ChannelPage;
