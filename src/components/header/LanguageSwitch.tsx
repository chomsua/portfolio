"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { locales, localizePath, type Locale } from "@/i18n/config";

/**
 * KO / EN 전환 (기획서 C-01 #3, 7-6): 같은 페이지의 다른 언어 버전으로 이동
 *
 * 현재 경로는 usePathname 대신 useSelectedLayoutSegments로 구한다.
 * 국문 주소는 proxy가 내부적으로 /ko/...로 연결하기 때문에, 브라우저 주소를 읽으면
 * 서버 렌더링 결과와 어긋날 수 있다. 라우트 세그먼트는 양쪽이 같다.
 */
export function useCurrentPath() {
  const segments = useSelectedLayoutSegments().filter(
    (s) => !s.startsWith("(") && !s.startsWith("__"),
  );
  return segments.length ? `/${segments.join("/")}` : "/";
}

export function LanguageSwitch({
  lang,
  label,
  className = "",
}: {
  lang: Locale;
  label: string;
  className?: string;
}) {
  const path = useCurrentPath();

  return (
    <nav aria-label={label} className={`text-label flex items-center ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1 opacity-40">
              /
            </span>
          )}
          <Link
            href={localizePath(l, path)}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            className={`inline-flex min-h-11 min-w-8 items-center justify-center transition-opacity ${
              l === lang ? "font-bold" : "opacity-55 hover:opacity-100"
            }`}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );
}
