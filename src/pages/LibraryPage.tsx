import { useState } from 'react';
import { ExerciseCard } from '../components/ExerciseCard';
import { exercises } from '../data/exercises';
import { AREA_LABELS, BODY_AREAS, type BodyArea } from '../types';

export function LibraryPage() {
  const [area, setArea] = useState<BodyArea | null>(null);
  const [query, setQuery] = useState('');

  const filtered = exercises.filter((e) => {
    if (area && !e.bereiche.includes(area)) return false;
    if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-md px-5 pb-28 pt-12">
      <h1 className="text-2xl font-bold">Übungen</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Suchen…"
        className="mt-4 w-full rounded-xl border border-edge bg-card px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-accent"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setArea(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            area === null ? 'bg-accent text-ink' : 'bg-card text-zinc-400'
          }`}
        >
          Alle
        </button>
        {BODY_AREAS.map((a) => (
          <button
            key={a}
            onClick={() => setArea(area === a ? null : a)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              area === a ? 'bg-accent text-ink' : 'bg-card text-zinc-400'
            }`}
          >
            {AREA_LABELS[a]}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">{filtered.length} Übungen</p>
      <div className="mt-3 space-y-2">
        {filtered.map((e) => (
          <ExerciseCard key={e.id} exercise={e} />
        ))}
      </div>
    </div>
  );
}
