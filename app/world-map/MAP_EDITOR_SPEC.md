# Legendary North — Map Editor Specification

## Goal

Создать внутренний инструмент для сборки карты Legendary North из готовых модульных ассетов.

Редактор не является частью пользовательского интерфейса продукта.

Он нужен для быстрого создания и расширения мира без ручного изменения кода.

## 1. Core Idea

Редактор должен позволять:

- выбирать ассет из библиотеки;
- добавлять его на карту;
- перемещать;
- менять scale;
- менять rotation;
- менять layer;
- удалять;
- копировать;
- сохранять результат как JSON;
- загружать ранее созданную карту.

Pixi runtime затем должен рендерить этот JSON.

## 2. World Grid

Использовать те же правила, что runtime:

```text
CELL_SIZE = 256
```

Сетка может включаться/выключаться.

Новые области мира добавляются без изменения `CELL_SIZE`.

## 3. Asset Library

Категории:

```text
Terrain
Roads
Rivers
Water
Trees
Rocks
Mountains
Bridges
Buildings
Props
Landmarks
FX
```

Каждый asset:

```ts
{
  id,
  category,
  assetUrl,
  defaultScale,
  defaultLayer,
  footprint?
}
```

## 4. Placement Modes

### Grid placement

```text
roads
rivers
bridges
large lakes
location footprints
```

### Free placement

```text
trees
rocks
props
small buildings
FX
```

Должна быть возможность временно отключить snap.

## 5. Object Controls

Для выбранного объекта:

```text
X
Y
Scale
Rotation
Layer
zIndex override
Flip X
Visible
Locked
```

Также:

```text
Duplicate
Delete
Bring forward
Send backward
```

## 6. Location Editing

```ts
{
  id,
  cellX,
  cellY,
  widthCells,
  heightCells,
  exits
}
```

Presets:

```text
Standard Location = 6×6
Major Location    = 8×6
```

## 7. Location Exits

Можно добавить:

```text
north
south
east
west
```

или custom exit point.

Exit хранится отдельно от визуального road asset.

## 8. Road Editing

Road module snap'ится к grid.

Минимум:

```text
straight
curve
T-junction
crossroad
fork
dead-end
bridge-entry
```

На первом этапе автоматический pathfinding не нужен.

## 9. River Editing

```text
straight
curve
fork
lake-entry
waterfall-entry
bridge-crossing
```

## 10. Layers

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

## 11. Export Format

```ts
type MapData = {
  version: number;
  cellSize: number;
  locations: Location[];
  objects: WorldObject[];
};
```

Пример:

```json
{
  "version": 1,
  "cellSize": 256,
  "locations": [],
  "objects": [
    {
      "id": "tree-001",
      "asset": "tree_pine_single_01",
      "x": 1234,
      "y": 2468,
      "scale": 0.8,
      "rotation": 0,
      "layer": "Environment"
    }
  ]
}
```

## 12. Expandable World

Редактор не должен иметь жёстко ограниченный canvas.

World bounds рассчитываются по содержимому.

При добавлении объекта за текущей границей bounds автоматически расширяются.

Существующие координаты не меняются.

## 13. MVP Editor

На первом этапе достаточно:

```text
asset library
drag/drop or click-to-place
selection
move
scale
rotate
delete
duplicate
grid snap
free placement
layers
JSON export/import
```

Не нужны в MVP:

```text
collaboration
complex undo history
automatic biome generation
automatic roads
pathfinding
procedural generation UI
cloud storage
```

## 14. Runtime Contract

Map Editor только создаёт данные.

Pixi runtime отвечает за:

```text
rendering
camera
swipe
pinch zoom
mouse zoom
inertia
selection
animations
FX
performance optimization
```

Редактор и runtime должны использовать общий формат `MapData`.
