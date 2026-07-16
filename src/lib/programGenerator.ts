import { exercises as defaultPool } from '../data/exercises';
import {
  AREA_LABELS,
  type BodyArea,
  type Exercise,
  type ProgramSession,
  type SessionType,
  type Skill,
} from '../types';
import { weakestAreas } from './scoring';

const WEEKS = 4;
const DAYS_PER_WEEK = 5;
const EXERCISES_PER_SESSION = 7;
const DAY_TYPES: SessionType[] = ['daily', 'skill', 'recovery', 'daily', 'skill'];

function pick(
  pool: Exercise[],
  count: number,
  offset: number,
  taken: Set<string>,
): Exercise[] {
  const result: Exercise[] = [];
  if (pool.length === 0) return result;
  for (let i = 0; i < pool.length && result.length < count; i++) {
    const candidate = pool[(offset + i) % pool.length];
    if (taken.has(candidate.id)) continue;
    taken.add(candidate.id);
    result.push(candidate);
  }
  return result;
}

export interface GeneratedProgram {
  weakAreas: BodyArea[];
  sessions: ProgramSession[];
}

/**
 * Deterministischer Programm-Generator: 4 Wochen × 5 Sessions.
 * ~60 % der Übungen zielen auf die schwächsten Bereiche, der Rest rotiert
 * durch den ganzen Körper; Skill-Prep-Tage priorisieren die Ziel-Skills.
 */
export function generateProgram(
  scores: Record<BodyArea, number>,
  goalSkills: Skill[],
  pool: Exercise[] = defaultPool,
): GeneratedProgram {
  const weakAreas = weakestAreas(scores);
  const weakPool = pool.filter((e) => e.bereiche.some((a) => weakAreas.includes(a)));
  const goalPool = pool.filter((e) => e.skills.some((s) => goalSkills.includes(s)));

  const sessions: ProgramSession[] = [];
  for (let week = 1; week <= WEEKS; week++) {
    for (let day = 1; day <= DAYS_PER_WEEK; day++) {
      const typ = DAY_TYPES[day - 1];
      const offset = week * 11 + day * 3;
      const taken = new Set<string>();

      // Recovery-Tage bleiben bei niedriger Intensität.
      const byIntensity = (list: Exercise[]) =>
        typ === 'recovery' ? list.filter((e) => e.intensitaet <= 2) : list;

      let chosen: Exercise[] = [];
      if (typ === 'skill' && goalPool.length > 0) {
        chosen = [
          ...pick(byIntensity(goalPool), 3, offset, taken),
          ...pick(byIntensity(weakPool), 3, offset, taken),
        ];
      } else {
        chosen = pick(byIntensity(weakPool), 4, offset, taken);
      }
      chosen = [
        ...chosen,
        ...pick(byIntensity(pool), EXERCISES_PER_SESSION - chosen.length, offset, taken),
      ];

      const fokusArea = weakAreas[(week + day) % weakAreas.length];
      const titel =
        typ === 'skill'
          ? `Skill-Prep · ${goalSkills.length ? 'Ziel-Skills' : AREA_LABELS[fokusArea]}`
          : typ === 'recovery'
            ? `Recovery · ${AREA_LABELS[fokusArea]}`
            : `Daily · Fokus ${AREA_LABELS[fokusArea]}`;

      sessions.push({
        week,
        day,
        typ,
        titel,
        fokus: weakAreas,
        exerciseIds: chosen.map((e) => e.id),
      });
    }
  }
  return { weakAreas, sessions };
}

/** Geschätzte Session-Dauer in Sekunden (einseitige Übungen zählen doppelt). */
export function sessionDurationSek(exerciseList: Exercise[]): number {
  return exerciseList.reduce(
    (sum, e) => sum + e.dauerSek * (e.seiten === 'einseitig' ? 2 : 1),
    0,
  );
}
