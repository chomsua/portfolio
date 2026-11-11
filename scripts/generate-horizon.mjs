/**
 * 판화풍 지평선 풍경 생성기 (기획서 C-02 #6, 4-3 "판화 일러스트", 레퍼런스 R1 sequel)
 *
 * 코발트 바탕 위 크림색 땅에, 등고선처럼 겹친 가는 선의 굵기·끊김으로 명암을 새긴다.
 * 결과는 레이어별 SVG 파일(public/horizon/*.svg)로 저장돼 <img>로 쓰인다.
 * 최종 손그림 일러스트가 나오면 같은 파일 이름으로 교체하면 된다.
 *
 * 실행: node scripts/generate-horizon.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "horizon");
const INK = "#2340A0"; // cobalt
const CREAM = "#F4EFE4"; // paper
const W = 2400;

// ---------------------------------------------------------------- 난수·노이즈
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function noise1d(seed) {
  const r = rng(seed);
  const table = Array.from({ length: 512 }, r);
  return (x) => {
    const i = Math.floor(x);
    const f = x - i;
    const a = table[((i % 512) + 512) % 512];
    const b = table[(((i + 1) % 512) + 512) % 512];
    const u = f * f * (3 - 2 * f);
    return a + (b - a) * u;
  };
}
function fbm(seed, octaves = 5) {
  const ns = Array.from({ length: octaves }, (_, i) => noise1d(seed * 31 + i * 7));
  return (x) => {
    let v = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;
    for (const n of ns) {
      v += amp * n(x * freq);
      norm += amp;
      amp *= 0.5;
      freq *= 2.03;
    }
    return v / norm; // 0..1
  };
}

const f = (n) => Math.round(n * 10) / 10;

/** 굵기별로 선을 모아 path 몇 개로 만든다 (DOM 부담을 줄이기 위해) */
function strokeBuckets() {
  const buckets = new Map();
  return {
    add(width, d) {
      const w = Math.max(0.5, Math.round(width * 4) / 4);
      if (!buckets.has(w)) buckets.set(w, []);
      buckets.get(w).push(d);
    },
    render(color) {
      return [...buckets.entries()]
        .map(
          ([w, ds]) =>
            `<path fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" d="${ds.join("")}"/>`,
        )
        .join("");
    },
  };
}

/**
 * 산·언덕 한 겹: 능선 아래를 크림색으로 채우고, 능선을 따라 내려가는 선으로 명암을 새긴다.
 * light: 왼쪽 위에서 빛이 온다고 보고, 오른쪽을 향한 비탈(내리막)은 선이 굵고 촘촘하다.
 */
