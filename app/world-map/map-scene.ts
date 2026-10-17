import {
  Application,
  Container,
  Graphics,
  MeshSimple,
  Rectangle,
  Sprite,
  Text,
  Texture,
} from "pixi.js";

import { createLogicalGrid } from "./grid";
import { MAP_DIMENSIONS, mapConfig } from "./map-config";
import {
  cloneMapLayout,
  DEFAULT_ROADS,
  MAP_ASSET_COUNTS,
  MAP_LAYOUT_STORAGE_KEY,
  parseLegacyRoadLayout,
  parseMapLayout,
  ROAD_LAYOUT_STORAGE_KEY,
  type MapAssetCategory,
  type MapPlacement,
} from "./map-layout";

export type MapEditorState = {
  count: number;
  dirty: boolean;
  selected: boolean;
};

export type MapScene = {
  addMapElement: (
    category: MapAssetCategory,
    texture: number,
    x: number,
    y: number,
  ) => void;
  applyMapLayout: () => boolean;
  destroy: () => void;
  removeSelectedElement: () => void;
  resetMapLayout: () => void;
  restoreMapLayout: () => void;
  rotateSelectedElement: (radians: number) => void;
  scaleSelectedElement: (delta: number) => void;
  setGridVisible: (visible: boolean) => void;
  setMapEditorEnabled: (enabled: boolean) => void;
};

const GRID_COLOR = 0x31505d;
const TERRAIN_TEXTURE_URL = "/assets/world-map/terrain-snow-topdown.webp";
const GRASS_ATLAS_URL = "/assets/world-map/grass/grass-atlas.webp";
const GRASS_FRAMES = [
  { x: 6, y: 6, width: 384, height: 384 },
  { x: 396, y: 6, width: 384, height: 384 },
  { x: 6, y: 396, width: 384, height: 384 },
  { x: 396, y: 396, width: 384, height: 384 },
] as const;
const GRASS_ZONES = [
  { texture: 0, row: 4, col: 3, rows: 10, columns: 12, alpha: 0.72 },
  { texture: 0, row: 2, col: 31, rows: 9, columns: 12, alpha: 0.64 },
  { texture: 0, row: 23, col: 1, rows: 19, columns: 21, alpha: 0.42 },
  { texture: 0, row: 28, col: 14, rows: 16, columns: 19, alpha: 0.38 },
  { texture: 0, row: 30, col: 27, rows: 19, columns: 22, alpha: 0.44 },
  { texture: 1, row: 7, col: 7, rows: 13, columns: 14, alpha: 0.62 },
  { texture: 2, row: 26, col: 4, rows: 13, columns: 15, alpha: 0.68 },
  { texture: 1, row: 20, col: 32, rows: 10, columns: 12, alpha: 0.62 },
  { texture: 2, row: 31, col: 17, rows: 11, columns: 13, alpha: 0.58 },
  { texture: 3, row: 34, col: 31, rows: 14, columns: 17, alpha: 0.55 },
] as const;
const LAKES = [
  {
    frame: { x: 6, y: 6, width: 768, height: 448 },
    row: 8,
    col: 10,
    rows: 18,
    columns: 19,
  },
  {
    frame: { x: 6, y: 460, width: 640, height: 544 },
    row: 11,
    col: 32,
    rows: 6,
    columns: 6,
  },
  {
    frame: { x: 652, y: 460, width: 512, height: 448 },
    row: 29,
    col: 27,
    rows: 5,
    columns: 5,
  },
] as const;
const LAKE_ATLAS_URL = "/assets/world-map/water-v2/lakes-atlas.webp";
const ROAD_ATLAS_URL = "/assets/world-map/roads/roads-atlas.webp";
const ROAD_FRAMES = [
  { x: 6, y: 6, width: 420, height: 238 },
  { x: 432, y: 6, width: 109, height: 420 },
  { x: 547, y: 6, width: 420, height: 130 },
  { x: 6, y: 432, width: 420, height: 210 },
  { x: 432, y: 432, width: 420, height: 200 },
  { x: 6, y: 648, width: 420, height: 228 },
] as const;
const DECORATION_ATLAS_URL =
  "/assets/world-map/decorations/decorations-atlas.webp";
