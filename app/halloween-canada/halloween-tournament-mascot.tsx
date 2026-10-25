'use client';

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { ParentSiteLink } from "../components/parent-site-link";
import type { HalloweenLocale } from "./halloween-canada-banner";

import styles from "./halloween-tournament-mascot.module.css";

type SideMascotProps = {
  delay: number;
  frequency: number;
  locale: HalloweenLocale;
};
type SideMascotContentProps = SideMascotProps & {
  characterClassName?: string;
  height: number;
  href: string;
  labels: (typeof tournamentCopy)[HalloweenLocale] | (typeof casperCopy)[HalloweenLocale];
  sizes: string;
  src: string;
  width: number;
};

const VISIBLE_DURATION = 9_000;

const tournamentCopy = {
  en: {
    close: "Close tournament invitation",
    eyebrow: "Psst…",
    title: "a tournament awaits!",
    action: "View tournament",
  },
  fr: {
    close: "Fermer l’invitation au tournoi",
    eyebrow: "Psst…",
    title: "un tournoi t’attend !",
    action: "Voir le tournoi",
  },
} as const;

const casperCopy = {
  en: {
    close: "Close sticker pack invitation",
    eyebrow: "Boo!",
    title: "Your spooky sticker pack is waiting!",
    action: "DISCOVER",
  },
  fr: {
    close: "Fermer l’invitation au pack de stickers",
    eyebrow: "Bouh !",
    title: "Ton pack de stickers d’Halloween t’attend !",
    action: "DÉCOUVRIR",
  },
} as const;

function HalloweenSideMascot({
  delay,
  frequency,
  characterClassName,
  height,
  href,
  labels,
  sizes,
  src,
  width,
}: SideMascotContentProps) {
  const [imageReady, setImageReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) setImageReady(true);
  }, []);

  useEffect(() => {
    if (!imageReady || dismissed || frequency === 0) return;

    let appearances = 0;
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const show = () => {
      if (
        document.querySelector(
          '[data-side-mascot-visible="true"], [data-pumpkin-cube-busy="true"]',
        )
      ) {
        showTimer = setTimeout(show, 250);
        return;
      }

      appearances += 1;
      setVisible(true);
      hideTimer = setTimeout(() => {
        setVisible(false);
        if (appearances < frequency) schedule();
      }, VISIBLE_DURATION);
    };

    const schedule = () => {
      showTimer = setTimeout(show, delay);
    };

    schedule();

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [delay, dismissed, frequency, imageReady]);

  if (frequency === 0) return null;

  return (
    <aside
      aria-hidden={!visible}
      className={`${styles.root}${imageReady ? ` ${styles.ready}` : ""}${visible ? ` ${styles.visible}` : ""}`}
      data-side-mascot-visible={visible ? "true" : undefined}
    >
      <div className={styles.bubble}>
        <div className={styles.bubbleContent}>
          <button
            aria-label={labels.close}
            className={styles.close}
            onClick={() => {
              setDismissed(true);
              setVisible(false);
            }}
            tabIndex={visible ? 0 : -1}
            type="button"
          >
            ×
          </button>
          <p className={styles.message}>
            <span>{labels.eyebrow}</span>
            <strong>{labels.title}</strong>
          </p>
          <ParentSiteLink
            className={styles.action}
            href={href}
            tabIndex={visible ? 0 : -1}
          >
            {labels.action}
          </ParentSiteLink>
        </div>
      </div>

      <Image
        alt=""
        className={`${styles.character}${characterClassName ? ` ${characterClassName}` : ""}`}
        decoding="async"
        draggable={false}
        height={height}
        loading="eager"
        onLoad={() => setImageReady(true)}
        ref={imageRef}
        sizes={sizes}
        src={src}
        width={width}
      />
    </aside>
  );
}

export function HalloweenTournamentMascot(props: SideMascotProps) {
  return (
    <HalloweenSideMascot
      {...props}
      height={640}
      href="/casino"
      labels={tournamentCopy[props.locale]}
      sizes="(max-width: 620px) 225px, 300px"
      src="/Hooded Character with Extended Hands.webp"
      width={615}
    />
  );
}

export function HalloweenCasperMascot(props: SideMascotProps) {
  return (
    <HalloweenSideMascot
      {...props}
      characterClassName={styles.casperCharacter}
      height={360}
      href={`/${props.locale}/gamification/stickerbooks/912`}
      labels={casperCopy[props.locale]}
      sizes="(max-width: 620px) 190px, 240px"
      src="/images/halloween-canada/friendly-phantom.webp"
      width={360}
    />
  );
}
