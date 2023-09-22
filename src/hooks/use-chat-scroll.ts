import { useEffect, useState } from 'react';

interface ChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
}

export const useChatScroll = ({
  bottomRef,
  chatRef,
  count,
  loadMore,
  shouldLoadMore,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    const topDiv = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) loadMore();
    };
    topDiv?.addEventListener('scroll', handleScroll);
    return () => topDiv?.removeEventListener('scroll', handleScroll);
  }, [chatRef, loadMore, shouldLoadMore]);

  useEffect(() => {
    const topDiv = chatRef.current;
    const bottomDiv = bottomRef.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }
      if (!topDiv) return false;
      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomDiv?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }, [bottomRef, chatRef, hasInitialized, count]);
};
