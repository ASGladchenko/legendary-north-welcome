# Legendary North — World Specification

## Goal

Создать расширяемую pseudo-3D карту на PixiJS из модульных ассетов.

Карта НЕ является одной большой картинкой.

Мир собирается из terrain, roads, rivers, lakes, bridges, trees, rocks, mountains, buildings, unique landmarks и FX.

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

## 3. Coordinates

```ts
worldX = cellX * CELL_SIZE;
worldY = cellY * CELL_SIZE;
```

Мелкий декор может использовать произвольные координаты внутри клеток.

## 4. Locations

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

Пример:

```text
Standard:
Welcome Camp
Explorer's Dock
Northern Vault

Major:
Sports Peak
Ice Casino Valley
Northern Hall
```

Это footprint области, а не размер одного здания.

## 5. Distance Between Locations

Между крупными локациями оставлять минимум `2–3 cells` для дорог, леса, воды, гор, мостов и transition areas.

## 6. Roads

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

## 7. Rivers

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

## 8. Large Environment Assets

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

## 9. Free Placement Assets

Не привязывать строго к клеткам:

```text
trees
tree clusters
rocks
lanterns
signs
crates
bushes
snow props
small decorations
```

## 10. Anchors

Для деревьев, гор, зданий и landmark:

```ts
anchor.set(0.5, 1);
```

Координата объекта означает точку контакта с землёй.

## 11. Rendering Layers

```text
Background
Terrain
Water
Roads
Environment
Structures
Landmarks
Foreground
FX
```

При необходимости внутри слоя:

```ts
object.zIndex = object.y;
```

## 12. Camera

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

## 13. World Data

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

## 14. Expansion Rule

Добавление новой территории:

```text
1. добавить новые location/world objects;
2. добавить необходимые assets;
3. соединить новую территорию дорогой/рекой;
4. пересчитать world bounds.
```

Не должно требоваться:

```text
перерисовывать существующую карту;
масштабировать старые территории;
менять CELL_SIZE;
менять координаты существующих объектов.
```

## 15. MVP

Сначала реализовать тестовую область примерно `6 × 12 cells`.

Проверить:

```text
modular assets
roads
water
one landmark
forest
Y sorting
swipe
zoom
camera bounds
mobile performance
```

После успешного прототипа расширять мир до стартовых `32×24`.

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

> Мир должен расширяться добавлением новых территорий, а не увеличением или пересборкой существующей карты.
