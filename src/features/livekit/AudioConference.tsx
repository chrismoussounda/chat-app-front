import * as React from 'react';
import {
  useParticipants,
  LayoutContextProvider,
  ParticipantLoop,
  ParticipantAudioTile,
  ControlBar,
  Chat,
} from '@livekit/components-react';
import type { WidgetState } from '@livekit/components-core';

export interface AudioConferenceProps extends React.HTMLAttributes<HTMLDivElement> {}
export function AudioConference({ ...props }: AudioConferenceProps) {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
  });
  const participants = useParticipants();

  return (
    <LayoutContextProvider onWidgetChange={setWidgetState}>
      <div className="lk-audio-conference overflow-scroll" {...props}>
        <div className="flex h-full">
          <div className="lk-audio-conference-stage">
            <ParticipantLoop participants={participants}>
              <ParticipantAudioTile />
            </ParticipantLoop>
          </div>
          {widgetState.showChat && <Chat className="" />}
        </div>
        <ControlBar
          controls={{ microphone: true, screenShare: false, camera: false, chat: true }}
        />
      </div>
    </LayoutContextProvider>
  );
}
