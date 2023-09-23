import { ModeToggle } from '@/components/mode-toggle';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Separator } from '@radix-ui/react-select';
import { getServers } from '../../features/server/use-servers';
import NavigationAction from './navigation-action';
import NavigationItem from './navigation-item';
import UserAction from '../user-action';

const NavigationSidebar = () => {
  const servers = getServers();
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <UserAction />
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavigationSidebar;
