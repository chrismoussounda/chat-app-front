import { Toaster } from '@/components/ui/toaster';
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default ToastProvider;
