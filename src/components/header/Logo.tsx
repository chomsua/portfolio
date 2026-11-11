import Link from "next/link";

/** Joshfield 세리프 워드마크 + 작은 별 심볼 (기획서 C-01 #1, R1의 별 로고 참고) */
export function Logo({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group inline-flex items-center gap-1.5 font-serif text-[1.375rem] leading-none tracking-[-0.01em] md:text-2xl"
    >
      <StarMark className="size-3 text-cobalt transition-transform duration-500 ease-out-soft group-hover:rotate-45" />
      <span>Joshfield</span>
    </Link>
  );
}

function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path
        d="M6 0 C6.4 3.6 8.4 5.6 12 6 C8.4 6.4 6.4 8.4 6 12 C5.6 8.4 3.6 6.4 0 6 C3.6 5.6 5.6 3.6 6 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
