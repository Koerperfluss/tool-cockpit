import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { db } from '../lib/db';
import { scoreColor } from '../lib/scoring';
import { toDayKey } from '../lib/streak';
import { AREA_LABELS, BODY_AREAS } from '../types';

function OverallChart({ points }: { points: { date: string; overall: number }[] }) {
  if (points.length < 2) return null;
  const w = 320;
  const h = 120;
  const pad = 10;
  const xs = points.map((_, i) => pad + (i * (w - 2 * pad)) / (points.length - 1));
  const ys = points.map((p) => h - pad - (p.overall / 100) * (h - 2 * pad));
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full">
      <path d={path} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#34d399" />
      ))}
    </svg>
  );
}

function Heatmap({ doneDays }: { doneDays: Set<string> }) {
  const weeks = 12;
  const today = new Date();
  const cells: { key: string; done: boolean }[] = [];
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toDayKey(d);
    cells.push({ key, done: doneDays.has(key) });
  }
  return (
    <div className="mt-3 grid grid-flow-col grid-rows-7 gap-1">
      {cells.map((c) => (
        <div
          key={c.key}
          title={c.key}
          className={`h-3 w-3 rounded-sm ${c.done ? 'bg-accent' : 'bg-edge'}`}
        />
      ))}
    </div>
  );
}

export function HistoryPage() {
  const results = useLiveQuery(() => db.testResults.orderBy('id').toArray(), []);
  const completed = useLiveQuery(() => db.completedSessions.toArray(), []);

  if (results === undefined || completed === undefined) return null;

  const latest = results.at(-1);
  const previous = results.at(-2);
  const doneDays = new Set(completed.map((c) => c.date));

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), testResults: results, completedSessions: completed }, null, 2)],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cali-mobility-export-${toDayKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-md px-5 pb-28 pt-12">
      <h1 className="text-2xl font-bold">Verlauf</h1>

      {latest ? (
        <>
          <h2 className="mt-6 text-sm font-semibold text-zinc-300">
            Mobility Score über Zeit
          </h2>
          {results.length >= 2 ? (
            <OverallChart
              points={results.map((r) => ({ date: r.date, overall: r.overall }))}
            />
          ) : (
            <p className="mt-2 text-sm text-zinc-500">
              Mach einen Retest, um deinen Fortschritt als Kurve zu sehen.
            </p>
          )}

          <h2 className="mt-8 text-sm font-semibold text-zinc-300">
            Letzte Veränderung pro Bereich
          </h2>
          <div className="mt-3 space-y-2">
            {BODY_AREAS.map((area) => {
              const delta = previous
                ? latest.scores[area] - previous.scores[area]
                : null;
              return (
                <div
                  key={area}
                  className="flex items-center justify-between rounded-xl bg-card px-4 py-3 text-sm"
                >
                  <span>{AREA_LABELS[area]}</span>
                  <span className="flex items-center gap-3">
                    <span
                      className="font-bold"
                      style={{ color: scoreColor(latest.scores[area]) }}
                    >
                      {latest.scores[area]}
                    </span>
                    {delta !== null && (
                      <span
                        className={`text-xs font-semibold ${
                          delta > 0
                            ? 'text-emerald-400'
                            : delta < 0
                              ? 'text-red-400'
                              : 'text-zinc-500'
                        }`}
                      >
                        {delta > 0 ? '+' : ''}
                        {delta}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-zinc-400">
          Noch keine Testergebnisse.{' '}
          <Link to="/test" className="font-semibold text-accent">
            Jetzt testen →
          </Link>
        </p>
      )}

      <h2 className="mt-8 text-sm font-semibold text-zinc-300">
        Trainingstage (12 Wochen)
      </h2>
      <Heatmap doneDays={doneDays} />

      <button
        onClick={exportData}
        className="mt-8 w-full rounded-2xl border border-edge bg-card py-3.5 text-sm font-semibold text-zinc-200"
      >
        Daten als JSON exportieren (für Coach)
      </button>
    </div>
  );
}
