import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Plus, SendIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { useModal } from '@/hooks/use-modal-store';
import { EmojiPicker } from '../../features/messages/emogi-picker';
import { createDirectMessage, createMessage } from '@/services/message';
import { useParams } from 'react-router-dom';

interface ChatInputProps {
  name: string;
  type: 'conversation' | 'channel';
  conversationId?: string;
  memberId?: string;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ name, type, conversationId = '', memberId = '' }: ChatInputProps) => {
  const { serverId = '', channelId = '' } = useParams();
  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async ({ content }: z.infer<typeof formSchema>) => {
    try {
      if (type === 'channel' && channelId) await createMessage({ content, serverId, channelId });
      else if (type === 'conversation' && conversationId) {
        await createDirectMessage({
          conversationId,
          content,
          memberId,
        });
      }
      form.reset();
      form.setFocus('content');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus
                      onClick={() =>
                        onOpen('messageFile', {
                          query: {
                            conversationId,
                            memberId,
                          },
                        })
                      }
                      className="text-white dark:text-[#313338]"
                    />
                  </button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${type === 'conversation' ? 'to ' : '#'}${name} `}
                  />
                  <div
                    className="hidden xs:block absolute top-7 right-8  hover:cursor-pointer"
                    aria-disabled={isLoading}
                  >
                    <EmojiPicker
                      onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)}
                    />
                  </div>
                  <div
                    className="xs:hidden absolute top-7 right-8  hover:cursor-pointer"
                    aria-disabled={isLoading}
                  >
                    <SendIcon />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
