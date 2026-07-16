import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { db } from '../lib/db';
import { AREA_LABELS, SESSION_TYPE_LABELS, type SessionType } from '../types';

const TYPE_BADGE: Record<SessionType, string> = {
  daily: 'bg-accent/15 text-accent',
  skill: 'bg-sky-400/15 text-sky-300',
  recovery: 'bg-violet-400/15 text-violet-300',
};

export function ProgramPage() {
  const program = useLiveQuery(
    async () => (await db.programs.orderBy('id').toArray()).at(-1),
    [],
  );
  const completed = useLiveQuery(
    async () =>
      program?.id
        ? db.completedSessions.where('programId').equals(program.id).toArray()
        : [],
    [program?.id],
  );

  if (program === undefined || completed === undefined) return null;

  if (!program) {
    return (
      <div className="mx-auto max-w-md px-5 pt-14">
        <h1 className="text-2xl font-bold">Programm</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Noch kein Programm vorhanden. Mach zuerst den Mobility-Test — daraus
          entsteht dein persönlicher 4-Wochen-Plan.
        </p>
        <Link
          to="/test"
          className="mt-6 block w-full rounded-2xl bg-accent py-4 text-center font-bold text-ink"
        >
          Mobility-Test starten →
        </Link>
      </div>
    );
  }

  const doneKeys = new Set(completed.map((c) => `${c.week}-${c.day}`));
  const doneCount = program.sessions.filter((s) =>
    doneKeys.has(`${s.week}-${s.day}`),
  ).length;

  return (
    <div className="mx-auto max-w-md px-5 pb-28 pt-12">
      <h1 className="text-2xl font-bold">Dein Programm</h1>
      <p className="mt-1 text-sm text-zinc-400">
        4 Wochen · {program.sessions.length} Sessions · {doneCount} erledigt
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded bg-edge">
        <div
          className="h-full bg-accent"
          style={{ width: `${(doneCount / program.sessions.length) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Fokus: {program.weakAreas.map((a) => AREA_LABELS[a]).join(', ')}
      </p>

      {[1, 2, 3, 4].map((week) => (
        <div key={week} className="mt-6">
          <h2 className="text-sm font-semibold text-zinc-300">Woche {week}</h2>
          <div className="mt-2 space-y-2">
            {program.sessions
              .filter((s) => s.week === week)
              .map((s) => {
                const done = doneKeys.has(`${s.week}-${s.day}`);
                return (
                  <Link
                    key={`${s.week}-${s.day}`}
                    to={`/session/${program.id}/${s.week}/${s.day}`}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                      done ? 'border-accent/30 bg-accent/5' : 'border-edge bg-card'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        done ? 'bg-accent text-ink' : 'bg-edge text-zinc-400'
                      }`}
                    >
                      {done ? '✓' : s.day}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.titel}</p>
                      <p className="text-xs text-zinc-500">
                        {s.exerciseIds.length} Übungen
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_BADGE[s.typ]}`}
                    >
                      {SESSION_TYPE_LABELS[s.typ]}
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
