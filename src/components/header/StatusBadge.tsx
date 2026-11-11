"use client";

/** "연락 가능" 배지 (기획서 C-01 #4). 클릭하면 이메일 주소를 복사한다. */
export function StatusBadge({
  label,
  actionLabel,
  onClick,
  className = "",
}: {
  label: string;
  actionLabel: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={actionLabel}
      aria-label={`${label} — ${actionLabel}`}
      className={`text-label inline-flex min-h-9 items-center gap-2 rounded-full border border-line px-3 transition-colors hover:border-ink/40 hover:bg-ink/[0.04] ${className}`}
    >
      <span className="relative flex size-1.5" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-dusk opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-1.5 rounded-full bg-dusk" />
      </span>
      {label}
    </button>
  );
}
