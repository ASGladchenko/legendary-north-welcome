import assert from "node:assert/strict";
import test from "node:test";

import { createLogicalGrid } from "./grid";
import { mapConfig } from "./map-config";

test("creates the configured logical grid", () => {
  const grid = createLogicalGrid(mapConfig);

  assert.equal(grid.cells.length, 2_500);
  assert.equal(grid.width, 1_800);
  assert.equal(grid.height, 1_800);
  assert.deepEqual(grid.cells.at(-1), {
    row: 49,
    col: 49,
    x: 1_764,
    y: 1_764,
  });
});
