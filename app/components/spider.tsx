import type { CSSProperties } from "react";

import styles from "./spider.module.css";

export type SpiderProps = {
  size?: number;
  cycleMs?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
};

type SpiderStyle = CSSProperties & {
  "--spider-size": string;
  "--spider-cycle": string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export function Spider({
  size = 72,
  cycleMs = 800,
  paused = false,
  className,
  style,
}: SpiderProps) {
  const clampedSize = clamp(size, 16, 120);
  const spiderStyle: SpiderStyle = {
    ...style,
    width: clampedSize,
    height: clampedSize,
    "--spider-size": `${clampedSize}px`,
    "--spider-cycle": `${clamp(cycleMs, 160, 10_000)}ms`,
  };

  return (
    <span
      aria-hidden="true"
      className={[styles.spider, paused && styles.paused, className]
        .filter(Boolean)
        .join(" ")}
      draggable={false}
      style={spiderStyle}
    >
      <span className={styles.frames} />
    </span>
  );
}
