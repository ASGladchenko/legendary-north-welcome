'use client';

import { useEffect, useRef, useState } from "react";

import Image, { getImageProps } from "next/image";

import wheelBackgroundPortrait from "../../public/images/fortune-wheel/fw-bg-portrait.webp";
import wheelBackground from "../../public/images/fortune-wheel/fw-bg.webp";
import wheelButton from "../../public/images/fortune-wheel/fw-btn.webp";
import wheelDisk from "../../public/images/fortune-wheel/fw-disk.webp";

type Locale = "en" | "fr";

const rewards = [
  { value: "100% +", label: "100 FS" },
  { value: "BONUS", label: "GAME" },
  { value: "75%", label: "" },
  { value: "50% +", label: "50 FS" },
  { value: "100", label: "FS" },
  { value: "50%", label: "" },
  { value: "25% +", label: "25 FS" },
  { value: "50", label: "FS" },
] as const;

const WINNING_REWARD_INDEX = 0;
const REDIRECT_COUNTDOWN_SECONDS = 10;

const backgroundImageProps = {
  alt: "",
  fill: true,
  sizes: "100vw",
  fetchPriority: "high" as const,
};
const {
  props: { srcSet: landscapeBackground },
} = getImageProps({ ...backgroundImageProps, src: wheelBackground });
const {
  props: { srcSet: portraitBackground, ...backgroundProps },
} = getImageProps({ ...backgroundImageProps, src: wheelBackgroundPortrait });

const copy = {
  en: {
    action: "Spin the wheel",
    spinning: "Finding your fortune...",
    won: "CONGRATULATIONS!",
    wonLabel: "YOU WON",
    claim: "GET BONUS",
    redirecting: "CLAIM IN",
    wheelLabel: "Fortune wheel with eight rewards",
  },
  fr: {
    action: "Tourner la roue",
    spinning: "Votre fortune se dessine...",
    won: "FÉLICITATIONS!",
    wonLabel: "VOUS AVEZ GAGNÉ",
    claim: "OBTENIR LE BONUS",
    redirecting: "DÉCLARER UN SINISTRE",
    wheelLabel: "Roue de la fortune avec huit récompenses",
  },
} as const;

export function FortuneWheel({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const rotorRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN_SECONDS);
  const prize = rewards[WINNING_REWARD_INDEX];
  const prizeUrl = `https://1mlnbet.com/${locale}/registration/7`;

  useEffect(() => {
    if (!showPrize) return;

    const timer = window.setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
        return;
      }

      window.top!.location.href = prizeUrl;
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, prizeUrl, showPrize]);

  const spin = () => {
    if (spinning) return;

    const returnsFromEdge = crypto.getRandomValues(new Uint8Array(1))[0] % 2 === 0;
    const sectorAngle = 360 / rewards.length;
    const targetAngle = (WINNING_REWARD_INDEX + 0.5) * sectorAngle;
    const overshootAngle = sectorAngle / 2 + 3.5;
    const currentAngle = rotation % 360;
    const alignment = (360 - targetAngle - currentAngle + 360) % 360;
    const nextRotation = rotation + 360 * 4 + alignment;
    const finalRotation = nextRotation + (returnsFromEdge ? 0 : 360);
    const rotor = rotorRef.current;

    setSpinning(true);
    setShowPrize(false);
    setCountdown(REDIRECT_COUNTDOWN_SECONDS);

    if (
      !rotor ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRotation(finalRotation);
      setSpinning(false);
      setShowPrize(true);
      return;
    }

    const start = {
      transform: `rotate(${rotation}deg)`,
      offset: 0,
      easing: "cubic-bezier(0.32, 0, 0.16, 1)",
    };
    const settle = [
      {
        transform: `rotate(${finalRotation - 2.5}deg)`,
        offset: 0.88,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
      {
        transform: `rotate(${finalRotation + 1}deg)`,
        offset: 0.94,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
      {
        transform: `rotate(${finalRotation - 0.35}deg)`,
        offset: 0.98,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
      { transform: `rotate(${finalRotation}deg)`, offset: 1 },
    ];
    const keyframes = returnsFromEdge
      ? [
          start,
          {
            transform: `rotate(${nextRotation + overshootAngle}deg)`,
            offset: 0.68,
            easing: "cubic-bezier(0.45, 0, 0.55, 1)",
          },
          ...settle,
        ]
      : [start, ...settle];

    const animation = rotor.animate(
      keyframes,
      {
        duration: returnsFromEdge ? 9000 : 9800,
        fill: "forwards",
      },
    );

    animation.onfinish = () => {
      rotor.style.transform = `rotate(${finalRotation}deg)`;
      animation.cancel();
      setRotation(finalRotation);
      setSpinning(false);
      setShowPrize(true);
    };
  };

  return (
    <main className="fortune-page" lang={locale}>
      <picture>
        <source media="(orientation: landscape)" srcSet={landscapeBackground} />
        <source media="(orientation: portrait)" srcSet={portraitBackground} />
        <img {...backgroundProps} className="fortune-background" alt="" />
      </picture>
      <div className="fortune-vignette" aria-hidden="true" />

      <section className="fortune-stage" aria-label={text.wheelLabel}>
        <div className="fortune-wheel">
            <div
              ref={rotorRef}
              className="fortune-rotor"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <Image
                className="fortune-disk"
                src={wheelDisk}
                alt=""
                fill
                sizes="(max-width: 760px) 88vw, 48vw"
                loading="eager"
              />
              <div className="fortune-prizes" aria-hidden="true">
                {rewards.map((reward, index) => {
                  const angle = (index + 0.5) * (360 / rewards.length);
                  const radians = ((angle - 90) * Math.PI) / 180;

                  return (
                    <span
                      className="fortune-prize"
                      key={index}
                      style={{
                        left: `${50 + Math.cos(radians) * 29}%`,
                        top: `${50 + Math.sin(radians) * 29}%`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      }}
                    >
                      <strong>{reward.value}</strong>
                      {reward.label && <small>{reward.label}</small>}
                    </span>
                  );
                })}
              </div>
            </div>

            <Image
              className="fortune-frame"
              src="/images/fortune-wheel/fw-frame.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 94vw, 52vw"
              loading="eager"
            />
            <Image
              className="fortune-pointer"
              src="/images/fortune-wheel/fw-chip.webp"
              alt=""
              width={1536}
              height={1024}
              sizes="220px"
            />
          <button
            className="fortune-spin-button"
            type="button"
            onClick={spin}
            disabled={spinning}
            aria-label={spinning ? text.spinning : text.action}
          >
            <Image
              src={wheelButton}
              alt=""
              fill
              sizes="160px"
            />
          </button>
        </div>
      </section>

      {showPrize && (
        <div
          className="fortune-win-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fortune-win-title"
        >
          <div className="fortune-win-card">
            <p>{text.won}</p>
            <span className="fortune-win-label">{text.wonLabel}</span>
            <h2 id="fortune-win-title">
              <span className="fortune-win-percentage">{prize.value}</span>{" "}
              <span className="fortune-win-spins">{prize.label}</span>
            </h2>
            <a className="fortune-win-action" href={prizeUrl} target="_top">
              {text.claim}
            </a>
            <span className="fortune-countdown" aria-live="polite">
              {text.redirecting} <strong>{countdown}</strong>
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
