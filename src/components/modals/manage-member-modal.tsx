import { MemberRole, Server } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { ScrollArea } from '../ui/scroll-area';
import { UserAvatar } from '../user-avatar';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { removeServerMember, updateServerMember } from '@/services/server';
import { refreshServer } from '@/features/server/use-server';
const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const ManageMemberModal = () => {
  const [loadingId, setLoadingId] = useState('');
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const server = data?.server as Server;

  const isModalOpen = isOpen && type === 'members';

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const data = await removeServerMember({ memberId, id: server.id });
      onOpen('members', { server: data });
      await refreshServer(server.id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const data = await updateServerMember({ id: server.id, memberId, role });
      await refreshServer(server.id);
      onOpen('members', { server: data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Manage Members</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">{`${
            server?.members?.length
          } member${server?.members?.length > 1 ? 's' : ''}`}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.user.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-sm font-bold flex items-center gap-x-1">
                  {member.user.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-sm text-zinc-500">No email ...</p>
              </div>
              {server.userId !== member.userId && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-4 h-4 text-zinc-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal></DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() => onRoleChange(member.id, MemberRole.GUEST)}
                          >
                            <Shield className="h-4 w-4 mr-2" /> Guest
                            {member.role === MemberRole.GUEST && (
                              <Check className="h-4 w-4 ml-auto" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onRoleChange(member.id, MemberRole.MODERATOR)}
                          >
                            <Shield className="h-4 w-4 mr-2" /> Moderator
                            {member.role === MemberRole.MODERATOR && (
                              <Check className="h-4 w-4 ml-auto" />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        <Gavel className="h-4 mr-2 w-4" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMemberModal;
