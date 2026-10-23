import { Container, Graphics, PerspectiveMesh, Texture } from "pixi.js";

export const FACE_COLORS = {
  pumpkin: 0xff6a00,
  ghost: 0xa347ff,
  witchHat: 0x19ff58,
  moon: 0x00bfff,
  bat: 0xff253a,
  spider: 0xffbf32,
} as const;

export type CubeFaceId = keyof typeof FACE_COLORS;

export type CubeFaceEnergyOptions = {
  faceId: CubeFaceId;
  color: number | string;
  intensity?: number;
  speed?: number;
  quality?: "low" | "high";
  paused?: boolean;
};

export const FACE_ENERGY_SETTINGS = {
  pumpkin: { color: FACE_COLORS.pumpkin, intensity: 0.68, speed: 1 },
  ghost: { color: FACE_COLORS.ghost, intensity: 0.62, speed: 0.92 },
  witchHat: { color: FACE_COLORS.witchHat, intensity: 0.6, speed: 0.96 },
  moon: { color: FACE_COLORS.moon, intensity: 0.66, speed: 0.88 },
  bat: { color: FACE_COLORS.bat, intensity: 0.64, speed: 1.04 },
  spider: { color: FACE_COLORS.spider, intensity: 0.6, speed: 0.9 },
} satisfies Record<
  CubeFaceId,
  Pick<CubeFaceEnergyOptions, "color" | "intensity" | "speed">
>;

export type CubeFaceEnergyAssets = {
  faceTexture: Texture;
  smoke: Texture;
  energyStreams: Texture;
  vortex: Texture;
  runeRing: Texture;
  sparks: Texture;
  coreGlow: Texture;
};

type Point = { x: number; y: number };
type EnergyLayer = {
  mesh: PerspectiveMesh;
  baseUvs: Float32Array;
  baseAlpha: number;
  maxAlpha: number;
};

function createMesh(
  texture: Texture,
  color: number | string,
  blend: PerspectiveMesh["blendMode"] = "add",
) {
  const mesh = new PerspectiveMesh({ texture, verticesX: 5, verticesY: 5 });

  mesh.tint = color;
  mesh.blendMode = blend;
  mesh.eventMode = "none";
  return mesh;
}

