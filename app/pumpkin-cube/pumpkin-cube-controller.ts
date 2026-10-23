import gsap from "gsap";
import {
  Application,
  BlurFilter,
  Container,
  PerspectiveMesh,
  Texture,
  type Ticker,
} from "pixi.js";

import {
  createRevealTimeline,
  type CubeMotionState,
} from "../northern-oracle/oracle-animation";
import type { PumpkinCubeAssets } from "./pumpkin-cube-assets";
import {
  CubeFaceEnergy,
  FACE_ENERGY_SETTINGS,
  type CubeFaceId,
} from "./cube-face-energy";

type Vec3 = [number, number, number];

type FaceView = {
  container: Container;
  surface: PerspectiveMesh;
  borderShadow: PerspectiveMesh;
  borderHighlight: PerspectiveMesh;
  border: PerspectiveMesh;
  symbolGlow: PerspectiveMesh;
  symbol: PerspectiveMesh;
  symbolBlur: BlurFilter;
  symbolState: {
    alpha: number;
    blur: number;
    glowScale: number;
    rotation: number;
    scale: number;
  };
  energy: CubeFaceEnergy;
  vertices: [Vec3, Vec3, Vec3, Vec3];
  normal: Vec3;
};

const faceIds: CubeFaceId[] = [
  "pumpkin",
  "ghost",
  "witchHat",
  "moon",
  "bat",
  "spider",
];

const faceGeometry: Array<Pick<FaceView, "vertices" | "normal">> = [
  {
    vertices: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]],
    normal: [0, 0, 1],
  },
  {
    vertices: [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]],
    normal: [0, 0, -1],
  },
  {
    vertices: [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]],
    normal: [1, 0, 0],
  },
  {
    vertices: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
    normal: [-1, 0, 0],
  },
  {
    vertices: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
    normal: [0, -1, 0],
  },
  {
    vertices: [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]],
    normal: [0, 1, 0],
  },
];

function rotate([x, y, z]: Vec3, rx: number, ry: number, rz: number): Vec3 {
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;

  const x2 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;

  return [x2 * cosZ - y1 * sinZ, x2 * sinZ + y1 * cosZ, z2];
}

function mesh(texture: Texture) {
  return new PerspectiveMesh({ texture, verticesX: 5, verticesY: 5 });
}

function scaledCorners(
  points: Array<{ x: number; y: number }>,
  scale: number,
  offsetX = 0,
  offsetY = 0,
) {
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / 4;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / 4;

  return points.map((point) => ({
    x: centerX + (point.x - centerX) * scale + offsetX,
    y: centerY + (point.y - centerY) * scale + offsetY,
  }));
}

function rotatedCorners(
  points: Array<{ x: number; y: number }>,
  angle: number,
) {
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / 4;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / 4;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return points.map((point) => {
    const x = point.x - centerX;
    const y = point.y - centerY;

    return {
      x: centerX + x * cos - y * sin,
      y: centerY + x * sin + y * cos,
    };
  });
}

function setCorners(
  target: PerspectiveMesh,
  points: Array<{ x: number; y: number }>,
) {
  target.setCorners(
    points[0].x,
    points[0].y,
    points[1].x,
    points[1].y,
    points[2].x,
    points[2].y,
    points[3].x,
    points[3].y,
  );
}

function interpolateFacePoint(
  vertices: [Vec3, Vec3, Vec3, Vec3],
  u: number,
  v: number,
): Vec3 {
  return [0, 1, 2].map((axis) => {
    const top = vertices[0][axis] * (1 - u) + vertices[1][axis] * u;
    const bottom = vertices[3][axis] * (1 - u) + vertices[2][axis] * u;

    return top * (1 - v) + bottom * v;
  }) as Vec3;
}

function projectPoint(
  vertex: Vec3,
  rx: number,
  ry: number,
  rz: number,
  size: number,
) {
  const [x, y, z] = rotate(vertex, rx, ry, rz);
  const perspective = 4.6 / (4.6 - z);

  return { x: x * size * perspective, y: y * size * perspective };
}

function projectFaceRegion(
  vertices: [Vec3, Vec3, Vec3, Vec3],
  rx: number,
  ry: number,
  rz: number,
  size: number,
  centerU = 0.5,
  centerV = 0.5,
  radiusU = 0.285,
  radiusV = radiusU,
) {
  return Array.from({ length: 36 }, (_, index) => {
    const angle = (index / 36) * Math.PI * 2;

    return projectPoint(
      interpolateFacePoint(
        vertices,
        centerU + Math.cos(angle) * radiusU,
        centerV + Math.sin(angle) * radiusV,
      ),
      rx,
      ry,
      rz,
      size,
    );
  });
}

