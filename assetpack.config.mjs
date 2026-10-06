import { pixiPipes } from "@assetpack/core/pixi";

const config = {
  entry: "./assets/northern-oracle",
  output: "./public/assets/northern-oracle",
  cache: true,
  cacheLocation: "./.assetpack/northern-oracle",
  pipes: pixiPipes({
    cacheBust: false,
    resolutions: { default: 1, cube: 0.64 },
    compression: {
      png: "skip",
      jpg: "skip",
      webp: { quality: 82, alphaQuality: 86, effort: 5 },
      avif: false,
    },
    texturePacker: {
      texturePacker: {
        nameStyle: "short",
        padding: 4,
        allowRotation: false,
      },
      resolutionOptions: {
        resolutions: { atlas: 0.32 },
        fixedResolution: "atlas",
        maximumTextureSize: 4096,
      },
    },
    manifest: {
      output: "manifest.json",
      createShortcuts: true,
      trimExtensions: true,
    },
  }),
};

export default config;
