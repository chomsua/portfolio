/**
 * 언어 설정 (기획서 7-6)
 * - 국문이 기본: `/`, `/work` …  (주소에 언어 표시 없음)
 * - 영문: `/en`, `/en/work` …
 * 내부적으로는 모든 페이지가 `app/[lang]/` 아래에 있고,
 * `src/proxy.ts`가 언어 표시 없는 주소를 `/ko/...`로 연결(rewrite)한다.
 */
export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/**
 * 언어와 경로를 받아 실제 주소를 만든다.
 * localizePath("ko", "/work") → "/work"
 * localizePath("en", "/work") → "/en/work"
 */
export function localizePath(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
