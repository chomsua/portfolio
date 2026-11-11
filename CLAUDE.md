@AGENTS.md

# Joshfield — 프로젝트 안내 (Claude Code가 작업마다 먼저 읽는 파일)

웹·모바일 UX/UI 디자이너 Josh의 포트폴리오. 전체 화면 기획서는 `docs/spec.md`.
컨셉: **"넓은 들판 위의 작은 사람, 흐림에서 선명함으로"** — 스크롤은 들판을 걷는 여정, 푸터는 그 끝의 지평선.

## 기술 스택

- Next.js 16 (App Router, `cacheComponents` 켜짐) + TypeScript + React 19
- Tailwind CSS v4 — 토큰은 `src/app/globals.css`의 `@theme`에 있음 (tailwind.config 파일 없음)
- 모션: `motion` 패키지(Framer Motion 후속, `import { motion } from "motion/react"`)
- 다국어: 외부 라이브러리 없이 Next.js 내장 방식
  - 모든 페이지는 `src/app/[lang]/` 아래. `src/proxy.ts`가 `/work` → 내부 `/ko/work`로 연결
  - 국문 `/…`, 영문 `/en/…`. `/ko/…`로 들어오면 언어 표시 없는 주소로 308 이동
  - 문구는 `src/i18n/dictionaries/{ko,en}.json`, 링크는 반드시 `localizePath(lang, path)`로 만든다
  - 클라이언트에서 현재 경로가 필요하면 `usePathname` 대신 `useCurrentPath()`(LanguageSwitch.tsx) 사용 — rewrite 때문에 hydration 불일치가 날 수 있음
- 배포: Vercel

## 디자인 토큰 (기획서 4장)

| 토큰 | 값 | 쓰임 |
|---|---|---|
| paper | #F4EFE4 | 기본 배경 |
| ink | #172350 | 본문 글자, 아이콘 |
| cobalt | #2340A0 | 푸터 배경, 링크, 강조 제목 |
| sky | #A9CBE0 | 보조 배경, 하늘 레이어 |
| field | #3E7B3A | 태그, 잔디, 호버 표시 |
| dusk | #E59A52 | **화면당 한 곳만** (현재 위치 점, 연락 가능 배지, 포커스 테두리) |
| line | ink 15% | 구분선, 테두리 |

- 색 비율 70% paper / 25% cobalt·sky·field / 5% dusk
- 서체: `font-serif`(Instrument Serif + Noto Serif KR), `font-sans`(Inter + Pretendard), `font-mono`(JetBrains Mono)
- 타이포 유틸리티: `text-display` `text-h1` `text-h2` `text-h3` `text-body` `text-caption` `text-label`(모노 대문자)
- 레이아웃: `container-site` (좌우 20/32px, 최대 1200px). 브레이크포인트 `md`=768px(태블릿), `lg`=1280px(데스크톱)
- 모션: Focus-in(blur 16px→0, 600ms ease-out), Hover focus(300ms, 1.02배), 페이지 전환 400ms. easing은 `ease-out-soft`

## 반드시 지킬 원칙 (기획서 3장, 7-4)

1. **작업이 주인공** — 프로젝트 이미지 주변에는 텍스처·장식을 올리지 않는다
2. **흐림은 이미지에만** — 텍스트에는 blur를 적용하지 않는다(단어 단위 focus-in 연출은 예외로 짧게)
3. **색은 절제** — dusk는 화면당 한 곳
4. **느리지만 답답하지 않게** — 연출은 600ms 이하, 내비게이션은 즉시 반응
5. 접근성
   - `prefers-reduced-motion`이면 블러·시차·확대를 끄고 투명도 전환만 남긴다 (`motion-reduce:` 변형 활용)
   - 본문 대비 4.5:1 이상. dusk·sky 위에 작은 글자 금지
   - 모든 링크는 Tab으로 이동 가능, 포커스는 dusk 2px (globals.css에 기본 적용)
   - 작업 이미지는 내용을 설명하는 alt, 장식 이미지는 `alt=""` / `aria-hidden`
   - 터치 영역 최소 44×44px (`min-h-11`)
6. 성능 — 이미지는 `next/image`(AVIF/WebP, 지연 로딩), LCP 2.5초 이내

## 폴더 구조

```
docs/spec.md                 화면 기획서 (원본: Claude Docs)
src/proxy.ts                 언어별 주소 처리
src/app/[lang]/layout.tsx    루트 레이아웃 (서체·그레인·헤더·토스트)
src/app/[lang]/page.tsx      Home
src/app/globals.css          디자인 토큰 + 기본 스타일
src/app/fonts.ts             next/font 설정
src/components/header/       C-01 헤더 (Logo, LanguageSwitch, MobileMenu, StatusBadge)
src/components/toast/        이메일 복사 토스트
src/i18n/                    언어 설정, 문구 파일
src/lib/site.ts              이메일·메뉴 등 사이트 공통 정보
```

## 제작 순서 (기획서 7-7) — 한 번에 한 단계씩, 확인하고 다음으로

- [x] 1. 기획서 → `docs/spec.md`, 이 파일
- [x] 2. 프로젝트 생성 + 토큰·서체·그레인 오버레이 + C-01 헤더
- [ ] 3. C-02 푸터 (풍경 레이어와 걸어가는 인물은 임시 도형으로)
- [ ] 4. P-01 Home → P-02 Work 목록(슬롯 5개, 더미 MDX) → P-03 상세 템플릿 + 점 내비게이션
- [ ] 5. P-04 Research, P-05 About, P-06 404
- [ ] 6. 영문(`/en`) 문구 채우기, "View in English" 안내
- [ ] 7. 접근성·성능 점검 후 Vercel 배포

## 작업 규칙

- 확인 명령: `npm run lint`, `npx tsc --noEmit`, `npm run build`
- 새 라우트를 만든 뒤 타입 오류(`PageProps` 등)가 나면 `npx next typegen`
- 문구는 컴포넌트에 직접 쓰지 말고 dictionaries에 국문·영문을 함께 추가
- 메뉴·모노 라벨(ROLE, DURATION 등)·프로젝트 메타는 국문 모드에서도 영문 유지
- 실제 값이 없는 곳(이메일, 학교명, 프로젝트명)은 `TODO:` 주석과 함께 더미 값
