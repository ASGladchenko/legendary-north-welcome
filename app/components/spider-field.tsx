"use client";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Spider } from "./spider";
import styles from "./spider-field.module.css";

export type SpiderFieldProps = {
  children?: ReactNode;
  className?: string;
  seed?: string | number;
  desktopCount?: number;
  mobileCount?: number;
  minSize?: number;
  maxSize?: number;
  paused?: boolean;
  toggleLabel?: string;
};

type SpiderSpec = {
  cycleMs: number;
  mirrored: boolean;
  size: number;
};

type Point = { x: number; y: number };
type RouteStart = { point: Point; angle: number };
type Explode = (index: number) => void;
type Gesture = {
  pointerId: number;
  index: number;
  startX: number;
  startY: number;
  dragging: boolean;
};
type BeginDrag = (index: number, clientX: number, clientY: number) => void;
type MoveDrag = (index: number, clientX: number, clientY: number) => void;
type ReleaseDrag = (index: number, resume: boolean) => void;

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SPIDERS_ENABLED_KEY = "spiders-enabled";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function randomFrom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createPointOnEdge(
  edge: number,
  width: number,
  height: number,
  distance: number,
  random: () => number,
): Point {
  if (edge === 0) return { x: random() * width, y: -distance };
  if (edge === 1) return { x: width + distance, y: random() * height };
  if (edge === 2) return { x: random() * width, y: height + distance };
  return { x: -distance, y: random() * height };
}

function angleBetween(from: Point, to: Point) {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI - 90;
}

function pointOnCurve(points: [Point, Point, Point, Point], progress: number) {
  const inverse = 1 - progress;
  return {
    x:
      inverse ** 3 * points[0].x +
      3 * inverse ** 2 * progress * points[1].x +
      3 * inverse * progress ** 2 * points[2].x +
      progress ** 3 * points[3].x,
    y:
      inverse ** 3 * points[0].y +
      3 * inverse ** 2 * progress * points[1].y +
      3 * inverse * progress ** 2 * points[2].y +
      progress ** 3 * points[3].y,
  };
}

function angleOnCurve(points: [Point, Point, Point, Point], progress: number) {
  const inverse = 1 - progress;
  const direction = {
    x:
      3 * inverse ** 2 * (points[1].x - points[0].x) +
      6 * inverse * progress * (points[2].x - points[1].x) +
      3 * progress ** 2 * (points[3].x - points[2].x),
    y:
      3 * inverse ** 2 * (points[1].y - points[0].y) +
      6 * inverse * progress * (points[2].y - points[1].y) +
      3 * progress ** 2 * (points[3].y - points[2].y),
  };
  return angleBetween({ x: 0, y: 0 }, direction);
}

function directionFromAngle(angle: number) {
  const radians = ((angle + 90) * Math.PI) / 180;
  return { x: Math.cos(radians), y: Math.sin(radians) };
}

function transformAt(point: Point, angle: number, size: number, mirrored: boolean) {
  return `translate3d(${point.x - size / 2}px, ${point.y - size / 2}px, 0) rotate(${angle}deg) scaleX(${mirrored ? -1 : 1})`;
}

