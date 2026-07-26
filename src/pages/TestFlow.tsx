import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mobilityTests } from '../data/mobilityTests';
import { db } from '../lib/db';
import { computeScores } from '../lib/scoring';
import type { TestAnswer } from '../types';

const OPTIONS: { value: TestAnswer; label: string; key: 'voll' | 'teilweise' | 'nicht'; color: string }[] = [
  { value: 2, label: 'Voll erreicht', key: 'voll', color: 'border-emerald-500/60' },
  { value: 1, label: 'Teilweise', key: 'teilweise', color: 'border-amber-500/60' },
  { value: 0, label: 'Nicht erreicht', key: 'nicht', color: 'border-red-500/60' },
];

export function TestFlow() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, TestAnswer>>({});

  const finish = async (finalAnswers: Record<string, TestAnswer>) => {
    const { scores, overall } = computeScores(finalAnswers);
    const id = await db.testResults.add({
      date: new Date().toISOString(),
      answers: finalAnswers,
      scores,
      overall,
    });
    navigate(`/ergebnis/${id}`, { replace: true });
  };

  if (idx === -1) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-14">
        <h1 className="text-2xl font-bold">Mobility-Test</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {mobilityTests.length} kurze Selbsttests. Wärme dich 2–3 Minuten auf
          (lockeres Kreisen, ein paar Kniebeugen). Bewerte ehrlich — der Test
          bestimmt dein Programm. Teste ohne Schwung und ohne Schmerz.
        </p>
        <div className="mt-6 space-y-2">
          {mobilityTests.map((t, i) => (
            <div key={t.id} className="flex items-center gap-3 rounded-xl bg-card px-4 py-2.5 text-sm">
              <span className="text-xs text-zinc-600">{i + 1}</span>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-8">
          <button
            onClick={() => setIdx(0)}
            className="w-full rounded-2xl bg-accent py-4 font-bold text-ink"
          >
            Los geht's
          </button>
        </div>
      </div>
    );
  }

  const test = mobilityTests[idx];
  const answer = (value: TestAnswer) => {
    const next = { ...answers, [test.id]: value };
    setAnswers(next);
    if (idx + 1 < mobilityTests.length) setIdx(idx + 1);
    else void finish(next);
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-10">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <button onClick={() => (idx === 0 ? navigate(-1) : setIdx(idx - 1))}>← Zurück</button>
        <span>
          {idx + 1} / {mobilityTests.length}
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded bg-edge">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${((idx + 1) / mobilityTests.length) * 100}%` }}
        />
      </div>

      <h1 className="mt-6 text-2xl font-bold">{test.name}</h1>
      <p className="mt-1 text-xs font-medium text-accent/80">{test.skillBezug}</p>
      <p className="mt-4 text-sm leading-relaxed text-zinc-300">{test.anleitung}</p>

      <div className="mt-auto space-y-2.5 pt-8">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => answer(opt.value)}
            className={`w-full rounded-2xl border ${opt.color} bg-card p-4 text-left`}
          >
            <span className="font-semibold">{opt.label}</span>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {test.kriterien[opt.key]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
