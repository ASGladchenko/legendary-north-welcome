# Legendary North — World Specification

## Goal

Создать расширяемую pseudo-3D карту на PixiJS из модульных ассетов.

Карта НЕ является одной большой картинкой.

Мир собирается из seamless base terrain, terrain patches, roads, rivers, lakes, bridges, trees, rocks, mountains, buildings, unique landmarks и FX.

Пользователь должен иметь возможность двигать карту свайпом/drag, масштабировать pinch/wheel, нажимать на локации и плавно фокусировать камеру.

## 1. World Grid

```ts
const CELL_SIZE = 256;
```

Одна логическая клетка: `256 × 256 world units`.

`CELL_SIZE` после начала разработки не меняем.

## 2. Expandable World

Стартовая область:

```text
32 × 24 cells
8192 × 6144 world units
```

Это только стартовый контент.

Архитектура должна позволять расширение:

```text
32×24 → 40×24 → 48×32 → 64×48 → etc.
```

без изменения существующих координат и ассетов.

Расширение происходит добавлением новых клеток и объектов вокруг существующего мира.

Не масштабировать существующий мир для добавления новых территорий.

`WORLD_MAX_SIZE` не фиксирован.

## 3. Coordinates

```ts
worldX = cellX * CELL_SIZE;
worldY = cellY * CELL_SIZE;
```

Мелкий декор может использовать произвольные координаты внутри клеток.

## 4. Base Terrain

Весь текущий world bounds всегда покрыт непрерывным базовым terrain layer.

Для Legendary North базовый слой:

```text
terrain_snow_base_01
```

Он должен быть seamless/tileable и может рендериться через PixiJS `TilingSprite`.

При расширении world bounds базовый terrain автоматически расширяется вместе с миром.

## 5. Terrain Patches

Поверх base terrain размещаются irregular terrain patches:

```text
snow
snow + rock
rocky ground
forest floor
ice
dark snow
snow drift
transition patches
```

Terrain patches могут занимать несколько клеток, выходить за grid, не обязаны snap'иться к клеткам, имеют прозрачный фон и мягкие края.

## 6. Locations

Стандартная локация:

```text
6 × 6 cells
1536 × 1536 units
```

Крупная локация:

```text
8 × 6 cells
2048 × 1536 units
```

Это footprint области, а не размер одного здания.

## 7. Distance Between Locations

Между крупными локациями оставлять минимум `2–3 cells` для дорог, леса, воды, гор, мостов и transition areas.

## 8. Roads

Один road module:

```text
1 × 1 cell
256 × 256 units
```

Модули:

```text
straight
curve
T-junction
crossroad
fork
dead-end
bridge-entry
```

Connection points:

```text
North  = (128, 0)
South  = (128, 256)
West   = (0, 128)
East   = (256, 128)
```

Визуальная ширина дороги: `~80–115 world units`.

## 9. Rivers

Используют ту же систему подключения, что дороги.

```text
straight
curve
fork
lake-entry
waterfall-entry
bridge-crossing
```

Базовый river module: `1 × 1 cell`.

## 10. Large Environment Assets

```text
small lake      2×2
medium lake     3×2
large lake      4×3
small mountain  1×1
medium mountain 2×2
large mountain  3×3
landmark        2×2 – 4×4
```

Объект визуально может выходить за свой footprint.

## 11. Free Placement Assets

Не привязывать строго к клеткам:

```text
terrain patches
trees
tree clusters
rocks
lanterns
signs
crates
bushes
snow props
small decorations
FX
```

## 12. Anchors

Для деревьев, гор, зданий и landmarks:

```ts
anchor.set(0.5, 1);
```

Координата объекта означает точку контакта с землёй.

## 13. Rendering Layers

```text
Background
BaseTerrain
TerrainPatches
Water
Roads
Environment
Structures
Landmarks
Foreground
FX
```

При необходимости внутри подходящего слоя:

```ts
object.zIndex = object.y;
```

## 14. Camera

Поддержать:

```text
drag / swipe
pinch zoom
mouse wheel zoom
tap selection
focus location
inertia
camera bounds
```

Zoom:

```text
min: 0.22
max: 1.25
```

Camera bounds рассчитываются по текущему содержимому карты и автоматически расширяются.

## 15. World Data

```ts
type WorldObject = {
  id: string;
  asset: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  layer: string;
};
```

```ts
type Location = {
  id: string;
  cellX: number;
  cellY: number;
  widthCells: number;
  heightCells: number;
  exits: LocationExit[];
  objects: WorldObject[];
};
```

## 16. Expansion Rule

Добавление новой территории:

```text
1. добавить новые location/world objects;
2. добавить необходимые assets;
3. добавить terrain patches;
4. соединить новую территорию дорогой/рекой;
5. пересчитать world bounds;
6. автоматически расширить BaseTerrain.
```

Не должно требоваться перерисовывать существующую карту, масштабировать старые территории, менять `CELL_SIZE` или координаты существующих объектов.

## 17. MVP

Сначала реализовать тестовую область примерно `6 × 12 cells`.

Проверить base terrain, terrain patches, modular assets, roads, water, one landmark, forest, Y sorting, swipe, zoom, camera bounds и mobile performance.

## Fixed Rules

```text
CELL_SIZE = 256
STANDARD_LOCATION = 6×6 cells
MAJOR_LOCATION = 8×6 cells
ROAD_MODULE = 1×1 cell
RIVER_MODULE = 1×1 cell
LOCATION_GAP = minimum 2–3 cells
START_AREA = 32×24 cells
WORLD_MAX_SIZE = not fixed
MIN_ZOOM = 0.22
MAX_ZOOM = 1.25
```

Главный принцип:

> Мир расширяется добавлением новых территорий и ассетов, а не увеличением или пересборкой существующей карты.
