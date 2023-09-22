import { ChatWelcome } from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2 } from 'lucide-react';
import { ElementRef, Fragment, useRef } from 'react';
import { ChatItem } from './chat-item';
import { format } from 'date-fns';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { Any, Member } from '@/types';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { Error } from '../error';
import { Loading } from '../loading';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketQuery: Record<string, Any>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

const ChatMessages = ({
  apiUrl,
  chatId,
  member,
  name,
  paramValue,
  socketQuery,
  type,
  paramKey,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const deleteKey = `chat:${chatId}:messages:delete`;
  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    apiUrl,
    paramKey,
    paramValue,
    queryKey,
  });
  useChatSocket({ addKey, updateKey, queryKey, deleteKey });
  useChatScroll({
    bottomRef,
    chatRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items.length ?? 0,
  });
  if (status === 'loading') return <Loading name="messages" />;
  if (status === 'error') return <Error />;
  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && (
        <>
          <div className="flex-1"></div>
          <ChatWelcome type={type} name={name} />
        </>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 text-xs my-4 transition"
            >
              Load previous chats
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data &&
          data.pages &&
          data.pages.map((group, i) => (
            <Fragment key={i}>
              {group &&
                group.items.map((message) => (
                  <ChatItem
                    key={message.id}
                    currentMember={member}
                    content={message.content}
                    fileUrl={message.fileUrl || ''}
                    deleted={message.deleted}
                    isUpdated={message.createAt !== message.updateAt}
                    timestamp={format(new Date(message.createAt), DATE_FORMAT)}
                    member={message.member}
                    socketQuery={{ ...socketQuery, messageId: message.id }}
                  />
                ))}
            </Fragment>
          ))}
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatMessages;
