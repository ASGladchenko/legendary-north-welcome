import gsap from "gsap";

export type CubeMotionState = {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
};

const TAU = Math.PI * 2;

const spinVariants = [
  {
    xTurns: 0.7,
    yTurns: 1.35,
    xKick: -0.08,
    yKick: -0.12,
    zKick: -0.035,
    zSpin: 0.045,
    duration: 3.15,
  },
  {
    xTurns: -1.15,
    yTurns: -0.75,
    xKick: 0.1,
    yKick: 0.08,
    zKick: 0.04,
    zSpin: -0.06,
    duration: 3,
  },
  {
    xTurns: 1.45,
    yTurns: -0.85,
    xKick: -0.12,
    yKick: 0.1,
    zKick: 0.055,
    zSpin: -0.035,
    duration: 3.3,
  },
  {
    xTurns: -0.8,
    yTurns: 1.55,
    xKick: 0.08,
    yKick: -0.14,
    zKick: -0.05,
    zSpin: 0.07,
    duration: 3.2,
  },
  {
    xTurns: 1.8,
    yTurns: 0.65,
    xKick: -0.14,
    yKick: -0.06,
    zKick: 0.035,
    zSpin: 0.08,
    duration: 3.4,
  },
  {
    xTurns: -1.55,
    yTurns: -1.25,
    xKick: 0.12,
    yKick: 0.14,
    zKick: -0.06,
    zSpin: -0.045,
    duration: 2.9,
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
      rotationX: targetX - variant.xKick * 2,
      rotationY: targetY - variant.yKick * 2,
      rotationZ: variant.zSpin,
      duration: variant.duration,
      ease: "power2.inOut",
    })
    .to(state, {
      rotationX: targetX,
      rotationY: targetY,
      rotationZ: 0,
      duration: 0.9,
      ease: "power3.out",
      onComplete: onReveal,
    });

  return timeline;
}
