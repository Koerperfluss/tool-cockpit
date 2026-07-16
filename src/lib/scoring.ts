import { mobilityTests } from '../data/mobilityTests';
import { BODY_AREAS, type BodyArea, type TestAnswer } from '../types';

export interface ScoreResult {
  scores: Record<BodyArea, number>;
  overall: number;
}

/** Aggregiert Test-Antworten (0/1/2) zu Bereichs-Scores 0–100. */
export function computeScores(answers: Record<string, TestAnswer>): ScoreResult {
  const num = {} as Record<BodyArea, number>;
  const den = {} as Record<BodyArea, number>;
  for (const area of BODY_AREAS) {
    num[area] = 0;
    den[area] = 0;
  }

  for (const test of mobilityTests) {
    const answer = answers[test.id];
    if (answer === undefined) continue;
    for (const [area, weight] of Object.entries(test.bereiche) as [BodyArea, number][]) {
      num[area] += weight * (answer / 2);
      den[area] += weight;
    }
  }

  const scores = {} as Record<BodyArea, number>;
  const covered: number[] = [];
  for (const area of BODY_AREAS) {
    scores[area] = den[area] > 0 ? Math.round((num[area] / den[area]) * 100) : 0;
    if (den[area] > 0) covered.push(scores[area]);
  }
  const overall = covered.length
    ? Math.round(covered.reduce((a, b) => a + b, 0) / covered.length)
    : 0;
  return { scores, overall };
}

/** Schwächste Bereiche: alle unter 75, mindestens 2, maximal 3. */
export function weakestAreas(scores: Record<BodyArea, number>): BodyArea[] {
  const sorted = [...BODY_AREAS].sort((a, b) => scores[a] - scores[b]);
  const below = sorted.filter((a) => scores[a] < 75);
  const count = Math.min(3, Math.max(2, below.length));
  return sorted.slice(0, count);
}

export function scoreColor(score: number): string {
  if (score >= 75) return '#34d399';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

export function scoreLabel(score: number): string {
  if (score >= 75) return 'Gut';
  if (score >= 50) return 'Ausbaufähig';
  return 'Schwachstelle';
}
