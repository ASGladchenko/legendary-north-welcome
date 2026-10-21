"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import styles from "./capybara-peek-mascot.module.css";

const OPEN_IMAGE = "/images/welcome-brazil/capybara-original.webp";
const WINK_IMAGE = "/images/welcome-brazil/capybara-wink.webp";
const SPEECH_IMAGE = "/images/welcome-brazil/capybara-speech-pt-br.webp";
const ANIMATION_DURATION = 5600;

export type CapybaraPeekMascotProps = {
  autoPlay?: boolean;
  className?: string;
  delay?: number;
  enabled?: boolean;
  repeat?: boolean;
  repeatDelay?: number;
  replayKey?: string | number;
  size?: number | string;
};

function waitForImage(image: HTMLImageElement, signal: AbortSignal) {
  const loaded = image.complete
    ? Promise.resolve()
    : new Promise<void>((resolve, reject) => {
        const cleanup = () => {
          image.removeEventListener("load", handleLoad);
          image.removeEventListener("error", handleError);
          signal.removeEventListener("abort", handleAbort);
        };
        const handleLoad = () => {
          cleanup();
          resolve();
        };
        const handleError = () => {
          cleanup();
          reject(new Error(`Failed to load mascot image: ${image.currentSrc}`));
        };
        const handleAbort = () => {
          cleanup();
          reject(new DOMException("Mascot loading aborted", "AbortError"));
        };

        image.addEventListener("load", handleLoad, { once: true });
        image.addEventListener("error", handleError, { once: true });
        signal.addEventListener("abort", handleAbort, { once: true });
      });

  return loaded.then(async () => {
    if (!image.naturalWidth) {
      throw new Error(`Failed to decode mascot image: ${image.currentSrc}`);
    }

    await image.decode();

    if (signal.aborted) {
      throw new DOMException("Mascot loading aborted", "AbortError");
    }
  });
}

