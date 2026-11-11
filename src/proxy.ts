import { NextResponse, type NextRequest } from "next/server";

/**
 * 언어별 주소 처리 (기획서 7-6)
 * - `/en`, `/en/...`  → 그대로 둔다 (영문)
 * - `/ko`, `/ko/...`  → 언어 표시 없는 주소로 이동(redirect). 국문 주소는 하나만 쓰기 위해
 * - 그 밖의 주소       → 내부적으로 `/ko/...` 페이지를 보여준다(rewrite). 주소창은 바뀌지 않음
 *
 * Proxy 파일은 다른 모듈과 분리돼 실행되는 것이 권장되므로 언어 목록을 여기 직접 적는다.
 * 언어를 추가하면 src/i18n/config.ts 와 함께 수정할 것.
 */
const DEFAULT_LOCALE = "ko";
const OTHER_LOCALES = ["en"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isOther = OTHER_LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (isOther) return;

  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // _next 내부 파일, API, 확장자가 있는 정적 파일(이미지·폰트·favicon 등)은 건너뛴다
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
