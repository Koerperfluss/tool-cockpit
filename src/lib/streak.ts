/** Datum als yyyy-mm-dd in lokaler Zeit. */
export function toDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Anzahl aufeinanderfolgender Trainingstage bis heute.
 * Ein noch offener heutiger Tag bricht den Streak nicht.
 */
export function currentStreak(doneDays: Set<string>, today: Date = new Date()): number {
  let streak = 0;
  const cursor = new Date(today);
  if (!doneDays.has(toDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (doneDays.has(toDayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