export function CapybaraPeekMascot({
  autoPlay = true,
  className,
  delay = 2600,
  enabled = true,
  repeat = false,
  repeatDelay = 30000,
  replayKey = 0,
  size = "clamp(210px, 25vw, 340px)",
}: CapybaraPeekMascotProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const openImageRef = useRef<HTMLImageElement>(null);
  const winkImageRef = useRef<HTMLImageElement>(null);
  const speechImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const mascot = mascotRef.current;
    const openImage = openImageRef.current;
    const winkImage = winkImageRef.current;
    const speechImage = speechImageRef.current;

    if (!enabled || !viewport || !mascot || !openImage || !winkImage || !speechImage) return;

    const abortController = new AbortController();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let movement: Animation | null = null;
    let openFrame: Animation | null = null;
    let wink: Animation | null = null;
    let speech: Animation | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const hide = () => {
      movement?.cancel();
      openFrame?.cancel();
      wink?.cancel();
      speech?.cancel();
      movement = null;
      openFrame = null;
      wink = null;
      speech = null;
      viewport.style.visibility = "hidden";
    };
    const schedule = (wait: number) => {
      if (disposed || reducedMotion.matches || !autoPlay) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(play, Math.max(0, wait));
    };
    const play = () => {
      if (disposed || reducedMotion.matches) return;

      viewport.style.visibility = "visible";
      movement = mascot.animate(
        [
          { offset: 0, transform: "translate3d(-72%, 6%, 0) rotate(-7deg)", easing: "cubic-bezier(.18,.72,.24,1)" },
          { offset: 0.22, transform: "translate3d(-14%, -1%, 0) rotate(2deg)", easing: "cubic-bezier(.2,.8,.2,1)" },
          { offset: 0.3, transform: "translate3d(-18%, 0, 0) rotate(0deg)", easing: "ease-in-out" },
          { offset: 0.56, transform: "translate3d(-18%, 0, 0) rotate(0deg)" },
          { offset: 0.64, transform: "translate3d(-19%, -1.5%, 0) rotate(-1.4deg)", easing: "ease-in-out" },
          { offset: 0.72, transform: "translate3d(-18%, 0, 0) rotate(0deg)", easing: "ease-in" },
          { offset: 0.8, transform: "translate3d(-23%, 1%, 0) rotate(-2.5deg)", easing: "cubic-bezier(.55,.02,.8,.3)" },
          { offset: 0.94, transform: "translate3d(-72%, 6%, 0) rotate(-7deg)" },
          { offset: 1, transform: "translate3d(-72%, 6%, 0) rotate(-7deg)" },
        ],
        { duration: ANIMATION_DURATION, easing: "linear", fill: "both" },
      );
      openFrame = openImage.animate(
        [
          { offset: 0, opacity: 1 },
          { offset: 0.5, opacity: 1 },
          { offset: 0.5001, opacity: 0 },
          { offset: 0.56, opacity: 0 },
          { offset: 0.5601, opacity: 1 },
          { offset: 1, opacity: 1 },
        ],
        { duration: ANIMATION_DURATION, easing: "linear", fill: "both" },
      );
      wink = winkImage.animate(
        [
          { offset: 0, opacity: 0 },
          { offset: 0.5, opacity: 0 },
          { offset: 0.5001, opacity: 1 },
          { offset: 0.56, opacity: 1 },
          { offset: 0.5601, opacity: 0 },
          { offset: 1, opacity: 0 },
        ],
        { duration: ANIMATION_DURATION, easing: "linear", fill: "both" },
      );
      speech = speechImage.animate(
        [
          { offset: 0, opacity: 0, transform: "translate3d(-12%, 24%, 0) scale(.45)" },
          { offset: 0.28, opacity: 0, transform: "translate3d(-12%, 24%, 0) scale(.45)", easing: "cubic-bezier(.18,.78,.22,1)" },
          { offset: 0.34, opacity: 1, transform: "translate3d(0, 0, 0) scale(1.08)", easing: "ease-out" },
          { offset: 0.38, opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          { offset: 0.7, opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", easing: "ease-in" },
          { offset: 0.76, opacity: 0, transform: "translate3d(4%, -3%, 0) scale(.9)" },
          { offset: 1, opacity: 0, transform: "translate3d(4%, -3%, 0) scale(.9)" },
        ],
        { duration: ANIMATION_DURATION, easing: "linear", fill: "both" },
      );

      void movement.finished.then(() => {
        hide();
        if (repeat) schedule(repeatDelay);
      }).catch(() => undefined);
    };
    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        if (timer) clearTimeout(timer);
        hide();
      } else {
        schedule(delay);
      }
    };

    Promise.all([
      waitForImage(openImage, abortController.signal),
      waitForImage(winkImage, abortController.signal),
      waitForImage(speechImage, abortController.signal),
    ]).then(() => schedule(delay)).catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Capybara mascot assets failed to load", error);
      }
    });

    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      disposed = true;
      abortController.abort();
      reducedMotion.removeEventListener("change", handleMotionPreference);
      if (timer) clearTimeout(timer);
      hide();
    };
  }, [autoPlay, delay, enabled, repeat, repeatDelay, replayKey]);

  const rootClassName = `${styles.viewport}${className ? ` ${className}` : ""}`;
  const rootStyle = {
    "--capybara-size": typeof size === "number" ? `${size}px` : size,
  } as CSSProperties;

  if (!enabled) return null;

  return (
    <div ref={viewportRef} className={rootClassName} style={rootStyle} aria-hidden="true">
      <div ref={mascotRef} className={styles.mascot}>
        <Image
          ref={openImageRef}
          className={styles.image}
          src={OPEN_IMAGE}
          alt=""
          fill
          sizes="(max-width: 700px) 230px, 340px"
          loading="eager"
          decoding="async"
          draggable={false}
        />
        <Image
          ref={winkImageRef}
          className={`${styles.image} ${styles.wink}`}
          src={WINK_IMAGE}
          alt=""
          fill
          sizes="(max-width: 700px) 230px, 340px"
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>
      <Image
        ref={speechImageRef}
        className={styles.speech}
        src={SPEECH_IMAGE}
        alt=""
        width={640}
        height={250}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
