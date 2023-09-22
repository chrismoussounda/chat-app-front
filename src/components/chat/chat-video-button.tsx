import { Video, VideoOff } from 'lucide-react';
import ActionTooltip from '../ui/action-tooltip';
import { useVideo } from '@/hooks/use-video';

export const ChatVideoButon = () => {
  const { isVideo, toggle } = useVideo();
  const Icon = isVideo ? VideoOff : Video;
  const toolTipLabel = isVideo ? 'End video call' : 'Start video call';

  return (
    <ActionTooltip side="bottom" label={toolTipLabel}>
      <button onClick={toggle} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
