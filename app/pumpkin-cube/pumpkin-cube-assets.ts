import { Texture } from "pixi.js";

const base = "/assets/pumpkin-cube";

export const pumpkinCubeAssetUrls = [
  `${base}/cube-face-neutral.webp`,
  `${base}/pumpkin-circle.webp`,
  `${base}/01-pumpkin.webp`,
  `${base}/02-ghost.webp`,
  `${base}/03-witch-hat.webp`,
  `${base}/04-moon.webp`,
  `${base}/05-bat.webp`,
  `${base}/06-spider.webp`,
  "/textures/smoke.webp",
  "/textures/energy-streams.webp",
  "/textures/vortex.webp",
  "/textures/rune-ring.webp",
  "/textures/sparks.webp",
  "/textures/core-glow.webp",
] as const;

export type PumpkinCubeAssets = {
  frame: Texture;
  border: Texture;
  symbols: [Texture, Texture, Texture, Texture, Texture, Texture];
  energy: {
    faceTexture: Texture;
    smoke: Texture;
    energyStreams: Texture;
    vortex: Texture;
    runeRing: Texture;
    sparks: Texture;
    coreGlow: Texture;
  };
};

let assetPromise: Promise<PumpkinCubeAssets> | null = null;

function loadTexture(src: string) {
  return new Promise<Texture>((resolve, reject) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = () => resolve(Texture.from(image));
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

export async function loadPumpkinCubeAssets() {
  try {
    assetPromise ??= Promise.all(pumpkinCubeAssetUrls.map(loadTexture)).then(
      ([
        frame,
        border,
        pumpkin,
        ghost,
        witchHat,
        moon,
        bat,
        spider,
        smoke,
        energyStreams,
        vortex,
        runeRing,
        sparks,
        coreGlow,
      ]) => ({
        frame,
        border,
        symbols: [pumpkin, ghost, witchHat, moon, bat, spider],
        energy: {
          faceTexture: frame,
          smoke,
          energyStreams,
          vortex,
          runeRing,
          sparks,
          coreGlow,
        },
      }),
    );

    return await assetPromise;
  } catch (error) {
    assetPromise = null;
    throw error;
  }
}

export function unloadPumpkinCubeAssets() {
  // shortcut: keep this sub-500 KB texture set cached for the browser session;
  // unload only if the app starts cycling through many independent Pixi scenes.
  return Promise.resolve();
}
