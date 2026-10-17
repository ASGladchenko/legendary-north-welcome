import type { MapConfig } from "./map-config";

export type GridCell = {
  row: number;
  col: number;
  x: number;
  y: number;
};

export type LogicalGrid = {
  rows: number;
  columns: number;
  cellSize: number;
  width: number;
  height: number;
  cells: GridCell[];
};

export function createLogicalGrid(config: MapConfig): LogicalGrid {
  const cells = Array.from(
    { length: config.rows * config.columns },
    (_, index) => {
      const row = Math.floor(index / config.columns);
      const col = index % config.columns;

      return {
        row,
        col,
        x: col * config.cellSize,
        y: row * config.cellSize,
      };
    },
  );

  return {
    rows: config.rows,
    columns: config.columns,
    cellSize: config.cellSize,
    width: config.columns * config.cellSize,
    height: config.rows * config.cellSize,
    cells,
  };
}
