export type BodyArea =
  | 'schultern'
  | 'handgelenke'
  | 'huefte'
  | 'hamstrings'
  | 'wirbelsaeule'
  | 'sprunggelenke';

export const BODY_AREAS: BodyArea[] = [
  'schultern',
  'handgelenke',
  'huefte',
  'hamstrings',
  'wirbelsaeule',
  'sprunggelenke',
];

export const AREA_LABELS: Record<BodyArea, string> = {
  schultern: 'Schultern',
  handgelenke: 'Handgelenke',
  huefte: 'Hüfte',
  hamstrings: 'Hamstrings',
  wirbelsaeule: 'Wirbelsäule',
  sprunggelenke: 'Sprunggelenke',
};

export type Skill =
  | 'handstand'
  | 'planche'
  | 'frontlever'
  | 'backlever'
  | 'lsit'
  | 'pancake'
  | 'bridge'
  | 'muscleup';

export const SKILL_LABELS: Record<Skill, string> = {
  handstand: 'Handstand',
  planche: 'Planche',
  frontlever: 'Front Lever',
  backlever: 'Back Lever',
  lsit: 'L-Sit / V-Sit',
  pancake: 'Pancake / Straddle',
  bridge: 'Bridge',
  muscleup: 'Muscle-up',
};

export type ExerciseType = 'statisch' | 'dynamisch' | 'aktiv';

export interface Exercise {
  id: string;
  name: string;
  bereiche: BodyArea[];
  skills: Skill[];
  anleitung: string;
  cues: string[];
  dauerSek: number;
  seiten: 'beidseitig' | 'einseitig';
  intensitaet: 1 | 2 | 3;
  typ: ExerciseType;
}

/** 2 = voll erreicht, 1 = teilweise, 0 = nicht erreicht */
export type TestAnswer = 0 | 1 | 2;

export interface MobilityTest {
  id: string;
  name: string;
  skillBezug: string;
  anleitung: string;
  /** Gewichtung, mit der dieser Test in die Bereichs-Scores eingeht */
  bereiche: Partial<Record<BodyArea, number>>;
  kriterien: { voll: string; teilweise: string; nicht: string };
}

export interface TestResultRecord {
  id?: number;
  date: string; // ISO
  answers: Record<string, TestAnswer>;
  scores: Record<BodyArea, number>;
  overall: number;
}

export type SessionType = 'daily' | 'skill' | 'recovery';

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  daily: 'Daily Mobility',
  skill: 'Skill-Prep',
  recovery: 'Recovery',
};

export interface ProgramSession {
  week: number; // 1..4
  day: number; // 1..5
  typ: SessionType;
  titel: string;
  fokus: BodyArea[];
  exerciseIds: string[];
}

export interface ProgramRecord {
  id?: number;
  createdAt: string;
  sourceTestId: number;
  goalSkills: Skill[];
  weakAreas: BodyArea[];
  sessions: ProgramSession[];
}

export interface CompletedSession {
  id?: number;
  programId: number;
  week: number;
  day: number;
  date: string; // yyyy-mm-dd
  dauerSek: number;
}

export interface Profile {
  id: string; // immer 'me'
  goalSkills: Skill[];
  onboarded: boolean;
}
