import { Instrument_Serif, Inter, JetBrains_Mono, Noto_Serif_KR } from "next/font/google";

/**
 * 서체 3종 조합 (기획서 4-2)
 * - 세리프(제목·디스플레이): Instrument Serif + 국문 Noto Serif KR
 * - 산세리프(본문): Inter + 국문 Pretendard (layout에서 CSS로 불러옴)
 * - 모노(라벨·메타): JetBrains Mono
 *
 * next/font는 폰트 파일을 빌드 시 내려받아 이 사이트에서 직접 제공하므로
 * 방문자 브라우저가 Google 서버에 따로 접속하지 않는다.
 */
export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

// 한글 폰트는 용량이 커서 미리 불러오지(preload) 않고, 필요한 글자 조각만 받는다.
// TODO: 기획서 7-6의 마루 부리로 바꾸려면 next/font/local로 교체
export const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "600"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-kr",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const fontVariables = [
  instrumentSerif.variable,
  notoSerifKr.variable,
  inter.variable,
  jetbrainsMono.variable,
].join(" ");
