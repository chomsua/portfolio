"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { navItems, site, socials } from "@/lib/site";
import { useCopyEmail } from "@/lib/use-copy-email";
import { EDGE_PATH, EDGE_VIEWBOX } from "./edge-path";
import { HorizonLandscape } from "./HorizonLandscape";
import { SayHelloForm } from "./SayHelloForm";
import { SocialIcon } from "./SocialIcon";

type Props = {
  lang: Locale;
  dict: Dictionary["footer"];
  toast: Dictionary["toast"];
};

type Sky = "day" | "evening" | "night";

/** C-02 #7 시간대 하늘: 낮 cobalt / 저녁 dusk 그라데이션(R5) / 밤 ink. 페이지 로드 시 1회 계산 */
function skyFor(hour: number): Sky {
  if (hour >= 17 && hour < 20) return "evening";
  if (hour >= 20 || hour < 6) return "night";
  return "day";
}
const SKY_CLASS: Record<Sky, { bg: string; edge: string }> = {
  day: { bg: "bg-cobalt", edge: "text-cobalt" },
  evening: {
    bg: "bg-[linear-gradient(to_bottom,var(--color-cobalt)_0%,var(--color-cobalt)_55%,#6a5f8f_78%,var(--color-dusk)_100%)]",
    edge: "text-cobalt",
  },
  night: { bg: "bg-ink", edge: "text-ink" },
};

/**
 * C-02 Horizon Footer — 이 사이트의 간판 컴포넌트
 * R1(코발트 + 판화 사막)을 뼈대로, R2의 유기적 경계선, R3의 그레인, R4의 모노 라벨을 섞는다.
 * "위는 정보, 아래는 풍경". 방문자가 끝까지 내려왔을 때 만나는 엔딩 장면이다.
 */
