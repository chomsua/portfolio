/**
 * 사이트 공통 정보. 실제 값이 정해지면 여기만 바꾸면 된다.
 */
export const site = {
  name: "Joshfield",
  owner: "Josh",
  // TODO: 실제 이메일 주소로 교체
  email: "hello@joshfield.com",
  /** 헤더의 "Open to internship" 배지 노출 여부 (기획서 C-01 #4, 선택) */
  showStatusBadge: true,
  /** 푸터 하늘색을 방문자 시간대(낮/저녁/밤)에 맞출지 (기획서 C-02 #7, 선택) */
  timeOfDaySky: true,
  /** 배포할 때마다 자동으로 바뀌는 마지막 수정일 (next.config.ts에서 주입) */
  lastUpdated: process.env.NEXT_PUBLIC_BUILD_DATE ?? "",
} as const;

/** 헤더·푸터 메뉴. 메뉴 이름은 국문 모드에서도 영문 유지 (기획서 C-01 #2) */
export const navItems = [
  { key: "work", label: "WORK", href: "/work" },
  { key: "research", label: "RESEARCH", href: "/research" },
  { key: "about", label: "ABOUT", href: "/about" },
] as const;

/**
 * 외부 채널 (기획서 C-02 #2, #4)
 * TODO: 각 서비스의 실제 프로필 주소로 교체
 */
export const socials = [
  { key: "behance", label: "Behance", href: "https://www.behance.net/" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { key: "github", label: "GitHub", href: "https://github.com/" },
  { key: "readcv", label: "Read.cv", href: "https://read.cv/" },
] as const;
