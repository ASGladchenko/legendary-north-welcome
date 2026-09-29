"use client";

import { useRef, useState } from "react";

import Image from "next/image";

import wheelButton from "../../public/images/fortune-wheel/fw-btn.webp";
import wheelDisk from "../../public/images/fortune-wheel/fw-disk.webp";

type Locale = "en" | "fr";

const rewards = [
  { value: "5", unit: "spins" },
  { value: "10", unit: "cad" },
  { value: "10", unit: "spins" },
  { value: "20", unit: "cad" },
  { value: "15", unit: "spins" },
  { value: "MYSTERY", unit: "prize" },
  { value: "25", unit: "spins" },
  { value: "JACKPOT", unit: "bonus" },
] as const;

const WINNING_REWARD_INDEX = 0;

const copy = {
  en: {
    action: "Spin the wheel",
    spinning: "Finding your fortune...",
    wheelLabel: "Fortune wheel with eight rewards",
    mystery: "MYSTERY",
    units: {
      spins: "FREE SPINS",
      cad: "CAD",
      prize: "PRIZE",
      bonus: "BONUS",
    },
  },
  fr: {
    action: "Tourner la roue",
    spinning: "Votre fortune se dessine...",
    wheelLabel: "Roue de la fortune avec huit récompenses",
    mystery: "MYSTÈRE",
    units: {
      spins: "TOURS",
      cad: "CAD",
      prize: "PRIX",
      bonus: "BONUS",
    },
  },
} as const;

export function FortuneWheel({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const rotorRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;

    const returnsFromEdge = crypto.getRandomValues(new Uint8Array(1))[0] % 2 === 0;
    const sectorAngle = 360 / rewards.length;
    const targetAngle = (WINNING_REWARD_INDEX + 0.5) * sectorAngle;
    const overshootAngle = sectorAngle / 2 + 3.5;
    const currentAngle = rotation % 360;
    const alignment = (360 - targetAngle - currentAngle + 360) % 360;
    const nextRotation = rotation + 360 * 6 + alignment;
    const finalRotation = nextRotation + (returnsFromEdge ? 0 : 360);
    const rotor = rotorRef.current;

    setSpinning(true);

    if (
      !rotor ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRotation(finalRotation);
      setSpinning(false);
      return;
    }

    const start = {
      transform: `rotate(${rotation}deg)`,
      offset: 0,
      easing: "cubic-bezier(0.1, 0.72, 0.15, 1)",
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
        duration: returnsFromEdge ? 7800 : 8600,
        fill: "forwards",
      },
    );

    animation.onfinish = () => {
      rotor.style.transform = `rotate(${finalRotation}deg)`;
      animation.cancel();
      setRotation(finalRotation);
      setSpinning(false);
    };
  };

  return (
    <main className="fortune-page" lang={locale}>
      <Image
        className="fortune-background"
        src="/images/fortune-wheel/fw-bg.webp"
        alt=""
        fill
        sizes="100vw"
        preload
      />
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
                        left: `${50 + Math.cos(radians) * 28}%`,
                        top: `${50 + Math.sin(radians) * 28}%`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      }}
                    >
                      <strong>
                        {reward.value === "MYSTERY"
                          ? text.mystery
                          : reward.value}
                      </strong>
                      <small>{text.units[reward.unit]}</small>
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
    </main>
  );
}
