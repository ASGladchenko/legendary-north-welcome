import { Application } from "pixi.js";

import {
  loadPumpkinCubeAssets,
  unloadPumpkinCubeAssets,
} from "./pumpkin-cube-assets";
import { PumpkinCubeController } from "./pumpkin-cube-controller";

export type PumpkinCubeScene = {
  rotateBy: (deltaX: number, deltaY: number) => void;
  spin: (onReveal?: () => void) => Promise<void>;
  destroy: () => Promise<void>;
};

export async function createPumpkinCubeScene(
  host: HTMLElement,
): Promise<PumpkinCubeScene> {
  const app = new Application();
  let controller: PumpkinCubeController | null = null;

  try {
    await app.init({
      width: Math.max(host.clientWidth, 1),
      height: Math.max(host.clientHeight, 1),
      antialias: true,
      autoDensity: true,
      backgroundAlpha: 0,
      preference: "webgl",
      resolution: Math.min(window.devicePixelRatio || 1, 1.75),
    });

    host.replaceChildren(app.canvas);
    controller = new PumpkinCubeController(
      app,
      await loadPumpkinCubeAssets(),
    );

    const resizeObserver = new ResizeObserver(() => {
      app.renderer.resize(
        Math.max(host.clientWidth, 1),
        Math.max(host.clientHeight, 1),
      );
      controller?.resize();
    });
    let isIntersecting = true;
    const syncTicker = () => {
      if (document.hidden || !isIntersecting) app.ticker.stop();
      else app.ticker.start();
    };
    const handleVisibility = () => {
      syncTicker();
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      syncTicker();
    });

    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    document.addEventListener("visibilitychange", handleVisibility);

    return {
      rotateBy: (deltaX, deltaY) => controller?.rotateBy(deltaX, deltaY),
      spin: (onReveal) => controller?.spin(onReveal) ?? Promise.resolve(),
      destroy: async () => {
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
        controller?.destroy();
        controller = null;
        app.ticker.stop();
        app.destroy(
          { removeView: true },
          { children: true, texture: false, textureSource: false, context: true },
        );
        await unloadPumpkinCubeAssets();
      },
    };
  } catch (error) {
    controller?.destroy();
    app.destroy({ removeView: true }, { children: true, context: true });
    await unloadPumpkinCubeAssets().catch(() => undefined);
    throw error;
  }
}
