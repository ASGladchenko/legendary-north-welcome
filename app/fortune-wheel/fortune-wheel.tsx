'use client';

import { useEffect, useRef, useState, type CSSProperties } from "react";

import Image from "next/image";

import wheelBackgroundPortrait from "../../public/images/fortune-wheel/fw-bg-portrait.webp";
import wheelBackground from "../../public/images/fortune-wheel/fw-bg.webp";
import wheelButton from "../../public/images/fortune-wheel/fw-btn.webp";
import wheelChip from "../../public/images/fortune-wheel/fw-chip.webp";
import wheelDisk from "../../public/images/fortune-wheel/fw-disk.webp";
import wheelFrame from "../../public/images/fortune-wheel/fw-frame.webp";
import wheelHint from "../../public/images/fortune-wheel/fw-hint.webp";
import {
  getBrazilFortuneWheelConfig,
  type BrazilFortuneWheelLocale,
  type FortuneWheelConfig,
} from "../config/fortune-wheel-brazil";
import {
  getParentSiteHref,
  ParentSiteLink,
} from "../components/parent-site-link";

type DefaultLocale = "en" | "fr";

const defaultRewards = [
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
const SPIN_HINT_ENABLED = false;
const HINT_FADE_DURATION_MS = 300;

function FortuneHint({
  hiding,
  onReady,
}: {
  hiding: boolean;
  onReady: () => void;
}) {
  return (
    <div
      className={`fortune-hint${hiding ? " is-hiding" : ""}`}
      aria-hidden="true"
    >
      <Image
        src={wheelHint}
        alt=""
        fill
        sizes="(max-width: 520px) 48vw, min(39vw, 394px)"
        quality={70}
        loading="eager"
        onLoad={onReady}
        onError={onReady}
      />
      <span>TAP TO SPIN</span>
    </div>
  );
}

const defaultCopy = {
  en: {
    action: "Spin the wheel",
    spinning: "Finding your fortune...",
    won: "CONGRATULATIONS!",
    wonLabel: "YOU WON",
    claim: "GET BONUS",
    redirecting: "CLAIM IN",
    loading: "Loading fortune wheel",
    wheelLabel: "Fortune wheel with eight rewards",
  },
  fr: {
    action: "Tourner la roue",
    spinning: "Votre fortune se dessine...",
    won: "FÉLICITATIONS!",
    wonLabel: "VOUS AVEZ GAGNÉ",
    claim: "OBTENIR LE BONUS",
    redirecting: "RÉCLAMER LE BONUS",
    loading: "Chargement de la roue de la fortune",
    wheelLabel: "Roue de la fortune avec huit récompenses",
  },
} as const;

type FortuneWheelProps =
  | { market: "brazil"; locale: BrazilFortuneWheelLocale }
  | { market?: "default"; locale: DefaultLocale };

export function FortuneWheel(props: FortuneWheelProps) {
  const config: FortuneWheelConfig = props.market === "brazil"
    ? getBrazilFortuneWheelConfig(props.locale)
    : {
        id: "default",
        locale: props.locale,
        prizeUrl: `https://1mlnbet.com/${props.locale}/registration/7`,
        rewards: defaultRewards,
        winningRewardIndex: WINNING_REWARD_INDEX,
        assets: {
          backgroundLandscape: wheelBackground,
          backgroundPortrait: wheelBackgroundPortrait,
          backgroundPreviewLandscape: "/images/fortune-wheel/previews/fw-bg.webp",
          backgroundPreviewPortrait: "/images/fortune-wheel/previews/fw-bg-portrait.webp",
          button: wheelButton,
          disk: wheelDisk,
          frame: wheelFrame,
          pointer: wheelChip,
        },
        copy: defaultCopy[props.locale],
      };
  const { assets, copy: text, locale, rewards } = config;
  const criticalAssetCount = 3 + Number(Boolean(assets.pointer)) + Number(SPIN_HINT_ENABLED);
  const backgroundLandscapeSrc = assets.backgroundLandscape.src;
  const backgroundPortraitSrc = assets.backgroundPortrait.src;
  const backgroundHostRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const loadedAssetsRef = useRef(new Set<string>());
  const [assetsReady, setAssetsReady] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [hintHiding, setHintHiding] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN_SECONDS);
  const prize = rewards[config.winningRewardIndex];
  const prizeUrl = config.prizeUrl;

  const markAssetLoaded = (asset: string) => {
    loadedAssetsRef.current.add(asset);
    setAssetsReady(loadedAssetsRef.current.size >= criticalAssetCount);
  };

  useEffect(() => {
    if (!hintHiding) return;

    const timer = window.setTimeout(
      () => setShowHint(false),
      HINT_FADE_DURATION_MS,
    );

    return () => window.clearTimeout(timer);
  }, [hintHiding]);

  useEffect(() => {
    if (!assetsReady) return;

    const portraitQuery = window.matchMedia("(orientation: portrait)");
    let requestId = 0;
    let revealTimer = 0;

    const loadBackground = () => {
      const currentRequest = ++requestId;
      const src = portraitQuery.matches
        ? backgroundPortraitSrc
        : backgroundLandscapeSrc;
      const image = new window.Image();
      const backgroundHost = backgroundHostRef.current;

      setBackgroundLoaded(false);
      window.clearTimeout(revealTimer);
      if (!backgroundHost) return;

      image.alt = "";
      image.decoding = "async";
      image.fetchPriority = "low";
      backgroundHost.replaceChildren(image);
      image.onload = async () => {
        try {
          const bitmap = await window.createImageBitmap(image);
          bitmap.close();
        } catch {
          // The load event remains the fallback on browsers without bitmap decoding.
        }

        if (currentRequest !== requestId) return;

        revealTimer = window.setTimeout(() => {
          if (currentRequest === requestId) setBackgroundLoaded(true);
        });
      };
      image.src = src;
    };

    loadBackground();
    portraitQuery.addEventListener("change", loadBackground);

    return () => {
      requestId++;
      window.clearTimeout(revealTimer);
      portraitQuery.removeEventListener("change", loadBackground);
    };
  }, [assetsReady, backgroundLandscapeSrc, backgroundPortraitSrc]);

  useEffect(() => {
    if (!showPrize) return;

    const timer = window.setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
        return;
      }

      window.top!.location.href = getParentSiteHref(prizeUrl);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, prizeUrl, showPrize]);

  const spin = () => {
    if (spinning) return;

    setHintHiding(true);

    const returnsFromEdge = crypto.getRandomValues(new Uint8Array(1))[0] % 2 === 0;
    const sectorAngle = 360 / rewards.length;
    const targetAngle = (config.winningRewardIndex + 0.5) * sectorAngle;
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
    <>
      <main
        className={`fortune-page fortune-page--${config.id}`}
        lang={locale}
        aria-busy={!assetsReady}
        style={{
          "--fortune-bg-preview-landscape": `url("${assets.backgroundPreviewLandscape}")`,
          "--fortune-bg-preview-portrait": `url("${assets.backgroundPreviewPortrait}")`,
        } as CSSProperties}
      >
      <div className="fortune-background" aria-hidden="true">
        <div className="fortune-background-preview" />
        <div
          ref={backgroundHostRef}
          className={`fortune-background-full${backgroundLoaded ? " is-loaded" : ""}`}
        />
      </div>
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
                src={assets.disk}
                alt=""
                fill
                sizes="(max-width: 520px) min(89vw, 66svh), (orientation: portrait) min(82vw, 728px), min(73svh, 728px)"
                quality={70}
                loading="eager"
                onLoad={() => markAssetLoaded("disk")}
                onError={() => markAssetLoaded("disk")}
              />
              <div className="fortune-prizes" aria-hidden="true">
                {rewards.map((reward, index) => {
                  const angle = (index + 0.5) * (360 / rewards.length);
                  const radians = ((angle - 90) * Math.PI) / 180;
                  const left = (50 + Math.cos(radians) * 29).toFixed(4);
                  const top = (50 + Math.sin(radians) * 29).toFixed(4);

                  return (
                    <span
                      className="fortune-prize"
                      key={index}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
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
              src={assets.frame}
              alt=""
              fill
              sizes="(max-width: 520px) min(100vw, 74svh), (orientation: portrait) min(92vw, 820px), min(82svh, 820px)"
              quality={70}
              loading="eager"
              onLoad={() => markAssetLoaded("frame")}
              onError={() => markAssetLoaded("frame")}
            />
            {assets.pointer && (
              <Image
                className="fortune-pointer"
                src={assets.pointer}
                alt=""
                sizes="(max-width: 520px) min(42vw, 31svh), (orientation: portrait) min(39vw, 344px), min(35svh, 344px)"
                quality={70}
                loading="eager"
                onLoad={() => markAssetLoaded("chip")}
                onError={() => markAssetLoaded("chip")}
              />
            )}
          {SPIN_HINT_ENABLED && showHint && (
            <FortuneHint
              hiding={hintHiding}
              onReady={() => markAssetLoaded("hint")}
            />
          )}
          <button
            className="fortune-spin-button"
            type="button"
            onClick={spin}
            disabled={spinning || !assetsReady}
            aria-label={spinning ? text.spinning : text.action}
          >
            <Image
              src={assets.button}
              alt=""
              fill
              sizes="(max-width: 520px) min(21vw, 16svh), (orientation: portrait) min(20vw, 172px), min(18svh, 172px)"
              quality={70}
              loading="eager"
              onLoad={() => markAssetLoaded("button")}
              onError={() => markAssetLoaded("button")}
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
              <ParentSiteLink className="fortune-win-action" href={prizeUrl}>
                {text.claim}
              </ParentSiteLink>
              <span className="fortune-countdown" aria-live="polite">
                {text.redirecting} <strong>{countdown}</strong>
              </span>
            </div>
          </div>
        )}
      </main>

      {!assetsReady && (
        <div className="fortune-loader" role="status" aria-label={text.loading}>
          <Image
            className="fortune-loader-logo"
            src="/svg/logo.svg"
            alt=""
            width={228}
            height={36}
            preload
            unoptimized
          />
        </div>
      )}
    </>
  );
}
