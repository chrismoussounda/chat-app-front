import { cn } from '@/lib/utils';
import ActionTooltip from '../ui/action-tooltip';
import { useParams } from 'react-router-dom';
import { Image } from '../image';
import { Link } from 'react-router-dom';

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <Link to={`/servers/${id}`} className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'relative group flex  mx-3 h-[48px] w-[48px] rouded-[24px] transition-all overflow-hidden rounded-full group-hover:rounded-[16px]',
            params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image src={imageUrl} alt="Channel" />
        </div>
      </Link>
    </ActionTooltip>
  );
};

export default NavigationItem;
