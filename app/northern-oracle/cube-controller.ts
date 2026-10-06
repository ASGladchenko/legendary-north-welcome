import gsap from "gsap";
import {
  Application,
  Container,
  PerspectiveMesh,
  Text,
  type Texture,
  type Ticker,
} from "pixi.js";

import {
  createRevealTimeline,
  type CubeMotionState,
} from "./oracle-animation";
import type { OracleAssets } from "./oracle-assets";
import type { Prediction } from "./predictions";

type Vec3 = [number, number, number];

type FaceView = {
  container: Container;
  surface: PerspectiveMesh;
  glow: PerspectiveMesh;
  rune: PerspectiveMesh;
  glowState: { scale: number };
  runeState: { scale: number };
  vertices: [Vec3, Vec3, Vec3, Vec3];
  normal: Vec3;
};

const faceGeometry: Array<{
  vertices: FaceView["vertices"];
  normal: Vec3;
  texture: 0 | 1;
}> = [
  {
    vertices: [
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ],
    normal: [0, 0, 1],
    texture: 0,
  },
  {
    vertices: [
      [1, -1, -1],
      [-1, -1, -1],
      [-1, 1, -1],
      [1, 1, -1],
    ],
    normal: [0, 0, -1],
    texture: 0,
  },
  {
    vertices: [
      [1, -1, 1],
      [1, -1, -1],
      [1, 1, -1],
      [1, 1, 1],
    ],
    normal: [1, 0, 0],
    texture: 1,
  },
  {
    vertices: [
      [-1, -1, -1],
      [-1, -1, 1],
      [-1, 1, 1],
      [-1, 1, -1],
    ],
    normal: [-1, 0, 0],
    texture: 1,
  },
  {
    vertices: [
      [-1, -1, -1],
      [1, -1, -1],
      [1, -1, 1],
      [-1, -1, 1],
    ],
    normal: [0, -1, 0],
    texture: 0,
  },
  {
    vertices: [
      [-1, 1, 1],
      [1, 1, 1],
      [1, 1, -1],
      [-1, 1, -1],
    ],
    normal: [0, 1, 0],
    texture: 1,
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
  return new PerspectiveMesh({ texture, verticesX: 6, verticesY: 6 });
}

export class CubeController {
  readonly motion: CubeMotionState = {
    rotationX: -0.54,
    rotationY: 0.62,
    rotationZ: 0,
  };

  private readonly root = new Container({ sortableChildren: true });
  private readonly faces: FaceView[];
  private readonly title: Text;
  private readonly app: Application;
  private readonly reducedMotion: boolean;
  private readonly revealState = { blend: 0 };
  private timeline: gsap.core.Timeline | null = null;
  private selectedFace = 0;
  private elapsed = 0;
  private size = 180;
  private centerRatio = 0.57;
  private spinning = false;
  private destroyed = false;

  constructor(app: Application, assets: OracleAssets) {
    this.app = app;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.faces = faceGeometry.map((geometry, index) => {
      const container = new Container();
      const surface = mesh(assets.faces[geometry.texture]);
      const glow = mesh(assets.aurora);
      const runeTexture = assets.atlas.textures[`rune-0${index + 1}.png`];
      const rune = mesh(runeTexture);

      glow.alpha = 0.04;
      glow.blendMode = "add";
      rune.alpha = 0.88;
      rune.blendMode = "screen";
      container.addChild(surface, glow, rune);

      return {
        container,
        surface,
        glow,
        rune,
        glowState: { scale: 0.55 },
        runeState: { scale: 0.52 },
        vertices: geometry.vertices,
        normal: geometry.normal,
      };
    });
    this.title = new Text({
      text: "",
      anchor: 0.5,
      style: {
        align: "center",
        fill: "#fff0bd",
        fontFamily: "Montserrat, Arial, sans-serif",
        fontSize: 44,
        fontWeight: "900",
        letterSpacing: 1,
        lineHeight: 42,
        stroke: { color: "#03131a", width: 7 },
        wordWrap: true,
        wordWrapWidth: 260,
      },
    });
    this.title.alpha = 0;
    this.title.zIndex = 100;

    this.root.addChild(...this.faces.map((face) => face.container), this.title);
    this.app.stage.addChild(this.root);
    this.app.ticker.add(this.update);
    this.resize();
  }

  resize() {
    const { width, height } = this.app.screen;
    const mobile = width <= 600;
    const widthScale = mobile ? 0.27 : 0.28;
    const heightScale = mobile ? 0.31 : 0.2;

    this.centerRatio = 0.5;
    this.size = Math.min(width * widthScale, height * heightScale, 180);
    this.root.position.set(width / 2, height * this.centerRatio);
  }

  rotateBy(deltaX: number, deltaY: number) {
    if (this.spinning || this.destroyed) return;

    this.motion.rotationX += deltaY;
    this.motion.rotationY += deltaX;
  }

  async reveal(prediction: Prediction, faceIndex: number) {
    if (this.spinning || this.destroyed) return;

    this.commitVisibleRotation();
    this.spinning = true;
    this.selectedFace = faceIndex;
    this.timeline?.kill();
    this.title.text = prediction.title.toUpperCase();
    this.title.alpha = 0;
    this.faces.forEach((face) => {
      face.rune.alpha = 0.88;
      face.glow.alpha = 0.04;
      face.glowState.scale = 0.55;
      face.runeState.scale = 0.52;
    });

    await new Promise<void>((resolve) => {
      const reveal = () => this.revealResult(faceIndex, resolve);

      if (this.reducedMotion) {
        const targets = [
          [0, 0],
          [0, Math.PI],
          [0, -Math.PI / 2],
          [0, Math.PI / 2],
          [-Math.PI / 2, 0],
          [Math.PI / 2, 0],
        ][faceIndex];

        this.timeline = gsap
          .timeline({ onComplete: reveal })
          .to(this.motion, {
            rotationX: targets[0],
            rotationY: targets[1],
            rotationZ: 0,
            duration: 0.45,
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
    gsap.killTweensOf(this.revealState);
    this.faces.forEach((face) => {
      gsap.killTweensOf(face.glowState);
      gsap.killTweensOf(face.glow);
      gsap.killTweensOf(face.rune);
    });
    gsap.killTweensOf(this.title);
    this.app.ticker.remove(this.update);
  }

  private commitVisibleRotation() {
    const { x, y } = this.getIdleRotation();

    this.motion.rotationX += x;
    this.motion.rotationY += y;
    this.revealState.blend = 0;
  }

  private getIdleRotation() {
    const revealBlend = this.revealState.blend;

    return {
      x: revealBlend
        ? (-0.32 + Math.sin(this.elapsed * 0.00052) * 0.08) * revealBlend
        : this.spinning
          ? 0
          : Math.sin(this.elapsed * 0.00052) * 0.045,
      y: revealBlend
        ? (0.5 + Math.cos(this.elapsed * 0.00041) * 0.1) * revealBlend
        : this.spinning
          ? 0
          : Math.cos(this.elapsed * 0.00041) * 0.06,
    };
  }

  private revealResult(faceIndex: number, resolve: () => void) {
    const face = this.faces[faceIndex];

    this.timeline = gsap
      .timeline({
        onComplete: () => {
          this.spinning = false;
          resolve();
        },
      })
      .to(face.glowState, {
        scale: 0.92,
        duration: 0.36,
        ease: "power2.out",
      })
      .to(face.glow, { alpha: 0.64, duration: 0.3 }, 0)
      .to(this.title, { alpha: 1, duration: 0.42, ease: "power2.out" }, 0.25)
      .to(
        this.revealState,
        {
          blend: this.reducedMotion ? 0 : 1,
          duration: 0.9,
          ease: "sine.inOut",
        },
        0.8,
      )
      .to(
        face.glow,
        { alpha: 0, duration: 0.7, ease: "sine.inOut" },
        1,
      )
      .to(face.glowState, { scale: 0.65, duration: 0.7 }, 1)
      .to(this.title, { alpha: 0, duration: 0.5, ease: "sine.inOut" }, 1.2);
  }

  private readonly update = (ticker: Ticker) => {
    this.elapsed += ticker.deltaMS;
    const { x: idleX, y: idleY } = this.getIdleRotation();
    const floatY = Math.sin(this.elapsed * 0.00115) * this.size * 0.035;
    const rx = this.motion.rotationX + idleX;
    const ry = this.motion.rotationY + idleY;
    const rz = this.motion.rotationZ;

    this.root.y = this.app.screen.height * this.centerRatio + floatY;
    this.faces.forEach((face, faceIndex) => {
      const normal = rotate(face.normal, rx, ry, rz);
      const transformed = face.vertices.map((vertex) => rotate(vertex, rx, ry, rz));
      const points = transformed.map(([x, y, z]) => {
        const perspective = 4.2 / (4.2 - z);

        return { x: x * this.size * perspective, y: y * this.size * perspective };
      });
      const depth = transformed.reduce((sum, point) => sum + point[2], 0) / 4;

      face.container.visible = normal[2] > -0.015;
      face.container.zIndex = depth;
      const centerX = points.reduce((sum, point) => sum + point.x, 0) / 4;
      const centerY = points.reduce((sum, point) => sum + point.y, 0) / 4;
      const surfacePoints = points.map((point) => ({
        x: centerX + (point.x - centerX) * 1.008,
        y: centerY + (point.y - centerY) * 1.008,
      }));

      face.surface.setCorners(
        surfacePoints[0].x,
        surfacePoints[0].y,
        surfacePoints[1].x,
        surfacePoints[1].y,
        surfacePoints[2].x,
        surfacePoints[2].y,
        surfacePoints[3].x,
        surfacePoints[3].y,
      );

      const glowPoints = points.map((point) => ({
        x: centerX + (point.x - centerX) * face.glowState.scale,
        y: centerY + (point.y - centerY) * face.glowState.scale,
      }));
      const runePoints = points.map((point) => ({
        x: centerX + (point.x - centerX) * face.runeState.scale,
        y: centerY + (point.y - centerY) * face.runeState.scale,
      }));

      [
        [face.glow, glowPoints],
        [face.rune, runePoints],
      ].forEach(([layer, corners]) => {
        const meshLayer = layer as PerspectiveMesh;
        const meshCorners = corners as Array<{ x: number; y: number }>;

        meshLayer.setCorners(
          meshCorners[0].x,
          meshCorners[0].y,
          meshCorners[1].x,
          meshCorners[1].y,
          meshCorners[2].x,
          meshCorners[2].y,
          meshCorners[3].x,
          meshCorners[3].y,
        );
      });

      if (faceIndex === this.selectedFace) {
        const edgeWidth = Math.hypot(
          points[1].x - points[0].x,
          points[1].y - points[0].y,
        );

        this.title.position.set(centerX, centerY);
        this.title.rotation = Math.atan2(
          points[1].y - points[0].y,
          points[1].x - points[0].x,
        );
        this.title.scale.set(Math.min(1, edgeWidth / 330));
        this.title.visible = face.container.visible;
      }
    });

  };
}
