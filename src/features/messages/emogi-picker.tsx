import { Smile } from 'lucide-react';
import { Popover, PopoverTrigger } from '../../components/ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import Picker from '@emoji-mart/react';
import data, { Skin } from '@emoji-mart/data';

interface EmojiPickerProps {
  onChange: (value: string) => void;
  sideOffset?: number;
  side?: 'top' | 'right';
}

export const EmojiPicker = ({ side = 'right', sideOffset = 50, onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side={side}
        sideOffset={sideOffset}
        className="bg-transparent border-none shadow-none z-50 drop-shadow-none mb-16"
      >
        <Picker data={data} onEmojiSelect={(emoji: Skin) => onChange(emoji.native)} />
      </PopoverContent>
    </Popover>
  );
};
