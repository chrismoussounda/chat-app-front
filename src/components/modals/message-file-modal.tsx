import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Form, FormItem, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { useModal } from '@/hooks/use-modal-store';
import { processPdf } from '@/lib/utils';
import { useParams } from 'react-router-dom';
import { createDirectMessage, createMessage } from '@/services/message';
import { uploadFile } from '@/services/file-upload';

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'FIle not provided',
  }),
});

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'messageFile';
  const { serverId = '', channelId = '' } = useParams();
  const conversationId = data?.query?.conversationId as string;
  const memberId = data?.query?.memberId as string;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: new File([''], 'filename'),
    },
  });
  const getPdfImage = async (file: File) => {
    const { imageFile } = await processPdf(file);
    return await uploadFile(imageFile);
  };

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async ({ file }: z.infer<typeof formSchema>) => {
    const isPdf = file.type.includes('pdf');
    let pdfPreview = '';
    let fileUrl = '';
    try {
      if (isPdf) {
        pdfPreview = await getPdfImage(file);
      }
      fileUrl = await uploadFile(file);
      if (channelId)
        await createMessage({
          content: isPdf ? pdfPreview : file.name,
          fileUrl: fileUrl,
          serverId,
          channelId,
        });
      if (memberId) {
        await createDirectMessage({
          conversationId,
          content: isPdf ? pdfPreview : file.name,
          fileUrl: fileUrl,
          memberId,
        });
      }
      form.reset();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Add an Attachment</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          onChange={field.onChange}
                          value={field.value}
                          type="message"
                          disable={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-7">
              <Button
                disabled={isLoading}
                variant="primary"
                className={isLoading ? 'cursor-wait' : ''}
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
