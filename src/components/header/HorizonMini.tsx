/**
 * 모바일 메뉴 하단의 작은 지평선 (기획서 C-01 모바일).
 * 푸터(C-02)와 같은 판화풍 풍경 레이어를 그대로 써서 세계관을 잇는다.
 */
const LAYERS = ["/horizon/far.svg", "/horizon/mid.svg", "/horizon/front.svg"];

export function HorizonMini({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative overflow-hidden bg-cobalt ${className}`}>
      {LAYERS.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element -- 장식용 SVG, 최적화 불필요
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
      ))}
    </div>
  );
}
