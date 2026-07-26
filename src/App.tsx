import { useLiveQuery } from 'dexie-react-hooks';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { db } from './lib/db';
import { Dashboard } from './pages/Dashboard';
import { HistoryPage } from './pages/HistoryPage';
import { LibraryPage } from './pages/LibraryPage';
import { Onboarding } from './pages/Onboarding';
import { ProgramPage } from './pages/ProgramPage';
import { SessionPlayer } from './pages/SessionPlayer';
import { TestFlow } from './pages/TestFlow';
import { TestResultPage } from './pages/TestResultPage';

const FULLSCREEN_PREFIXES = ['/onboarding', '/test', '/session', '/ergebnis'];

function Shell() {
  const location = useLocation();
  // undefined = Dexie lädt noch, null = kein Profil vorhanden
  const profile = useLiveQuery(async () => (await db.profile.get('me')) ?? null, []);

  if (profile === undefined) return null;

  const needsOnboarding = !profile?.onboarded;
  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  // Nach abgeschlossenem Onboarding direkt in den Test weiterleiten
  // (fängt auch die Live-Query-Latenz beim ersten Speichern ab).
  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/test" replace />;
  }

  const fullscreen = FULLSCREEN_PREFIXES.some((p) => location.pathname.startsWith(p));

  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/test" element={<TestFlow />} />
        <Route path="/ergebnis/:id" element={<TestResultPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/programm" element={<ProgramPage />} />
        <Route path="/session/:programId/:week/:day" element={<SessionPlayer />} />
        <Route path="/verlauf" element={<HistoryPage />} />
        <Route path="/bibliothek" element={<LibraryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!fullscreen && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell />
    </BrowserRouter>
  );
}
