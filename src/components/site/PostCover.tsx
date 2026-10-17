import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { getCategoryStyle, type CoverPattern } from "@/lib/categoryStyle";
import type { CategorySlug } from "@/content/types";

interface PostCoverProps {
  slug: string;
  category: CategorySlug | string;
  photo?: string;
  photoAlt?: string;
  className?: string;
  priority?: boolean;
}

function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function PostCover({
  slug,
  category,
  photo,
  photoAlt,
  className,
  priority = false,
}: PostCoverProps) {
  const style = getCategoryStyle(category);
  const h = hashSlug(slug);
  const rot = (h % 17) - 8;
  const ox = ((h >> 3) % 21) - 10;
  const oy = ((h >> 7) % 17) - 8;

  return (
    <div
      className={cn("relative overflow-hidden bg-secondary", className)}
      style={{ "--cat": style.cssVar } as CSSProperties}
    >
      {photo ? (
        <img
          src={photo}
          alt={photoAlt ?? ""}
          width={1600}
          height={900}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="img-zoom absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <GeneratedArt pattern={style.pattern} hash={h} rot={rot} ox={ox} oy={oy} />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
    </div>
  );
}

function GeneratedArt({
  pattern,
  hash,
  rot,
  ox,
  oy,
}: {
  pattern: CoverPattern;
  hash: number;
  rot: number;
  ox: number;
  oy: number;
}) {
  const hueShift = (hash % 30) - 15;

  return (
    <svg
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      className="img-zoom absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={`g-${hash}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--cat)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--background)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--electric)" stopOpacity="0.22" />
        </linearGradient>
        <filter id={`grain-${hash}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={hash % 99} />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0" />
        </filter>
      </defs>
      <rect width="400" height="250" fill={`url(#g-${hash})`} />
      <rect width="400" height="250" filter={`url(#grain-${hash})`} opacity="0.18" />
      <g
        transform={`translate(${200 + ox} ${125 + oy}) rotate(${rot + hueShift * 0.2}) translate(-200 -125)`}
        fill="none"
        stroke="var(--cat)"
        strokeOpacity="0.55"
      >
        {pattern === "pitch" && <PitchMarks hash={hash} />}
        {pattern === "orbits" && <OrbitMarks hash={hash} />}
        {pattern === "grid" && <GridMarks hash={hash} />}
        {pattern === "nodes" && <NodeMarks hash={hash} />}
        {pattern === "journal" && <JournalMarks hash={hash} />}
      </g>
    </svg>
  );
}

function PitchMarks({ hash }: { hash: number }) {
  const shift = (hash % 7) - 3;
  return (
    <>
      <rect x="40" y="28" width="320" height="194" strokeWidth="1.4" />
      <line x1="200" y1="28" x2="200" y2="222" strokeWidth="1" />
      <circle cx="200" cy="125" r="36" strokeWidth="1.2" />
      <circle cx="200" cy="125" r="3" fill="var(--cat)" stroke="none" opacity="0.8" />
      <rect x="40" y="70" width="52" height="110" strokeWidth="1" />
      <rect x="308" y="70" width="52" height="110" strokeWidth="1" />
      <rect x="40" y="92" width="22" height="66" strokeWidth="0.8" />
      <rect x="338" y="92" width="22" height="66" strokeWidth="0.8" />
      {[
        [118, 70],
        [118, 180],
        [160, 100],
        [160, 150],
        [200 + shift, 90],
        [200 - shift, 160],
        [248, 80],
        [248, 170],
        [280, 125],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" fill="var(--ivory)" stroke="none" opacity="0.7" />
      ))}
      <path
        d={`M 130 ${110 + shift} C 170 90, 230 150, 270 ${130 - shift}`}
        strokeWidth="1.6"
        stroke="var(--gold)"
        strokeOpacity="0.7"
        markerEnd=""
      />
      <polygon points="272,128 262,122 262,138" fill="var(--gold)" stroke="none" opacity="0.7" />
    </>
  );
}

function OrbitMarks({ hash }: { hash: number }) {
  const a = 18 + (hash % 10);
  return (
    <>
      <circle cx="200" cy="125" r="28" strokeWidth="1.2" />
      <circle cx="200" cy="125" r="56" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="200" cy="125" r="88" strokeWidth="0.8" />
      <circle cx="200" cy="125" r="118" strokeWidth="0.6" strokeOpacity="0.35" />
      <circle cx={200 + a} cy="70" r="5" fill="var(--gold)" stroke="none" />
      <circle cx="120" cy="160" r="4" fill="var(--ivory)" stroke="none" opacity="0.7" />
      <circle cx="290" cy="150" r="3.5" fill="var(--cat)" stroke="none" />
      <ellipse cx="200" cy="125" rx="140" ry="42" strokeWidth="0.7" transform="rotate(-18 200 125)" />
    </>
  );
}

function GridMarks({ hash }: { hash: number }) {
  const offset = hash % 12;
  const lines = [];
  for (let i = 0; i < 12; i++) {
    lines.push(<line key={`v${i}`} x1={20 + i * 32} y1="10" x2={20 + i * 32} y2="240" strokeWidth="0.5" strokeOpacity="0.35" />);
  }
  for (let i = 0; i < 8; i++) {
    lines.push(<line key={`h${i}`} x1="10" y1={16 + i * 30} x2="390" y2={16 + i * 30} strokeWidth="0.5" strokeOpacity="0.35" />);
  }
  return (
    <>
      {lines}
      <text x={48 + offset} y="80" fill="var(--cat)" stroke="none" fontFamily="JetBrains Mono, monospace" fontSize="22" opacity="0.7">
        Σ
      </text>
      <text x="250" y="170" fill="var(--gold)" stroke="none" fontFamily="JetBrains Mono, monospace" fontSize="18" opacity="0.55">
        Δx
      </text>
      <circle cx={140 + offset} cy="140" r="46" strokeWidth="1.1" />
    </>
  );
}

function NodeMarks({ hash }: { hash: number }) {
  const pts = [
    [70, 60],
    [150, 40],
    [250, 70],
    [330, 50],
    [90, 140],
    [180, 125],
    [270, 155],
    [340, 130],
    [120, 210],
    [220, 200],
    [310, 210],
  ].map(([x, y], i) => [x + ((hash >> i) % 9) - 4, y + ((hash >> (i + 3)) % 7) - 3] as const);
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    [4, 5],
    [5, 6],
    [6, 7],
    [4, 8],
    [5, 9],
    [6, 10],
    [8, 9],
    [9, 10],
  ];
  return (
    <>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={pts[a][0]}
          y1={pts[a][1]}
          x2={pts[b][0]}
          y2={pts[b][1]}
          strokeWidth="0.9"
          strokeOpacity="0.5"
        />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3.2} fill="var(--ivory)" stroke="none" opacity="0.75" />
      ))}
      <text x="46" y="48" fill="var(--gold)" stroke="none" fontFamily="JetBrains Mono, monospace" fontSize="28" opacity="0.45">
        {"{ }"}
      </text>
    </>
  );
}

function JournalMarks({ hash }: { hash: number }) {
  const lines = [];
  for (let i = 0; i < 9; i++) {
    lines.push(
      <line
        key={i}
        x1="48"
        y1={40 + i * 22}
        x2="360"
        y2={40 + i * 22}
        strokeWidth="0.7"
        strokeOpacity="0.35"
      />,
    );
  }
  return (
    <>
      {lines}
      <line x1="86" y1="24" x2="86" y2="226" stroke="var(--cat-football)" strokeWidth="1.2" strokeOpacity="0.45" />
      <circle cx={310} cy={58 + (hash % 20)} r="28" fill="var(--gold)" stroke="none" opacity="0.35" />
      <circle cx={310} cy={58 + (hash % 20)} r="18" fill="none" stroke="var(--gold)" strokeWidth="1.2" />
    </>
  );
}
