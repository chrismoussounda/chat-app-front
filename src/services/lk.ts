import axios from './axios';

interface GetTokenProps {
  roomId: string;
  username: string;
}

export const getToken = async (values: GetTokenProps) => {
  const res = await axios.get(`/livekit`, {
    params: values,
  });
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as string;
};
