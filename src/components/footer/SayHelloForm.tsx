"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/lib/site";

/**
 * C-02 #5 "한 줄 메시지 보내기"
 * 지금은 서버 없이 방문자의 메일 앱을 내용이 채워진 상태로 연다(mailto).
 * TODO: 메일이 바로 도착하게 하려면 Resend 같은 메일 API + Server Action으로 교체
 */
export function SayHelloForm({ dict, onSent }: { dict: Dictionary["footer"]; onSent: () => void }) {
  const id = useId();
  const [sent, setSent] = useState(false);

  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("name") ?? "");
        const email = String(data.get("email") ?? "");
        const message = String(data.get("message") ?? "");
        const subject = `[Joshfield] ${name}`;
        const body = `${message}\n\n— ${name} (${email})`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
        onSent();
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field id={`${id}-name`} name="name" label={dict.name} autoComplete="name" />
        <Field id={`${id}-email`} name="email" type="email" label={dict.email} autoComplete="email" />
      </div>
      <div className="flex items-stretch border border-paper/60 focus-within:border-paper">
        <label htmlFor={`${id}-message`} className="sr-only">
          {dict.message}
        </label>
        <input
          id={`${id}-message`}
          name="message"
          required
          maxLength={200}
          placeholder={dict.messagePlaceholder}
          className="min-h-12 min-w-0 flex-1 bg-transparent px-4 font-serif text-[1.0625rem] italic text-paper placeholder:text-paper/55 focus:outline-none"
        />
        <button
          type="submit"
          aria-label={dict.send}
          className="flex w-12 shrink-0 items-center justify-center bg-paper text-cobalt transition-colors hover:bg-sky"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <p role="status" className="text-caption min-h-6 text-paper/85">
        {sent ? dict.sent : ""}
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-label text-paper/70">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="min-h-11 border-b border-paper/50 bg-transparent text-[0.9375rem] text-paper focus:border-paper focus:outline-none"
      />
    </div>
  );
}
