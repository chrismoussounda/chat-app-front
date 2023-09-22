import { ServerCrash } from 'lucide-react';

export const Error = () => {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <ServerCrash className="h-7 w-8 text-zinc-500 data:text-zinc-300" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong</p>
    </div>
  );
};
