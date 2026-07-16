import { describe, expect, it } from 'vitest';
import { exerciseById } from '../data/exercises';
import type { BodyArea } from '../types';
import { generateProgram } from './programGenerator';

const scores: Record<BodyArea, number> = {
  schultern: 40,
  handgelenke: 55,
  huefte: 80,
  hamstrings: 90,
  wirbelsaeule: 70,
  sprunggelenke: 95,
};

describe('generateProgram', () => {
  it('erzeugt 4 Wochen × 5 Sessions', () => {
    const { sessions } = generateProgram(scores, ['handstand']);
    expect(sessions).toHaveLength(20);
    expect(new Set(sessions.map((s) => `${s.week}-${s.day}`)).size).toBe(20);
  });

  it('referenziert nur existierende Übungen, ohne Duplikate pro Session', () => {
    const { sessions } = generateProgram(scores, ['planche', 'pancake']);
    for (const s of sessions) {
      expect(s.exerciseIds.length).toBeGreaterThanOrEqual(5);
      expect(new Set(s.exerciseIds).size).toBe(s.exerciseIds.length);
      for (const id of s.exerciseIds) expect(exerciseById.has(id)).toBe(true);
    }
  });

  it('identifiziert die schwächsten Bereiche', () => {
    const { weakAreas } = generateProgram(scores, []);
    expect(weakAreas).toContain('schultern');
    expect(weakAreas).toContain('handgelenke');
  });

  it('gewichtet die Schwachstellen (>50 % der Übungen treffen schwache Bereiche)', () => {
    const { weakAreas, sessions } = generateProgram(scores, ['handstand']);
    let weakHits = 0;
    let total = 0;
    for (const s of sessions) {
      for (const id of s.exerciseIds) {
        total++;
        const ex = exerciseById.get(id)!;
        if (ex.bereiche.some((a) => weakAreas.includes(a))) weakHits++;
      }
    }
    expect(weakHits / total).toBeGreaterThan(0.5);
  });

  it('hält Recovery-Sessions bei niedriger Intensität', () => {
    const { sessions } = generateProgram(scores, ['handstand']);
    for (const s of sessions.filter((s) => s.typ === 'recovery')) {
      for (const id of s.exerciseIds) {
        expect(exerciseById.get(id)!.intensitaet).toBeLessThanOrEqual(2);
      }
    }
  });

  it('ist deterministisch', () => {
    const a = generateProgram(scores, ['handstand']);
    const b = generateProgram(scores, ['handstand']);
    expect(a).toEqual(b);
  });
});
