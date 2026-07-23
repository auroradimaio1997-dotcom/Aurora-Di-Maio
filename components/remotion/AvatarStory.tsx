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

export const AVATAR_SCENE_DURATION = 110;
const OVERLAP = 20;
const SCENE_COUNT = 4;
export const AVATAR_TOTAL_DURATION =
  SCENE_COUNT * AVATAR_SCENE_DURATION - (SCENE_COUNT - 1) * OVERLAP;

const scenes: {
  icon: LucideIcon;
  label: string;
  caption: string;
  bg: string;
  tint: string;
}[] = [
  {
    icon: GraduationCap,
    label: "Laurea",
    caption: "Il punto di partenza.",
    bg: "bg-primary",
    tint: "text-primary",
  },
  {
    icon: Award,
    label: "Dottorato",
    caption: "Anni di ricerca e studio.",
    bg: "bg-cta",
    tint: "text-cta",
  },
  {
    icon: Scale,
    label: "Studia da Notaio",
    caption: "La preparazione per l'esame.",
    bg: "bg-secondary",
    tint: "text-secondary",
  },
  {
    icon: Landmark,
    label: "Lavora in Studio",
    caption: "Oggi, in studio notarile.",
    bg: "bg-primary",
    tint: "text-primary",
  },
];

const BOOK_COLORS = ["bg-primary", "bg-cta", "bg-secondary"];
const BOOK_LAYOUT = [
  { rotate: -14, x: -150, y: 40, h: 70, w: 40 },
  { rotate: 10, x: 150, y: -20, h: 84, w: 44 },
  { rotate: -6, x: 170, y: 90, h: 60, w: 36 },
];

function FloatingBooks({ frame }: { frame: number }) {
  return (
    <>
      {BOOK_LAYOUT.map((book, i) => {
        const float = Math.sin((frame + i * 30) / 22) * 10;
        const spin = book.rotate + Math.sin((frame + i * 20) / 40) * 4;
        return (
          <div
            key={i}
            style={{
              transform: `translate(${book.x}px, ${book.y + float}px) rotate(${spin}deg)`,
            }}
            className={`absolute left-1/2 top-1/2 -ml-5 -mt-10 rounded-md opacity-90 shadow-xl ${BOOK_COLORS[i]}`}
          >
            <div
              style={{ width: book.w, height: book.h }}
              className="relative rounded-md"
            >
              <span className="absolute inset-y-1 left-1 w-1 rounded-full bg-background/40" />
            </div>
          </div>
        );
      })}
    </>
  );
}

function AvatarScene({
  icon: Icon,
  label,
  caption,
  bg,
  tint,
  duration,
  avatarSrc,
}: {
  icon: LucideIcon;
  label: string;
  caption: string;
  bg: string;
  tint: string;
  duration: number;
  avatarSrc?: string;
}) {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, OVERLAP], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [duration - OVERLAP, duration], [1, 0], {
    easing: Easing.bezier(0.7, 0, 0.84, 0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, exit);

  const zoom = interpolate(frame, [0, duration], [1, 1.12], {
    easing: Easing.bezier(0.65, 0, 0.35, 1),
    extrapolateRight: "clamp",
  });

  const captionY = interpolate(frame, [10, 34], [24, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeScale = interpolate(frame, [16, 36], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-background">
      <AbsoluteFill
        style={{ opacity: 0.16 }}
        className={`bg-[radial-gradient(circle_at_30%_30%,_currentColor,_transparent_60%)] ${tint}`}
      />

      <AbsoluteFill
        style={{ opacity }}
        className="flex flex-col items-center justify-center gap-8 px-10 md:flex-row md:gap-16"
      >
        <div className="relative flex h-64 w-64 shrink-0 items-center justify-center md:h-72 md:w-72">
          <FloatingBooks frame={frame} />

          <div
            style={{ transform: `scale(${zoom})` }}
            className="relative z-10 flex h-56 w-56 items-center justify-center overflow-hidden rounded-3xl border-4 border-primary bg-muted shadow-2xl md:h-64 md:w-64"
          >
            {avatarSrc ? (
              <Img
                src={avatarSrc}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={96} className="text-secondary" />
            )}
          </div>

          <div
            style={{ scale: badgeScale }}
            className={`absolute -bottom-4 -right-4 z-20 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background ${bg}`}
          >
            <Icon size={30} className="text-background" />
          </div>
        </div>

        <div
          style={{ opacity, translate: `0 ${captionY}px` }}
          className="max-w-sm text-center md:text-left"
        >
          <p className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            {label}
          </p>
          <p className="mt-3 text-lg text-secondary">{caption}</p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function AvatarStory({ avatarSrc }: { avatarSrc?: string }) {
  return (
    <AbsoluteFill className="bg-background">
      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence
            key={i}
            durationInFrames={AVATAR_SCENE_DURATION}
            offset={i === 0 ? 0 : -OVERLAP}
          >
            <AvatarScene {...scene} duration={AVATAR_SCENE_DURATION} avatarSrc={avatarSrc} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
}
