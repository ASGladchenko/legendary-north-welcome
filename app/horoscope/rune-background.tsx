"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type RuneBackgroundProps = {
  desktop: string;
  mobile: string;
  desktopPreview: string;
  mobilePreview: string;
};

export function RuneBackground({
  desktop,
  mobile,
  desktopPreview,
  mobilePreview,
}: RuneBackgroundProps) {
  const [source, setSource] = useState<string>();

  useEffect(() => {
    const portrait = window.matchMedia("(max-width: 700px)");
    const selectSource = () => {
      setSource(portrait.matches ? mobile : desktop);
    };

    selectSource();
    portrait.addEventListener("change", selectSource);
    return () => portrait.removeEventListener("change", selectSource);
  }, [desktop, mobile]);

  return (
    <div
      className="rune-background"
      style={
        {
          "--rune-preview-desktop": `url(${desktopPreview})`,
          "--rune-preview-mobile": `url(${mobilePreview})`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="rune-background-preview" />
      {source && (
        <Image
          className="rune-background-full"
          src={source}
          alt=""
          fill
          sizes="100vw"
          quality={70}
          loading="eager"
        />
      )}
    </div>
  );
}