export class PumpkinCubeController {
  private readonly app: Application;
  private readonly root = new Container({ sortableChildren: true });
  private readonly faces: FaceView[];
  private readonly reducedMotion: boolean;
  private readonly motion: CubeMotionState = {
    rotationX: -0.34,
    rotationY: 0.58,
    rotationZ: 0,
  };
  private timeline: gsap.core.Timeline | null = null;
  private elapsed = 0;
  private size = 160;
  private spinning = false;
  private destroyed = false;

  constructor(app: Application, assets: PumpkinCubeAssets) {
    this.app = app;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.faces = faceGeometry.map((geometry, index) => {
      const container = new Container();
      const faceId = faceIds[index];
      const energy = new CubeFaceEnergy(assets.energy, {
        faceId,
        ...FACE_ENERGY_SETTINGS[faceId],
        quality: app.screen.width <= 600 ? "low" : "high",
        paused: this.reducedMotion,
      });
      const surface = mesh(assets.frame);
      const borderShadow = mesh(assets.border);
      const borderHighlight = mesh(assets.border);
      const border = mesh(assets.border);
      const symbolGlow = mesh(assets.symbols[index]);
      const symbol = mesh(assets.symbols[index]);
      const symbolBlur = new BlurFilter({ strength: 0, quality: 2 });

      surface.tint = 0x747982;
      borderShadow.tint = 0x16070a;
      borderShadow.alpha = 0.92;
      borderHighlight.tint = 0xffc27d;
      borderHighlight.alpha = 0.34;
      symbolGlow.tint = FACE_ENERGY_SETTINGS[faceId].color;
      symbolGlow.alpha = 0.28;
      symbolGlow.blendMode = "add";
      symbol.filters = [symbolBlur];
      container.addChild(
        energy.underlay,
        surface,
        energy.recesses,
        energy.container,
        symbolGlow,
        symbol,
        borderShadow,
        borderHighlight,
        border,
      );

      return {
        container,
        surface,
        borderShadow,
        borderHighlight,
        border,
        symbolGlow,
        symbol,
        symbolBlur,
        symbolState: {
          alpha: 1,
          blur: 0,
          glowScale: 0.4,
          rotation: 0,
          scale: 0.36,
        },
        energy,
        ...geometry,
      };
    });

    this.root.addChild(...this.faces.map((face) => face.container));
    this.app.stage.addChild(this.root);
    this.app.ticker.add(this.update);
    this.resize();
  }

  resize() {
    const { width, height } = this.app.screen;
    const isCompact = width <= 600;

    this.size = Math.min(
      width * (isCompact ? 0.2 : 0.24),
      height * (isCompact ? 0.24 : 0.27),
      isCompact ? 150 : 190,
    );
    this.root.position.set(width / 2, height * 0.51);
  }

  rotateBy(deltaX: number, deltaY: number) {
    if (this.destroyed || this.spinning) return;

    this.motion.rotationX = Math.max(
      -1.3,
      Math.min(1.3, this.motion.rotationX + deltaY),
    );
    this.motion.rotationY += deltaX;
  }

  spin(onReveal: () => void = () => undefined) {
    if (this.destroyed || this.spinning) return Promise.resolve();

    this.spinning = true;
    const faceIndex = Math.floor(Math.random() * this.faces.length);
    this.faces.forEach((face) => {
      face.symbolState.alpha = 1;
      face.symbolState.blur = 0;
      face.symbolState.glowScale = 0.4;
      face.symbolState.rotation = 0;
      face.symbolState.scale = 0.36;
      face.symbolGlow.alpha = 0.28;
    });

    return new Promise<void>((resolve) => {
      const reveal = () => this.revealSymbol(faceIndex, onReveal, resolve);

      if (this.reducedMotion) {
        this.timeline = gsap
          .timeline({ onComplete: reveal })
          .to(this.motion, {
            rotationY: this.motion.rotationY + Math.PI / 2,
            duration: 0.18,
            ease: "power2.out",
          });
        return;
      }

      this.timeline = createRevealTimeline(this.motion, faceIndex, reveal);
    });
  }

