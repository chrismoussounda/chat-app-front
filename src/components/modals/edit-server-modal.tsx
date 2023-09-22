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
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/file-upload';
import { useModal } from '@/hooks/use-modal-store';
import { refreshServer } from '@/features/server/use-server';
import { updateServer } from '@/services/server';
import { uploadFile, deleteFile, getStorageRef } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { Server } from '@/types';
import { refreshServers } from '@/features/server/use-servers';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Server name is required',
    })
    .optional(),
  file: z.any().nullable().optional(),
});

const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { toast } = useToast();
  const server = data?.server as Server;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: server?.name,
      file: { size: 0, url: server?.imageUrl } as object as File & { url: string },
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name);
      form.setValue('file', { size: 0, url: server.imageUrl } as File & { url: string });
    }
  }, [form, server]);

  const isModalOpen = isOpen && type === 'editServer';

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async ({ file, name }: z.infer<typeof formSchema>) => {
    let ref = '';
    let url = '';
    try {
      if (file && file.size > 0) {
        await deleteFile(getStorageRef(server.imageUrl));
        const { imageUrl, location } = await uploadFile(file);
        ref = location;
        url = imageUrl;
      }
      await updateServer({ name, imageUrl: url ? url : server.imageUrl, id: server.id });
      await refreshServer(server.id);
      if (ref) await refreshServers();
      toast({ description: 'Serveur mis à jour' });
      handleClose();
    } catch (err) {
      const error = err as Error;
      if (ref) await deleteFile(ref);
      toast({ description: error.message, variant: 'destructive' });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with name and image. You can alwyas change it later
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
                          disable={isLoading}
                          type="server"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-7">
              <Button disabled={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
