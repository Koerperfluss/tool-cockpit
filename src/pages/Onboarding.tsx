import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { SKILL_LABELS, type Skill } from '../types';

const ALL_SKILLS = Object.keys(SKILL_LABELS) as Skill[];

export function Onboarding() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Skill[]>([]);

  const toggle = (skill: Skill) =>
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );

  const start = async () => {
    await db.profile.put({ id: 'me', goalSkills: selected, onboarded: true });
    navigate('/test');
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        Cali Mobility
      </p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">
        Kenne deinen Körper.
        <br />
        Trainiere deine Skills.
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        Mobility-Test, Scores pro Körperbereich und ein 4-Wochen-Programm —
        zugeschnitten auf Calisthenics.
      </p>

      <h2 className="mt-8 text-sm font-semibold text-zinc-300">
        An welchen Skills arbeitest du?
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {ALL_SKILLS.map((skill) => {
          const active = selected.includes(skill);
          return (
            <button
              key={skill}
              onClick={() => toggle(skill)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                active
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-edge bg-card text-zinc-300'
              }`}
            >
              {SKILL_LABELS[skill]}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-10">
        <button
          onClick={start}
          className="w-full rounded-2xl bg-accent py-4 text-base font-bold text-ink"
        >
          Mobility-Test starten →
        </button>
        <p className="mt-2 text-center text-xs text-zinc-500">
          10 geführte Selbsttests · ca. 10 Minuten
        </p>
      </div>
    </div>
  );
}
