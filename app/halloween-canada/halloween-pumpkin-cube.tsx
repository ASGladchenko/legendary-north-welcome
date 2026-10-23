"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { ParentSiteLink } from "../components/parent-site-link";
import type { PumpkinCubeScene } from "../pumpkin-cube/pumpkin-cube-scene";
import styles from "./halloween-slider.module.css";

type CubeGame = {
  href: string;
  image: string;
  title: string;
};

type HalloweenPumpkinCubeProps = {
  items: CubeGame[];
  labels: {
    close: string;
    play: string;
    result: string;
    spin: string;
    tap: string;
  };
};

export function HalloweenPumpkinCube({
  items,
  labels,
}: HalloweenPumpkinCubeProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sceneRef = useRef<PumpkinCubeScene | null>(null);
  const mountedRef = useRef(true);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [spinning, setSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState<CubeGame | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const setup = async () => {
      if (!hostRef.current) return;

      try {
        const { createPumpkinCubeScene } = await import(
          "../pumpkin-cube/pumpkin-cube-scene"
        );
        const scene = await createPumpkinCubeScene(hostRef.current);

        if (cancelled) {
          await scene.destroy();
          return;
        }

        sceneRef.current = scene;
        setStatus("ready");
      } catch (error) {
        console.error("Failed to initialize Halloween Pumpkin Cube", error);
        if (!cancelled) setStatus("error");
      }
    };

    void setup();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      const scene = sceneRef.current;

      sceneRef.current = null;
      if (scene) void scene.destroy();
    };
  }, []);

  useEffect(() => {
    if (selectedGame && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, [selectedGame]);

  const spin = async () => {
    if (status !== "ready" || spinning || !sceneRef.current) return;

    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    const game = items[randomValue % items.length];

    setSpinning(true);
    setSelectedGame(null);
    await sceneRef.current.spin(() => {
      if (mountedRef.current) setSelectedGame(game);
    });
    if (mountedRef.current) {
      setSpinning(false);
    }
  };

  const closeDialog = () => dialogRef.current?.close();

  return (
    <>
      <button
        aria-busy={spinning}
        aria-label={labels.spin}
        className={styles.pumpkinCube}
        disabled={status !== "ready" || spinning}
        onClick={() => void spin()}
        type="button"
      >
        <span
          aria-hidden="true"
          className={styles.pumpkinCanvas}
          ref={hostRef}
        />
        {status === "loading" && (
          <span aria-hidden="true" className={styles.pumpkinLoader} />
        )}
        {status === "ready" && (
          <span aria-hidden="true" className={styles.pumpkinTap}>
            {labels.tap}
          </span>
        )}
      </button>

      <dialog
        aria-labelledby="pumpkin-game-title"
        className={styles.gameDialog}
        onClose={() => setSelectedGame(null)}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const outside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

          if (outside) closeDialog();
        }}
        ref={dialogRef}
      >
        {selectedGame && (
          <>
            <button
              aria-label={labels.close}
              className={styles.gameDialogClose}
              onClick={closeDialog}
              type="button"
            >
              ×
            </button>
            <Image
              alt=""
              className={styles.gameDialogImage}
              height={234}
              quality={75}
              sizes="(max-width: 620px) 82vw, 380px"
              src={selectedGame.image}
              width={416}
            />
            <p className={styles.gameDialogEyebrow}>{labels.result}</p>
            <h2 id="pumpkin-game-title">{selectedGame.title}</h2>
            <ParentSiteLink
              className={styles.gameDialogAction}
              href={selectedGame.href}
              onClick={closeDialog}
            >
              {labels.play}
            </ParentSiteLink>
          </>
        )}
      </dialog>
    </>
  );
}
