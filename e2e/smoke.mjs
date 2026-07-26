// End-to-End-Smoke: Onboarding → Test → Ergebnis → Programm → Session → Dashboard
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const shots = process.env.SHOT_DIR ?? '/tmp';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => {
  console.error('PAGE ERROR:', e.message);
  process.exitCode = 1;
});

const step = async (name, fn) => {
  await fn();
  console.log('OK:', name);
};

await step('Onboarding lädt', async () => {
  await page.goto(BASE);
  await page.waitForSelector('text=Kenne deinen Körper');
});

await step('Skills wählen + Test starten', async () => {
  await page.click('text=Handstand');
  await page.click('text=Planche');
  await page.click('text=Mobility-Test starten');
  await page.waitForSelector('text=Mobility-Test');
  await page.click("text=Los geht's");
});

await step('10 Tests beantworten', async () => {
  const answers = [
    'Nicht erreicht', 'Teilweise', 'Nicht erreicht', 'Teilweise', 'Voll erreicht',
    'Voll erreicht', 'Teilweise', 'Teilweise', 'Nicht erreicht', 'Teilweise',
  ];
  for (const a of answers) {
    await page.waitForSelector(`text=${a}`);
    await page.click(`text=${a}`);
    await page.waitForTimeout(120);
  }
});

await step('Ergebnis-Screen mit Scores', async () => {
  await page.waitForSelector('text=Mobility Score');
  await page.screenshot({ path: `${shots}/smoke-ergebnis.png` });
});

await step('Programm erstellen', async () => {
  await page.click('text=4-Wochen-Programm erstellen');
  await page.waitForSelector('text=Dein Programm');
  await page.waitForSelector('text=Woche 4');
  await page.screenshot({ path: `${shots}/smoke-programm.png` });
});

await step('Session öffnen und durchspielen', async () => {
  await page.click('text=Daily · Fokus');
  await page.waitForSelector('text=Start');
  // Übungen per "Weiter" durchklicken bis zum Abschluss
  for (let i = 0; i < 40; i++) {
    const done = await page.locator('text=Session geschafft').count();
    if (done) break;
    await page.click('text=Weiter →');
    await page.waitForTimeout(60);
  }
  await page.waitForSelector('text=Session geschafft');
  await page.screenshot({ path: `${shots}/smoke-session-fertig.png` });
  await page.click('text=Zum Dashboard');
});

await step('Dashboard zeigt Streak und nächste Session', async () => {
  await page.waitForSelector('text=Dashboard');
  await page.waitForSelector('text=Tage Streak');
  await page.waitForSelector('text=Heutige Session');
  await page.screenshot({ path: `${shots}/smoke-dashboard.png` });
});

await step('Daten überleben Reload (IndexedDB)', async () => {
  await page.reload();
  await page.waitForSelector('text=Tage Streak');
});

await step('Verlauf und Bibliothek laden', async () => {
  await page.click('text=Verlauf');
  await page.waitForSelector('text=Trainingstage');
  await page.click('text=Übungen');
  await page.waitForSelector('text=Wall Slides');
});

await browser.close();
console.log(process.exitCode ? 'SMOKE FAILED' : 'SMOKE PASSED');
