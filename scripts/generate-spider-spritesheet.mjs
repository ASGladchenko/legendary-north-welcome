import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const FRAME_COUNT = 10;
const FRAME_SIZE = 240;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(ROOT, "assets/spider/frames");
const outputDirectory = path.join(ROOT, "public/assets/spider");
const outputPath = path.join(outputDirectory, "spider-walk.webp");
const expectedNames = Array.from(
  { length: FRAME_COUNT },
  (_, index) => `${String(index + 1).padStart(2, "0")}.webp`,
);

const files = (await readdir(sourceDirectory))
  .filter((file) => file.toLowerCase().endsWith(".webp"))
  .sort();

if (
  files.length !== FRAME_COUNT ||
  files.some((file, index) => file !== expectedNames[index])
) {
  throw new Error(
    `Expected exactly ${FRAME_COUNT} frames named ${expectedNames.join(", ")} in ${sourceDirectory}`,
  );
}

const frames = await Promise.all(
  files.map(async (file) => {
    const inputPath = path.join(sourceDirectory, file);
    const image = sharp(inputPath);
    const [metadata, stats] = await Promise.all([image.metadata(), image.stats()]);
    const alpha = stats.channels[3];

    if (!metadata.width || metadata.width !== metadata.height) {
      throw new Error(`${file} must be square`);
    }

    if (!metadata.hasAlpha || !alpha || alpha.min === 255) {
      throw new Error(`${file} must contain transparency`);
    }

    return sharp(inputPath)
      .resize(FRAME_SIZE, FRAME_SIZE, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer();
  }),
);

await mkdir(outputDirectory, { recursive: true });

await sharp({
  create: {
    width: FRAME_SIZE * FRAME_COUNT,
    height: FRAME_SIZE,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(
    frames.map((input, index) => ({
      input,
      raw: { width: FRAME_SIZE, height: FRAME_SIZE, channels: 4 },
      left: index * FRAME_SIZE,
      top: 0,
    })),
  )
  .webp({ quality: 78, alphaQuality: 90, effort: 6 })
  .toFile(outputPath);

const outputMetadata = await sharp(outputPath).metadata();
if (
  outputMetadata.width !== FRAME_SIZE * FRAME_COUNT ||
  outputMetadata.height !== FRAME_SIZE ||
  !outputMetadata.hasAlpha
) {
  throw new Error(`Generated spider spritesheet has invalid dimensions or alpha`);
}

const outputStats = await stat(outputPath);
console.log(`Generated ${path.relative(ROOT, outputPath)} (${outputStats.size} bytes)`);
