import { describe, expect, it } from 'vitest';
import { mobilityTests } from '../data/mobilityTests';
import { BODY_AREAS, type TestAnswer } from '../types';
import { computeScores, weakestAreas } from './scoring';

function allAnswers(value: TestAnswer): Record<string, TestAnswer> {
  return Object.fromEntries(mobilityTests.map((t) => [t.id, value]));
}

describe('computeScores', () => {
  it('ergibt 100 überall bei voll erreichten Tests', () => {
    const { scores, overall } = computeScores(allAnswers(2));
    for (const area of BODY_AREAS) expect(scores[area]).toBe(100);
    expect(overall).toBe(100);
  });

  it('ergibt 0 überall bei nicht erreichten Tests', () => {
    const { scores, overall } = computeScores(allAnswers(0));
    for (const area of BODY_AREAS) expect(scores[area]).toBe(0);
    expect(overall).toBe(0);
  });

  it('ergibt 50 überall bei teilweise erreichten Tests', () => {
    const { scores, overall } = computeScores(allAnswers(1));
    for (const area of BODY_AREAS) expect(scores[area]).toBe(50);
    expect(overall).toBe(50);
  });

  it('jeder Körperbereich wird von mindestens einem Test abgedeckt', () => {
    const covered = new Set(
      mobilityTests.flatMap((t) => Object.keys(t.bereiche)),
    );
    for (const area of BODY_AREAS) expect(covered.has(area)).toBe(true);
  });
});

describe('weakestAreas', () => {
  it('liefert 2–3 Bereiche, die schwächsten zuerst', () => {
    const { scores } = computeScores(allAnswers(2));
    scores.handgelenke = 10;
    scores.huefte = 40;
    scores.schultern = 60;
    const weak = weakestAreas(scores);
    expect(weak.length).toBeGreaterThanOrEqual(2);
    expect(weak.length).toBeLessThanOrEqual(3);
    expect(weak[0]).toBe('handgelenke');
    expect(weak).toContain('huefte');
  });
});
