import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { exerciseById } from '../data/exercises';
import { db } from '../lib/db';
import { toDayKey } from '../lib/streak';
import type { Exercise } from '../types';

interface Step {
  exercise: Exercise;
  side: 'links' | 'rechts' | null;
}

function buildSteps(exerciseIds: string[]): Step[] {
  const steps: Step[] = [];
  for (const id of exerciseIds) {
    const exercise = exerciseById.get(id);
    if (!exercise) continue;
    if (exercise.seiten === 'einseitig') {
      steps.push({ exercise, side: 'links' }, { exercise, side: 'rechts' });
    } else {
      steps.push({ exercise, side: null });
    }
  }
  return steps;
}

export function SessionPlayer() {
  const { programId, week, day } = useParams();
  const navigate = useNavigate();
  const program = useLiveQuery(() => db.programs.get(Number(programId)), [programId]);

  const session = program?.sessions.find(
    (s) => s.week === Number(week) && s.day === Number(day),
  );
  const steps = useMemo(
    () => (session ? buildSteps(session.exerciseIds) : []),
    [session],
  );

  const [stepIdx, setStepIdx] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());
  const saved = useRef(false);

  const step = steps[stepIdx];

  useEffect(() => {
    if (step) setRemaining(step.exercise.dauerSek);
    setRunning(false);
  }, [stepIdx, step]);

  useEffect(() => {
    if (!running || remaining === null) return;
    if (remaining <= 0) {
      if (stepIdx + 1 < steps.length) setStepIdx((i) => i + 1);
      else setFinished(true);
      return;
    }
    const t = setTimeout(() => setRemaining((r) => (r === null ? null : r - 1)), 1000);
    return () => clearTimeout(t);
  }, [running, remaining, stepIdx, steps.length]);

  useEffect(() => {
    if (!finished || saved.current || !program?.id || !session) return;
    saved.current = true;
    void db.completedSessions.add({
      programId: program.id,
      week: session.week,
      day: session.day,
      date: toDayKey(new Date()),
      dauerSek: Math.round((Date.now() - startedAt.current) / 1000),
    });
  }, [finished, program?.id, session]);

  if (!program || !session) return null;

  if (finished) {
    const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-5 text-center">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-4 text-2xl font-bold">Session geschafft!</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {session.titel} · ca. {minutes} min
        </p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="mt-8 w-full rounded-2xl bg-accent py-4 font-bold text-ink"
        >
          Zum Dashboard
        </button>
      </div>
    );
  }

  if (!step || remaining === null) return null;

  const progress = steps.length ? stepIdx / steps.length : 0;
  const mm = String(Math.floor(remaining / 60)).padStart(1, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-10">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <button onClick={() => navigate(-1)}>✕ Abbrechen</button>
        <span>
          {stepIdx + 1} / {steps.length}
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded bg-edge">
        <div className="h-full bg-accent" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="mt-8">
        {step.side && (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
            {step.side === 'links' ? 'Linke Seite' : 'Rechte Seite'}
          </span>
        )}
        <h1 className="mt-3 text-2xl font-bold">{step.exercise.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {step.exercise.anleitung}
        </p>
        <ul className="mt-4 space-y-1.5">
          {step.exercise.cues.map((cue) => (
            <li key={cue} className="text-xs text-zinc-400">
              → {cue}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-8 text-center">
        <p className="text-7xl font-bold tabular-nums">
          {mm}:{ss}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => stepIdx > 0 && setStepIdx(stepIdx - 1)}
            className="flex-1 rounded-2xl border border-edge bg-card py-3.5 text-sm font-semibold text-zinc-300"
          >
            ← Zurück
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex-[2] rounded-2xl bg-accent py-3.5 font-bold text-ink"
          >
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() =>
              stepIdx + 1 < steps.length ? setStepIdx(stepIdx + 1) : setFinished(true)
            }
            className="flex-1 rounded-2xl border border-edge bg-card py-3.5 text-sm font-semibold text-zinc-300"
          >
            Weiter →
          </button>
        </div>
      </div>
    </div>
  );
}
