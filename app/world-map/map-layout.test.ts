import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_ROADS,
  parseLegacyRoadLayout,
  parseMapLayout,
} from "./map-layout";

test("accepts a valid map layout", () => {
  assert.deepEqual(parseMapLayout(JSON.stringify(DEFAULT_ROADS)), DEFAULT_ROADS);
});

test("migrates the previous road-only layout", () => {
  const legacy = DEFAULT_ROADS.map(
    ({ texture, x, y, rotation, scale }) => ({
      texture,
      x,
      y,
      rotation,
      scale,
    }),
  );

  assert.deepEqual(parseLegacyRoadLayout(JSON.stringify(legacy)), DEFAULT_ROADS);
});

test("rejects malformed or unsafe map layouts", () => {
  assert.equal(parseMapLayout("not json"), null);
  assert.equal(
    parseMapLayout(
      '[{"category":"roads","texture":99,"x":0,"y":0,"rotation":0,"scale":1}]',
    ),
    null,
  );
});
