import { Any, Message } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSocket } from './use-socket';

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
  deleteKey: string;
};

export const useChatSocket = ({ addKey, queryKey, updateKey, deleteKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: Message) => {
      queryClient.setQueryData([queryKey], (oldData: Any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

        const newData = oldData.pages.map((page: Any) => ({
          ...page,
          items: page.items.map((item: Message) => {
            if (item.id === message.id) return message;
            return item;
          }),
        }));

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(deleteKey, (message: Message) => {
      queryClient.setQueryData([queryKey], (oldData: Any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

        const newData = oldData.pages.map((page: Any) => ({
          ...page,
          items: page.items.filter((item: Message) => item.id !== message.id),
        }));

        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    socket.on(addKey, (message: Message) => {
      console.log(message);
      queryClient.setQueryData([queryKey], (oldData: Any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return { pages: [{ items: [message] }] };

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [addKey, deleteKey, queryClient, queryKey, socket, updateKey]);
};
