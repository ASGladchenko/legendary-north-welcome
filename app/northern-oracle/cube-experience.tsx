"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { OracleLoader } from "./oracle-loader";
import type { OracleScene } from "./pixi-scene";
import {
  getNextPrediction,
  getPredictionFaceIndex,
  type Prediction,
} from "./predictions";
import { ResultUi } from "./result-ui";

export default function CubeExperience() {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<OracleScene | null>(null);
  const mountedRef = useRef(true);
  const joystickPointerRef = useRef<{
    id: number;
    originX: number;
    originY: number;
    x: number;
    y: number;
  } | null>(null);
  const joystickFrameRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [resultCollapsed, setResultCollapsed] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let cancelled = false;
    const image = new window.Image();

    image.decoding = "async";
    image.fetchPriority = "high";
    image.onload = async () => {
      await image.decode().catch(() => undefined);
      if (!cancelled) setBackgroundLoaded(true);
    };
    image.src = "/assets/northern-oracle/oracle-background.webp";

    return () => {
      cancelled = true;
    };
  }, []);

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
      if (joystickFrameRef.current !== null) {
        window.cancelAnimationFrame(joystickFrameRef.current);
      }
      const scene = sceneRef.current;

      sceneRef.current = null;
      if (scene) void scene.destroy();
    };
  }, []);

  const reveal = async () => {
    if (!ready || spinning || !sceneRef.current) return;

    const nextPrediction = getNextPrediction();
    const faceIndex = getPredictionFaceIndex(nextPrediction);

    setPrediction(null);
    setResultCollapsed(false);
    setSpinning(true);
    await sceneRef.current.reveal(nextPrediction, faceIndex);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    if (!mountedRef.current) return;
    setPrediction(nextPrediction);
    setSpinning(false);
  };

  const moveJoystick = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const pointer = joystickPointerRef.current;

    if (!pointer || pointer.id !== event.pointerId || !sceneRef.current) return;

    const offsetX = event.clientX - pointer.originX;
    const offsetY = event.clientY - pointer.originY;
    const distance = Math.hypot(offsetX, offsetY);
    const limit = 24;
    const scale = distance > limit ? limit / distance : 1;
    const x = offsetX * scale;
    const y = offsetY * scale;

    setJoystickPosition({ x, y });
    pointer.x = x;
    pointer.y = y;
  };

  const startJoystickRotation = () => {
    if (joystickFrameRef.current !== null) return;

    let previousTime = performance.now();
    const rotate = (time: number) => {
      const pointer = joystickPointerRef.current;

      if (!pointer) {
        joystickFrameRef.current = null;
        return;
      }

      const elapsed = Math.min((time - previousTime) / 1000, 0.05);

      sceneRef.current?.rotateBy(
        pointer.x * elapsed * 0.085,
        pointer.y * elapsed * 0.085,
      );
      previousTime = time;
      joystickFrameRef.current = window.requestAnimationFrame(rotate);
    };

    joystickFrameRef.current = window.requestAnimationFrame(rotate);
  };

  const releaseJoystick = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (joystickPointerRef.current?.id !== event.pointerId) return;

    joystickPointerRef.current = null;
    if (joystickFrameRef.current !== null) {
      window.cancelAnimationFrame(joystickFrameRef.current);
      joystickFrameRef.current = null;
    }
    setJoystickPosition({ x: 0, y: 0 });
  };

  const rotateWithKeyboard = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const rotations: Partial<Record<string, [number, number]>> = {
      ArrowLeft: [-0.18, 0],
      ArrowRight: [0.18, 0],
      ArrowUp: [0, -0.18],
      ArrowDown: [0, 0.18],
    };
    const rotation = rotations[event.key];

    if (!rotation) return;

    event.preventDefault();
    sceneRef.current?.rotateBy(...rotation);
  };

  return (
    <main className="oracle-page">
      <div className="oracle-background" aria-hidden="true">
        <div className="oracle-background-preview" />
        <div
          className={`oracle-background-full${backgroundLoaded ? " is-loaded" : ""}`}
        />
      </div>
      <div className="oracle-shade" aria-hidden="true" />

      <button
        className="oracle-joystick"
        type="button"
        disabled={!ready || spinning || failed}
        aria-label="Rotate the oracle cube"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          joystickPointerRef.current = {
            id: event.pointerId,
            originX: event.clientX,
            originY: event.clientY,
            x: 0,
            y: 0,
          };
          startJoystickRotation();
        }}
        onPointerMove={moveJoystick}
        onPointerUp={releaseJoystick}
        onPointerCancel={releaseJoystick}
        onKeyDown={rotateWithKeyboard}
      >
        <span
          style={{
            transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
          }}
        />
      </button>

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
        <ResultUi
          prediction={prediction}
          collapsed={resultCollapsed}
          onToggle={() => setResultCollapsed((collapsed) => !collapsed)}
        />
      )}

      {!ready && !failed && <OracleLoader />}
    </main>
  );
}
