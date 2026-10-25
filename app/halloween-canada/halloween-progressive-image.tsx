"use client";

import Image from "next/image";
import { useCallback, useState, type CSSProperties } from "react";

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
  const [loaded, setLoaded] = useState(false);
  const reveal = useCallback((image: HTMLImageElement) => {
    void image
      .decode()
      .catch(() => undefined)
      .then(() => setLoaded(true));
  }, []);
  const catchCachedImage = useCallback(
    (image: HTMLImageElement | null) => {
      if (image?.complete && image.naturalWidth > 0) reveal(image);
    },
    [reveal],
  );

  return (
    <span
      className={[styles.progressive, loaded && styles.loaded, className]
        .filter(Boolean)
        .join(" ")}
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
        onLoad={(event) => reveal(event.currentTarget)}
        quality={quality}
        ref={catchCachedImage}
        sizes={sizes}
        src={src}
      />
    </span>
  );
}
