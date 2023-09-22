import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { useState } from 'react';
import { deleteDirectMessage, deleteMessage } from '@/services/message';
import { useParams } from 'react-router-dom';

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { serverId = '', channelId = '' } = useParams();
  const [isLoading, setIsloading] = useState(false);
  const id = (data?.query?.id as string) || '';
  const memberId = (data?.query?.memberId as string) || '';
  const conversationId = (data?.query?.conversationId as string) || '';
  const isModalOpen = isOpen && type === 'deleteMessage';

  const onSubmit = async () => {
    try {
      setIsloading(true);
      if (channelId && id) await deleteMessage({ id, channelId, serverId });
      if (conversationId && id) deleteDirectMessage({ id, memberId, conversationId });
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
    } finally {
      setIsloading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Message</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br />
            The message will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button onClick={onClose} disabled={isLoading} variant="ghost">
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isLoading} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
