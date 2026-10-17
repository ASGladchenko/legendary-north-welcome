"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { MAP_DIMENSIONS, mapConfig } from "./map-config";
import type { MapAssetCategory } from "./map-layout";
import { MapLoader } from "./map-loader";
import type { MapEditorState, MapScene } from "./map-scene";

const SCROLL_STEP = MAP_DIMENSIONS.logicalCellSize * 5;
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 1.15;
const ZOOM_STEP = 0.15;
const ROAD_ROTATION_STEP = Math.PI / 12;
const MAP_TOOLS: ReadonlyArray<{
  category: MapAssetCategory;
  label: string;
  items: readonly string[];
}> = [
  {
    category: "roads",
    label: "Дороги",
    items: ["Прямая", "Узкая", "Поворот", "Перекрёсток", "S-изгиб", "Т-развилка"],
  },
  {
    category: "grass",
    label: "Трава",
    items: ["Редкая", "Пятна", "Средняя", "Густая"],
  },
  {
    category: "lakes",
    label: "Озёра",
    items: ["Большое", "Залив", "Малое"],
  },
  {
    category: "trees",
    label: "Деревья",
    items: ["Ель", "Смешанный лес", "Малая группа", "Группа елей"],
  },
  {
    category: "rocks",
    label: "Камни",
    items: ["Малый", "Группа", "Выступ", "Гора", "Шпиль"],
  },
];
const WORLD_WIDTH =
  ((mapConfig.rows + mapConfig.columns) *
    MAP_DIMENSIONS.isometricCellWidth) /
  2;
const WORLD_HEIGHT =
  ((mapConfig.rows + mapConfig.columns) *
    MAP_DIMENSIONS.isometricCellHeight) /
  2;

type MapView = {
  left: number;
  top: number;
  width: number;
  height: number;
  canMoveUp: boolean;
  canMoveRight: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
};

type DragState = {
  pointerId: number;
  clientX: number;
  clientY: number;
  scrollLeft: number;
  scrollTop: number;
  lastClientX: number;
  lastClientY: number;
  lastTime: number;
  velocityX: number;
  velocityY: number;
};

type ScrollTarget = {
  left: number;
  top: number;
};

type ZoomAnchor = {
  worldX: number;
  worldY: number;
};

