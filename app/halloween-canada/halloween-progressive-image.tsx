"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import styles from "./halloween-slider.module.css";

type HalloweenProgressiveImageProps = {
  alt: string;
  className?: string;
  eager?: boolean;
  imageClassName?: string;
  preview: string;
  quality?: 60 | 70;
  sizes: string;
  src: string;
};

export function HalloweenProgressiveImage({
  alt,
  className,
  eager = false,
  imageClassName,
  preview,
  quality = 70,
  sizes,
  src,
}: HalloweenProgressiveImageProps) {
  return (
    <span
      className={[styles.progressive, className].filter(Boolean).join(" ")}
      style={{ "--halloween-preview": `url("${preview}")` } as CSSProperties}
    >
      <span aria-hidden="true" className={styles.progressivePreview} />
      <Image
        alt={alt}
        className={[styles.progressiveFull, imageClassName]
          .filter(Boolean)
          .join(" ")}
        decoding="async"
        draggable={false}
        fill
        fetchPriority={eager ? "high" : "auto"}
        loading={eager ? "eager" : "lazy"}
        onLoad={(event) => {
          event.currentTarget.parentElement?.classList.add(styles.loaded);
        }}
        quality={quality}
        sizes={sizes}
        src={src}
      />
    </span>
  );
}
