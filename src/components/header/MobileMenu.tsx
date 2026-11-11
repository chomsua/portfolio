"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { navItems, site } from "@/lib/site";
import { HorizonMini } from "./HorizonMini";
import { LanguageSwitch } from "./LanguageSwitch";
import { StatusBadge } from "./StatusBadge";

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  lang: Locale;
  section: string;
  dict: Dictionary["header"];
  onContact: (event?: React.MouseEvent) => void;
  onCopyEmail: () => void;
};

/**
 * 모바일 전체 화면 메뉴 (기획서 C-01 모바일)
 * 메뉴 하단에 푸터와 같은 지평선 일러스트를 작게 보여 세계관을 유지한다.
 */
export function MobileMenu({ id, open, onClose, lang, section, dict, onContact, onCopyEmail }: Props) {
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id={id}
      inert={!open}
      className={`fixed inset-0 z-40 flex flex-col bg-paper pt-16 transition-[opacity,visibility] duration-300 ease-out-soft md:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <nav aria-label={dict.nav} className="container-site flex-1 overflow-y-auto pt-8">
        <ul className="flex flex-col gap-1">
          {navItems.map((item, i) => {
            const active = section === item.key;
            return (
              <li key={item.key}>
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  href={localizePath(lang, item.href)}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className="flex min-h-14 items-center gap-3 font-serif text-[2.5rem] leading-tight"
                >
                  <span className="text-label w-6 opacity-50">0{i + 1}</span>
                  {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                  {active && <span aria-hidden="true" className="size-2 rounded-full bg-dusk" />}
                </Link>
              </li>
            );
          })}
          <li>
            <a
              href="#footer"
              onClick={onContact}
              className="flex min-h-14 items-center gap-3 font-serif text-[2.5rem] leading-tight"
            >
              <span className="text-label w-6 opacity-50">0{navItems.length + 1}</span>
              Contact
            </a>
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <LanguageSwitch lang={lang} label={dict.languageLabel} />
          {site.showStatusBadge && (
            <StatusBadge label={dict.status} actionLabel={dict.statusAction} onClick={onCopyEmail} />
          )}
        </div>
      </nav>

      <HorizonMini className="block h-28 w-full shrink-0" />
    </div>
  );
}
