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
import { Channel } from '@/types';
import { deleteChannel } from '@/services/channel';
import { useNavigate, useParams } from 'react-router-dom';
import { getServer, refreshServer } from '@/features/server/use-server';

const DeleteChannelModal = () => {
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onClose, type, data } = useModal();
  const { channelId = '', serverId = '' } = useParams();
  const channel = data?.channel as Channel;
  const server = getServer(serverId);
  const generalChannel = server?.channels?.find((channel) => channel.name === 'general');
  const isModalOpen = isOpen && type === 'deleteChannel';

  const onSubmit = async () => {
    try {
      setIsloading(true);
      await deleteChannel(channel?.id);
      await refreshServer(serverId);
      if (channel.id === channelId) navigate(`/servers/${serverId}/channels/${generalChannel?.id}`);
      onClose();
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
    } finally {
      setIsloading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Channel</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br />
            <span className="text-indigo-500 font-semibold">{channel?.name}</span> will be
            permanently deleted
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

export default DeleteChannelModal;
