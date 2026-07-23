"use client";

import { Player } from "@remotion/player";
import { AvatarStory, AVATAR_SCENE_DURATION } from "./AvatarStory";

const SIZE = 420;
const FPS = 30;
const SCENE_COUNT = 4;

export default function AvatarStoryPlayer({
  avatarSrc,
}: {
  avatarSrc?: string;
}) {
  return (
    <div className="mx-auto aspect-square w-[22rem] max-w-full overflow-hidden rounded-2xl">
      <Player
        component={AvatarStory}
        inputProps={{ avatarSrc }}
        durationInFrames={SCENE_COUNT * AVATAR_SCENE_DURATION}
        compositionWidth={SIZE}
        compositionHeight={SIZE}
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
