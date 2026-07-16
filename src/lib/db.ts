import Dexie, { type Table } from 'dexie';
import type {
  CompletedSession,
  Profile,
  ProgramRecord,
  TestResultRecord,
} from '../types';

class CaliMobilityDB extends Dexie {
  testResults!: Table<TestResultRecord, number>;
  programs!: Table<ProgramRecord, number>;
  completedSessions!: Table<CompletedSession, number>;
  profile!: Table<Profile, string>;

  constructor() {
    super('cali-mobility');
    this.version(1).stores({
      testResults: '++id, date',
      programs: '++id, createdAt, sourceTestId',
      completedSessions: '++id, programId, date, [programId+week+day]',
      profile: 'id',
    });
  }
}

export const db = new CaliMobilityDB();
