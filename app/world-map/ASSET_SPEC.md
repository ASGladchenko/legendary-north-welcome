# Legendary North — Asset Specification

## Goal

Создать единый пул модульных ассетов, из которого можно собирать разные локации Legendary North без перерисовки всей карты.

## 1. Shared Visual Rules

Все ассеты должны иметь:
- единый pseudo-3D / 3/4 top-down ракурс;
- одинаковое направление света;
- одинаковый уровень стилизации;
- холодную северную палитру;
- снег и лёд в одном визуальном языке;
- прозрачный фон там, где это нужно;
- отсутствие текста и UI;
- чистые края;
- понятную точку контакта с землёй;
- достаточное качество для zoom.

## 2. Base Terrain System

Весь мир должен иметь непрерывный базовый terrain layer.

Основная текстура:

```text
terrain_snow_base_01
```

Требования:
- seamless/tileable по всем четырём сторонам;
- низкий визуальный контраст;
- без крупных объектов;
- без явного фокуса;
- без сильных теней;
- подходит для PixiJS `TilingSprite`.

Рекомендуемый source resolution: `1024×1024 px`.

## 3. Terrain Variation Patches

Минимальный набор:

```text
terrain_snow_soft_01
terrain_snow_soft_02
terrain_snow_rock_01
terrain_snow_rock_02
terrain_rocky_ground_01
terrain_forest_floor_01
terrain_forest_floor_02
terrain_ice_01
terrain_ice_02
terrain_dark_snow_01
terrain_transition_snow_rock_01
terrain_snow_drift_01
terrain_frost_edge_01
```

Требования:
- transparent background;
- irregular organic shape;
- мягкие внешние края;
- без жёсткой рамки;
- без деревьев, дорог, зданий и других самостоятельных объектов;
- могут перекрываться;
- должны визуально сливаться с `terrain_snow_base_01`.

Рекомендуемый source resolution: `1024×1024 px`.

Типичный world footprint:

```text
2×2 cells
3×3 cells
4×4 cells
6×4 cells
```

Terrain patches не обязаны snap'иться к grid.

## 4. Asset Classes

### Reusable

```text
base terrain
terrain patches
trees
tree clusters
rocks
mountains
roads
rivers
bridges
shore pieces
lanterns
signposts
fences
small cabins
fog
snow FX
```

### Semi-unique

```text
large cabins
watchtowers
docks
gates
special bridges
small fortifications
special rock formations
```

### Unique landmarks

```text
Sports Peak
Ice Casino Valley
Northern Hall
Treasure Mountain
Northern Vault
Welcome Camp
Explorer's Dock
```

## 5. Road Asset Family

Базовый модуль: `1×1 cell = 256×256 world units`.

```text
road_straight_horizontal
road_straight_vertical
road_curve_ne
road_curve_nw
road_curve_se
road_curve_sw
road_t_north
road_t_south
road_t_east
road_t_west
road_cross
road_fork
road_end_north
road_end_south
road_end_east
road_end_west
road_bridge_entry
```

Все края подключения должны совпадать по центру стороны клетки.

## 6. River Asset Family

```text
river_straight_horizontal
river_straight_vertical
river_curve_ne
river_curve_nw
river_curve_se
river_curve_sw
river_fork
river_lake_entry
river_waterfall_entry
river_bridge_crossing
```

## 7. Water Assets

```text
lake_small      2×2 cells
lake_medium     3×2 cells
lake_large      4×3 cells
shore_straight
shore_inner_corner
shore_outer_corner
shore_small_bay
waterfall_small
waterfall_medium
```

## 8. Trees and Forest

```text
pine_single_01
pine_single_02
pine_single_03
pine_tall_01
pine_cluster_small_01
pine_cluster_small_02
pine_cluster_dense_01
pine_cluster_dense_02
bush_snow_01
bush_snow_02
```

Рекомендуемый anchor:

```ts
anchor.set(0.5, 1);
```

## 9. Rocks and Cliffs

```text
rock_small_01
rock_small_02
rock_cluster_01
rock_cluster_02
boulder_01
boulder_02
cliff_edge_01
cliff_edge_02
cliff_corner_01
cliff_corner_02
```

## 10. Mountains

```text
mountain_small_01
mountain_small_02
mountain_medium_01
mountain_medium_02
mountain_large_01
mountain_large_02
mountain_ridge_01
mountain_ridge_02
```

Footprints:

```text
small  = 1×1
medium = 2×2
large  = 3×3
```

## 11. Bridges

```text
bridge_wood_small
bridge_wood_medium
bridge_stone_small
bridge_stone_medium
bridge_entry
```

## 12. Generic Buildings

```text
cabin_small_01
cabin_small_02
lodge_medium_01
lodge_medium_02
watchtower_01
dock_small_01
gate_01
```

## 13. Props

```text
campfire_01
lantern_01
lantern_02
signpost_01
fence_01
crate_cluster_01
barrel_cluster_01
snow_pile_01
```

## 14. FX

```text
fog_soft
snow_drift
snow_particles
warm_glow
cold_glow
smoke_soft
aurora_overlay
```

## 15. Terrain Composition

```text
Base seamless snow
↓
Terrain variation patches
↓
Water
↓
Roads
↓
Environment
↓
Structures
↓
Landmarks
↓
Foreground
↓
FX
```

## 16. Source Texture Sizes

```text
Base terrain: 1024×1024 px
Terrain patches: 1024×1024 px
Small: 256–512 px
Medium: 512–1024 px
Large: 1024 px+
Landmark: 1536–2048 px
```

Это размеры исходных файлов, а не world footprint.

## 17. Naming Convention

```text
terrain_snow_base_01
terrain_snow_soft_01
terrain_snow_rock_01
terrain_forest_floor_01
terrain_ice_01
road_straight_horizontal_01
road_curve_ne_01
river_straight_vertical_01
river_curve_sw_01
tree_pine_single_01
tree_pine_cluster_dense_01
rock_cluster_01
cliff_edge_01
mountain_medium_01
building_cabin_small_01
landmark_sports_peak_01
landmark_welcome_camp_01
```

## 18. Minimum MVP Asset Pool

```text
1 seamless snow base
4–6 terrain patches
3–4 trees
2 tree clusters
3 rocks
2 cliffs
2 mountains
straight road
curve road
T-junction
road end
bridge
straight river
curve river
small lake
waterfall
1 cabin
1 lantern
1 sign
1 campfire
1 landmark
2–3 FX
```

Цель MVP — проверить совместимость ассетов и цельность карты, а не сразу собрать полный art library.
