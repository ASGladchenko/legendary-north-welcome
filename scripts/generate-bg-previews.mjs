import { mkdir, readdir } from "node:fs/promises";
import { extname, join, parse } from "node:path";

import sharp from "sharp";

const backgroundsDirectory = "public/images/fortune-wheel";
const previewsDirectory = join(backgroundsDirectory, "previews");
const supportedExtensions = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

await mkdir(previewsDirectory, { recursive: true });

const backgrounds = (await readdir(backgroundsDirectory, { withFileTypes: true }))
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.startsWith("fw-bg") &&
      supportedExtensions.has(extname(entry.name).toLowerCase()),
  )
  .map((entry) => entry.name);

if (backgrounds.length === 0) {
  throw new Error(`No background images found in ${backgroundsDirectory}`);
}

await Promise.all(
  backgrounds.map(async (filename) => {
    const output = join(previewsDirectory, `${parse(filename).name}.webp`);

    await sharp(join(backgroundsDirectory, filename))
      .resize({ width: 80, withoutEnlargement: true })
      .webp({ quality: 30 })
      .toFile(output);

    console.log(`Generated ${output}`);
  }),
);

const oracleBackground = "public/assets/northern-oracle/oracle-background.webp";
const oraclePreview = "public/assets/northern-oracle/previews/oracle-background.webp";

await mkdir(parse(oraclePreview).dir, { recursive: true });
await sharp(oracleBackground)
  .resize({ width: 80, withoutEnlargement: true })
  .webp({ quality: 30 })
  .toFile(oraclePreview);

console.log(`Generated ${oraclePreview}`);
