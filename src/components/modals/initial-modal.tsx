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
import { FileUpload } from '../file-upload';
import { useEffect } from 'react';
import { deleteFile, uploadFile } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createServer } from '@/services/server';
import { useToast } from '../ui/use-toast';
import { useServers } from '@/features/server/use-servers';
import Loader from '../loader';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required',
  }),
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'Image not provided',
  }),
});

export const Initial = () => {
  const { servers, isLoading: serversLoading } = useServers();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!serversLoading && servers.length) {
      const server = servers[0];
      navigate(`/servers/${server.id}`);
    }
  }, [serversLoading, navigate, servers]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      file: new File([], 'file'),
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async ({ file, name }: z.infer<typeof formSchema>) => {
    let url = '';
    try {
      const { imageUrl, location } = await uploadFile(file);
      url = location;
      const server = await createServer({ name, imageUrl });
      toast({ description: 'Serveur crée' });
      navigate(`servers/${server.id}/channel/${server.channels[0].id}`);
    } catch (err) {
      const error = err as Error;
      await deleteFile(url);
      toast({ description: error.message, variant: 'destructive' });
    }
  };

  if (serversLoading) return <Loader />;

  return (
    <Dialog open={true}>
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
                    <FormItem className="flex-1">
                      <FormControl>
                        <FileUpload
                          type="server"
                          disable={isLoading}
                          onChange={field.onChange}
                          value={field.value}
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
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-7">
              <Button
                variant="primary"
                className={isLoading ? 'cursor-progress' : ''}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin w-10" /> : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Initial;
