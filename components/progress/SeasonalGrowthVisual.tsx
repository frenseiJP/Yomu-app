"use client";

import type { Season, SeasonStage } from "@/lib/progress/seasonal";

type Props = {
  season: Season;
  stage: SeasonStage;
  className?: string;
  progressRatio: number;
};

function SpringArt({ stage, className, glowOpacity }: { stage: SeasonStage; className: string; glowOpacity: number }) {
  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-pink-400/20 blur-3xl"
        style={{ opacity: glowOpacity }}
        aria-hidden
      />
      <svg viewBox="0 0 220 180" className="relative z-[1] h-44 w-full max-w-[280px] sm:h-52 md:h-56 lg:max-w-[340px] lg:h-64" aria-hidden>
        <defs>
          <linearGradient id="sg-spring-petal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
        <path d="M28 165 Q 70 126 112 96 T 190 55" fill="none" stroke="rgba(148,163,184,0.55)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M110 95 Q 130 75 168 68" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2.2" strokeLinecap="round" />
        {stage >= 1 ? <circle cx="182" cy="56" r="4.5" fill="#fbcfe8" opacity={0.95} /> : null}
        {stage >= 2 ? <circle cx="182" cy="56" r="7" fill="#86efac" opacity={0.95} /> : null}
        {stage >= 3 ? (
          <g>
            {[0, 1, 2, 3].map((i) => {
              const angle = (-40 + i * 28) * (Math.PI / 180);
              const r = stage >= 4 ? 11 : 8;
              const cx = 178 + Math.cos(angle) * r * 0.9;
              const cy = 52 + Math.sin(angle) * r * 0.7;
              const rot = -20 + i * 15;
              return (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx="9"
                  ry="6"
                  fill="url(#sg-spring-petal)"
                  opacity={0.85 - i * 0.05}
                  transform={"rotate(" + String(rot) + " " + String(cx) + " " + String(cy) + ")"}
                />
              );
            })}
          </g>
        ) : null}
        {stage >= 4 ? (
          <g opacity={0.9}>
            <ellipse cx="155" cy="48" rx="10" ry="7" fill="url(#sg-spring-petal)" transform="rotate(-25 155 48)" />
            <ellipse cx="198" cy="42" rx="9" ry="6" fill="url(#sg-spring-petal)" transform="rotate(18 198 42)" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}

function AutumnArt({
  stage,
  className,
  glowOpacity,
}: {
  stage: SeasonStage;
  className: string;
  glowOpacity: number;
}) {
  const colors = ["#4ade80", "#eab308", "#fb923c", "#ea580c", "#dc2626"] as const;
  const fill = colors[stage];
  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl blur-3xl"
        style={{ backgroundColor: fill, opacity: glowOpacity * 0.6 }}
        aria-hidden
      />
      <svg viewBox="0 0 220 180" className="relative z-[1] h-44 w-full max-w-[280px] sm:h-52 md:h-56 lg:max-w-[340px] lg:h-64" aria-hidden>
        <path
          d="M35 168 Q 80 130 115 100 Q 150 70 188 62"
          fill="none"
          stroke="rgba(120,113,108,0.5)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <ellipse cx="120" cy="88" rx="52" ry="38" fill={fill} opacity={0.88} />
        <ellipse cx="95" cy="102" rx="28" ry="22" fill={fill} opacity={0.75} style={{ filter: "brightness(0.92)" }} />
        <ellipse cx="148" cy="78" rx="32" ry="24" fill={fill} opacity={0.8} style={{ filter: "brightness(1.05)" }} />
      </svg>
    </div>
  );
}

function SummerArt({ stage, className, glowOpacity }: { stage: SeasonStage; className: string; glowOpacity: number }) {
  const shell = stage >= 2 ? 1 : 0;
  const burst = stage >= 3 ? 1 : 0;
  const full = stage >= 4 ? 1 : 0;
  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-fuchsia-400/20 blur-3xl" style={{ opacity: glowOpacity }} aria-hidden />
      <svg viewBox="0 0 220 180" className="relative z-[1] h-44 w-full max-w-[280px] sm:h-52 md:h-56 lg:max-w-[340px] lg:h-64" aria-hidden>
        <rect x="0" y="0" width="220" height="180" fill="rgba(15,23,42,0.65)" />
        <circle cx="112" cy="92" r={shell ? 8 : 4} fill="#fef08a" opacity={0.9} />
        {shell ? <circle cx="112" cy="92" r="18" fill="none" stroke="rgba(250,204,21,0.55)" strokeWidth="1.5" /> : null}
        {burst ? (
          <g strokeLinecap="round">
            {Array.from({ length: full ? 16 : 10 }, (_, i) => {
              const a = (Math.PI * 2 * i) / (full ? 16 : 10);
              const inner = 20;
              const outer = full ? 54 : 40;
              const x1 = 112 + Math.cos(a) * inner;
              const y1 = 92 + Math.sin(a) * inner;
              const x2 = 112 + Math.cos(a) * outer;
              const y2 = 92 + Math.sin(a) * outer;
              const colors = ["#fef08a", "#f9a8d4", "#a5f3fc", "#c4b5fd"];
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={colors[i % colors.length]}
                  strokeWidth={full ? 2.6 : 2}
                  opacity={0.9}
                />
              );
            })}
          </g>
        ) : null}
      </svg>
    </div>
  );
}

function WinterArt({ stage, className, glowOpacity }: { stage: SeasonStage; className: string; glowOpacity: number }) {
  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-sky-400/15 blur-3xl" style={{ opacity: glowOpacity }} aria-hidden />
      <svg viewBox="0 0 220 180" className="relative z-[1] h-44 w-full max-w-[280px] sm:h-52 md:h-56 lg:max-w-[340px] lg:h-64" aria-hidden>
        <rect x="0" y="0" width="220" height="180" fill="rgba(15,23,42,0.5)" />
        {Array.from({ length: stage >= 2 ? 14 : 8 }, (_, i) => (
          <circle
            key={i}
            cx={24 + (i * 13) % 200}
            cy={30 + ((i * 19) % 110)}
            r={stage >= 1 ? 2 : 1.5}
            fill="white"
            opacity={stage >= 1 ? 0.55 : 0.25}
          />
        ))}
        {stage >= 2 ? <circle cx="112" cy="126" r="24" fill="#e2e8f0" /> : null}
        {stage >= 3 ? <circle cx="112" cy="96" r="16" fill="#f1f5f9" /> : null}
        {stage >= 4 ? (
          <g>
            <circle cx="106" cy="94" r="1.6" fill="#0f172a" />
            <circle cx="118" cy="94" r="1.6" fill="#0f172a" />
            <path d="M106 102 Q112 106 118 102" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M96 108 Q112 118 128 108" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}

export default function SeasonalGrowthVisual({ season, stage, className = "", progressRatio }: Props) {
  const glowOpacity = 0.15 + progressRatio * 0.35;
  switch (season) {
    case "spring":
      return <SpringArt stage={stage} className={className} glowOpacity={glowOpacity} />;
    case "autumn":
      return <AutumnArt stage={stage} className={className} glowOpacity={glowOpacity} />;
    case "summer":
      return <SummerArt stage={stage} className={className} glowOpacity={glowOpacity} />;
    case "winter":
      return <WinterArt stage={stage} className={className} glowOpacity={glowOpacity} />;
    default:
      return null;
  }
}
