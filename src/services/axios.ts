import { CONSTANT } from '@/lib/constants';
import { getSessionData, removeSessionData, setSessionData } from '@/lib/utils';
import api from 'axios';

// Create a new Axios instance with custom configuration
const axios = api.create({
  baseURL: CONSTANT.APIURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.request.use((req) => {
  req.headers.Authorization = getSessionData('token');
  return req;
});

axios.interceptors.response.use(
  (res) => {
    const newToken = res.headers['X-New-Access-Token'];
    if (newToken) setSessionData('token', newToken);
    return res;
  },
  (err) => {
    if (err?.response?.status === 401) removeSessionData('token');
    return err.response;
  }
);

export default axios;
