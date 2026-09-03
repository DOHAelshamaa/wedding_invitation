interface BotanicalProps {
  className?: string;
  flip?: boolean;
}

/**
 * A lightweight line-art botanical branch, drawn as inline SVG so no binary
 * asset is required. Swap the path data for a licensed illustration/PNG in
 * production if you have one — see README "Decorative assets".
 */
export function Botanical({ className = '', flip = false }: BotanicalProps) {
  return (
    <svg
      viewBox="0 0 120 320"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="var(--taupe)" strokeWidth="1.4" strokeLinecap="round" opacity="0.75">
        <path d="M60 6 C 45 60, 55 120, 40 160 C 28 190, 35 230, 30 300" />
        {[40, 75, 110, 150, 190, 230, 265].map((y, i) => (
          <g key={y}>
            <path
              d={`M${60 - i * 2},${y} C ${40 - i * 3},${y - 18} 20,${y - 22} 8,${y - 8}`}
            />
            <ellipse
              cx={12}
              cy={y - 12}
              rx="9"
              ry="5"
              transform={`rotate(-25 12 ${y - 12})`}
              fill="var(--taupe)"
              opacity="0.35"
            />
            {i % 2 === 0 && (
              <>
                <path
                  d={`M${58 - i * 2},${y + 12} C ${78 - i},${y + 4} 96,${y + 8} 106,${y + 20}`}
                />
                <ellipse
                  cx={102}
                  cy={y + 16}
                  rx="8"
                  ry="4.5"
                  transform={`rotate(20 102 ${y + 16})`}
                  fill="var(--gold)"
                  opacity="0.3"
                />
              </>
            )}
          </g>
        ))}
        {/* small blossom accents for extra editorial detail */}
        {[62, 200].map((y) => (
          <g key={`blossom-${y}`} opacity="0.55">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx={34}
                cy={y}
                rx="6"
                ry="3"
                fill="var(--gold)"
                opacity="0.25"
                transform={`rotate(${angle} 34 ${y})`}
              />
            ))}
            <circle cx={34} cy={y} r="2.5" fill="var(--clay)" opacity="0.5" />
          </g>
        ))}
      </g>
    </svg>
  );
}
