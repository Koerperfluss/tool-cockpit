import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate } from 'react-router-dom';
import { ScoreRing } from '../components/ScoreRing';
import { db } from '../lib/db';
import { currentStreak, toDayKey } from '../lib/streak';
import { AREA_LABELS, BODY_AREAS, SESSION_TYPE_LABELS } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const results = useLiveQuery(() => db.testResults.orderBy('id').toArray(), []);
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

  if (results === undefined || program === undefined || completed === undefined) {
    return null;
  }

  const latest = results.at(-1);
  const previous = results.at(-2);

  if (!latest) {
    return (
      <div className="mx-auto max-w-md px-5 pt-14">
        <h1 className="text-2xl font-bold">Willkommen 👋</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Mach zuerst den Mobility-Test, um deine Scores und dein Programm zu
          bekommen.
        </p>
        <button
          onClick={() => navigate('/test')}
          className="mt-6 w-full rounded-2xl bg-accent py-4 font-bold text-ink"
        >
          Mobility-Test starten →
        </button>
      </div>
    );
  }

  const doneKeys = new Set(completed.map((c) => `${c.week}-${c.day}`));
  const nextSession = program?.sessions.find(
    (s) => !doneKeys.has(`${s.week}-${s.day}`),
  );
  const doneDays = new Set(completed.map((c) => c.date));
  const streak = currentStreak(doneDays);
  const monthKey = toDayKey(new Date()).slice(0, 7);
  const doneThisMonth = completed.filter((c) => c.date.startsWith(monthKey)).length;

  return (
    <div className="mx-auto max-w-md px-5 pb-28 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Cali Mobility
          </p>
          <h1 className="mt-1 text-2xl font-bold">Dashboard</h1>
        </div>
        <ScoreRing score={latest.overall} size={72} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-edge bg-card p-4">
          <p className="text-3xl font-bold text-accent">{streak}</p>
          <p className="mt-1 text-xs text-zinc-400">Tage Streak</p>
        </div>
        <div className="rounded-2xl border border-edge bg-card p-4">
          <p className="text-3xl font-bold">{doneThisMonth}</p>
          <p className="mt-1 text-xs text-zinc-400">Sessions diesen Monat</p>
        </div>
      </div>

      {nextSession && program?.id ? (
        <Link
          to={`/session/${program.id}/${nextSession.week}/${nextSession.day}`}
          className="mt-4 block rounded-2xl bg-accent p-5 text-ink"
        >
          <p className="text-xs font-bold uppercase tracking-wide">
            Heutige Session · Woche {nextSession.week}
          </p>
          <p className="mt-1 text-lg font-bold">{nextSession.titel}</p>
          <p className="mt-0.5 text-sm font-medium opacity-80">
            {SESSION_TYPE_LABELS[nextSession.typ]} · {nextSession.exerciseIds.length}{' '}
            Übungen → Start
          </p>
        </Link>
      ) : program ? (
        <div className="mt-4 rounded-2xl border border-accent/40 bg-card p-5">
          <p className="font-bold text-accent">Programm abgeschlossen! 🎉</p>
          <p className="mt-1 text-sm text-zinc-400">
            Zeit für einen Retest, um deinen Fortschritt zu messen.
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-edge bg-card p-5">
          <p className="text-sm text-zinc-300">Noch kein Programm erstellt.</p>
          <Link to={`/ergebnis/${latest.id}`} className="mt-2 inline-block text-sm font-semibold text-accent">
            Aus letztem Test erstellen →
          </Link>
        </div>
      )}

      <h2 className="mt-8 text-sm font-semibold text-zinc-300">Deine Bereiche</h2>
      <div className="mt-3 grid grid-cols-3 gap-4">
        {BODY_AREAS.map((area) => (
          <ScoreRing
            key={area}
            score={latest.scores[area]}
            label={AREA_LABELS[area]}
            delta={previous ? latest.scores[area] - previous.scores[area] : null}
            size={80}
          />
        ))}
      </div>

      <button
        onClick={() => navigate('/test')}
        className="mt-8 w-full rounded-2xl border border-edge bg-card py-3.5 text-sm font-semibold text-zinc-200"
      >
        Retest machen
      </button>
    </div>
  );
}
