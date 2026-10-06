import gsap from "gsap";

export type CubeMotionState = {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
};

const TAU = Math.PI * 2;

const finalRotations = [
  [0, 0],
  [0, Math.PI],
  [0, -Math.PI / 2],
  [0, Math.PI / 2],
  [-Math.PI / 2, 0],
  [Math.PI / 2, 0],
] as const;

function nextRotation(current: number, final: number, minimumTurns: number) {
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
  const startX = state.rotationX;
  const startY = state.rotationY;
  const targetX = nextRotation(startX, finalX, 0.7);
  const targetY = nextRotation(startY, finalY, 1.35);
  const timeline = gsap.timeline();

  timeline
    .to(state, {
      rotationX: startX - 0.08,
      rotationY: startY - 0.12,
      rotationZ: -0.035,
      duration: 0.34,
      ease: "sine.out",
    })
    .to(state, {
      rotationX: targetX - 0.16,
      rotationY: targetY - 0.24,
      rotationZ: 0.045,
      duration: 3.15,
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
