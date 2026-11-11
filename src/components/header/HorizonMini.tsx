/**
 * 모바일 메뉴 하단의 작은 지평선 (기획서 C-01 모바일).
 * 푸터 풍경(C-02)과 같은 세계관을 미리 보여준다. 최종 일러스트가 나오면 교체.
 */
export function HorizonMini({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 390 120"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      {/* 먼 산 */}
      <path
        d="M0 70 C40 52 70 58 110 46 C150 34 180 50 220 42 C270 32 310 48 350 40 C370 36 382 38 390 40 V120 H0Z"
        className="fill-sky"
      />
      {/* 언덕 */}
      <path
        d="M0 88 C60 72 120 84 180 76 C240 68 300 82 390 72 V120 H0Z"
        className="fill-cobalt"
      />
      {/* 앞 풀 */}
      <path d="M0 104 C80 96 160 106 240 100 C300 96 350 102 390 98 V120 H0Z" className="fill-field" />
      {/* 걸어가는 작은 인물 (임시 도형) */}
      <g className="fill-ink" transform="translate(232 84)">
        <circle cx="0" cy="-10" r="2.2" />
        <path d="M-1.6 -7.5 h3.2 l1 7 h-1.4 l-0.6 -4 -0.8 4 h-1.4z" />
        <path d="M-0.8 -0.6 l-2.4 6.6 h1.4 l2 -5z M0.6 -0.6 l2.2 6.6 h-1.4 l-1.8 -5z" />
      </g>
    </svg>
  );
}
