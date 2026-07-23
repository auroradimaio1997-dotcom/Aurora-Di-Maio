import {
  AbsoluteFill,
  Series,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  Library,
  FileStack,
  NotebookPen,
  FileText,
  ClipboardCheck,
  Landmark,
  GraduationCap,
  PenLine,
  BookMarked,
} from "lucide-react";

export const SCENE_DURATION = 75;

const ICONS = {
  Library,
  FileStack,
  NotebookPen,
  FileText,
  ClipboardCheck,
  Landmark,
  GraduationCap,
  PenLine,
  BookMarked,
} as const;

export type StoryIconName = keyof typeof ICONS;

export type StoryScene = {
  iconName: StoryIconName;
  label: string;
  sub: string;
};

const borderByTheme = {
  dottorato: "border-accent",
  notarile: "border-cta",
  accademia: "border-secondary",
} as const;

function SceneView({
  iconName,
  label,
  sub,
  duration,
  borderClass,
}: StoryScene & { duration: number; borderClass: string }) {
  const Icon = ICONS[iconName];
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [duration - 15, duration], [1, 0], {
    easing: Easing.bezier(0.65, 0, 0.35, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, exit);
  const scale = interpolate(frame, [0, 20], [0.6, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(frame, [0, 20], [-6, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [8, 26], [16, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center gap-6 bg-muted">
      <div
        style={{ opacity, scale, rotate: `${rotate}deg` }}
        className={`flex h-28 w-28 items-center justify-center rounded-2xl border-2 bg-primary ${borderClass}`}
      >
        <Icon size={52} className="text-on-primary" />
      </div>
      <div style={{ opacity, translate: `0 ${textY}px` }} className="text-center">
        <p className="font-serif text-2xl font-semibold text-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm text-secondary">{sub}</p>
      </div>
    </AbsoluteFill>
  );
}

export function AreaStory({
  scenes,
  theme,
}: {
  scenes: StoryScene[];
  theme: keyof typeof borderByTheme;
}) {
  const borderClass = borderByTheme[theme];

  return (
    <AbsoluteFill>
      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence key={i} durationInFrames={SCENE_DURATION}>
            <SceneView {...scene} duration={SCENE_DURATION} borderClass={borderClass} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
}
