const baseUrl = import.meta.env.VITE_API_URL;
export const CONSTANT = {
  USER: 'user',
  LK_URL: import.meta.env.VITE_LK_SERVER_URL,
  APIURL: baseUrl,
  SOCKET_API_URL: import.meta.env.VITE_API_URL,
  SERVERS: 'servers',
  SERVER: 'server',
  CHANNELS: 'channels',
  CHANNEL: 'channel',
  MESSAGE_URL: baseUrl + 'messages',
  DIRECT_MESSAGE_URL: baseUrl + 'direct-messages',
};
