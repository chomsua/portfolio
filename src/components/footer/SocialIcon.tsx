/** 소셜 아이콘 (선 아이콘, 20px). 브랜드 로고를 단순화한 형태 */
export function SocialIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 20 20",
    className: "size-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="14" height="14" rx="4" />
          <circle cx="10" cy="10" r="3.2" />
          <circle cx="14.2" cy="5.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <path d="M6.6 9v4.6M6.6 6.6v.1M9.6 13.6V9m0 2.2c0-1.3.9-2.2 2-2.2s1.8.8 1.8 2.2v2.4" />
        </svg>
      );
    case "behance":
      return (
        <svg {...common}>
          <path d="M3 5.5h3.6a2 2 0 0 1 0 4H3Zm0 4h4a2.2 2.2 0 0 1 0 4.5H3Z" />
          <path d="M11.5 11.3h5.3a2.6 2.6 0 1 0-.6 2.2M12.3 6.3h3.6" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M7.6 16.4c-3.2 1-3.2-1.6-4.5-1.9m9 3.5v-2.6a2.2 2.2 0 0 0-.6-1.7c2-.2 4.2-1 4.2-4.5a3.5 3.5 0 0 0-1-2.4 3.2 3.2 0 0 0-.1-2.4s-.8-.2-2.5 1a8.6 8.6 0 0 0-4.5 0C5.9 4.2 5.1 4.4 5.1 4.4a3.2 3.2 0 0 0-.1 2.4 3.5 3.5 0 0 0-1 2.4c0 3.5 2.2 4.3 4.2 4.5a2.2 2.2 0 0 0-.6 1.7V18" />
        </svg>
      );
    default:
      return null;
  }
}
