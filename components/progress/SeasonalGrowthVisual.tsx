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
      <svg viewBox="0 0 220 180" className="relative z-[1] h-44 w-full max-w-[280px] sm:h-52" aria-hidden>
        <defs>
          <linearGradient id="sg-spring-petal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
        <path
          d="M30 165 Q 70 120 110 95 T 185 55"
          fill="none"
          stroke="rgba(148,163,184,0.55)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path d="M110 95 Q 130 75 168 68" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2.2" strokeLinecap="round" />
        {stage >= 1 ? (
          <circle cx="182" cy="56" r={stage >= 2 ? 7 : 5} fill={stage >= 2 ? "#86efac" : "#fbcfe8"} opacity={0.95} />
        ) : null}
        {stage >= 1 && stage < 2 ? <circle cx="182" cy="56" r="3" fill="#fef3c7" /> : null}
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
      <svg viewBox="0 0 220 180" className="relative z-[1] h-44 w-full max-w-[280px] sm:h-52" aria-hidden>
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
  const gScale = 0.75 + stage * 0.06;
  const summerTf = "translate(110 92) scale(" + String(gScale) + ") translate(-110 -92)";
  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-emerald-400/25 blur-3xl" style={{ opacity: glowOpacity }} aria-hidden />
      <svg viewBox="0 0 220 180" className="relative z-[1] h-44 w-full max-w-[280px] sm:h-52" aria-hidden>
        <g transform={summerTf}>
          <path
            d="M40 165 Q 85 120 118 95 Q 155 65 195 58"
            fill="none"
            stroke="rgba(100,116,139,0.45)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <ellipse cx="125" cy="82" rx="58" ry="42" fill="#22c55e" opacity={0.85} />
          <ellipse cx="95" cy="95" rx="34" ry="28" fill="#16a34a" opacity={0.78} />
          <ellipse cx="152" cy="72" rx="36" ry="28" fill="#4ade80" opacity={0.72} />
        </g>
        {stage >= 3 ? (
          <circle cx="188" cy="38" r="14" fill="#fde047" opacity={0.9} />
        ) : (
          <circle cx="188" cy="38" r="10" fill="#fde047" opacity={0.45} />
        )}
      </svg>
    </div>
  );
}

function WinterArt({ stage, className, glowOpacity }: { stage: SeasonStage; className: string; glowOpacity: number }) {
  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-sky-400/15 blur-3xl" style={{ opacity: glowOpacity }} aria-hidden />
      <svg viewBox="0 0 220 180" className="relative z-[1] h-44 w-full max-w-[280px] sm:h-52" aria-hidden>
        <path
          d="M38 168 Q 78 125 118 88 Q 158 52 198 45"
          fill="none"
          stroke="rgba(148,163,184,0.5)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={48 + i * 28}
            cy={118 + (i % 2) * 8}
            r={1.8}
            fill="white"
            opacity={stage >= 2 ? 0.55 : 0.2}
          />
        ))}
        {stage >= 3 ? <circle cx="168" cy="62" r="16" fill="#fef08a" opacity={0.35 + stage * 0.08} /> : null}
        {stage >= 4 ? <circle cx="168" cy="62" r="8" fill="#fef9c3" opacity={0.85} /> : null}
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
