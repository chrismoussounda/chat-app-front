import { DownloadIcon, Edit, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import { UserAvatar } from '../user-avatar';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { Member, MemberRole } from '@/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Image } from '../image';
import { updateDirectMessage, updateMessage } from '@/services/message';
import EmojiPicker from '@emoji-mart/react';
import ActionTooltip from '../ui/action-tooltip';

interface ChatItemProps {
  content: string;
  member: Member;
  timestamp: string;
  fileUrl: string;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};
const formSchema = z.object({
  content: z.string().min(1),
});
export const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  isUpdated,
  member,
  socketQuery,
  timestamp,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const { serverId = '', channelId = '' } = useParams();
  const navigate = useNavigate();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = socketQuery?.channelId
    ? !deleted && (isAdmin || (isModerator && isOwner))
    : isOwner;
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileUrl ? fileUrl.includes('pdf') : false;
  const isImage = !isPdf && fileUrl;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsEditing(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    form.reset({
      content,
    });
  }, [content, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (content !== values.content) {
        if (channelId)
          updateMessage({
            channelId,
            serverId,
            content: values.content,
            id: socketQuery.messageId,
          });
        else
          updateDirectMessage({
            conversationId: socketQuery.conversationId,
            id: socketQuery.messageId,
            content: values.content,
            memberId: currentMember.id,
          });
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onMemberClick = async () => {
    if (member.id === currentMember.id) return;
    navigate(`/servers/${serverId}/conversations/${member.id}`);
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full:">
      <div className="group flex gap-x-2 items-center w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition" onClick={onMemberClick}>
          <UserAvatar src={member.user.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="font-semibold text-sm hover:underline cursor-pointer"
                onClick={onMemberClick}
              >
                {member.user.name}
              </p>
              <ActionTooltip label={member.role}>
                <p>{roleIconMap[member.role]}</p>
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>
          {isImage && (
            <div className="flex items-center mt-2 p-1  rounded-md bg-background/10 relative overflow-hidden border max-w-[400px] w-fit">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferer"
                className="relative rounded-md overflow-hidden border flex items-center bg-secondary"
              >
                <Image src={fileUrl} alt={content} className="w-full" />
              </a>
            </div>
          )}
          {isPdf && (
            <div className="flex items-center mt-2 p-1 w-fit max-w-[300px] rounded-md bg-background/10 relative overflow-hidden border">
              <div className="relative rounded-md overflow-hidden aborder flex items-center bg-secondary h-full">
                <Image src={content} alt={content} className="" />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferer"
                  className="text-sm text-indigo-500 dark:text-indigo-500 hover:underline absolute cursor-pointer z-10 bottom-0 w-full"
                >
                  <Button className="w-full" variant="primary">
                    <DownloadIcon className="h-6 w-6 fill-indigo-200 stroke-indigo-400" />
                    Download pdf
                  </Button>
                </a>
              </div>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            {...field}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edit message"
                            disabled={isLoading}
                          />
                          <div
                            className="absolute top-2 right-2  hover:cursor-pointer"
                            aria-disabled={isLoading}
                          >
                            <EmojiPicker
                              onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)}
                              side="top"
                              sideOffset={-20}
                            />
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5 cg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && !isEditing && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Detele">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  query: {
                    id: socketQuery.messageId,
                    memberId: currentMember.id,
                    conversationId: socketQuery.conversationId,
                  },
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