const DECORATION_ATLAS_SCALE = 0.8;
const DECORATION_FRAMES = [
  { x: 6, y: 345, width: 220, height: 269 },
  { x: 685, y: 345, width: 217, height: 253 },
  { x: 232, y: 345, width: 210, height: 269 },
  { x: 448, y: 345, width: 231, height: 261 },
  { x: 464, y: 620, width: 120, height: 90 },
  { x: 252, y: 620, width: 206, height: 141 },
  { x: 6, y: 620, width: 240, height: 189 },
  { x: 401, y: 6, width: 427, height: 285 },
  { x: 6, y: 6, width: 389, height: 333 },
] as const;
const DECORATIONS = [
  { texture: 0, row: 37, col: 33, scale: 0.43 },
  { texture: 1, row: 40, col: 33, scale: 0.46 },
  { texture: 2, row: 35, col: 41, scale: 0.42 },
  { texture: 3, row: 39, col: 42, scale: 0.47 },
  { texture: 0, row: 43, col: 37, scale: 0.48 },
  { texture: 2, row: 42, col: 42, scale: 0.5 },
  { texture: 1, row: 46, col: 39, scale: 0.5 },
  { texture: 2, row: 45, col: 45, scale: 0.48 },
  { texture: 3, row: 43, col: 47, scale: 0.52 },
  { texture: 0, row: 47, col: 43, scale: 0.52 },
  { texture: 8, row: 15, col: 12, scale: 0.5 },
  { texture: 7, row: 19, col: 11, scale: 0.48 },
  { texture: 6, row: 21, col: 17, scale: 0.5 },
  { texture: 5, row: 24, col: 18, scale: 0.46 },
  { texture: 4, row: 27, col: 19, scale: 0.45 },
  { texture: 7, row: 12, col: 24, scale: 0.5 },
  { texture: 8, row: 15, col: 29, scale: 0.42 },
  { texture: 6, row: 18, col: 27, scale: 0.48 },
  { texture: 5, row: 22, col: 31, scale: 0.46 },
  { texture: 4, row: 26, col: 33, scale: 0.43 },
  { texture: 4, row: 30, col: 27, scale: 0.4 },
] as const;

type Point = { x: number; y: number };

function createAtlasTextures(
  atlasTexture: Texture,
  frames: ReadonlyArray<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>,
) {
  return frames.map(
    ({ x, y, width, height }) =>
      new Texture({
        source: atlasTexture.source,
        frame: new Rectangle(x, y, width, height),
      }),
  );
}

function readSavedMapLayout() {
  try {
    return parseMapLayout(window.localStorage.getItem(MAP_LAYOUT_STORAGE_KEY));
  } catch {
    return null;
  }
}

