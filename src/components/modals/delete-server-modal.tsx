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
import { deleteServer } from '@/services/server';
import { getServers, refreshServers } from '@/features/server/use-servers';
import { useNavigate } from 'react-router-dom';

const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsloading] = useState(false);
  const servers = getServers();
  const server = data?.server;
  const navigate = useNavigate();
  const isModalOpen = isOpen && type === 'deleteServer';

  const onSubmit = async () => {
    try {
      const serverRef = servers.find((el) => el.id !== server?.id);
      console.log({ servers, server, serverRef });
      if (!server?.id) return;
      setIsloading(true);
      await deleteServer(server.id);
      await refreshServers();
      onClose();
      if (serverRef) return navigate(`/servers/${serverRef.id}`);
      navigate('/');
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
          <DialogTitle className="text-2xl text-center font-bold">Delete server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br />
            <span className="text-indigo-500 font-semibold">{server?.name}</span> will be
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

export default DeleteServerModal;
