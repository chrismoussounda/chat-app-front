import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthProps, auth as authApi } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    mutate: auth,
    isLoading,
    error,
  } = useMutation({
    mutationFn: async (values: AuthProps) => await authApi(values),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      navigate('/', { replace: true });
    },
    onError: (err: Error) => {
      toast({
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  return { auth, isLoading, error };
}