export function Footer({ lang, dict, toast }: Props) {
  const reduce = useReducedMotion();
  const copyEmail = useCopyEmail(toast);
  const [sky, setSky] = useState<Sky>("day");
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    if (!site.timeOfDaySky) return;
    // 방문자 브라우저의 지역 시간 기준. 서버 렌더링 결과는 항상 "낮"이고, 화면에 붙은 뒤 바꾼다
    const id = requestAnimationFrame(() => setSky(skyFor(new Date().getHours())));
    return () => cancelAnimationFrame(id);
  }, []);

  const onSent = () => {
    setWaving(true);
    setTimeout(() => setWaving(false), 2600);
  };

  return (
    <footer
      id="footer"
      tabIndex={-1}
      data-sky={sky}
      className={`relative mt-24 text-paper outline-none md:mt-32 ${SKY_CLASS[sky].bg}`}
    >
      {/* C-02 #1 경계선: 본문과 푸터 사이를 멀리 있는 산의 능선으로. 보일 때 살짝 올라온다 */}
      <motion.svg
        viewBox={EDGE_VIEWBOX}
        preserveAspectRatio="none"
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-full block h-10 w-full md:h-16 ${SKY_CLASS[sky].edge}`}
        initial={reduce ? false : { y: 14 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <path d={EDGE_PATH} fill="currentColor" />
      </motion.svg>

      <div className="container-site grid gap-x-8 gap-y-12 pt-14 pb-12 md:grid-cols-8 md:pt-20 lg:grid-cols-12">
        {/* C-02 #2 브랜드 열 */}
        <div className="md:col-span-8 lg:col-span-4">
          <Link href={localizePath(lang, "/")} className="inline-flex items-center gap-2 font-serif text-[2rem] leading-none">
            <svg viewBox="0 0 12 12" className="size-4" aria-hidden="true">
              <path d="M6 0 C6.4 3.6 8.4 5.6 12 6 C8.4 6.4 6.4 8.4 6 12 C5.6 8.4 3.6 6.4 0 6 C3.6 5.6 5.6 3.6 6 0Z" fill="currentColor" />
            </svg>
            Joshfield
          </Link>
          <p className="mt-5 max-w-[22rem] font-serif text-xl leading-snug italic text-paper/90">{dict.tagline}</p>

          <ul className="text-caption mt-7 space-y-1.5 text-paper/85">
            <li>
              <button
                type="button"
                onClick={copyEmail}
                title={dict.copyEmail}
                className="group inline-flex min-h-11 items-center gap-2.5 underline-offset-4 hover:underline"
              >
                <MailIcon />
                {site.email}
                <span className="text-label text-paper/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  COPY
                </span>
              </button>
            </li>
            <li className="inline-flex items-center gap-2.5">
              <PinIcon />
              {dict.location}
            </li>
          </ul>

          <ul className="mt-6 flex gap-1">
            {socials
              .filter((s) => s.key !== "readcv")
              .map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (${dict.newTab})`}
                    className="inline-flex size-11 items-center justify-center rounded-full text-paper/85 transition-colors hover:bg-paper/10 hover:text-paper"
                  >
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
          </ul>
        </div>

        {/* C-02 #3 NAVIGATE / #4 ELSEWHERE: 모바일에서는 2열로 접는다 */}
        <div className="grid grid-cols-2 gap-8 md:col-span-4 lg:col-span-4 lg:pl-8">
          <FooterColumn title={dict.navigate}>
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={localizePath(lang, item.href)} className={linkClass}>
                  {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                </Link>
              </li>
            ))}
          </FooterColumn>
          <FooterColumn title={dict.elsewhere}>
            {socials
              .filter((s) => s.key !== "github")
              .map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label}
                    <span aria-hidden="true" className="ml-1 text-paper/60">
                      ↗
                    </span>
                    <span className="sr-only">({dict.newTab})</span>
                  </a>
                </li>
              ))}
          </FooterColumn>
        </div>

        {/* C-02 #5 SAY HELLO: 뉴스레터 자리를 한 줄 메시지로 */}
        <div className="md:col-span-4 lg:col-span-4">
          <h2 className="text-label text-paper/70">{dict.sayHello}</h2>
          <span aria-hidden="true" className="mt-3 block h-px w-8 bg-paper/50" />
          <p className="mt-4 font-serif text-lg italic text-paper/90">{dict.formIntro}</p>
          <SayHelloForm dict={dict} onSent={onSent} />
        </div>
      </div>

      {/* C-02 #8 하단 라인: 가는 구분선(R3) 위 모노 라벨(R4). 풀 위에 겹치지 않도록 풍경 위에 둔다 */}
      <div className="container-site">
        <div className="flex items-center justify-between gap-4 border-t border-paper/25 py-4">
          <p className="text-label text-[0.6875rem] leading-relaxed text-paper/75">
            © 2026 {site.owner} · {dict.designedBy} {site.owner}
            {site.lastUpdated && (
              <>
                <span className="hidden md:inline"> · </span>
                <br className="md:hidden" />
                {dict.lastUpdated} {site.lastUpdated}
              </>
            )}
          </p>
          <a
            href="#main"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
              document.getElementById("main")?.focus({ preventScroll: true });
            }}
            aria-label={dict.backToTop}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors hover:bg-paper/10"
          >
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>

      {/* C-02 #6 풍경. 엔딩 문구는 산 위 하늘에 띄운다 */}
      <div className="relative">
        <HorizonLandscape waving={waving} />
        <p className="pointer-events-none absolute inset-x-0 top-[8%] px-5 text-center font-serif text-[clamp(1.5rem,1rem+1.6vw,2.25rem)] italic text-paper">
          {dict.edge}
        </p>
      </div>
    </footer>
  );
}

const linkClass = "inline-flex min-h-11 items-center text-[0.9375rem] text-paper/85 transition-colors hover:text-paper hover:underline underline-offset-4";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-label text-paper/70">{title}</h2>
      <span aria-hidden="true" className="mt-3 block h-px w-8 bg-paper/50" />
      <ul className="mt-3">{children}</ul>
    </nav>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
      <path d="m3 5.5 7 5.5 7-5.5" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M10 17.5s5.5-5 5.5-9.2a5.5 5.5 0 1 0-11 0c0 4.2 5.5 9.2 5.5 9.2Z" />
      <circle cx="10" cy="8.3" r="1.8" />
    </svg>
  );
}
