"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { navItems, site } from "@/lib/site";
import { useCopyEmail } from "@/lib/use-copy-email";
import { LanguageSwitch, useCurrentPath } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { StatusBadge } from "./StatusBadge";

type Props = {
  lang: Locale;
  dict: Dictionary["header"];
  toast: Dictionary["toast"];
};

/** 맨 위에서 이만큼(px) 내려오기 전에는 투명하게 둔다 */
const TOP_THRESHOLD = 24;
/** 이만큼 이상 움직였을 때만 숨김/표시를 바꿔 떨림을 막는다 */
const DELTA = 6;

/**
 * C-01 공통 헤더 (GNB)
 * - 히어로 위(맨 위)에서는 투명, 스크롤하면 paper 배경 + 반투명 흐림
 * - 아래로 내리면 숨고, 위로 올리면 나타남
 * - 현재 페이지 메뉴 옆에 dusk색 점 하나
 * - CONTACT는 별도 페이지 없이 푸터(#footer)로 부드럽게 스크롤
 */
export function Header({ lang, dict, toast }: Props) {
  const path = useCurrentPath();
  const section = path.split("/")[1] ?? "";
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const copyEmail = useCopyEmail(toast);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setAtTop(y < TOP_THRESHOLD);
        if (Math.abs(y - lastY.current) >= DELTA) {
          setHidden(y > lastY.current && y > 120);
          lastY.current = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // 페이지를 옮기면 모바일 메뉴를 닫는다 (렌더 중 이전 값과 비교하는 React 권장 방식)
  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setMenuOpen(false);
  }

  const goToContact = useCallback((event?: React.MouseEvent) => {
    const footer = document.getElementById("footer");
    if (!footer) return;
    event?.preventDefault();
    setMenuOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    footer.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    footer.focus({ preventScroll: true });
  }, []);

  const solid = !atTop || menuOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable text-label fixed left-4 top-3 z-[60] rounded bg-ink px-3 py-2 text-paper"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-300 ease-out-soft ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${
          solid
            ? "bg-paper/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          <Logo href={localizePath(lang, "/")} label={dict.home} />

          {/* 데스크톱·태블릿: 메뉴 4개 노출 */}
          <div className="hidden items-center gap-8 md:flex">
            <nav aria-label={dict.nav}>
              <ul className="text-label flex items-center gap-7">
                {navItems.map((item) => {
                  const active = section === item.key;
                  return (
                    <li key={item.key}>
                      <NavLink href={localizePath(lang, item.href)} active={active}>
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
                <li>
                  <NavLink href="#footer" onClick={goToContact}>
                    CONTACT
                  </NavLink>
                </li>
              </ul>
            </nav>

            <LanguageSwitch lang={lang} label={dict.languageLabel} />

            {site.showStatusBadge && (
              <StatusBadge label={dict.status} actionLabel={dict.statusAction} onClick={copyEmail} />
            )}
          </div>

          {/* 모바일: MENU 텍스트 버튼 → 전체 화면 메뉴 */}
          <button
            type="button"
            className="text-label -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center px-2 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? dict.close : dict.menu}
          </button>
        </div>
      </header>

      <MobileMenu
        id="mobile-menu"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        lang={lang}
        section={section}
        dict={dict}
        onContact={goToContact}
        onCopyEmail={copyEmail}
      />
    </>
  );
}

function NavLink({
  href,
  active = false,
  onClick,
  children,
}: {
  href: string;
  active?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  const className =
    "relative inline-flex min-h-11 items-center transition-colors hover:text-cobalt";
  const dot = active && (
    <span
      aria-hidden="true"
      className="absolute -left-3 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-dusk"
    />
  );

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={className}>
      {dot}
      {children}
    </Link>
  );
}
