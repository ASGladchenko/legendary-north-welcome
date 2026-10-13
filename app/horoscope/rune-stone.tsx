import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import monolithBlue from "@/public/images/rune/monolith-blue.webp";
import monolithCyan from "@/public/images/rune/monolith-cyan.webp";
import monolithViolet from "@/public/images/rune/monolith-violet.webp";

const monoliths = {
  blue: monolithBlue,
  cyan: monolithCyan,
  violet: monolithViolet,
} as const;

export function RuneStone({
  image,
  name,
  color,
  stone,
  priority = false,
}: {
  image: StaticImageData;
  name: string;
  color: string;
  stone: keyof typeof monoliths;
  priority?: boolean;
}) {
  return (
    <div
      className="rune-stone"
      style={{ "--rune-color": color } as CSSProperties}
    >
      <Image
        className="rune-stone-rock"
        src={monoliths[stone]}
        alt=""
        fill
        sizes="(max-width: 700px) 70vw, 260px"
        quality={70}
        preload={priority}
      />
      <RuneMark
        className="rune-stone-mark"
        image={image}
        name={name}
        color={color}
      />
    </div>
  );
}

export function RuneMark({
  image,
  name,
  color,
  className = "",
}: {
  image: StaticImageData;
  name: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      role="img"
      aria-label={`${name} rune`}
      style={
        {
          "--rune-color": color,
          "--rune-mask": `url(${image.src})`,
          "--rune-texture": `url(${image.src})`,
        } as CSSProperties
      }
    />
  );
}
