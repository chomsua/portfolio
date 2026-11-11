/**
 * 사이트 공통 정보. 실제 값이 정해지면 여기만 바꾸면 된다.
 * TODO: 실제 이메일·소셜 주소로 교체
 */
export const site = {
  name: "Joshfield",
  owner: "Josh",
  email: "hello@joshfield.com",
  /** 헤더의 "Open to internship" 배지 노출 여부 (기획서 C-01 #4, 선택) */
  showStatusBadge: true,
} as const;

/** 헤더·푸터 메뉴. 메뉴 이름은 국문 모드에서도 영문 유지 (기획서 C-01 #2) */
export const navItems = [
  { key: "work", label: "WORK", href: "/work" },
  { key: "research", label: "RESEARCH", href: "/research" },
  { key: "about", label: "ABOUT", href: "/about" },
] as const;
