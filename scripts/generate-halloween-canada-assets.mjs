import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(root, "assets/halloween-canada");
const outputDirectory = path.join(root, "public/images/halloween-canada");
const previewDirectory = path.join(outputDirectory, "previews");
const characters = ["man", "blonde", "redhead"];
const copies = characters.flatMap((character) =>
  ["en", "fr"].map((locale) => `${character}-${locale}`),
);
const sourceNames = [
  "background",
  ...characters.map((name) => `character-${name}`),
  ...copies.map((name) => `copy-${name}`),
];
const publicPreviewSources = [
  ...["witch", "pumpkin", "wolf", "wraith", "plague"].map((name) => ({
    name: `card-${name}`,
    source: path.join(outputDirectory, "cards", `${name}.webp`),
  })),
  ...["web-top-left", "web-bottom-right"].map((name) => ({
    name,
    source: path.join(outputDirectory, "decor", `${name}.webp`),
  })),
];

await Promise.all([
  mkdir(outputDirectory, { recursive: true }),
  mkdir(previewDirectory, { recursive: true }),
]);

async function validateSource(source, label, requireAlpha = true) {
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`${label} must be a valid image`);
  }
  if (requireAlpha && !metadata.hasAlpha) {
    throw new Error(`${label} must have transparency`);
  }
}

async function generateVariants(source, name, resize) {
  const variants = [
    { suffix: "", size: resize.desktop },
    { suffix: "-mobile", size: resize.mobile },
  ];

  await Promise.all(
    variants.flatMap(({ suffix, size }) => {
      const image = () =>
        sharp(source).resize({
          ...size,
          fit: size.fit ?? "inside",
          withoutEnlargement: true,
        });
      return [
        image()
          .avif({ quality: 54, effort: 4 })
          .toFile(path.join(outputDirectory, `${name}${suffix}.avif`)),
        image()
          .webp({ quality: 74, alphaQuality: 88, effort: 5 })
          .toFile(path.join(outputDirectory, `${name}${suffix}.webp`)),
      ];
    }),
  );
}

await Promise.all([
  (async () => {
    const source = path.join(sourceDirectory, "background.webp");
    await validateSource(source, "background", false);
    await generateVariants(source, "background", {
      desktop: { width: 1994, height: 560, fit: "cover" },
      mobile: { width: 1200, height: 337, fit: "cover" },
    });
  })(),
  ...characters.map(async (name) => {
    const source = path.join(sourceDirectory, `character-${name}.webp`);
    await validateSource(source, `character-${name}`);
    await generateVariants(source, `character-${name}`, {
      desktop: { height: 1100 },
      mobile: { height: 760 },
    });
  }),
  ...copies.map(async (name) => {
    const source = path.join(sourceDirectory, `copy-${name}.webp`);
    await validateSource(source, `copy-${name}`);
    await generateVariants(source, `copy-${name}`, {
      desktop: { width: 1100 },
      mobile: { width: 680 },
    });
  }),
]);

const previews = [
  ...sourceNames.map((name) => ({
    name,
    source: path.join(sourceDirectory, `${name}.webp`),
  })),
  ...publicPreviewSources,
];

await Promise.all(
  previews.map(({ name, source }) =>
    sharp(source)
      .resize({ width: 80, withoutEnlargement: true })
      .webp({ quality: 28, alphaQuality: 60, effort: 4 })
      .toFile(path.join(previewDirectory, `${name}.webp`)),
  ),
);

const sourceBytes = (
  await Promise.all(
    sourceNames.map((name) => stat(path.join(sourceDirectory, `${name}.webp`))),
  )
).reduce((total, file) => total + file.size, 0);
const outputNames = sourceNames.flatMap((name) =>
  ["", "-mobile"].flatMap((suffix) => [
    `${name}${suffix}.avif`,
    `${name}${suffix}.webp`,
  ]),
);
const outputBytes = (
  await Promise.all(
    [
      ...outputNames.map((name) => path.join(outputDirectory, name)),
      ...previews.map(({ name }) => path.join(previewDirectory, `${name}.webp`)),
    ].map((name) => stat(name)),
  )
).reduce((total, file) => total + file.size, 0);

console.log(
  `Generated ${outputNames.length} optimized assets and ${previews.length} previews (${sourceBytes} -> ${outputBytes} bytes)`,
);