export default function WorldMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<MapScene | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const minimapFrameRef = useRef<number | null>(null);
  const minimapTargetRef = useRef<ScrollTarget | null>(null);
  const zoomRef = useRef(1);
  const zoomAnchorRef = useRef<ZoomAnchor | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [mapView, setMapView] = useState<MapView>({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    canMoveUp: false,
    canMoveRight: false,
    canMoveDown: false,
    canMoveLeft: false,
  });
  const [dragging, setDragging] = useState(false);
  const [gridVisible, setGridVisible] = useState<boolean>(mapConfig.showGrid);
  const [fogVisible, setFogVisible] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [mapEditorEnabled, setMapEditorEnabled] = useState(false);
  const [mapEditorCategory, setMapEditorCategory] =
    useState<MapAssetCategory>("roads");
  const [mapEditorState, setMapEditorState] = useState<MapEditorState>({
    count: 0,
    dirty: false,
    selected: false,
  });
  const [mapEditorMessage, setMapEditorMessage] = useState("");

  const cancelInertia = () => {
    if (inertiaFrameRef.current === null) return;

    window.cancelAnimationFrame(inertiaFrameRef.current);
    inertiaFrameRef.current = null;
  };

  const cancelMinimapMotion = () => {
    if (minimapFrameRef.current !== null) {
      window.cancelAnimationFrame(minimapFrameRef.current);
      minimapFrameRef.current = null;
    }
    minimapTargetRef.current = null;
  };

  useEffect(() => {
    const controller = new AbortController();
    let scene: MapScene | null = null;

    const setup = async () => {
      if (!hostRef.current) return;

      try {
        const { createMapScene } = await import("./map-scene");
        scene = await createMapScene(
          hostRef.current,
          controller.signal,
          setMapEditorState,
        );
        if (!controller.signal.aborted) {
          sceneRef.current = scene;
          setStatus("ready");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to initialize world map", error);
          setStatus("error");
        }
      }
    };

    void setup();

    return () => {
      controller.abort();
      if (inertiaFrameRef.current !== null) {
        window.cancelAnimationFrame(inertiaFrameRef.current);
        inertiaFrameRef.current = null;
      }
      if (minimapFrameRef.current !== null) {
        window.cancelAnimationFrame(minimapFrameRef.current);
        minimapFrameRef.current = null;
      }
      minimapTargetRef.current = null;
      if (sceneRef.current === scene) sceneRef.current = null;
      scene?.destroy();
      scene = null;
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || status !== "ready") return;

    const updateMapView = () => {
      const mapWidth = Math.max(viewport.scrollWidth, 1);
      const mapHeight = Math.max(viewport.scrollHeight, 1);
      const maxLeft = Math.max(mapWidth - viewport.clientWidth, 0);
      const maxTop = Math.max(mapHeight - viewport.clientHeight, 0);

      setMapView({
        left: (viewport.scrollLeft / mapWidth) * 100,
        top: (viewport.scrollTop / mapHeight) * 100,
        width: Math.min((viewport.clientWidth / mapWidth) * 100, 100),
        height: Math.min((viewport.clientHeight / mapHeight) * 100, 100),
        canMoveUp: viewport.scrollTop > 0,
        canMoveRight: viewport.scrollLeft < maxLeft - 1,
        canMoveDown: viewport.scrollTop < maxTop - 1,
        canMoveLeft: viewport.scrollLeft > 0,
      });
    };

    const resizeObserver = new ResizeObserver(updateMapView);

    viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
    viewport.addEventListener("scroll", updateMapView, { passive: true });
    resizeObserver.observe(viewport);
    updateMapView();

    return () => {
      viewport.removeEventListener("scroll", updateMapView);
      resizeObserver.disconnect();
    };
  }, [status]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const anchor = zoomAnchorRef.current;

    if (!viewport || !anchor) return;

    viewport.scrollTo({
      left: anchor.worldX * zoom - viewport.clientWidth / 2,
      top: anchor.worldY * zoom - viewport.clientHeight / 2,
    });
    zoomAnchorRef.current = null;
    viewport.dispatchEvent(new Event("scroll"));
  }, [zoom]);

  const moveMap = (left: number, top: number) => {
    cancelInertia();
    cancelMinimapMotion();
    viewportRef.current?.scrollBy({ left, top, behavior: "smooth" });
  };

  const toggleGrid = () => {
    const visible = !gridVisible;

    sceneRef.current?.setGridVisible(visible);
    setGridVisible(visible);
  };

  const changeZoom = (delta: number) => {
    const viewport = viewportRef.current;
    const currentZoom = zoomRef.current;
    const nextZoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, Number((currentZoom + delta).toFixed(2))),
    );

    if (!viewport || nextZoom === currentZoom) return;

    cancelInertia();
    cancelMinimapMotion();
    zoomAnchorRef.current = {
      worldX: (viewport.scrollLeft + viewport.clientWidth / 2) / currentZoom,
      worldY: (viewport.scrollTop + viewport.clientHeight / 2) / currentZoom,
    };
    zoomRef.current = nextZoom;
    setZoom(nextZoom);
  };

  const startInertia = (velocityX: number, velocityY: number) => {
    const viewport = viewportRef.current;

    cancelInertia();
    if (
      !viewport ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Math.hypot(velocityX, velocityY) < 0.02
    ) {
      return;
    }

    const maxVelocity = 2.5;
    let x = Math.max(-maxVelocity, Math.min(velocityX, maxVelocity));
    let y = Math.max(-maxVelocity, Math.min(velocityY, maxVelocity));
    let previousTime = performance.now();

    const coast = (time: number) => {
      const elapsed = Math.min(time - previousTime, 32);
      const previousLeft = viewport.scrollLeft;
      const previousTop = viewport.scrollTop;

      viewport.scrollLeft += x * elapsed;
      viewport.scrollTop += y * elapsed;

      if (viewport.scrollLeft === previousLeft) x = 0;
      if (viewport.scrollTop === previousTop) y = 0;

      const friction = Math.pow(0.94, elapsed / 16.67);

      x *= friction;
      y *= friction;
      previousTime = time;

      if (Math.hypot(x, y) < 0.02) {
        inertiaFrameRef.current = null;
        return;
      }

      inertiaFrameRef.current = window.requestAnimationFrame(coast);
    };

    inertiaFrameRef.current = window.requestAnimationFrame(coast);
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || mapEditorEnabled) return;

    const viewport = event.currentTarget;

    cancelInertia();
    cancelMinimapMotion();
    viewport.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
      lastTime: performance.now(),
      velocityX: 0,
      velocityY: 0,
    };
    setDragging(true);
  };

  const dragMap = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    const time = performance.now();
    const elapsed = Math.max(time - drag.lastTime, 1);
    const velocityX = -(event.clientX - drag.lastClientX) / elapsed;
    const velocityY = -(event.clientY - drag.lastClientY) / elapsed;

    event.currentTarget.scrollTo({
      left: drag.scrollLeft - (event.clientX - drag.clientX),
      top: drag.scrollTop - (event.clientY - drag.clientY),
    });

    drag.velocityX = drag.velocityX * 0.65 + velocityX * 0.35;
    drag.velocityY = drag.velocityY * 0.65 + velocityY * 0.35;
    drag.lastClientX = event.clientX;
    drag.lastClientY = event.clientY;
    drag.lastTime = time;
  };

  const stopDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (drag?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setDragging(false);
    if (performance.now() - drag.lastTime < 100) {
      startInertia(drag.velocityX, drag.velocityY);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const moveFromMinimap = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width);
    const y = Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height);
    const maxLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const maxTop = Math.max(viewport.scrollHeight - viewport.clientHeight, 0);

    minimapTargetRef.current = {
      left: Math.min(
        Math.max(
          (x / bounds.width) * viewport.scrollWidth - viewport.clientWidth / 2,
          0,
        ),
        maxLeft,
      ),
      top: Math.min(
        Math.max(
          (y / bounds.height) * viewport.scrollHeight -
            viewport.clientHeight / 2,
          0,
        ),
        maxTop,
      ),
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      viewport.scrollTo(minimapTargetRef.current);
      minimapTargetRef.current = null;
      return;
    }

    if (minimapFrameRef.current !== null) return;

    let previousTime = performance.now();
    const followTarget = (time: number) => {
      const target = minimapTargetRef.current;

      if (!target) {
        minimapFrameRef.current = null;
        return;
      }

      const elapsed = Math.min(time - previousTime, 32);
      const deltaX = target.left - viewport.scrollLeft;
      const deltaY = target.top - viewport.scrollTop;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 0.5) {
        viewport.scrollTo(target);
        minimapTargetRef.current = null;
        minimapFrameRef.current = null;
        return;
      }

      const maximumStep = (1_100 * elapsed) / 1_000;
      const easedStep = distance * (1 - Math.exp((-12 * elapsed) / 1_000));
      const step = Math.min(distance, maximumStep, easedStep);

      viewport.scrollBy({
        left: (deltaX / distance) * step,
        top: (deltaY / distance) * step,
      });
      previousTime = time;
      minimapFrameRef.current = window.requestAnimationFrame(followTarget);
    };

    minimapFrameRef.current = window.requestAnimationFrame(followTarget);
  };

  const startMinimapDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;

    cancelInertia();
    cancelMinimapMotion();
    event.currentTarget.setPointerCapture(event.pointerId);
    moveFromMinimap(event);
  };

  const dragMinimap = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      moveFromMinimap(event);
    }
  };

  const stopMinimapDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const toggleMapEditor = () => {
    const enabled = !mapEditorEnabled;

    cancelInertia();
    sceneRef.current?.setMapEditorEnabled(enabled);
    setMapEditorEnabled(enabled);
    setMapEditorMessage("");
  };

  const addMapElement = (texture: number) => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    sceneRef.current?.addMapElement(
      mapEditorCategory,
      texture,
      (viewport.scrollLeft + viewport.clientWidth / 2) / zoomRef.current,
      (viewport.scrollTop + viewport.clientHeight / 2) / zoomRef.current,
    );
    setMapEditorMessage("");
  };

  const applyMapLayout = () => {
    const saved = sceneRef.current?.applyMapLayout() ?? false;

    setMapEditorMessage(
      saved ? "Сохранено в этом браузере" : "Не удалось сохранить",
    );
  };

  return (
    <main
      className={`world-map-page${mapEditorEnabled ? " is-map-editing" : ""}`}
    >
      <header className="world-map-heading">
        <span>Legendary North</span>
        <h1>World Map</h1>
        <div className="world-map-switches">
          <button
            className="world-map-grid-switch"
            type="button"
            role="switch"
            aria-checked={gridVisible}
            disabled={status !== "ready"}
            onClick={toggleGrid}
          >
            <i aria-hidden="true" />
            Сетка
          </button>
          <button
            className="world-map-grid-switch"
            type="button"
            role="switch"
            aria-checked={fogVisible}
            disabled={status !== "ready"}
            onClick={() => setFogVisible((visible) => !visible)}
          >
            <i aria-hidden="true" />
            Дымка
          </button>
          <button
            className="world-map-grid-switch"
            type="button"
            role="switch"
            aria-checked={mapEditorEnabled}
            disabled={status !== "ready"}
            onClick={toggleMapEditor}
          >
            <i aria-hidden="true" />
            Редактор карты
          </button>
        </div>
      </header>

      <section
        className={`world-map-stage${fogVisible ? "" : " is-fog-hidden"}`}
        aria-label="Legendary North world map"
      >
        <div
          ref={viewportRef}
          className={`world-map-viewport${dragging ? " is-dragging" : ""}${mapEditorEnabled ? " is-editing" : ""}`}
          onPointerDown={startDrag}
          onPointerMove={dragMap}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onLostPointerCapture={stopDrag}
          onWheel={() => {
            cancelInertia();
            cancelMinimapMotion();
          }}
        >
          <div
            ref={hostRef}
            className="world-map-canvas"
            style={
              {
                width: WORLD_WIDTH * zoom,
                height: WORLD_HEIGHT * zoom,
                "--world-map-zoom": zoom,
              } as CSSProperties
            }
          />
        </div>
        {status === "ready" && (
          <button
            className="world-map-minimap"
            type="button"
            aria-label="Move viewport using minimap"
            onPointerDown={startMinimapDrag}
            onPointerMove={dragMinimap}
            onPointerUp={stopMinimapDrag}
            onPointerCancel={stopMinimapDrag}
          >
            <div
              className="world-map-minimap-view"
              aria-hidden="true"
              style={{
                left: `${mapView.left}%`,
                top: `${mapView.top}%`,
                width: `${mapView.width}%`,
                height: `${mapView.height}%`,
              }}
            />
          </button>
        )}

        <button
          className="world-map-move world-map-move-up"
          type="button"
          aria-label="Move map up"
          disabled={!mapView.canMoveUp}
          onClick={() => moveMap(0, -SCROLL_STEP)}
        />
        <button
          className="world-map-move world-map-move-right"
          type="button"
          aria-label="Move map right"
          disabled={!mapView.canMoveRight}
          onClick={() => moveMap(SCROLL_STEP, 0)}
        />
        <button
          className="world-map-move world-map-move-down"
          type="button"
          aria-label="Move map down"
          disabled={!mapView.canMoveDown}
          onClick={() => moveMap(0, SCROLL_STEP)}
        />
        <button
          className="world-map-move world-map-move-left"
          type="button"
          aria-label="Move map left"
          disabled={!mapView.canMoveLeft}
          onClick={() => moveMap(-SCROLL_STEP, 0)}
        />

        <div className="world-map-zoom" aria-label="Map zoom controls">
          <button
            type="button"
            aria-label="Zoom out"
            disabled={status !== "ready" || zoom <= MIN_ZOOM}
            onClick={() => changeZoom(-ZOOM_STEP)}
          >
            −
          </button>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={status !== "ready" || zoom >= MAX_ZOOM}
            onClick={() => changeZoom(ZOOM_STEP)}
          >
            +
          </button>
        </div>
      </section>

      {mapEditorEnabled && status === "ready" && (
        <aside className="world-map-map-editor" aria-label="Редактор карты">
          <div className="world-map-map-categories" role="tablist">
            {MAP_TOOLS.map(({ category, label }) => (
              <button
                key={category}
                className={mapEditorCategory === category ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={mapEditorCategory === category}
                onClick={() => setMapEditorCategory(category)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="world-map-map-palette">
            {MAP_TOOLS.find(
              ({ category }) => category === mapEditorCategory,
            )?.items.map((label, texture) => (
              <button
                key={label}
                type="button"
                onClick={() => addMapElement(texture)}
              >
                <span
                  className={`world-map-asset-icon is-${mapEditorCategory} is-${texture}`}
                  aria-hidden="true"
                />
                {label}
              </button>
            ))}
          </div>

          <div className="world-map-map-actions">
            <button
              type="button"
              disabled={!mapEditorState.selected}
              onClick={() =>
                sceneRef.current?.rotateSelectedElement(-ROAD_ROTATION_STEP)
              }
            >
              ↶ 15°
            </button>
            <button
              type="button"
              disabled={!mapEditorState.selected}
              onClick={() =>
                sceneRef.current?.rotateSelectedElement(ROAD_ROTATION_STEP)
              }
            >
              ↷ 15°
            </button>
            <button
              type="button"
              disabled={!mapEditorState.selected}
              onClick={() => sceneRef.current?.scaleSelectedElement(-0.05)}
            >
              Размер −
            </button>
            <button
              type="button"
              disabled={!mapEditorState.selected}
              onClick={() => sceneRef.current?.scaleSelectedElement(0.05)}
            >
              Размер +
            </button>
            <button
              className="is-danger"
              type="button"
              disabled={!mapEditorState.selected}
              onClick={() => sceneRef.current?.removeSelectedElement()}
            >
              Удалить
            </button>
          </div>

          <div className="world-map-map-save">
            <span>
              Элементов: {mapEditorState.count}
              {mapEditorState.dirty ? " · есть изменения" : ""}
            </span>
            {mapEditorMessage && <output>{mapEditorMessage}</output>}
            <button
              type="button"
              onClick={() => {
                sceneRef.current?.restoreMapLayout();
                setMapEditorMessage("Изменения отменены");
              }}
            >
              Отменить
            </button>
            <button
              type="button"
              onClick={() => {
                sceneRef.current?.resetMapLayout();
                setMapEditorMessage("Возвращён исходный вариант");
              }}
            >
              Исходный вариант
            </button>
            <button
              className="is-primary"
              type="button"
              disabled={!mapEditorState.dirty}
              onClick={applyMapLayout}
            >
              Применить
            </button>
          </div>
        </aside>
      )}

      {status === "loading" && <MapLoader />}
      {status === "error" && (
        <div className="world-map-status" role="alert">
          <p>Не удалось открыть карту.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      )}
    </main>
  );
}
