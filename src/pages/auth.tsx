import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/authentification/use-auth';
import { useUser } from '@/features/authentification/use-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Username is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

const Auth = () => {
  const [isSignin, setIsSignin] = useState(false);
  const { user } = useUser();
  const { isLoading, auth, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation().pathname;

  useEffect(() => {
    setIsSignin(location === '/sign-in');
    console.log(user);
    if (user) navigate('/');
  }, [error, isLoading, location, navigate, user]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    auth({ ...values, isSignin });
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-xl bg-slate-100 w-96 space-y-6 p-10 text-black"
        >
          <header>
            <h3 className="font-semibold text-xl">
              {isSignin ? 'Sign in' : 'Create your account'}
            </h3>
            <p className="mt-0 text-sm text-zinc-500">to continue to chatify</p>
          </header>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 text-sm h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormItem>
                  <FormLabel className="uppercase text-xs te font-bold text-zinc-500 dark:text-secondary/70">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 h-10"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            variant="primary"
            className="uppercase text-xs font-bold w-full text-zinc-100"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'continue'}
          </Button>
          <FormDescription className="text-xs">
            {isSignin ? 'No account?' : 'Have an account?'}{' '}
            <Link
              className="hover:underline-offset-1"
              to={isSignin ? '/sign-up' : '/sign-in'}
              onClick={() => setIsSignin((prev) => !prev)}
            >
              {isSignin ? 'Sign up' : 'Sign in'}
            </Link>
          </FormDescription>
        </form>
      </Form>
    </div>
  );
};

export default Auth;
