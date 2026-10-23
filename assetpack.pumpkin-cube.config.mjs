import { pixiPipes } from "@assetpack/core/pixi";

const config = {
  entry: "./assets/pumpkin-cube",
  output: "./public/assets/pumpkin-cube",
  cache: true,
  cacheLocation: "./.assetpack/pumpkin-cube",
  pipes: pixiPipes({
    cacheBust: false,
    resolutions: { default: 1 },
    compression: {
      png: "skip",
      jpg: "skip",
      webp: { quality: 86, alphaQuality: 90, effort: 5 },
      avif: false,
    },
    manifest: {
      output: "manifest.json",
      createShortcuts: true,
      trimExtensions: true,
    },
  }),
};

export default config;