function readLegacyRoadLayout() {
  try {
    return parseLegacyRoadLayout(
      window.localStorage.getItem(ROAD_LAYOUT_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

function createWorldMask(
  worldWidth: number,
  worldHeight: number,
): { sprite: Sprite; texture: Texture } {
  const resolution = 0.25;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = Math.ceil(worldWidth * resolution);
  canvas.height = Math.ceil(worldHeight * resolution);

  if (!context) throw new Error("Canvas 2D is unavailable");

  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const points: Point[] = [
    [0.03, 0.36],
    [0.04, 0.22],
    [0.09, 0.07],
    [0.19, 0.035],
    [0.31, 0.07],
    [0.42, 0.045],
    [0.5, 0.08],
    [0.61, 0.035],
    [0.72, 0.1],
    [0.84, 0.14],
    [0.92, 0.22],
    [0.95, 0.38],
    [0.975, 0.5],
    [0.95, 0.62],
    [0.96, 0.74],
    [0.9, 0.87],
    [0.8, 0.93],
    [0.69, 0.88],
    [0.6, 0.92],
    [0.5, 0.98],
    [0.4, 0.91],
    [0.31, 0.96],
    [0.21, 0.88],
    [0.15, 0.97],
    [0.08, 0.95],
    [0.035, 0.82],
    [0.045, 0.7],
    [0.02, 0.56],
  ].map(([x, y]) => ({ x: x * canvas.width, y: y * canvas.height }));

  context.filter = "blur(6px)";
  context.fillStyle = "white";
  context.beginPath();
  const last = points.at(-1) ?? points[0];

  context.moveTo((last.x + points[0].x) / 2, (last.y + points[0].y) / 2);

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const next = points[(index + 1) % points.length];

    context.quadraticCurveTo(
      point.x,
      point.y,
      (point.x + next.x) / 2,
      (point.y + next.y) / 2,
    );
  }

  context.closePath();
  context.fill();

  context.save();
  context.globalCompositeOperation = "destination-out";
  context.filter = "blur(5px)";

  for (let index = 0; index < points.length; index += 2) {
    const from = points[index];
    const to = points[(index + 1) % points.length];
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const edgeX = (from.x + to.x) / 2;
    const edgeY = (from.y + to.y) / 2;
    const centerDistance = Math.hypot(center.x - edgeX, center.y - edgeY);
    const inwardX = (center.x - edgeX) / centerDistance;
    const inwardY = (center.y - edgeY) / centerDistance;
    const phase = index * 1.37;
    const inwardOffset = 4 + (Math.sin(phase) + 1) * 2;

    context.globalAlpha = 0.065 + (Math.sin(phase * 1.7) + 1) * 0.03;
    context.beginPath();
    context.ellipse(
      edgeX + inwardX * inwardOffset,
      edgeY + inwardY * inwardOffset,
      10 + (Math.sin(phase * 1.3) + 1) * 2.5,
      3.5 + (Math.cos(phase) + 1) * 1.5,
      angle,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  context.restore();

  const texture = Texture.from(canvas);
  const sprite = new Sprite(texture);

  sprite.width = worldWidth;
  sprite.height = worldHeight;

  return { sprite, texture };
}

export async function createMapScene(
  host: HTMLDivElement,
  signal: AbortSignal,
  onMapEditorChange?: (state: MapEditorState) => void,
): Promise<MapScene> {
  const app = new Application();
  const grid = createLogicalGrid(mapConfig);
  const halfCellWidth = MAP_DIMENSIONS.isometricCellWidth / 2;
  const halfCellHeight = MAP_DIMENSIONS.isometricCellHeight / 2;
  const worldWidth = halfCellWidth * (grid.rows + grid.columns);
  const worldHeight = halfCellHeight * (grid.rows + grid.columns);
  const originX = grid.rows * halfCellWidth;
  let terrainTexture: Texture | null = null;
  let grassAtlasTexture: Texture | null = null;
  let grassTextures: Texture[] = [];
  let lakeAtlasTexture: Texture | null = null;
  let lakeTextures: Texture[] = [];
  let roadAtlasTexture: Texture | null = null;
  let roadTextures: Texture[] = [];
  let decorationAtlasTexture: Texture | null = null;
  let decorationTextures: Texture[] = [];
  let maskTexture: Texture | null = null;
  let mapLayout: MapPlacement[] = [];
  let mapEditorEnabled = false;
  let selectedElement: { placement: MapPlacement; display: Container } | null =
    null;
  let draggedElement:
    | {
        placement: MapPlacement;
        pointerX: number;
        pointerY: number;
        elementX: number;
        elementY: number;
      }
    | null = null;
  let mapLayoutDirty = false;
  let destroyed = false;

  const project = (row: number, col: number) => ({
    x: originX + (col - row) * halfCellWidth,
    y: (col + row) * halfCellHeight,
  });
  const createDefaultMapLayout = (
    roads: readonly MapPlacement[] = DEFAULT_ROADS,
  ) => [
    ...cloneMapLayout(roads),
    ...GRASS_ZONES.map(({ texture, row, col, rows, columns, alpha }) => ({
      category: "grass" as const,
      texture,
      ...project(row + rows / 2, col + columns / 2),
      rotation: 0,
      scale: 1,
      alpha,
      rows,
      columns,
    })),
    ...LAKES.map(({ row, col, rows, columns }, texture) => ({
      category: "lakes" as const,
      texture,
      ...project(row + rows / 2, col + columns / 2),
      rotation: 0,
      scale: 1,
      rows,
      columns,
    })),
    ...DECORATIONS.map(({ texture, row, col, scale }) => {
      const category = texture < 4 ? "trees" : "rocks";
      const categoryTexture = texture < 4 ? texture : texture - 4;
      const renderScale = scale / DECORATION_ATLAS_SCALE;
      const position = project(row, col);

      return {
        category,
        texture: categoryTexture,
        x: position.x,
        y:
          position.y +
          halfCellHeight -
          (DECORATION_FRAMES[texture].height * renderScale) / 2,
        rotation: 0,
        scale: renderScale,
      } satisfies MapPlacement;
    }),
  ];

  mapLayout =
    readSavedMapLayout() ??
    createDefaultMapLayout(readLegacyRoadLayout() ?? DEFAULT_ROADS);

  try {
    await app.init({
      width: worldWidth,
      height: worldHeight,
      antialias: true,
      autoDensity: true,
      autoStart: false,
      backgroundAlpha: 0,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
    });

    if (signal.aborted) {
      destroyed = true;
      app.destroy({ removeView: true }, { children: true, context: true });
      throw new DOMException("Map initialization aborted", "AbortError");
    }

    const images = await Promise.all(
      [
        TERRAIN_TEXTURE_URL,
        GRASS_ATLAS_URL,
        LAKE_ATLAS_URL,
        ROAD_ATLAS_URL,
        DECORATION_ATLAS_URL,
      ].map(
        async (url) => {
          const image = new Image();

          image.decoding = "async";
          image.src = url;
          await image.decode();
          return image;
        },
      ),
    );

    if (signal.aborted) {
      destroyed = true;
      app.destroy({ removeView: true }, { children: true, context: true });
      throw new DOMException("Map initialization aborted", "AbortError");
    }

    terrainTexture = Texture.from(images[0]);
    grassAtlasTexture = Texture.from(images[1]);
    grassTextures = createAtlasTextures(grassAtlasTexture, GRASS_FRAMES);
    lakeAtlasTexture = Texture.from(images[2]);
    lakeTextures = createAtlasTextures(
      lakeAtlasTexture,
      LAKES.map(({ frame }) => frame),
    );
    roadAtlasTexture = Texture.from(images[3]);
    roadTextures = createAtlasTextures(roadAtlasTexture, ROAD_FRAMES);
    decorationAtlasTexture = Texture.from(images[4]);
    decorationTextures = createAtlasTextures(
      decorationAtlasTexture,
      DECORATION_FRAMES,
    );
    terrainTexture.source.addressMode = "repeat";
    const terrainUv = (x: number, y: number) => {
      const difference = (x - originX) / halfCellWidth;
      const sum = y / halfCellHeight;

      return {
        u: (sum + difference) / 2 / MAP_DIMENSIONS.baseModuleSize,
        v: (sum - difference) / 2 / MAP_DIMENSIONS.baseModuleSize,
      };
    };
    const terrainTopLeftUv = terrainUv(0, 0);
    const terrainTopRightUv = terrainUv(worldWidth, 0);
    const terrainBottomRightUv = terrainUv(worldWidth, worldHeight);
    const terrainBottomLeftUv = terrainUv(0, worldHeight);
    const terrain = new MeshSimple({
      texture: terrainTexture,
      vertices: new Float32Array([
        0,
        0,
        worldWidth,
        0,
        worldWidth,
        worldHeight,
        0,
        worldHeight,
      ]),
      uvs: new Float32Array([
        terrainTopLeftUv.u,
        terrainTopLeftUv.v,
        terrainTopRightUv.u,
        terrainTopRightUv.v,
        terrainBottomRightUv.u,
        terrainBottomRightUv.v,
        terrainBottomLeftUv.u,
        terrainBottomLeftUv.v,
      ]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
    });

    terrain.autoUpdate = false;
    const worldContent = new Container();

    worldContent.addChild(terrain);

    const decorationContainer = new Container();

    decorationContainer.sortableChildren = true;
    const elementContainers: Record<MapAssetCategory, Container> = {
      grass: new Container(),
      lakes: new Container(),
      roads: new Container(),
      trees: decorationContainer,
      rocks: decorationContainer,
    };
    let elementEntries: Array<{
      placement: MapPlacement;
      display: Container;
    }> = [];

    const emitMapEditorState = () => {
      onMapEditorChange?.({
        count: mapLayout.length,
        dirty: mapLayoutDirty,
        selected: selectedElement !== null,
      });
    };
    const selectElement = (
      entry: { placement: MapPlacement; display: Container } | null,
    ) => {
      if (selectedElement) {
        selectedElement.display.alpha = selectedElement.placement.alpha ?? 1;
      }
      selectedElement = entry;
      if (selectedElement) selectedElement.display.alpha = 0.72;
      emitMapEditorState();
      app.render();
    };
    const markMapLayoutDirty = () => {
      if (mapLayoutDirty) return;
      mapLayoutDirty = true;
      emitMapEditorState();
    };
    const createIsometricMesh = (
      texture: Texture,
      rows: number,
      columns: number,
    ) => {
      const topLeft = project(0, 0);
      const topRight = project(0, columns);
      const bottomRight = project(rows, columns);
      const bottomLeft = project(rows, 0);
      const center = project(rows / 2, columns / 2);
      const mesh = new MeshSimple({
        texture,
        vertices: new Float32Array([
          topLeft.x - center.x,
          topLeft.y - center.y,
          topRight.x - center.x,
          topRight.y - center.y,
          bottomRight.x - center.x,
          bottomRight.y - center.y,
          bottomLeft.x - center.x,
          bottomLeft.y - center.y,
        ]),
        uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
        indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
      });

      mesh.autoUpdate = false;
      return mesh;
    };
    const createElement = (placement: MapPlacement) => {
      const display = new Container();

      if (placement.category === "grass" || placement.category === "lakes") {
        const textures =
          placement.category === "grass" ? grassTextures : lakeTextures;

        display.addChild(
          createIsometricMesh(
            textures[placement.texture],
            placement.rows ?? 8,
            placement.columns ?? 8,
          ),
        );
      } else {
        const texture =
          placement.category === "roads"
            ? roadTextures[placement.texture]
            : decorationTextures[
                placement.category === "trees"
                  ? placement.texture
                  : placement.texture + 4
              ];
        const sprite = new Sprite(texture);

        sprite.anchor.set(0.5);
        display.addChild(sprite);
      }

      const entry = { placement, display };

      display.position.set(placement.x, placement.y);
      if (placement.category === "trees" || placement.category === "rocks") {
        display.zIndex = placement.y;
      }
      display.rotation = placement.rotation;
      display.scale.set(placement.scale);
      display.alpha = placement.alpha ?? 1;
      display.eventMode = mapEditorEnabled ? "static" : "none";
      display.cursor = "move";
      display.on("pointerdown", (event) => {
        if (!mapEditorEnabled) return;

        event.stopPropagation();
        selectElement(entry);
        draggedElement = {
          placement,
          pointerX: event.global.x,
          pointerY: event.global.y,
          elementX: placement.x,
          elementY: placement.y,
        };
      });
      return entry;
    };
    const rebuildElements = () => {
      selectElement(null);
      new Set(Object.values(elementContainers)).forEach((container) => {
        container
          .removeChildren()
          .forEach((child) => child.destroy({ children: true }));
      });
      elementEntries = mapLayout.map(createElement);
      elementEntries.forEach((entry) => {
        elementContainers[entry.placement.category].addChild(entry.display);
      });
      emitMapEditorState();
      app.render();
    };

    elementEntries = mapLayout.map(createElement);
    elementEntries.forEach((entry) => {
      elementContainers[entry.placement.category].addChild(entry.display);
    });
    worldContent.addChild(
      elementContainers.grass,
      elementContainers.lakes,
      elementContainers.roads,
    );

    app.stage.eventMode = "static";
    app.stage.hitArea = new Rectangle(0, 0, worldWidth, worldHeight);
    app.stage.on("pointerdown", () => {
      if (mapEditorEnabled) selectElement(null);
    });
    app.stage.on("pointermove", (event) => {
      if (!mapEditorEnabled || !draggedElement) return;

      const x = Math.min(
        worldWidth,
        Math.max(
          0,
          draggedElement.elementX + event.global.x - draggedElement.pointerX,
        ),
      );
      const y = Math.min(
        worldHeight,
        Math.max(
          0,
          draggedElement.elementY + event.global.y - draggedElement.pointerY,
        ),
      );

      draggedElement.placement.x = Math.round(x);
      draggedElement.placement.y = Math.round(y);
      selectedElement?.display.position.set(x, y);
      if (
        selectedElement?.placement.category === "trees" ||
        selectedElement?.placement.category === "rocks"
      ) {
        selectedElement.display.zIndex = y;
      }
      markMapLayoutDirty();
      app.render();
    });
    const stopElementDrag = () => {
      draggedElement = null;
    };

    app.stage.on("pointerup", stopElementDrag);
    app.stage.on("pointerupoutside", stopElementDrag);

    const gridGraphics = new Graphics();

    for (let row = 0; row <= grid.rows; row += 1) {
      const start = project(row, 0);
      const end = project(row, grid.columns);

      gridGraphics.moveTo(start.x, start.y).lineTo(end.x, end.y);
    }

    for (let col = 0; col <= grid.columns; col += 1) {
      const start = project(0, col);
      const end = project(grid.rows, col);

      gridGraphics.moveTo(start.x, start.y).lineTo(end.x, end.y);
    }

    gridGraphics.stroke({ color: GRID_COLOR, width: 1, alpha: 0.36 });
    gridGraphics.visible = mapConfig.showGrid;

    worldContent.addChild(gridGraphics);

    if (mapConfig.showLabels) {
      for (const cell of grid.cells) {
        const position = project(cell.row, cell.col);
        const label = new Text({
          text: `${cell.row},${cell.col}`,
          style: { fill: 0x304b59, fontFamily: "monospace", fontSize: 8 },
        });
        label.anchor.set(0.5);
        label.position.set(position.x, position.y + halfCellHeight);
        worldContent.addChild(label);
      }
    }

    worldContent.addChild(decorationContainer);

    const worldMask = createWorldMask(worldWidth, worldHeight);

    maskTexture = worldMask.texture;
    worldContent.mask = worldMask.sprite;
    app.stage.addChild(worldContent, worldMask.sprite);

    host.replaceChildren(app.canvas);
    app.render();

    return {
      addMapElement: (category, texture, x, y) => {
        if (
          !mapEditorEnabled ||
          MAP_ASSET_COUNTS[category] === undefined ||
          !Number.isInteger(texture) ||
          texture < 0 ||
          texture >= MAP_ASSET_COUNTS[category]
        ) {
          return;
        }

        const isSurface = category === "grass" || category === "lakes";
        const lakeSize = [
          { rows: 10, columns: 12 },
          { rows: 6, columns: 6 },
          { rows: 5, columns: 5 },
        ][texture];
        const placement: MapPlacement = {
          category,
          texture,
          x: Math.round(Math.min(worldWidth, Math.max(0, x))),
          y: Math.round(Math.min(worldHeight, Math.max(0, y))),
          rotation: 0,
          scale: category === "roads" ? 0.62 : isSurface ? 1 : 0.55,
          ...(category === "grass"
            ? { rows: 10, columns: 10, alpha: 0.62 }
            : category === "lakes"
              ? lakeSize
              : {}),
        };
        const entry = createElement(placement);

        mapLayout.push(placement);
        elementEntries.push(entry);
        elementContainers[category].addChild(entry.display);
        selectElement(entry);
        markMapLayoutDirty();
      },
      applyMapLayout: () => {
        try {
          window.localStorage.setItem(
            MAP_LAYOUT_STORAGE_KEY,
            JSON.stringify(mapLayout),
          );
          mapLayoutDirty = false;
          emitMapEditorState();
          return true;
        } catch {
          return false;
        }
      },
      setGridVisible: (visible) => {
        if (destroyed || gridGraphics.visible === visible) return;

        gridGraphics.visible = visible;
        app.render();
      },
      setMapEditorEnabled: (enabled) => {
        mapEditorEnabled = enabled;
        elementEntries.forEach(({ display }) => {
          display.eventMode = enabled ? "static" : "none";
        });
        if (!enabled) {
          draggedElement = null;
          selectElement(null);
        } else {
          emitMapEditorState();
        }
      },
      removeSelectedElement: () => {
        if (!selectedElement) return;

        const removed = selectedElement;

        mapLayout = mapLayout.filter(
          (placement) => placement !== removed.placement,
        );
        elementEntries = elementEntries.filter((entry) => entry !== removed);
        selectElement(null);
        elementContainers[removed.placement.category].removeChild(
          removed.display,
        );
        removed.display.destroy({ children: true });
        markMapLayoutDirty();
        app.render();
      },
      resetMapLayout: () => {
        mapLayout = createDefaultMapLayout();
        mapLayoutDirty = true;
        rebuildElements();
      },
      restoreMapLayout: () => {
        mapLayout =
          readSavedMapLayout() ??
          createDefaultMapLayout(readLegacyRoadLayout() ?? DEFAULT_ROADS);
        mapLayoutDirty = false;
        rebuildElements();
      },
      rotateSelectedElement: (radians) => {
        if (!selectedElement || !Number.isFinite(radians)) return;

        selectedElement.placement.rotation += radians;
        selectedElement.display.rotation = selectedElement.placement.rotation;
        markMapLayoutDirty();
        app.render();
      },
      scaleSelectedElement: (delta) => {
        if (!selectedElement || !Number.isFinite(delta)) return;

        const scale = Number(
          Math.min(2, Math.max(0.2, selectedElement.placement.scale + delta)).toFixed(
            2,
          ),
        );

        selectedElement.placement.scale = scale;
        selectedElement.display.scale.set(scale);
        markMapLayoutDirty();
        app.render();
      },
      destroy: () => {
        if (destroyed) return;

        destroyed = true;
        app.destroy(
          { removeView: true },
          { children: true, texture: false, textureSource: false, context: true },
        );
        terrainTexture?.destroy(true);
        terrainTexture = null;
        grassTextures.forEach((texture) => texture.destroy(false));
        grassTextures = [];
        grassAtlasTexture?.destroy(true);
        grassAtlasTexture = null;
        lakeTextures.forEach((texture) => texture.destroy(false));
        lakeTextures = [];
        lakeAtlasTexture?.destroy(true);
        lakeAtlasTexture = null;
        roadTextures.forEach((texture) => texture.destroy(false));
        roadTextures = [];
        roadAtlasTexture?.destroy(true);
        roadAtlasTexture = null;
        decorationTextures.forEach((texture) => texture.destroy(false));
        decorationTextures = [];
        decorationAtlasTexture?.destroy(true);
        decorationAtlasTexture = null;
        maskTexture?.destroy(true);
        maskTexture = null;
      },
    };
  } catch (error) {
    if (!destroyed) {
      destroyed = true;
      app.destroy({ removeView: true }, { children: true, context: true });
      terrainTexture?.destroy(true);
      terrainTexture = null;
      grassTextures.forEach((texture) => texture.destroy(false));
      grassTextures = [];
      grassAtlasTexture?.destroy(true);
      grassAtlasTexture = null;
      lakeTextures.forEach((texture) => texture.destroy(false));
      lakeTextures = [];
      lakeAtlasTexture?.destroy(true);
      lakeAtlasTexture = null;
      roadTextures.forEach((texture) => texture.destroy(false));
      roadTextures = [];
      roadAtlasTexture?.destroy(true);
      roadAtlasTexture = null;
      decorationTextures.forEach((texture) => texture.destroy(false));
      decorationTextures = [];
      decorationAtlasTexture?.destroy(true);
      decorationAtlasTexture = null;
      maskTexture?.destroy(true);
      maskTexture = null;
    }
    throw error;
  }
}