function ridgeLayer({ seed, H, base, amp, freq, peaks = [], gap, depth, weight, roughness = 1, edgeKeep = 0.3 }) {
  const n = fbm(seed);
  const jitter = fbm(seed + 99, 3);
  const r = rng(seed + 7);
  const patch = fbm(seed + 313, 3);
  const ridge = (x) => {
    let y = base - amp * Math.pow(n(x * freq), 1.6) * 1.6;
    for (const p of peaks) {
      const d = (x - p.x) / p.w;
      y -= p.h * Math.exp(-d * d) * (0.85 + 0.3 * n(x * freq * 3 + 50));
    }
    return y;
  };
  const step = 6;
  const xs = [];
  for (let x = -20; x <= W + 20; x += step) xs.push(x);
  const ys = xs.map(ridge);
  // 기울기를 앞뒤로 평균 내 부드럽게 (그늘 경계가 세로로 잘리지 않게)
  const rawSlope = xs.map((_, i) => (ys[Math.min(i + 1, ys.length - 1)] - ys[Math.max(i - 1, 0)]) / (2 * step));
  const SM = 6;
  const slopeAt = (i) => {
    let a = 0;
    let c = 0;
    for (let j = Math.max(0, i - SM); j <= Math.min(xs.length - 1, i + SM); j++) {
      a += rawSlope[j];
      c++;
    }
    return a / c;
  };

  // 땅 채우기
  let fill = `M${xs[0]} ${H} L${xs[0]} ${f(ys[0])}`;
  xs.forEach((x, i) => (fill += ` L${x} ${f(ys[i])}`));
  fill += ` L${xs.at(-1)} ${H} Z`;

  const strokes = strokeBuckets();
  // 능선 윤곽선
  let outline = "";
  xs.forEach((x, i) => (outline += `${i ? "L" : "M"}${x} ${f(ys[i])}`));
  // 능선은 굵은 윤곽선 대신 촘촘한 짧은 선으로 가장자리를 만든다 (판화의 새김 느낌)
  for (let i = 0; i < xs.length - 1; i++) {
    const sl = slopeAt(i);
    if (r() > edgeKeep + sl * 2.5) continue;
    const w = weight * (0.45 + Math.min(1, Math.max(0, sl * 3)) * 0.8);
    strokes.add(w, `M${xs[i]} ${f(ys[i] + 0.8)}L${xs[i + 1]} ${f(ys[i + 1] + 0.8 + (r() - 0.5))}`);
  }
  void outline;

  // 등고선처럼 겹친 판화 선
  const rows = Math.floor(depth / gap);
  for (let k = 1; k <= rows; k++) {
    const t = k / rows; // 0(능선) → 1(아래)
    const off = depth * Math.pow(t, 1.25);
    let seg = [];
    const flush = () => {
      if (seg.length > 1) {
        const w = seg.reduce((a, s) => a + s.w, 0) / seg.length;
        strokes.add(w, seg.map((s, j) => `${j ? "L" : "M"}${s.x} ${f(s.y)}`).join(""));
      }
      seg = [];
    };
    for (let i = 1; i < xs.length - 1; i++) {
      const x = xs[i];
      // + 는 오른쪽으로 내려감 = 그늘. 아래 줄일수록 경계를 옆으로 흔들어 사선으로 흐르게
      const wob = Math.round(((jitter(k * 0.37 + x * 0.002) - 0.5) * 16 + t * 5) );
      const slope = slopeAt(Math.min(xs.length - 2, Math.max(1, i - wob)));
      // 능선의 굴곡을 아래로 갈수록 덜 따라가며 평평해진다
      const flat = base + (ys[i] - base) * (1 - t * 0.85);
      const y = Math.max(ys[i] + 3 + gap * 0.6, flat + off + (jitter(x * 0.01 + k * 3.7) - 0.5) * gap * 0.9 * roughness);
      // 큰 그늘 덩어리(구름 그림자·골짜기)를 만드는 느린 노이즈
      const mass = patch(x * 0.004 + k * 0.02);
      const shade = Math.min(1, Math.max(0, 0.05 + slope * 3.2 + (mass - 0.45) * 1.1 + (1 - t) * 0.12));
      // 밝은 곳은 선이 자주 끊기고(빛), 어두운 곳은 이어진다
      const keep = r() < 0.26 + shade * 0.85 && jitter(x * 0.03 + k * 11) > 0.3 - shade * 0.35;
      if (!keep) {
        flush();
        continue;
      }
      seg.push({ x, y, w: weight * (0.35 + shade * 0.95) * (1 - t * 0.4) });
      if (seg.length > 2 + r() * (4 + shade * 14)) flush();
    }
    flush();
  }

  // 밝은 면의 점묘(점으로 찍은 질감)
  for (let i = 1; i < xs.length - 1; i++) {
    const slope = (ys[i + 1] - ys[i - 1]) / (2 * step);
    const dots = Math.floor(r() * 4 * (0.6 - Math.min(0.5, slope)));
    for (let d = 0; d < dots; d++) {
      const x = xs[i] + r() * step;
      const y = ys[i] + 4 + Math.pow(r(), 1.6) * depth;
      strokes.add(weight * 0.55, `M${f(x)} ${f(y)}h0.6`);
    }
  }

  // 그늘진 비탈에 짧은 세로 결(골짜기 주름)
  for (let i = 2; i < xs.length - 2; i += 2) {
    const slope = (ys[i + 1] - ys[i - 1]) / (2 * step);
    if (slope < 0.18 || r() > 0.5) continue;
    const x = xs[i] + (r() - 0.5) * step;
    const y0 = ys[i] + 3;
    const len = 6 + r() * depth * 0.35 * Math.min(1, slope * 2);
    strokes.add(weight * 0.7, `M${f(x)} ${f(y0)}l${f(slope * len * 0.6)} ${f(len)}`);
  }

  return { fill, strokes, ridge };
}

