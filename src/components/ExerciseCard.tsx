import { useState } from 'react';
import { AREA_LABELS, SKILL_LABELS, type Exercise } from '../types';

const TYPE_LABELS = { statisch: 'Statisch', dynamisch: 'Dynamisch', aktiv: 'Aktiv' } as const;

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full rounded-2xl border border-edge bg-card p-4 text-left"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold">{exercise.name}</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            {exercise.bereiche.map((b) => AREA_LABELS[b]).join(' · ')} ·{' '}
            {TYPE_LABELS[exercise.typ]} · {exercise.dauerSek}s
            {exercise.seiten === 'einseitig' ? ' / Seite' : ''}
          </p>
        </div>
        <span className="text-zinc-600">{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className="mt-3 space-y-2 text-sm text-zinc-300">
          <p>{exercise.anleitung}</p>
          <ul className="space-y-1">
            {exercise.cues.map((cue) => (
              <li key={cue} className="text-xs text-zinc-400">
                → {cue}
              </li>
            ))}
          </ul>
          {exercise.skills.length > 0 && (
            <p className="text-xs text-accent/80">
              Skills: {exercise.skills.map((s) => SKILL_LABELS[s]).join(', ')}
            </p>
          )}
        </div>
      )}
    </button>
  );
}