export function SpiderField({
  children,
  className,
  seed = "spider-field",
  desktopCount = 4,
  mobileCount = 2,
  minSize = 42,
  maxSize = 112,
  paused = false,
  toggleLabel = "Spiders",
}: SpiderFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const moversRef = useRef(new Map<number, HTMLDivElement>());
  const explodeRef = useRef<Explode>(() => {});
  const beginDragRef = useRef<BeginDrag>(() => {});
  const moveDragRef = useRef<MoveDrag>(() => {});
  const releaseDragRef = useRef<ReleaseDrag>(() => {});
  const gestureRef = useRef<Gesture | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fieldActive, setFieldActive] = useState(false);
  const [spidersEnabled, setSpidersEnabled] = useState(true);

  useEffect(() => {
    const mobileMedia = window.matchMedia(MOBILE_QUERY);
    const motionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => {
      setIsMobile(mobileMedia.matches);
      setReducedMotion(motionMedia.matches);
      try {
        setSpidersEnabled(
          window.localStorage.getItem(SPIDERS_ENABLED_KEY) !== "false",
        );
      } catch {
        // localStorage can be unavailable in privacy mode.
      }
    };
    update();
    mobileMedia.addEventListener("change", update);
    motionMedia.addEventListener("change", update);
    return () => {
      mobileMedia.removeEventListener("change", update);
      motionMedia.removeEventListener("change", update);
    };
  }, []);

  const count = clamp(
    Math.round(isMobile ? mobileCount : desktopCount),
    0,
    12,
  );
  const smallest = clamp(Math.min(minSize, maxSize), 16, 120);
  const largest = clamp(Math.max(minSize, maxSize), smallest, 120);

  const specs = useMemo<SpiderSpec[]>(() => {
    return Array.from({ length: count }, (_, index) => {
      const random = randomFrom(hash(`${seed}:appearance:${index}`));
      return {
        cycleMs: Math.round(900 + random() * 450),
        mirrored: random() > 0.5,
        size: Math.round(smallest + random() * (largest - smallest)),
      };
    });
  }, [count, largest, seed, smallest]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || paused || reducedMotion || !spidersEnabled || count === 0)
      return;
    const movers = moversRef.current;

    const animations = new Map<number, Animation>();
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let disposed = false;
    let visible = document.visibilityState === "visible";
    let intersecting = false;
    let generation = 0;
    let dragged: {
      index: number;
      offsetX: number;
      offsetY: number;
      point: Point;
      angle: number;
    } | null = null;
    const routeBySpider = Array.from({ length: count }, () => 0);

    const isActive = () => visible && intersecting;

    const syncPlayback = () => {
      setFieldActive(isActive());
      animations.forEach((animation) => {
        if (isActive()) animation.play();
        else animation.pause();
      });
    };

    const schedule = (
      index: number,
      pass: number,
      route: number,
      delay: number,
      start?: RouteStart,
    ) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        run(index, pass, route, start);
      }, delay);
      timers.add(timer);
    };

    const run = (
      index: number,
      pass: number,
      route: number,
      start?: RouteStart,
    ) => {
      if (disposed || pass !== generation) return;
      const mover = movers.get(index);
      const spec = specs[index];
      if (!mover || !spec) return;
      mover.classList.remove(styles.exploding);
      mover.style.opacity = "";
      routeBySpider[index] = route;

      const { width, height } = host.getBoundingClientRect();
      if (width <= 0 || height <= 0) {
        schedule(index, pass, route, 250, start);
        return;
      }

      const random = randomFrom(hash(`${seed}:route:${index}:${pass}:${route}`));
      const startEdge = Math.floor(random() * 4);
      const endEdge = start
        ? Math.floor(random() * 4)
        : (startEdge + 1 + Math.floor(random() * 3)) % 4;
      const outside = spec.size * 0.75;
      const margin = Math.min(spec.size * 0.35, width / 4, height / 4);
      const startDirection = start && directionFromAngle(start.angle);
      const turnRadius = Math.min(
        Math.max(spec.size * 1.4, 72),
        Math.max(72, Math.min(width, height) * 0.32),
      );
      const controls: [Point, Point, Point, Point] = [
        start?.point ??
          createPointOnEdge(startEdge, width, height, outside, random),
        start && startDirection
          ? {
              x: start.point.x + startDirection.x * turnRadius,
              y: start.point.y + startDirection.y * turnRadius,
            }
          : {
              x: margin + random() * Math.max(0, width - margin * 2),
              y: margin + random() * Math.max(0, height - margin * 2),
            },
        {
          x: margin + random() * Math.max(0, width - margin * 2),
          y: margin + random() * Math.max(0, height - margin * 2),
        },
        createPointOnEdge(endEdge, width, height, outside, random),
      ];
      const points = Array.from({ length: 25 }, (_, pointIndex) =>
        pointOnCurve(controls, pointIndex / 24),
      );
      const angles = points.map((_, pointIndex) =>
        angleOnCurve(controls, pointIndex / (points.length - 1)),
      );
      for (let index = 1; index < angles.length; index += 1) {
        while (angles[index] - angles[index - 1] > 180) angles[index] -= 360;
        while (angles[index] - angles[index - 1] < -180) angles[index] += 360;
      }
      const keyframes = points.map((point, pointIndex) => ({
        offset: pointIndex / (points.length - 1),
        transform: transformAt(
          point,
          angles[pointIndex],
          spec.size,
          spec.mirrored,
        ),
      }));
      const animation = mover.animate(keyframes, {
        duration: 18_000 + random() * 16_000,
        easing: "linear",
        fill: "both",
      });
      animations.set(index, animation);
      if (!isActive()) animation.pause();
      mover.style.opacity = "1";

      animation.finished
        .then(() => {
          if (animations.get(index) !== animation) return;
          mover.style.transform = keyframes[keyframes.length - 1].transform;
          animation.cancel();
          animations.delete(index);
          if (!disposed && pass === generation) {
            schedule(index, pass, route + 1, 700 + random() * 2_800);
          }
        })
        .catch(() => undefined);
    };

    const explode = (index: number) => {
      if (!isActive()) return;
      const mover = movers.get(index);
      if (!mover || mover.classList.contains(styles.exploding)) return;

      const computedTransform = getComputedStyle(mover).transform;
      const currentTransform =
        computedTransform === "none"
          ? mover.style.transform || "translate3d(0, 0, 0)"
          : computedTransform;
      animations.get(index)?.cancel();
      mover.style.transform = currentTransform;
      mover.classList.add(styles.exploding);

      const animation = mover.animate(
        [
          {
            opacity: 1,
            filter: "brightness(1)",
            transform: `${currentTransform} scale(1)`,
          },
          {
            offset: 0.28,
            opacity: 1,
            filter: "brightness(4) saturate(1.8)",
            transform: `${currentTransform} scale(0.78)`,
          },
          {
            opacity: 0,
            filter: "brightness(2) blur(5px)",
            transform: `${currentTransform} scale(1.8) rotate(18deg)`,
          },
        ],
        { duration: 560, easing: "ease-out", fill: "both" },
      );
      animations.set(index, animation);
      const pass = generation;
      const nextRoute = routeBySpider[index] + 1;

      animation.finished
        .then(() => {
          if (animations.get(index) !== animation) return;
          mover.style.opacity = "0";
          animation.cancel();
          animations.delete(index);
          mover.classList.remove(styles.exploding);
          if (!disposed && pass === generation) {
            schedule(index, pass, nextRoute, 900);
          }
        })
        .catch(() => undefined);
    };

    explodeRef.current = explode;

    const beginDrag = (index: number, clientX: number, clientY: number) => {
      if (!isActive()) return;
      const mover = movers.get(index);
      if (!mover || mover.classList.contains(styles.exploding)) return;

      const hostRect = host.getBoundingClientRect();
      const moverRect = mover.getBoundingClientRect();
      const point = {
        x: moverRect.left + moverRect.width / 2 - hostRect.left,
        y: moverRect.top + moverRect.height / 2 - hostRect.top,
      };
      const computedTransform = getComputedStyle(mover).transform;
      animations.get(index)?.cancel();
      animations.delete(index);
      mover.style.transform =
        computedTransform === "none"
          ? mover.style.transform
          : computedTransform;
      dragged = {
        index,
        offsetX: clientX - hostRect.left - point.x,
        offsetY: clientY - hostRect.top - point.y,
        point,
        angle: 0,
      };
    };

    const moveDrag = (index: number, clientX: number, clientY: number) => {
      if (!dragged || dragged.index !== index) return;
      const mover = movers.get(index);
      const spec = specs[index];
      if (!mover || !spec) return;

      const hostRect = host.getBoundingClientRect();
      const inset = Math.min(
        spec.size * 0.25,
        hostRect.width / 2,
        hostRect.height / 2,
      );
      const point = {
        x: clamp(
          clientX - hostRect.left - dragged.offsetX,
          inset,
          hostRect.width - inset,
        ),
        y: clamp(
          clientY - hostRect.top - dragged.offsetY,
          inset,
          hostRect.height - inset,
        ),
      };
      if (Math.hypot(point.x - dragged.point.x, point.y - dragged.point.y) > 1) {
        dragged.angle = angleBetween(dragged.point, point);
      }
      dragged.point = point;
      mover.classList.add(styles.dragging);
      mover.style.transform = transformAt(
        point,
        dragged.angle,
        spec.size,
        spec.mirrored,
      );
    };

    const releaseDrag = (index: number, resume: boolean) => {
      if (!dragged || dragged.index !== index) return;
      const mover = movers.get(index);
      const point = dragged.point;
      const angle = dragged.angle;
      dragged = null;
      mover?.classList.remove(styles.dragging);
      if (resume && !disposed) {
        schedule(index, generation, routeBySpider[index] + 1, 180, {
          point,
          angle,
        });
      }
    };

    beginDragRef.current = beginDrag;
    moveDragRef.current = moveDrag;
    releaseDragRef.current = releaseDrag;

    let touchGesture: Gesture | null = null;

    const findTouchedSpider = (clientX: number, clientY: number) =>
      [...movers.entries()].reverse().find(([, mover]) => {
        const rect = mover.getBoundingClientRect();
        return (
          !mover.classList.contains(styles.exploding) &&
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        );
      });

    const onTouchStart = (event: TouchEvent) => {
      if (
        touchGesture ||
        event.touches.length !== 1 ||
        (event.target as Element).closest(`.${styles.toggle}`)
      )
        return;

      const touch = event.touches[0];
      const hit = findTouchedSpider(touch.clientX, touch.clientY);
      if (!hit) return;

      event.preventDefault();
      touchGesture = {
        pointerId: touch.identifier,
        index: hit[0],
        startX: touch.clientX,
        startY: touch.clientY,
        dragging: false,
      };
      beginDrag(hit[0], touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touchGesture) return;
      const touch = [...event.touches].find(
        (candidate) => candidate.identifier === touchGesture?.pointerId,
      );
      if (!touch) return;

      event.preventDefault();
      if (
        !touchGesture.dragging &&
        Math.hypot(
          touch.clientX - touchGesture.startX,
          touch.clientY - touchGesture.startY,
        ) >= 7
      ) {
        touchGesture.dragging = true;
      }
      if (touchGesture.dragging) {
        moveDrag(touchGesture.index, touch.clientX, touch.clientY);
      }
    };

    const finishTouch = (event: TouchEvent, cancelled = false) => {
      if (!touchGesture) return;
      const touch = [...event.changedTouches].find(
        (candidate) => candidate.identifier === touchGesture?.pointerId,
      );
      if (!touch) return;

      event.preventDefault();
      const gesture = touchGesture;
      touchGesture = null;
      if (gesture.dragging || cancelled) {
        releaseDrag(gesture.index, true);
      } else {
        releaseDrag(gesture.index, false);
        explode(gesture.index);
      }
    };
    const onTouchCancel = (event: TouchEvent) => finishTouch(event, true);

    host.addEventListener("touchstart", onTouchStart, { passive: false });
    host.addEventListener("touchmove", onTouchMove, { passive: false });
    host.addEventListener("touchend", finishTouch, { passive: false });
    host.addEventListener("touchcancel", onTouchCancel, { passive: false });

    const restart = () => {
      generation += 1;
      dragged = null;
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      movers.forEach((mover) => {
        mover.classList.remove(styles.exploding, styles.dragging);
        mover.style.opacity = "";
      });
      timers.forEach(clearTimeout);
      timers.clear();
      for (let index = 0; index < count; index += 1) {
        const random = randomFrom(hash(`${seed}:delay:${index}:${generation}`));
        schedule(index, generation, 0, random() * 2_400);
      }
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      syncPlayback();
    });
    intersectionObserver.observe(host);

    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible";
      syncPlayback();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(restart, 120);
    });
    resizeObserver.observe(host);
    restart();

    return () => {
      disposed = true;
      explodeRef.current = () => {};
      beginDragRef.current = () => {};
      moveDragRef.current = () => {};
      releaseDragRef.current = () => {};
      gestureRef.current = null;
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      host.removeEventListener("touchstart", onTouchStart);
      host.removeEventListener("touchmove", onTouchMove);
      host.removeEventListener("touchend", finishTouch);
      host.removeEventListener("touchcancel", onTouchCancel);
      clearTimeout(resizeTimer);
      timers.forEach(clearTimeout);
      animations.forEach((animation) => animation.cancel());
      movers.forEach((mover) => {
        mover.classList.remove(styles.exploding, styles.dragging);
        mover.style.opacity = "";
      });
      timers.clear();
      animations.clear();
    };
  }, [count, paused, reducedMotion, seed, specs, spidersEnabled]);

  const frontCount = count === 0 ? 0 : 1;
  const frontStart = count - frontCount;
  const backSpiders = specs.slice(0, frontStart);
  const frontSpiders = specs.slice(frontStart);
  const spidersPaused =
    paused || reducedMotion || !spidersEnabled || !fieldActive;

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (
      !spidersEnabled ||
      event.pointerType === "touch" ||
      !event.isPrimary ||
      gestureRef.current ||
      event.currentTarget.classList.contains(styles.exploding)
    )
      return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    gestureRef.current = {
      pointerId: event.pointerId,
      index,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    };
    beginDragRef.current(index, event.clientX, event.clientY);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (
      !gesture.dragging &&
      Math.hypot(
        event.clientX - gesture.startX,
        event.clientY - gesture.startY,
      ) >= 7
    ) {
      gesture.dragging = true;
    }
    if (gesture.dragging) {
      moveDragRef.current(gesture.index, event.clientX, event.clientY);
    }
  };

  const finishPointerGesture = (
    event: ReactPointerEvent<HTMLDivElement>,
    cancelled = false,
  ) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    const mover = moversRef.current.get(gesture.index);
    if (mover?.hasPointerCapture(event.pointerId)) {
      mover.releasePointerCapture(event.pointerId);
    }
    gestureRef.current = null;

    if (gesture.dragging || cancelled) {
      releaseDragRef.current(gesture.index, true);
      return;
    }

    releaseDragRef.current(gesture.index, false);
    explodeRef.current(gesture.index);
  };

  const renderSpider = (spec: SpiderSpec, index: number) => (
    <div
      className={styles.mover}
      key={index}
      onPointerDown={(event) => handlePointerDown(event, index)}
      ref={(node) => {
        if (node) moversRef.current.set(index, node);
        else moversRef.current.delete(index);
      }}
    >
      <Spider cycleMs={spec.cycleMs} paused={spidersPaused} size={spec.size} />
    </div>
  );

  const toggleSpiders = () => {
    const next = !spidersEnabled;
    setSpidersEnabled(next);
    try {
      window.localStorage.setItem(SPIDERS_ENABLED_KEY, String(next));
    } catch {
      // localStorage can be unavailable in privacy mode.
    }
  };

  return (
    <div
      className={[styles.field, className].filter(Boolean).join(" ")}
      onPointerCancelCapture={(event) => finishPointerGesture(event, true)}
      onPointerMoveCapture={handlePointerMove}
      onPointerUpCapture={finishPointerGesture}
      ref={hostRef}
    >
      <div aria-hidden="true" className={`${styles.layer} ${styles.back}`}>
        {backSpiders.map(renderSpider)}
      </div>
      <div className={styles.content}>{children}</div>
      <div aria-hidden="true" className={`${styles.layer} ${styles.front}`}>
        {frontSpiders.map((spec, index) => renderSpider(spec, frontStart + index))}
      </div>
      <button
        aria-label={toggleLabel}
        aria-checked={spidersEnabled}
        className={styles.toggle}
        onClick={toggleSpiders}
        role="switch"
        type="button"
      >
        <span aria-hidden="true" className={styles.toggleIcon}>
          <Spider
            cycleMs={1_000}
            paused={!spidersEnabled || reducedMotion}
            size={40}
          />
          <span className={styles.toggleSlash} />
        </span>
      </button>
    </div>
  );
}
