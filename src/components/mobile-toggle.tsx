import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import React, { Suspense } from 'react';
import Loader from './loader';
const NavigationSidebar = React.lazy(() => import('./navigation/navigation-sidebar'));
const ServerSidebar = React.lazy(() => import('./server/server-sidebar'));

export const MobileToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <Suspense fallback={<Loader />}>
        <SheetContent side="left" className="p-0 flex gap-0">
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
          <ServerSidebar />
        </SheetContent>
      </Suspense>
    </Sheet>
  );
};
