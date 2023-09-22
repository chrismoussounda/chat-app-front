import { User } from '@/types';
import axios from './axios';
import { setSessionData } from '@/lib/utils';

export interface AuthProps {
  name: string;
  password: string;
  isSignin: boolean;
}

export const auth = async (values: AuthProps) => {
  const link = values.isSignin ? '/auth/signin' : '/auth/signup';
  const res = await axios.post(link, values);
  if (res.status !== 200 && res.status !== 201) throw new Error(res.data['message']);
  setSessionData('token', res.data['accessToken']);
  return await getCurrentUser();
};

export const getCurrentUser = async () => {
  const res = await axios.get('/auth/profile');
  if (res.status !== 200) throw new Error(res.data['message']);
  return res.data as User;
};
