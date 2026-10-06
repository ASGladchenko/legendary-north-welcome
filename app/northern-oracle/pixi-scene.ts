import { Application } from "pixi.js";

import { CubeController } from "./cube-controller";
import { loadOracleAssets, unloadOracleAssets } from "./oracle-assets";
import type { Prediction } from "./predictions";

export type OracleScene = {
  reveal: (prediction: Prediction, faceIndex: number) => Promise<void>;
  rotateBy: (deltaX: number, deltaY: number) => void;
  destroy: () => Promise<void>;
};

export async function createOracleScene(
  host: HTMLDivElement,
): Promise<OracleScene> {
  const app = new Application();
  let controller: CubeController | null = null;

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
    const assets = await loadOracleAssets();

    controller = new CubeController(app, assets);

    const resizeObserver = new ResizeObserver(() => {
      app.renderer.resize(
        Math.max(host.clientWidth, 1),
        Math.max(host.clientHeight, 1),
      );
      controller?.resize();
    });
    const handleVisibility = () => {
      if (document.hidden) app.ticker.stop();
      else app.ticker.start();
    };

    resizeObserver.observe(host);
    document.addEventListener("visibilitychange", handleVisibility);

    return {
      reveal: (prediction, faceIndex) =>
        controller!.reveal(prediction, faceIndex),
      rotateBy: (deltaX, deltaY) => controller!.rotateBy(deltaX, deltaY),
      destroy: async () => {
        resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
        controller?.destroy();
        controller = null;
        app.ticker.stop();
        app.destroy(
          { removeView: true },
          { children: true, texture: false, textureSource: false, context: true },
        );
        await unloadOracleAssets();
      },
    };
  } catch (error) {
    controller?.destroy();
    app.destroy({ removeView: true }, { children: true, context: true });
    await unloadOracleAssets().catch(() => undefined);
    throw error;
  }
}
