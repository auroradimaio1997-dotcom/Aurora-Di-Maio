"use client";

import { Player } from "@remotion/player";
import { AvatarStory, AVATAR_TOTAL_DURATION } from "./AvatarStory";

const WIDTH = 960;
const HEIGHT = 540;
const FPS = 30;

export default function AvatarStoryPlayer({
  avatarSrc,
}: {
  avatarSrc?: string;
}) {
  return (
    <div className="mx-auto aspect-video w-[48rem] max-w-full overflow-hidden rounded-2xl">
      <Player
        component={AvatarStory}
        inputProps={{ avatarSrc }}
        durationInFrames={AVATAR_TOTAL_DURATION}
        compositionWidth={WIDTH}
        compositionHeight={HEIGHT}
        fps={FPS}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        initiallyMuted
        numberOfSharedAudioTags={0}
        loop
        controls={false}
        showVolumeControls={false}
        clickToPlay={false}
        acknowledgeRemotionLicense
      />
    </div>
  );
}
