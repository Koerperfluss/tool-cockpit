import { scoreColor } from '../lib/scoring';

interface Props {
  score: number;
  label?: string;
  delta?: number | null;
  size?: number;
}

export function ScoreRing({ score, label, delta = null, size = 88 }: Props) {
  const stroke = size >= 100 ? 9 : 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = scoreColor(score);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#26262a"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - score / 100)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>
            {score}
          </span>
          {delta !== null && delta !== 0 && (
            <span
              className={`text-[10px] font-semibold ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {delta > 0 ? '+' : ''}
              {delta}
            </span>
          )}
        </div>
      </div>
      {label && <span className="text-xs text-zinc-400">{label}</span>}
    </div>
  );
}