/**
 * 풀 한 포기: 아래에서 뾰족하게 뻗는 잎 여러 장. 잎은 끝으로 갈수록 가늘어지는 면(fill)이라
 * 펜 선보다 판화의 칼자국처럼 보인다.
 */
function tuft(r, cx, cy, size) {
  let d = "";
  const blades = 6 + Math.floor(r() * 12);
  for (let b = 0; b < blades; b++) {
    const a = (r() - 0.5) * 2.2; // 기울기(라디안)
    const h = size * (0.35 + Math.pow(r(), 0.7) * 0.85);
    const bx = cx + (r() - 0.5) * size * 0.35;
    const tipX = bx + Math.sin(a) * h;
    const tipY = cy - Math.cos(a) * h * (0.75 + r() * 0.3);
    const bend = (r() - 0.5) * h * 0.35;
    const bw = Math.max(0.9, size * 0.035) * (0.6 + r() * 0.8); // 밑동 폭
    const mX = (bx + tipX) / 2 + bend;
    const mY = (cy + tipY) / 2;
    d += `M${f(bx - bw)} ${f(cy)}Q${f(mX)} ${f(mY)} ${f(tipX)} ${f(tipY)}Q${f(mX + bw * 0.6)} ${f(mY)} ${f(bx + bw)} ${f(cy)}Z`;
  }
  return d;
}

function svg(H, body, viewBoxY = 0) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${viewBoxY} ${W} ${H - viewBoxY}" preserveAspectRatio="xMidYMax slice">${body}</svg>\n`;
}

// ---------------------------------------------------------------- 레이어
const H = 900;

// 1) 먼 산: 큰 봉우리 몇 개, 촘촘하고 가는 선
const far = ridgeLayer({
  seed: 11,
  H,
  base: 520,
  amp: 120,
  freq: 0.0024,
  peaks: [
    { x: 520, w: 210, h: 70 },
    { x: 1650, w: 260, h: 150 },
    { x: 2250, w: 160, h: 60 },
  ],
  gap: 7,
  depth: 210,
  weight: 1.1,
});

// 2) 중간 언덕: 낮고 넓게, 선 간격이 조금 넓다
const mid = ridgeLayer({
  seed: 23,
  H,
  base: 640,
  amp: 70,
  freq: 0.0036,
  peaks: [
    { x: 300, w: 220, h: 55 },
    { x: 1050, w: 300, h: 75 },
    { x: 2050, w: 240, h: 45 },
  ],
  gap: 10,
  depth: 180,
  weight: 1.4,
  edgeKeep: 0.85,
});

