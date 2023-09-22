import { cn } from '@/lib/utils';
import { Shield, ShieldAlert } from 'lucide-react';
import { UserAvatar } from '../user-avatar';
import { Member, MemberRole } from '@/types';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser } from '@/features/authentification/get-user';
import ActionTooltip from '../ui/action-tooltip';

interface ServerMemberProps {
  member: Member;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <Shield className="mr-2 h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

export const ServerMember = ({ member }: ServerMemberProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const icon = roleIconMap[member.role];

  const onClick = () => {
    if (member.userId !== user.id)
      navigate(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  return (
    <ActionTooltip label={member.userId === user.id ? 'me' : ''} side="right">
      <button
        onClick={onClick}
        className={cn(
          'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transitio mb-1',
          params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
        )}
      >
        <UserAvatar src={member.user.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />
        <p
          className={cn(
            'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
            params?.memberId === member.id && 'text-primary dark:text-zinc-200 dar'
          )}
        >
          {member.user.name}
        </p>
        {icon}
      </button>
    </ActionTooltip>
  );
};