function setCorners(mesh: PerspectiveMesh, points: Point[]) {
  mesh.setCorners(
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

function scaledCorners(points: Point[], scale: number) {
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / 4;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / 4;

  return points.map((point) => ({
    x: centerX + (point.x - centerX) * scale,
    y: centerY + (point.y - centerY) * scale,
  }));
}

function transformUvs(
  layer: EnergyLayer,
  angle: number,
  scale: number,
  offsetX = 0,
  offsetY = 0,
) {
  const uvs = layer.mesh.geometry.uvs;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (let index = 0; index < uvs.length; index += 2) {
    const x = (layer.baseUvs[index] - 0.5) * scale;
    const y = (layer.baseUvs[index + 1] - 0.5) * scale;

    uvs[index] = 0.5 + x * cos - y * sin + offsetX;
    uvs[index + 1] = 0.5 + x * sin + y * cos + offsetY;
  }

  layer.mesh.geometry.getAttribute("aUV").buffer.update();
}

export class CubeFaceEnergy {
  readonly underlay = new Container();
  readonly recesses = new Container();
  readonly container = new Container();
  private readonly effects = new Container();
  private readonly mask = new Graphics();
  private readonly recessEffects = new Container();
  private readonly recessMask = new Graphics();
  private readonly background: PerspectiveMesh;
  private readonly underlayLayers: {
    smoke: EnergyLayer;
    flicker: EnergyLayer;
  };
  private readonly recessLayers: {
    faceTint: EnergyLayer;
    smoke: EnergyLayer;
    glow: EnergyLayer;
  };
  private readonly layers: {
    faceTint: EnergyLayer;
    smoke: EnergyLayer;
    coreGlow: EnergyLayer;
    energyStreams: EnergyLayer;
    vortex: EnergyLayer;
    runeRing?: EnergyLayer;
    sparks?: EnergyLayer;
  };
  private readonly intensity: number;
  private readonly speed: number;
  private readonly phase: number;
  private readonly paused: boolean;

  constructor(assets: CubeFaceEnergyAssets, options: CubeFaceEnergyOptions) {
    const intensity = Math.max(0, Math.min(1, options.intensity ?? 0.65));
    const layer = (
      texture: Texture,
      baseAlpha: number,
      maxAlpha: number,
      blend: PerspectiveMesh["blendMode"] = "add",
    ): EnergyLayer => {
      const mesh = createMesh(texture, options.color, blend);

      mesh.alpha = Math.min(maxAlpha, baseAlpha * (intensity / 0.65));
      return {
        mesh,
        baseUvs: new Float32Array(mesh.geometry.uvs),
        baseAlpha,
        maxAlpha,
      };
    };

    this.intensity = intensity;
    this.speed = Math.max(0, options.speed ?? 1);
    this.paused = options.paused ?? false;
    this.phase = Object.keys(FACE_COLORS).indexOf(options.faceId) * 0.73;
    this.underlay.eventMode = "none";
    this.recesses.eventMode = "none";
    this.recessEffects.eventMode = "none";
    this.container.eventMode = "none";
    this.effects.eventMode = "none";
    assets.smoke.source.style.addressMode = "repeat";
    assets.energyStreams.source.style.addressMode = "repeat";
    assets.sparks.source.style.addressMode = "repeat";

    this.background = createMesh(Texture.WHITE, 0x090a12, "normal");
    this.background.alpha = 0.18;
    this.underlayLayers = {
      smoke: layer(assets.smoke, 0.13, 0.2, "normal"),
      flicker: layer(assets.energyStreams, 0.08, 0.16),
    };
    this.recessLayers = {
      faceTint: layer(assets.faceTexture, 0.36, 0.5, "normal"),
      smoke: layer(assets.smoke, 0.2, 0.3, "normal"),
      glow: layer(assets.energyStreams, 0.14, 0.24),
    };
    this.layers = {
      faceTint: layer(assets.faceTexture, 0.52, 0.68, "normal"),
      smoke: layer(assets.smoke, 0.26, 0.35, "normal"),
      coreGlow: layer(assets.coreGlow, 0.38, 0.58),
      energyStreams: layer(assets.energyStreams, 0.4, 0.6),
      vortex: layer(assets.vortex, 0.58, 0.82),
      ...(options.quality === "low"
        ? {}
        : {
            runeRing: layer(assets.runeRing, 0.18, 0.3),
            sparks: layer(assets.sparks, 0.42, 0.65),
          }),
    };

    this.effects.addChild(
      this.background,
      this.layers.faceTint.mesh,
      this.layers.smoke.mesh,
      this.layers.coreGlow.mesh,
      this.layers.energyStreams.mesh,
      this.layers.vortex.mesh,
    );
    if (this.layers.runeRing) this.effects.addChild(this.layers.runeRing.mesh);
    if (this.layers.sparks) this.effects.addChild(this.layers.sparks.mesh);

    this.underlay.addChild(
      this.underlayLayers.smoke.mesh,
      this.underlayLayers.flicker.mesh,
    );
    this.recessEffects.addChild(
      this.recessLayers.faceTint.mesh,
      this.recessLayers.smoke.mesh,
      this.recessLayers.glow.mesh,
    );
    this.recesses.addChild(this.recessEffects, this.recessMask);
    this.recessEffects.mask = this.recessMask;
    this.container.addChild(this.effects, this.mask);
    this.effects.mask = this.mask;
  }

  update(
    points: Point[],
    maskPoints: Point[],
    recessMaskPoints: Point[][],
    elapsedSeconds: number,
  ) {
    const energyCorners = scaledCorners(points, 0.64);
    const time = (this.paused ? 0 : elapsedSeconds * this.speed) + this.phase;
    const pulse = this.paused ? 0 : Math.sin(time * 2.1);
    const flicker = this.paused
      ? 0
      : Math.sin(time * 3.7) * 0.55 + Math.sin(time * 6.1) * 0.45;

    setCorners(this.underlayLayers.smoke.mesh, points);
    setCorners(this.underlayLayers.flicker.mesh, points);
    setCorners(this.recessLayers.smoke.mesh, points);
    setCorners(this.recessLayers.glow.mesh, points);
    setCorners(this.recessLayers.faceTint.mesh, points);
    setCorners(this.background, energyCorners);
    Object.values(this.layers).forEach((layer) => {
      if (layer) setCorners(layer.mesh, energyCorners);
    });

    this.mask
      .clear()
      .poly(maskPoints.flatMap(({ x, y }) => [x, y]))
      .fill(0xffffff);
    this.recessMask.clear();
    recessMaskPoints.forEach((region) => {
      this.recessMask
        .poly(region.flatMap(({ x, y }) => [x, y]))
        .fill(0xffffff);
    });

    transformUvs(this.layers.smoke, 0, 1.08, time * 0.006, time * 0.012);
    transformUvs(
      this.underlayLayers.smoke,
      0,
      1.12,
      -time * 0.004,
      time * 0.007,
    );
    transformUvs(
      this.underlayLayers.flicker,
      0,
      1.1,
      time * 0.009,
      -time * 0.005,
    );
    transformUvs(
      this.recessLayers.smoke,
      0,
      1.14,
      time * 0.005,
      -time * 0.009,
    );
    transformUvs(
      this.recessLayers.glow,
      0,
      1.08,
      -time * 0.012,
      time * 0.006,
    );
    transformUvs(
      this.layers.coreGlow,
      0,
      1 + pulse * 0.025,
    );
    transformUvs(
      this.layers.energyStreams,
      0,
      1.06,
      -time * 0.018,
      time * 0.009,
    );
    transformUvs(this.layers.vortex, time * ((Math.PI * 2) / 17), 1.02);

    if (this.layers.runeRing) {
      transformUvs(
        this.layers.runeRing,
        -time * ((Math.PI * 2) / 32),
        1,
      );
    }
    if (this.layers.sparks) {
      transformUvs(
        this.layers.sparks,
        0,
        1.08,
        time * 0.008,
        -time * 0.014,
      );
    }

    this.layers.coreGlow.mesh.alpha = Math.min(
      this.layers.coreGlow.maxAlpha,
      this.layers.coreGlow.baseAlpha *
        (this.intensity / 0.65) *
        (1 + pulse * 0.08),
    );
    this.layers.faceTint.mesh.alpha = Math.min(
      this.layers.faceTint.maxAlpha,
      this.layers.faceTint.baseAlpha *
        (this.intensity / 0.65) *
        (1 + pulse * 0.055),
    );
    this.recessLayers.faceTint.mesh.alpha = Math.min(
      this.recessLayers.faceTint.maxAlpha,
      this.recessLayers.faceTint.baseAlpha *
        (this.intensity / 0.65) *
        (1 + flicker * 0.08),
    );
    this.underlayLayers.flicker.mesh.alpha = Math.min(
      this.underlayLayers.flicker.maxAlpha,
      this.underlayLayers.flicker.baseAlpha *
        (this.intensity / 0.65) *
        (1 + flicker * 0.34),
    );
    this.recessLayers.glow.mesh.alpha = Math.min(
      this.recessLayers.glow.maxAlpha,
      this.recessLayers.glow.baseAlpha *
        (this.intensity / 0.65) *
        (1 + flicker * 0.28),
    );
  }
}
