export const MAP_ASSET_COUNTS = {
  roads: 6,
  grass: 4,
  lakes: 3,
  trees: 4,
  rocks: 5,
} as const;

export type MapAssetCategory = keyof typeof MAP_ASSET_COUNTS;

export type MapPlacement = {
  category: MapAssetCategory;
  texture: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  alpha?: number;
  rows?: number;
  columns?: number;
};

export const MAP_LAYOUT_STORAGE_KEY = "legendary-north-map-layout-v1";
export const ROAD_LAYOUT_STORAGE_KEY = "legendary-north-road-layout-v1";
export const DEFAULT_ROADS: readonly MapPlacement[] = [
  { category: "roads", texture: 1, x: 780, y: 211, rotation: 0, scale: 0.62 },
  { category: "roads", texture: 1, x: 780, y: 461, rotation: 0, scale: 0.62 },
  { category: "roads", texture: 2, x: 535, y: 674, rotation: 0, scale: 0.62 },
  { category: "roads", texture: 4, x: 1025, y: 694, rotation: 0, scale: 0.62 },
  { category: "roads", texture: 1, x: 780, y: 837, rotation: 0, scale: 0.62 },
  { category: "roads", texture: 5, x: 857, y: 1029, rotation: Math.PI, scale: 0.62 },
  { category: "roads", texture: 0, x: 308, y: 571, rotation: 1, scale: 0.62 },
  { category: "roads", texture: 0, x: 620, y: 1130, rotation: 0, scale: 0.62 },
  { category: "roads", texture: 3, x: 780, y: 650, rotation: 0, scale: 0.62 },
];

export function cloneMapLayout(layout: readonly MapPlacement[]) {
  return layout.map((placement) => ({ ...placement }));
}

export function parseMapLayout(value: string | null): MapPlacement[] | null {
  if (!value) return null;

  try {
    const layout: unknown = JSON.parse(value);

    if (!Array.isArray(layout) || layout.length > 250) return null;

    const valid = layout.every((item) => {
      if (typeof item !== "object" || item === null) return false;

      const placement = item as MapPlacement;
      const textureCount = MAP_ASSET_COUNTS[placement.category];
      const needsGridSize =
        placement.category === "grass" || placement.category === "lakes";

      return (
        textureCount !== undefined &&
        Number.isInteger(placement.texture) &&
        placement.texture >= 0 &&
        placement.texture < textureCount &&
        Number.isFinite(placement.x) &&
        placement.x >= 0 &&
        placement.x <= 3_000 &&
        Number.isFinite(placement.y) &&
        placement.y >= 0 &&
        placement.y <= 2_000 &&
        Number.isFinite(placement.rotation) &&
        Math.abs(placement.rotation) <= 1_000 &&
        Number.isFinite(placement.scale) &&
        placement.scale >= 0.2 &&
        placement.scale <= 2 &&
        (placement.alpha === undefined ||
          (Number.isFinite(placement.alpha) &&
            placement.alpha >= 0.1 &&
            placement.alpha <= 1)) &&
        (!needsGridSize ||
          (Number.isFinite(placement.rows) &&
            Number.isFinite(placement.columns) &&
            placement.rows! >= 2 &&
            placement.rows! <= 30 &&
            placement.columns! >= 2 &&
            placement.columns! <= 30))
      );
    });

    return valid ? cloneMapLayout(layout) : null;
  } catch {
    return null;
  }
}

export function parseLegacyRoadLayout(value: string | null) {
  if (!value) return null;

  try {
    const roads: unknown = JSON.parse(value);

    if (!Array.isArray(roads) || roads.length > 100) return null;

    const migrated = roads.map((road) => ({
      ...(road as Omit<MapPlacement, "category">),
      category: "roads" as const,
    }));

    return parseMapLayout(JSON.stringify(migrated));
  } catch {
    return null;
  }
}
