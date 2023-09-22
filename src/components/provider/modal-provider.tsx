import React, { Suspense } from 'react';
import Loader from '@/components/loader'; // Assuming you have a Loader component

const CreateServerModal = React.lazy(() => import('@/components/modals/create-server-modal'));
const DeleteServerModal = React.lazy(() => import('@/components/modals/delete-server-modal'));
const InviteModal = React.lazy(() => import('@/components/modals/invite-modal'));
const EditServerModal = React.lazy(() => import('@/components/modals/edit-server-modal'));
const ManageMemberModal = React.lazy(() => import('@/components/modals/manage-member-modal'));
const LeaveServerModal = React.lazy(() => import('@/components/modals/leave-server-modal'));
const DeleteMessageModal = React.lazy(() => import('@/components/modals/delete-message-modal'));
const MessageFileModal = React.lazy(() => import('@/components/modals/message-file-modal'));
const CreateChannelModal = React.lazy(() => import('@/components/modals/create-channel-modal'));
const DeleteChannelModal = React.lazy(() => import('@/components/modals/delete-channel-modal'));
const EditChannelModal = React.lazy(() => import('@/components/modals/edit-channel-modal'));

const ModalProvider = () => {
  return (
    <Suspense fallback={<Loader />}>
      <CreateServerModal />
      <DeleteServerModal />
      <InviteModal />
      <EditServerModal />
      <ManageMemberModal />
      <LeaveServerModal />
      <DeleteMessageModal />
      <MessageFileModal />
      <CreateChannelModal />
      <DeleteChannelModal />
      <EditChannelModal />
    </Suspense>
  );
};

export default ModalProvider;
