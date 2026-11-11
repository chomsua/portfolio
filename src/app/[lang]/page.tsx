import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * 임시 Home (빌드 2단계 확인용)
 * 토큰·서체·그레인·헤더가 제대로 보이는지 확인하는 화면. 4단계에서 P-01 Home으로 교체한다.
 */
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.placeholder;

  return (
    <>
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <section className="container-site flex min-h-[85dvh] flex-col justify-center pt-24 pb-16">
          <p className="text-label text-cobalt">{t.eyebrow}</p>
          <h1 className="text-display mt-5 max-w-[14ch]">{t.title}</h1>
          <p className="text-body mt-6 max-w-[38rem] text-ink/80">{t.body}</p>
        </section>

        {/* 토큰 미리보기: 색 · 타이포 단계 */}
        <section className="container-site grid gap-12 border-t border-line py-16 md:grid-cols-2">
          <div>
            <p className="text-label mb-5 text-ink/60">Color tokens</p>
            <ul className="grid grid-cols-3 gap-3">
              {[
                ["paper", "bg-paper border border-line"],
                ["ink", "bg-ink"],
                ["cobalt", "bg-cobalt"],
                ["sky", "bg-sky"],
                ["field", "bg-field"],
                ["dusk", "bg-dusk"],
              ].map(([name, cls]) => (
                <li key={name}>
                  <div className={`aspect-[4/3] rounded-md ${cls}`} />
                  <p className="text-label mt-2">{name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-label mb-5 text-ink/60">Type scale</p>
            <p className="text-display">Display 디스플레이</p>
            <p className="text-h1">Heading 1 제목</p>
            <p className="text-h2 italic">Heading 2 이탤릭</p>
            <p className="text-h3">Heading 3 소제목</p>
            <p className="text-body">Body 본문 — 흐릿한 문제를 선명한 화면으로.</p>
            <p className="text-caption text-ink/70">Caption 캡션</p>
            <p className="text-label">Label · 2026 · MOBILE APP · UX LEAD</p>
          </div>
        </section>
      </main>
    </>
  );
}
