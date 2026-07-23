import {
  AbsoluteFill,
  Img,
  Series,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GraduationCap, Award, Scale, Landmark, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const AVATAR_SCENE_DURATION = 90;

const scenes: { icon: LucideIcon; label: string }[] = [
  { icon: GraduationCap, label: "Laurea" },
  { icon: Award, label: "Dottorato" },
  { icon: Scale, label: "Studia da Notaio" },
  { icon: Landmark, label: "Lavora in Studio" },
];

function AvatarScene({
  icon: Icon,
  label,
  duration,
  avatarSrc,
}: {
  icon: LucideIcon;
  label: string;
  duration: number;
  avatarSrc?: string;
}) {
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
  const badgeScale = interpolate(frame, [10, 30], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeRotate = interpolate(frame, [10, 30], [-30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center gap-6 bg-background">
      <div
        style={{ opacity }}
        className="relative flex h-56 w-56 items-center justify-center overflow-visible rounded-full border-4 border-primary bg-muted"
      >
        {avatarSrc ? (
          <Img
            src={avatarSrc}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <UserRound size={96} className="text-secondary" />
        )}
        <div
          style={{ scale: badgeScale, rotate: `${badgeRotate}deg` }}
          className="absolute -bottom-2 -right-2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-cta"
        >
          <Icon size={30} className="text-on-primary" />
        </div>
      </div>
      <p style={{ opacity }} className="font-serif text-2xl font-semibold text-foreground">
        {label}
      </p>
    </AbsoluteFill>
  );
}

export function AvatarStory({ avatarSrc }: { avatarSrc?: string }) {
  return (
    <AbsoluteFill>
      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence key={i} durationInFrames={AVATAR_SCENE_DURATION}>
            <AvatarScene {...scene} duration={AVATAR_SCENE_DURATION} avatarSrc={avatarSrc} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
}
