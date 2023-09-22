import { Loader2 } from 'lucide-react';

interface LoadingProps {
  name: string;
}

export const Loading = ({ name }: LoadingProps) => {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <Loader2 className="h-7 w-8 text-zinc-500 data:text-zinc-300 animate-spin" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading {name}...</p>
    </div>
  );
};
