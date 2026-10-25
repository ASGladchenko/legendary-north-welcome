"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ParentSiteLink } from "../components/parent-site-link";
import type { HalloweenLocale } from "./halloween-canada-banner";
import styles from "./halloween-tournament-mascot.module.css";

const VISIBLE_DURATION = 9_000;

const copy = {
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

export function HalloweenTournamentMascot({
  delay,
  frequency,
  locale,
}: {
  delay: number;
  frequency: number;
  locale: HalloweenLocale;
}) {
  const [imageReady, setImageReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const labels = copy[locale];

  useEffect(() => {
    if (!imageReady || dismissed || frequency === 0) return;

    let appearances = 0;
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      showTimer = setTimeout(() => {
        appearances += 1;
        setVisible(true);
        hideTimer = setTimeout(() => {
          setVisible(false);
          if (appearances < frequency) schedule();
        }, VISIBLE_DURATION);
      }, delay);
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
    >
      <div className={styles.bubble}>
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
          href="/casino"
          tabIndex={visible ? 0 : -1}
        >
          {labels.action}
        </ParentSiteLink>
      </div>

      <Image
        alt=""
        className={styles.character}
        decoding="async"
        draggable={false}
        height={640}
        loading="lazy"
        onLoad={() => setImageReady(true)}
        sizes="(max-width: 620px) 225px, 300px"
        src="/Hooded Character with Extended Hands.webp"
        width={615}
      />
    </aside>
  );
}
