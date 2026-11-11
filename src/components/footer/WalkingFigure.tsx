/**
 * 풍경 속 "나"를 뜻하는 작은 인물 (기획서 C-02 #6, 확정)
 * 지평선(오른쪽)을 향해 걷는 옆모습. 걷기 6프레임 + 손 흔들기 2프레임.
 * 관절 각도로 프레임을 계산해 그리는 임시 도형이며, 손그림이 나오면 같은 자리에 교체한다.
 */

type Pt = [number, number];
const rad = (deg: number) => (deg * Math.PI) / 180;
const from = (p: Pt, len: number, deg: number): Pt => [
  p[0] + Math.sin(rad(deg)) * len,
  p[1] + Math.cos(rad(deg)) * len,
];
const r1 = (n: number) => Math.round(n * 10) / 10;
const line = (...pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${r1(p[0])} ${r1(p[1])}`).join("");

type Pose = {
  bob: number;
  thighA: number;
  shinA: number;
  thighB: number;
  shinB: number;
  armA: [number, number];
  armB: [number, number];
};

function draw(p: Pose) {
  const hip: Pt = [0, 26 + p.bob];
  const shoulder: Pt = [1.4, 13 + p.bob];
  const head: Pt = [2.2, 7.6 + p.bob];
  const kneeA = from(hip, 8.2, p.thighA);
  const footA = from(kneeA, 8.4, p.shinA);
  const kneeB = from(hip, 8.2, p.thighB);
  const footB = from(kneeB, 8.4, p.shinB);
  const elbowA = from(shoulder, 6.2, p.armA[0]);
  const handA = from(elbowA, 6, p.armA[1]);
  const elbowB = from(shoulder, 6.2, p.armB[0]);
  const handB = from(elbowB, 6, p.armB[1]);
  return {
    back: line(hip, kneeB, footB, [footB[0] + 2.4, footB[1]]) + line(shoulder, elbowB, handB),
    front: line(hip, kneeA, footA, [footA[0] + 2.4, footA[1]]) + line(shoulder, elbowA, handA),
    torso: line(shoulder, hip),
    head,
  };
}

// 걷기 주기: 다리는 앞뒤로 ±24°, 무릎은 뒤로 접히고, 팔은 다리와 반대로 흔든다
const WALK = Array.from({ length: 6 }, (_, i) => {
  const t = (i / 6) * Math.PI * 2;
  const s = Math.sin(t);
  const bend = (phase: number) => Math.max(0, Math.sin(phase)) * 32;
  return draw({
    bob: Math.abs(Math.cos(t)) * -0.8,
    thighA: s * 24,
    shinA: s * 24 - bend(t + 0.6),
    thighB: -s * 24,
    shinB: -s * 24 - bend(t + Math.PI + 0.6),
    armA: [-s * 22, -s * 22 + 18],
    armB: [s * 22, s * 22 + 18],
  });
});

// 손 흔들기: 앞팔을 머리 위로 들고 좌우로
const WAVE = [130, 160].map((fore) =>
  draw({
    bob: 0,
    thighA: 6,
    shinA: 4,
    thighB: -4,
    shinB: -4,
    armA: [150, fore],
    armB: [-8, 6],
  }),
);

export const WALK_FRAMES = WALK.length;

export function WalkingFigure({
  frame,
  waving = false,
  className,
}: {
  frame: number;
  waving?: boolean;
  className?: string;
}) {
  const pose = waving ? WAVE[frame % WAVE.length] : WALK[((frame % WALK.length) + WALK.length) % WALK.length];
  return (
    <svg viewBox="-12 0 26 44" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d={pose.back} strokeWidth={2.4} opacity={0.75} />
        <path d={pose.torso} strokeWidth={5.4} />
        <path d={pose.front} strokeWidth={2.6} />
      </g>
      <circle cx={pose.head[0]} cy={pose.head[1]} r={3.6} fill="currentColor" />
    </svg>
  );
}
