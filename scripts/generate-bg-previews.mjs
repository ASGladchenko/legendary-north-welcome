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

const runeBackgroundsDirectory = "public/images/rune";
const runePreviewsDirectory = join(runeBackgroundsDirectory, "previews");
const runeBackgrounds = [
  "aurora-lake-desktop.webp",
  "aurora-lake-mobile.webp",
  "monolith-landscape-desktop.webp",
  "monolith-landscape-mobile.webp",
];

await mkdir(runePreviewsDirectory, { recursive: true });
await Promise.all(
  runeBackgrounds.map(async (filename) => {
    const output = join(runePreviewsDirectory, filename);

    await sharp(join(runeBackgroundsDirectory, filename))
      .resize({ width: 80, withoutEnlargement: true })
      .webp({ quality: 30 })
      .toFile(output);

    console.log(`Generated ${output}`);
  }),
);

const brazilSourceDirectory = "assets/welcome-brazil";
const brazilPublicDirectory = "public/images/welcome-brazil";
const brazilPreviewsDirectory = join(brazilPublicDirectory, "previews");
const brazilSources = (await readdir(brazilSourceDirectory))
  .filter((filename) => filename.endsWith(".png"));
const brazilPublishedSources = brazilSources.filter(
  (filename) => filename !== "map-desktop.png",
);

await mkdir(brazilPublicDirectory, { recursive: true });
await Promise.all(
  brazilPublishedSources.flatMap((filename) => {
    const name = parse(filename).name;
    const source = join(brazilSourceDirectory, filename);
    const avifOutput = join(brazilPublicDirectory, `${name}.avif`);
    const webpOutput = join(brazilPublicDirectory, `${name}.webp`);

    return [
      sharp(source)
        .avif({ quality: 55, effort: 4 })
        .toFile(avifOutput)
        .then(() => console.log(`Generated ${avifOutput}`)),
      sharp(source)
        .webp({ quality: 78, effort: 5 })
        .toFile(webpOutput)
        .then(() => console.log(`Generated ${webpOutput}`)),
    ];
  }),
);

await mkdir(brazilPreviewsDirectory, { recursive: true });
await Promise.all(
  brazilPublishedSources.map(
    async (filename) => {
      const output = join(
        brazilPreviewsDirectory,
        `${parse(filename).name}.webp`,
      );

      await sharp(join(brazilSourceDirectory, filename))
        .resize({ width: 80, withoutEnlargement: true })
        .webp({ quality: 30 })
        .toFile(output);

      console.log(`Generated ${output}`);
    },
  ),
);

const brazilMapSources = Array.from(
  { length: 5 },
  (_, index) => `map-${index + 1}.webp`,
);

await Promise.all(
  brazilMapSources.flatMap((filename) => {
    const name = parse(filename).name;
    const source = join(brazilPublicDirectory, filename);

    return [
      sharp(source)
        .avif({ quality: 52, effort: 4 })
        .toFile(join(brazilPublicDirectory, `${name}.avif`))
        .then(() => console.log(`Generated ${join(brazilPublicDirectory, `${name}.avif`)}`)),
      sharp(source)
        .resize(80, 80, { fit: "contain" })
        .webp({ quality: 28 })
        .toFile(join(brazilPreviewsDirectory, `${name}.webp`))
        .then(() => console.log(`Generated ${join(brazilPreviewsDirectory, `${name}.webp`)}`)),
    ];
  }),
);

