import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { inviteCode } from '@/services/server';
import { refreshServer } from '@/features/server/use-server';
import { useOrgin } from '@/hooks/use-orgin';
import { AxiosError } from 'axios';

const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [copied, setCopied] = useState(false);
  const origin = useOrgin();
  const [isLoading, setIsLoading] = useState(false);
  const server = data?.server;

  const onCopie = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const server = await inviteCode(data?.server?.id);
      refreshServer(server.id);
      onOpen('invite', { server });
    } catch (err) {
      const error = err as AxiosError;
      console.log(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const isModalOpen = isOpen && type === 'invite';

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button disabled={isLoading} size="icon" onClick={onCopie}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
            onClick={onNew}
          >
            Generate a new link <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
