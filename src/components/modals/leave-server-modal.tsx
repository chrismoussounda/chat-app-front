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
import { useNavigate } from 'react-router-dom';
import { getServers, refreshServers } from '@/features/server/use-servers';
import { leaveServer } from '@/services/server';

const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const server = data?.server;
  const servers = getServers();
  const alternativeServer = servers?.find((ser) => ser.id !== server?.id);
  const isModalOpen = isOpen && type === 'leaveServer';

  const onSubmit = async () => {
    try {
      setIsloading(true);
      if (server) await leaveServer(server.id);
      await refreshServers();
      handleClose();
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
    } finally {
      setIsloading(false);
    }
  };

  const handleClose = () => {
    onClose();
    navigate(alternativeServer ? `/servers/${alternativeServer.id}` : '/');
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Leave server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave
            <span className="text-indigo-500 font-semibold">{server?.name}?</span>
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

export default LeaveServerModal;