// 3) 앞 들판: 거의 평평한 땅 + 가로 결 + 풀포기
function frontLayer() {
  const r = rng(41);
  const n = fbm(41);
  const top = 700;
  const ground = (x) => top + (n(x * 0.002) - 0.5) * 24;
  let fill = `M-20 ${H}`;
  for (let x = -20; x <= W + 20; x += 20) fill += ` L${x} ${f(ground(x))}`;
  fill += ` L${W + 20} ${H} Z`;
  const strokes = strokeBuckets();

  // 원근감: 멀수록(위) 가늘고 촘촘한 가로 결
  for (let y = top + 6; y < H; y += 3 + ((y - top) / (H - top)) * 9) {
    const t = (y - top) / (H - top);
    let x = -20 + r() * 40;
    while (x < W) {
      const len = 8 + r() * (30 + t * 80);
      if (r() < 0.42) {
        const yy = y + (r() - 0.5) * 3;
        strokes.add(0.5 + t * 0.9 * r(), `M${f(x)} ${f(yy)}l${f(len)} ${f((r() - 0.5) * 2)}`);
      }
      x += len + 6 + r() * (40 - t * 20);
    }
  }
  // 풀포기: 무리 지어 듬성듬성. 멀수록 작고, 가까울수록 크다
  let tufts = "";
  const clumps = 70;
  for (let c = 0; c < clumps; c++) {
    const t = Math.pow(r(), 0.75);
    const cy0 = top + 16 + t * (H - top - 30);
    const cx0 = r() * W;
    const count = 1 + Math.floor(r() * (2 + t * 5));
    for (let i = 0; i < count; i++) {
      const size = (5 + t * t * 70) * (0.5 + r() * 0.8);
      tufts += tuft(r, cx0 + (r() - 0.5) * (40 + t * 160), cy0 + (r() - 0.5) * 10 * (1 + t * 3), size);
    }
  }
  // 아주 작은 풀싹 (먼 들판의 질감)
  for (let i = 0; i < 260; i++) {
    const t = Math.pow(r(), 1.4);
    tufts += tuft(r, r() * W, top + 10 + t * (H - top - 20), 3 + t * 12);
  }
  return { fill, strokes, tufts };
}
const front = frontLayer();

mkdirSync(OUT, { recursive: true });

const layer = (name, l, extra = "") => {
  const body = `<path fill="${CREAM}" d="${l.fill}"/>${l.strokes.render(INK)}${extra}`;
  writeFileSync(join(OUT, `${name}.svg`), svg(H, body));
};
layer("far", far);
layer("mid", mid);
layer("front", front, `<path fill="${INK}" d="${front.tufts}"/>`);

// 미리보기용 합본 (코발트 바탕). 확인용이라 저장소에는 넣지 않는다(.gitignore)
const all = `<rect x="0" y="0" width="${W}" height="${H}" fill="${INK}"/>${[far, mid]
  .map((l) => `<path fill="${CREAM}" d="${l.fill}"/>${l.strokes.render(INK)}`)
  .join("")}<path fill="${CREAM}" d="${front.fill}"/>${front.strokes.render(INK)}<path fill="${INK}" d="${front.tufts}"/>`;
writeFileSync(join(OUT, "preview.svg"), svg(H, all));
console.log("horizon layers written to", OUT);

// ---------------------------------------------------------------- 본문 → 푸터 경계선 (C-02 #1)
// 직선 대신 "멀리 있는 산의 능선". 색은 CSS(currentColor)로 정하도록 path만 내보낸다.
{
  const EW = 1440;
  const EH = 64;
  const n = fbm(5);
  const pts = [];
  for (let x = 0; x <= EW; x += 8) {
    const big = n(x * 0.0026);
    const fine = n(x * 0.02 + 40) * 0.18;
    pts.push(`${x} ${f(EH - (Math.pow(big, 1.5) * 1.2 + fine) * EH * 0.85)}`);
  }
  const d = `M0 ${EH} L${pts.join(" L")} L${EW} ${EH} Z`;
  const file = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "components", "footer", "edge-path.ts");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(
    file,
    `// scripts/generate-horizon.mjs 가 만든 파일. 직접 고치지 말고 스크립트를 다시 실행할 것.\nexport const EDGE_VIEWBOX = "0 0 ${EW} ${EH}";\nexport const EDGE_PATH =\n  "${d}";\n`,
  );
}
