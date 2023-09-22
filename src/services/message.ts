import { Conversation, DirectMessage, FetchedMessages, Message } from '@/types';
import axios from './axios';

interface MessagesActionProps {
  serverId: string;
  content?: string;
  fileUrl?: string;
  channelId: string;
  id?: string;
}

interface GetConversation {
  memberOneId: string;
  memberTwoId: string;
}

interface DirectMessagesActionProps {
  content?: string;
  fileUrl?: string;
  conversationId: string;
  memberId: string;
  id?: string;
}

interface FetchMessagesProps {
  pageParam?: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export const fetchMessages = async ({ pageParam, paramValue, paramKey }: FetchMessagesProps) => {
  const url = paramKey === 'channelId' ? 'messages' : 'direct-messages';
  const res = await axios.get(url, {
    params: {
      cursor: pageParam ? pageParam : undefined,
      [paramKey]: paramValue,
    },
  });
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as FetchedMessages;
};

export const createMessage = async (values: MessagesActionProps) => {
  const res = await axios.post('/messages', values);
  if (res.status !== 201) throw new Error(res.data.message);
  return res.data as Message;
};

export const updateMessage = async (values: MessagesActionProps) => {
  const res = await axios.patch(`/messages/${values.id}`, values);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Message;
};

export const deleteMessage = async (values: MessagesActionProps) => {
  const res = await axios.delete(`/messages/${values.id}`, {
    params: values,
  });
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Message;
};

export const getConversation = async (values: GetConversation) => {
  if (!values.memberOneId || !values.memberTwoId) return null;
  const res = await axios.get(`/conversation`, {
    params: values,
  });
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Conversation;
};

export const createDirectMessage = async (values: DirectMessagesActionProps) => {
  const res = await axios.post('/direct-messages', values);
  if (res.status !== 201) throw new Error(res.data.message);
  return res.data as DirectMessage;
};

export const updateDirectMessage = async (values: DirectMessagesActionProps) => {
  const res = await axios.patch(`/direct-messages/${values.id}`, values);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as DirectMessage;
};

export const deleteDirectMessage = async (values: DirectMessagesActionProps) => {
  const res = await axios.delete(`/direct-messages/${values.id}`, {
    params: values,
  });
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as DirectMessage;
};
