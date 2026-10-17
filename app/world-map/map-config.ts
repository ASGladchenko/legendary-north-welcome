export const MAP_DIMENSIONS = {
  logicalCellSize: 36,
  isometricCellWidth: 52,
  isometricCellHeight: 26,
  baseModuleSize: 8,
  chunkSize: 32,
} as const;

export const mapConfig = {
  rows: 50,
  columns: 50,
  cellSize: MAP_DIMENSIONS.logicalCellSize,
  showGrid: true,
  showLabels: false,
} as const;

export type MapConfig = typeof mapConfig;