  destroy() {
    this.destroyed = true;
    this.timeline?.kill();
    gsap.killTweensOf(this.motion);
    this.faces.forEach((face) => {
      gsap.killTweensOf(face.symbolState);
      gsap.killTweensOf(face.symbolGlow);
    });
    this.app.ticker.remove(this.update);
  }

  private revealSymbol(
    faceIndex: number,
    onReveal: () => void,
    resolve: () => void,
  ) {
    const face = this.faces[faceIndex];
    const duration = this.reducedMotion ? 0.18 : 0.85;
    const tau = Math.PI * 2;
    const nearestAngle = (current: number, target: number) =>
      target + tau * Math.round((current - target) / tau);

    this.timeline = gsap
      .timeline({
        onComplete: () => {
          this.spinning = false;
          resolve();
        },
      })
      .to(face.symbolState, {
        alpha: 0,
        blur: 14,
        glowScale: 0.82,
        rotation: this.reducedMotion ? Math.PI / 2 : tau * 2,
        scale: 0.54,
        duration,
        ease: "power2.inOut",
      })
      .to(face.symbolGlow, { alpha: 0.92, duration: duration * 0.7 }, 0)
      .call(onReveal)
      .to(this.motion, {
        rotationX: nearestAngle(this.motion.rotationX, -0.34),
        rotationY: nearestAngle(this.motion.rotationY, 0.58),
        rotationZ: 0,
        duration: this.reducedMotion ? 0.18 : 0.8,
        ease: "power2.inOut",
      })
      .to(
        face.symbolState,
        {
          alpha: 1,
          blur: 0,
          glowScale: 0.4,
          rotation: 0,
          scale: 0.36,
          duration: 0.55,
          ease: "sine.out",
        },
        "<",
      )
      .to(face.symbolGlow, { alpha: 0.28, duration: 0.45 }, "<");
  }

  private readonly update = (ticker: Ticker) => {
    this.elapsed += ticker.deltaMS;
    const idleX = this.reducedMotion
      ? 0
      : Math.sin(this.elapsed * 0.00055) * 0.025;
    const idleY = this.reducedMotion
      ? 0
      : Math.cos(this.elapsed * 0.00043) * 0.035;
    const floatY = this.reducedMotion
      ? 0
      : Math.sin(this.elapsed * 0.0011) * this.size * 0.045;
    const rx = this.motion.rotationX + idleX;
    const ry = this.motion.rotationY + idleY;
    const rz = this.motion.rotationZ;

    this.root.y = this.app.screen.height * 0.51 + floatY;
    this.faces.forEach((face) => {
      const normal = rotate(face.normal, rx, ry, rz);
      const transformed = face.vertices.map((vertex) =>
        rotate(vertex, rx, ry, rz),
      );
      const points = face.vertices.map((vertex) =>
        projectPoint(vertex, rx, ry, rz, this.size),
      );
      const depth = transformed.reduce((sum, point) => sum + point[2], 0) / 4;

      face.container.visible = normal[2] > -0.01;
      face.container.zIndex = depth;
      // Every face must use the exact projected cube vertices. Expanding each
      // quad around its own center makes adjacent corners diverge when rotated.
      setCorners(face.surface, points);
      if (face.container.visible) {
        face.energy.update(
          points,
          projectFaceRegion(face.vertices, rx, ry, rz, this.size),
          [
            [0.17, 0.17],
            [0.83, 0.17],
            [0.17, 0.83],
            [0.83, 0.83],
          ].map(([u, v]) =>
            projectFaceRegion(
              face.vertices,
              rx,
              ry,
              rz,
              this.size,
              u,
              v,
              0.105,
              0.125,
            ),
          ),
          this.elapsed / 1000,
        );
      }
      setCorners(face.borderShadow, scaledCorners(points, 0.865, 4, 6));
      setCorners(face.borderHighlight, scaledCorners(points, 0.86, -1.5, -2));
      setCorners(face.border, scaledCorners(points, 0.86));
      const symbolCorners = rotatedCorners(
        scaledCorners(points, face.symbolState.scale),
        face.symbolState.rotation,
      );
      const symbolGlowCorners = rotatedCorners(
        scaledCorners(points, face.symbolState.glowScale),
        face.symbolState.rotation,
      );

      face.symbol.alpha = face.symbolState.alpha;
      face.symbolBlur.strength = face.symbolState.blur;
      setCorners(face.symbolGlow, symbolGlowCorners);
      setCorners(face.symbol, symbolCorners);
    });
  };
}
