"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { WALK_FRAMES, WalkingFigure } from "./WalkingFigure";

/**
 * C-02 #6 풍경 일러스트: 먼 산 / 언덕 / 앞 풀 3개 레이어 + 걸어가는 작은 인물
 *
 * - Horizon parallax: 푸터가 화면에 들어오는 동안 레이어가 서로 다른 속도로 올라온다 (0.2 / 0.5 / 0.9)
 * - 인물은 스크롤에 맞춰 왼쪽에서 오른쪽으로 몇 걸음 걷고, 스크롤이 멈추면 멈춰 선다
 * - 동작 줄이기 설정에서는 모두 정지 이미지
 *
 * 풍경 SVG는 scripts/generate-horizon.mjs 가 만든다. 손그림이 나오면 public/horizon/ 의 파일만 교체.
 */
const LAYERS = [
  { src: "/horizon/far.svg", speed: 0.2 },
  { src: "/horizon/mid.svg", speed: 0.5 },
  { src: "/horizon/front.svg", speed: 0.9 },
] as const;

/** 레이어가 올라오는 최대 거리(px). 모바일에서는 시차를 약하게 (기획서 7-2) */
const RISE = { mobile: 40, desktop: 120 };

export function HorizonLandscape({ waving = false }: { waving?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [rise, setRise] = useState(RISE.desktop);
  const [frame, setFrame] = useState(0);
  const stride = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(width < 48rem)");
    const update = () => setRise(mq.matches ? RISE.mobile : RISE.desktop);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // 0: 풍경 윗부분이 화면 아래에 막 닿음 → 1: 풍경 바닥이 화면 바닥에 닿음
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  const yFar = useTransform(scrollYProgress, [0, 1], [rise * LAYERS[0].speed, 0]);
  const yMid = useTransform(scrollYProgress, [0, 1], [rise * LAYERS[1].speed, 0]);
  const yFront = useTransform(scrollYProgress, [0, 1], [rise * LAYERS[2].speed, 0]);
  const ys = [yFar, yMid, yFront];

  // 인물: 화면 폭의 34% → 58% 지점까지 걷는다
  const figureX = useTransform(scrollYProgress, [0, 1], ["34%", "58%"]);

  // 스크롤한 거리만큼 걸음 프레임을 넘긴다 (멈추면 그 자세로 멈춤)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const next = Math.floor(v * 28);
    if (next !== stride.current) {
      stride.current = next;
      setFrame((f) => (f + 1) % WALK_FRAMES);
    }
  });

  // 손 흔들기: 메시지를 보내면 잠깐 두 프레임을 오간다
  const [waveFrame, setWaveFrame] = useState(0);
  useEffect(() => {
    if (!waving || reduce) return;
    const id = setInterval(() => setWaveFrame((f) => f + 1), 260);
    return () => clearInterval(id);
  }, [waving, reduce]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-[clamp(17rem,38vw,34rem)] overflow-hidden [container-type:inline-size]"
    >
      {LAYERS.map((layer, i) => (
        <motion.img
          key={layer.src}
          src={layer.src}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { y: ys[i] }}
          className="absolute inset-x-0 bottom-0 h-full w-full select-none object-cover object-bottom"
        />
      ))}

      {/* 인물은 언덕(mid)과 앞 풀(front) 사이, 앞 들판 위에 선다 */}
      <motion.div
        className="absolute bottom-[max(17%,6.4cqw)] -translate-x-1/2 text-cobalt"
        style={{ left: reduce ? "46%" : figureX, y: reduce ? undefined : yFront }}
      >
        <WalkingFigure
          frame={waving ? waveFrame : frame}
          waving={waving}
          className="h-[clamp(2.5rem,4.6cqw,4.75rem)] w-auto"
        />
      </motion.div>
    </div>
  );
}
