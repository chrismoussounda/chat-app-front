import React, { Suspense, useEffect } from 'react';
import { getUser } from '@/features/authentification/get-user';
import { useConversation } from '@/features/messages/use-conversation';
import { getServer } from '@/features/server/use-server';
import { useVideo } from '@/hooks/use-video';
import { CONSTANT } from '@/lib/constants';
import { Member } from '@/types';
import { Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { isUUID } from '@/lib/utils';

const ChatHeader = React.lazy(() => import('@/components/chat/chat-header'));
const ChatInput = React.lazy(() => import('@/components/chat/chat-input'));
const ChatMessages = React.lazy(() => import('@/components/chat/chat-messages'));
const MediaRoom = React.lazy(() => import('@/features/livekit/media-room'));

const MemberPage = () => {
  const { memberId = '', serverId = '' } = useParams();
  const user = getUser();
  const server = getServer(serverId);
  const { isVideo } = useVideo();
  const navigate = useNavigate();
  const member = server.members.find((member) => member.userId === user.id) as Member;
  const { conversation, isLoading } = useConversation(member?.id, memberId);
  const generalChannel = server.channels.find((channel) => channel.name === 'general');
  const memberOne = conversation?.memberOne;
  const memberTwo = conversation?.memberTwo;
  const targetMember = member?.userId === user.id ? memberTwo : memberOne;
  const name = targetMember?.user.name;
  const imageUrl = targetMember?.user.imageUrl;

  useEffect(() => {
    if (!isUUID(memberId) && generalChannel)
      navigate(`/servers/${serverId}/channels/${generalChannel.id}`);
    if (!isLoading) {
      if (!conversation && generalChannel)
        navigate(`/servers/${serverId}/channels/${generalChannel.id}`);
      if (!conversation && !generalChannel) navigate(`/servers/${serverId}`);
    }
  }, [conversation, generalChannel, isLoading, memberId, navigate, serverId]);

  if (isLoading) return <Loader />;
  return (
    <Suspense fallback={<Loader />}>
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader imageUrl={imageUrl} name={name} type="conversation" />
        {isVideo ? (
          <MediaRoom audio={true} video={true} chatId={conversation?.id} />
        ) : (
          <>
            <ChatMessages
              apiUrl={CONSTANT.DIRECT_MESSAGE_URL}
              chatId={conversation?.id}
              member={member}
              name={name}
              paramKey="conversationId"
              paramValue={conversation?.id}
              socketQuery={{
                conversationId: conversation?.id,
                memberOneId: memberOne.id,
                memberTwoId: memberTwo.id,
              }}
              type="conversation"
            />
            <ChatInput
              name={name}
              type="conversation"
              conversationId={conversation?.id}
              memberId={member.id}
            />
          </>
        )}
      </div>
    </Suspense>
  );
};

export default MemberPage;
