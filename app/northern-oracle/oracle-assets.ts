import {
  Assets,
  Texture,
  type Spritesheet,
} from "pixi.js";

const base = "/assets/northern-oracle";

export const oracleAssetUrls = [
  `${base}/faces/face-a@0.64x.webp`,
  `${base}/faces/face-b@0.64x.webp`,
  `${base}/aurora-core@0.64x.webp`,
  `${base}/runes@0.32x.webp.json`,
] as const;

export type OracleAssets = {
  faces: [Texture, Texture];
  aurora: Texture;
  atlas: Spritesheet;
};

let assetConsumers = 0;
let assetPromise: Promise<OracleAssets> | null = null;
let initPromise: Promise<void> | null = null;

export async function loadOracleAssets(): Promise<OracleAssets> {
  assetConsumers += 1;

  try {
    initPromise ??= Assets.init({
      skipDetections: true,
      preferences: {
        preferCreateImageBitmap: false,
        preferWorkers: false,
      },
    });
    await initPromise;

    assetPromise ??= Promise.all([
      Assets.load<Texture>(oracleAssetUrls[0]),
      Assets.load<Texture>(oracleAssetUrls[1]),
      Assets.load<Texture>(oracleAssetUrls[2]),
      Assets.load<Spritesheet>(oracleAssetUrls[3]),
    ]).then(([faceA, faceB, aurora, atlas]) => ({
      faces: [faceA, faceB],
      aurora,
      atlas,
    }));

    return await assetPromise;
  } catch (error) {
    assetConsumers -= 1;
    assetPromise = null;
    throw error;
  }
}

export async function unloadOracleAssets() {
  assetConsumers = Math.max(0, assetConsumers - 1);
  if (assetConsumers > 0) return;

  await Assets.unload([...oracleAssetUrls]);
  assetPromise = null;
}
