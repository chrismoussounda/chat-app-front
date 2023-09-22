import { MemberRole, Server } from '@/types';
import axios from './axios';
import { QueryFunctionContext } from '@tanstack/react-query';

interface ServerApiProps {
  name?: string;
  imageUrl?: string;
  id?: string;
  memberId?: string;
  role?: MemberRole;
}

export const getServers = async () => {
  const res = await axios.get('/server');
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Server[];
};

export const getServer = async (context: QueryFunctionContext) => {
  const res = await axios.get(`/server/${context.queryKey[1]}`);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Server;
};

export const createServer = async (values: ServerApiProps) => {
  const res = await axios.post('/server', values);
  if (res.status !== 201) throw new Error(res.data.message);
  return res.data as Server;
};

export const updateServer = async (values: ServerApiProps) => {
  const res = await axios.patch(`/server/${values.id}`, values);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Server;
};

export const updateServerMember = async (values: ServerApiProps) => {
  const res = await axios.patch(`/server/${values.id}/member-role`, values);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Server;
};

export const removeServerMember = async (values: ServerApiProps) => {
  const res = await axios.patch(`/server/${values.id}/remove-member`, values);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Server;
};

export const leaveServer = async (id: string) => {
  const res = await axios.delete(`/server/${id}/leave`);
  if (res.status !== 200) throw new Error(res.data.message);
  // return res.data as Server;
};

export const inviteCode = async (serverId = '') => {
  const res = await axios.patch(`server/${serverId}/invite-code`);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Server;
};

export const deleteServer = async (serverId: string) => {
  await axios.delete(`server/${serverId}`);
  // if (res.status !== 200) throw new Error(res.data.message);
};
