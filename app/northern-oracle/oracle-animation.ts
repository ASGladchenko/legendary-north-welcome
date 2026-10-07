import gsap from "gsap";

export type CubeMotionState = {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
};

const TAU = Math.PI * 2;
const SPIN_SPEED = TAU * 0.52;

const spinVariants = [
  {
    route: "x-first",
    xTurns: -1.55,
    yTurns: 0.18,
    xKick: 0.18,
    yKick: -0.04,
    zKick: -0.035,
    zSpin: 0.045,
  },
  {
    route: "x-first",
    xTurns: 1.55,
    yTurns: -0.18,
    xKick: -0.18,
    yKick: 0.04,
    zKick: 0.04,
    zSpin: -0.06,
  },
  {
    route: "y-first",
    xTurns: 0.18,
    yTurns: -1.55,
    xKick: -0.04,
    yKick: 0.18,
    zKick: 0.055,
    zSpin: -0.035,
  },
  {
    route: "y-first",
    xTurns: -0.18,
    yTurns: 1.55,
    xKick: 0.04,
    yKick: -0.18,
    zKick: -0.05,
    zSpin: 0.07,
  },
  {
    route: "arc",
    xTurns: -1.15,
    yTurns: -1.15,
    xKick: 0.14,
    yKick: 0.14,
    zKick: 0.035,
    zSpin: 0.08,
  },
  {
    route: "spiral",
    xTurns: 1.1,
    yTurns: -0.75,
    xKick: -0.12,
    yKick: 0.08,
    zKick: -0.12,
    zSpin: TAU,
  },
] as const;

const finalRotations = [
  [0, 0],
  [0, Math.PI],
  [0, -Math.PI / 2],
  [0, Math.PI / 2],
  [-Math.PI / 2, 0],
  [Math.PI / 2, 0],
] as const;

function nextRotation(
  current: number,
  final: number,
  minimumTurns: number,
): number {
  if (minimumTurns < 0) {
    return -nextRotation(-current, -final, -minimumTurns);
  }

  const nearestTarget = final + TAU * Math.ceil((current - final) / TAU);
  const extraTurns = Math.ceil(
    minimumTurns - (nearestTarget - current) / TAU,
  );

  return nearestTarget + TAU * Math.max(0, extraTurns);
}

export function createRevealTimeline(
  state: CubeMotionState,
  faceIndex: number,
  onReveal: () => void,
) {
  const [finalX, finalY] = finalRotations[faceIndex];
  const variant = spinVariants[Math.floor(Math.random() * spinVariants.length)];
  const startX = state.rotationX;
  const startY = state.rotationY;
  const targetX = nextRotation(startX, finalX, variant.xTurns);
  const targetY = nextRotation(startY, finalY, variant.yTurns);
  const spinStartX = startX + variant.xKick;
  const spinStartY = startY + variant.yKick;
  const deltaX = targetX - spinStartX;
  const deltaY = targetY - spinStartY;
  let waypointX = spinStartX + deltaX * 0.5;
  let waypointY = spinStartY + deltaY * 0.5;

  if (variant.route === "x-first") {
    waypointX = targetX;
    waypointY = spinStartY + deltaY * 0.22;
  } else if (variant.route === "y-first") {
    waypointX = spinStartX + deltaX * 0.22;
    waypointY = targetY;
  } else if (variant.route === "arc") {
    waypointX -= Math.sign(deltaY) * 0.42;
    waypointY += Math.sign(deltaX) * 0.42;
  }

  const waypointZ =
    variant.route === "spiral" ? variant.zSpin * 0.5 : variant.zSpin;
  const targetZ =
    variant.route === "spiral" ? variant.zSpin : variant.zSpin * 0.35;
  const firstDuration =
    Math.hypot(
      waypointX - spinStartX,
      waypointY - spinStartY,
      waypointZ - variant.zKick,
    ) / SPIN_SPEED;
  const secondDuration =
    Math.hypot(
      targetX - waypointX,
      targetY - waypointY,
      targetZ - waypointZ,
    ) / SPIN_SPEED;
  const timeline = gsap.timeline();

  timeline
    .to(state, {
      rotationX: startX + variant.xKick,
      rotationY: startY + variant.yKick,
      rotationZ: variant.zKick,
      duration: 0.34,
      ease: "sine.out",
    })
    .to(state, {
      rotationX: waypointX,
      rotationY: waypointY,
      rotationZ: waypointZ,
      duration: firstDuration,
      ease: "power1.in",
    })
    .to(state, {
      rotationX: targetX,
      rotationY: targetY,
      rotationZ: targetZ,
      duration: secondDuration,
      ease: "power1.out",
    });

  if (variant.route === "spiral") {
    timeline.set(state, { rotationZ: 0 }).call(onReveal);
  } else {
    timeline.to(state, {
      rotationZ: 0,
      duration: 0.4,
      ease: "sine.out",
      onComplete: onReveal,
    });
  }

  return timeline;
}
