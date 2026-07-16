import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { ScoreRing } from '../components/ScoreRing';
import { db } from '../lib/db';
import { generateProgram } from '../lib/programGenerator';
import { scoreLabel } from '../lib/scoring';
import { AREA_LABELS, BODY_AREAS } from '../types';

export function TestResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const result = useLiveQuery(() => db.testResults.get(Number(id)), [id]);
  const previous = useLiveQuery(
    async () =>
      result?.id
        ? (await db.testResults.where('id').below(result.id).sortBy('id')).at(-1)
        : undefined,
    [result?.id],
  );

  if (!result) return null;

  const createProgram = async () => {
    const profile = await db.profile.get('me');
    const { weakAreas, sessions } = generateProgram(
      result.scores,
      profile?.goalSkills ?? [],
    );
    await db.programs.add({
      createdAt: new Date().toISOString(),
      sourceTestId: result.id!,
      goalSkills: profile?.goalSkills ?? [],
      weakAreas,
      sessions,
    });
    navigate('/programm');
  };

  const weakest = [...BODY_AREAS].sort((a, b) => result.scores[a] - result.scores[b]);

  return (
    <div className="mx-auto max-w-md px-5 pb-32 pt-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Dein Ergebnis
      </p>
      <div className="mt-4 flex items-center gap-5">
        <ScoreRing score={result.overall} size={120} />
        <div>
          <h1 className="text-2xl font-bold">Mobility Score</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {new Date(result.date).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {BODY_AREAS.map((area) => (
          <ScoreRing
            key={area}
            score={result.scores[area]}
            label={AREA_LABELS[area]}
            delta={previous ? result.scores[area] - previous.scores[area] : null}
          />
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold text-zinc-300">Einordnung</h2>
      <div className="mt-3 space-y-2">
        {weakest.slice(0, 3).map((area) => (
          <div
            key={area}
            className="flex items-center justify-between rounded-xl bg-card px-4 py-3 text-sm"
          >
            <span>{AREA_LABELS[area]}</span>
            <span
              className={
                result.scores[area] >= 75
                  ? 'text-emerald-400'
                  : result.scores[area] >= 50
                    ? 'text-amber-400'
                    : 'text-red-400'
              }
            >
              {scoreLabel(result.scores[area])}
            </span>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink via-ink/95 to-transparent px-5 pb-8 pt-10">
        <div className="mx-auto max-w-md">
          <button
            onClick={createProgram}
            className="w-full rounded-2xl bg-accent py-4 font-bold text-ink"
          >
            4-Wochen-Programm erstellen →
          </button>
        </div>
      </div>
    </div>
  );
}
