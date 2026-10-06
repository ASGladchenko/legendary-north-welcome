'use client';

import { useEffect, useRef, useState } from "react";

import { OracleLoader } from "./oracle-loader";
import type { OracleScene } from "./pixi-scene";
import {
  getRandomPrediction,
  predictions,
  type Prediction,
} from "./predictions";
import { ResultUi } from "./result-ui";

export default function CubeExperience() {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<OracleScene | null>(null);
  const mountedRef = useRef(true);
  const [ready, setReady] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const setup = async () => {
      if (!hostRef.current) return;

      try {
        const { createOracleScene } = await import("./pixi-scene");
        const scene = await createOracleScene(hostRef.current);

        if (cancelled) {
          await scene.destroy();
          return;
        }

        sceneRef.current = scene;
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
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

  const reveal = async () => {
    if (!ready || spinning || !sceneRef.current) return;

    const nextPrediction = getRandomPrediction();
    const faceIndex = predictions.findIndex(
      (item) => item.id === nextPrediction.id,
    );

    setPrediction(null);
    setSpinning(true);
    await sceneRef.current.reveal(nextPrediction, faceIndex);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    if (!mountedRef.current) return;
    setPrediction(nextPrediction);
    setSpinning(false);
  };

  return (
    <main className="oracle-page">
      <div className="oracle-shade" aria-hidden="true" />

      <header className="oracle-heading">
        <span>The ice remembers</span>
        <h1>Northern Oracle</h1>
      </header>

      <section className="oracle-stage" aria-label="Northern Oracle Cube">
        <div ref={hostRef} className="oracle-canvas" />
        <button
          className="oracle-cube-trigger"
          type="button"
          onClick={reveal}
          disabled={!ready || spinning || failed}
          aria-label={spinning ? "The oracle is turning" : "Awaken the oracle"}
        >
          <span aria-hidden="true">Tap me</span>
        </button>
      </section>

      {failed ? (
        <p className="oracle-error" role="alert">
          The oracle is silent. Please reload the page.
        </p>
      ) : (
        <ResultUi prediction={prediction} />
      )}

      {!ready && !failed && <OracleLoader />}
    </main>
  );
}
