"use client";

import { Player } from "@remotion/player";
import { AreaStory, SCENE_DURATION, type StoryScene } from "./AreaStory";

const WIDTH = 640;
const HEIGHT = 360;
const FPS = 30;

export default function AreaStoryPlayer({
  scenes,
  theme,
}: {
  scenes: StoryScene[];
  theme: "dottorato" | "notarile" | "accademia";
}) {
  return (
    <div className="aspect-video w-[24rem] max-w-full overflow-hidden rounded-xl border">
      <Player
        component={AreaStory}
        inputProps={{ scenes, theme }}
        durationInFrames={scenes.length * SCENE_DURATION}
        compositionWidth={WIDTH}
        compositionHeight={HEIGHT}
        fps={FPS}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        initiallyMuted
        loop
        controls={false}
        showVolumeControls={false}
        clickToPlay={false}
        acknowledgeRemotionLicense
      />
    </div>
  );
}
