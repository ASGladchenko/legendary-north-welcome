"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { SpiderField } from "../components/spider-field";
import type { PumpkinCubeScene } from "./pumpkin-cube-scene";
import { PumpkinCubeLoader } from "./pumpkin-cube-loader";

export default function PumpkinCube() {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<PumpkinCubeScene | null>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(
    null,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      if (!hostRef.current) return;

      const { createPumpkinCubeScene } = await import("./pumpkin-cube-scene");
      let lastError: unknown;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const scene = await createPumpkinCubeScene(hostRef.current);

          if (cancelled) {
            await scene.destroy();
            return;
          }

          sceneRef.current = scene;
          setStatus("ready");
          return;
        } catch (error) {
          lastError = error;
          if (cancelled) return;
        }
      }

      console.error("Failed to initialize Pumpkin Cube", lastError);
      setStatus("error");
    };

    void setup();

    return () => {
      cancelled = true;
      const scene = sceneRef.current;

      sceneRef.current = null;
      if (scene) void scene.destroy();
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    sceneRef.current?.rotateBy(
      (event.clientX - drag.x) * 0.009,
      (event.clientY - drag.y) * 0.009,
    );
    drag.x = event.clientX;
    drag.y = event.clientY;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const directions: Partial<Record<string, [number, number]>> = {
      ArrowLeft: [-0.18, 0],
      ArrowRight: [0.18, 0],
      ArrowUp: [0, -0.18],
      ArrowDown: [0, 0.18],
    };
    const direction = directions[event.key];

    if (!direction) return;

    event.preventDefault();
    sceneRef.current?.rotateBy(...direction);
  };

  return (
    <main className="pumpkin-page">
      <div className="pumpkin-embers" aria-hidden="true" />

      <SpiderField className="pumpkin-spider-field" seed="pumpkin-cube">
        <section className="pumpkin-content" aria-labelledby="pumpkin-title">
          <header className="pumpkin-heading">
            <span>Trick or treat</span>
            <h1 id="pumpkin-title">Pumpkin Cube</h1>
            <p>Drag the cube to explore every side</p>
          </header>

          <div
            className={`pumpkin-stage is-${status}`}
            role="img"
            aria-label="Interactive Halloween cube. Drag or use the arrow keys to rotate it."
            tabIndex={status === "ready" ? 0 : -1}
            onPointerDown={(event) => {
              if (status !== "ready") return;
              event.currentTarget.setPointerCapture(event.pointerId);
              dragRef.current = {
                pointerId: event.pointerId,
                x: event.clientX,
                y: event.clientY,
              };
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onKeyDown={handleKeyDown}
          >
            <div ref={hostRef} className="pumpkin-canvas" />

            {status === "loading" && <PumpkinCubeLoader />}
            {status === "error" && (
              <div className="pumpkin-error" role="alert">
                <p>The cube could not be awakened.</p>
                <button type="button" onClick={() => window.location.reload()}>
                  Try again
                </button>
              </div>
            )}
          </div>
        </section>
      </SpiderField>
    </main>
  );
}
