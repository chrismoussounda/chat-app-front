export type User = {
  id: string;
  name: string;
  imageUrl: string;
  createAt: string;
  updateAt: string;
};

export type Server = {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  userId: string;
  createAt: string;
  updateAt: string;
  channels: Channel[];
  members: Member[];
};

export type Member = {
  id: string;
  role: MemberRole;
  userId: string;
  serverId: string;
  createAt: string;
  updateAt: string;
  user: User;
};

export enum MemberRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST',
}

export type Channel = {
  id: string;
  name: string;
  type: ChannelType;
  serverId: string;
  userId: string;
  createAt: string;
  updateAt: string;
};

export enum ChannelType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export type Message = {
  id: string;
  content: string;
  fileUrl: string;
  memberId: string;
  member: Member;
  channelId: string;
  channel: Channel;
  deleted: boolean;
  createAt: Date;
  updateAt: Date;
};

export type FetchedMessages = {
  items: Message[];
  nextCursor: string;
};

export type Conversation = {
  id: string;
  memberOneId: string;
  memberTwoId: string;
  memberOne: Member;
  memberTwo: Member;
  createdAt: Date;
  updatedAt: Date;
};

export type DirectMessage = {
  id: string;
  content: string;
  fileUrl: string;
  memberId: string;
  member: Member;
  conversationId: string;
  deleted: boolean;
  createAt: Date;
  updateAt: Date;
};

export interface FileWithUrl extends File {
  url: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;
