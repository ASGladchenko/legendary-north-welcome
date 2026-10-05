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
- прозрачный фон;
- отсутствие текста и UI;
- чистые края;
- понятную точку контакта с землёй;
- достаточное качество для zoom.

## 2. Asset Classes

### Reusable

```text
trees
tree clusters
rocks
mountains
snow patches
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

## 3. Road Asset Family

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

## 4. River Asset Family

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

## 5. Water Assets

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

## 6. Trees and Forest

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

## 7. Rocks and Cliffs

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

## 8. Mountains

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

## 9. Bridges

```text
bridge_wood_small
bridge_wood_medium
bridge_stone_small
bridge_stone_medium
bridge_entry
```

## 10. Generic Buildings

```text
cabin_small_01
cabin_small_02
lodge_medium_01
lodge_medium_02
watchtower_01
dock_small_01
gate_01
```

## 11. Props

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

## 12. FX

```text
fog_soft
snow_drift
snow_particles
warm_glow
cold_glow
smoke_soft
aurora_overlay
```

## 13. Source Texture Sizes

```text
Small:
256–512 px

Medium:
512–1024 px

Large:
1024 px+

Landmark:
1536–2048 px
```

Это размеры исходных файлов, а не world footprint.

## 14. Naming Convention

```text
terrain_snow_01
terrain_snow_rock_01

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

## 15. Minimum MVP Asset Pool

```text
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

Цель MVP — проверить совместимость ассетов, а не сразу собрать полный art library.
