# Cali Mobility

Mobility-App im Stil von pliability, aber gebaut für **Calisthenics-Athleten**:
Selbsttest → Mobility-Score pro Körperbereich → personalisiertes 4-Wochen-Programm →
geführte Sessions mit Timer, Streaks und Retest.

Mobile-first PWA — aufs iPhone installierbar (Safari → Teilen → „Zum Home-Bildschirm"),
läuft offline, alle Daten bleiben lokal auf dem Gerät (IndexedDB). Kein Account, kein Server.

## Features

- **Mobility-Test**: 10 geführte Selbsttests mit klaren Bestehens-Kriterien —
  calisthenics-spezifisch (Schulterflexion für die Handstand-Linie, Handgelenk-Extension
  für Planche, Pancake, Brücke, Hüftbeuger u. a.)
- **Scores**: 0–100 pro Bereich (Schultern, Handgelenke, Hüfte, Hamstrings,
  Wirbelsäule, Sprunggelenke) + Gesamtscore, mit Δ zum letzten Test
- **Programm-Generator**: deterministisch aus deinen Schwachstellen und Ziel-Skills
  (Handstand, Planche, Front/Back Lever, L-Sit, Pancake, Bridge, Muscle-up) —
  4 Wochen × 5 Sessions (Daily / Skill-Prep / Recovery)
- **Session-Player**: Übung für Übung mit Countdown, Cues und Seitenwechsel
- **Tracking**: Streak, Monats-Zähler, 12-Wochen-Heatmap, Score-Verlauf, Retest
- **Export**: Ergebnisse als JSON für Coach/Trainingspartner
- **Übungsbibliothek**: ~60 kuratierte Mobility-Übungen mit deutschen Anleitungen,
  filterbar nach Körperbereich

## Entwicklung

```bash
npm install
npm run dev        # Dev-Server
npm test           # Unit-Tests (Scoring + Programm-Generator)
npm run build      # Produktions-Build inkl. PWA/Service-Worker
npm run preview    # gebaute App lokal serven
node e2e/smoke.mjs # End-to-End-Smoke (erwartet preview auf :4173 und Chromium)
```

## Architektur

- Vite + React 18 + TypeScript + Tailwind CSS, `vite-plugin-pwa`
- Dexie (IndexedDB) für Testergebnisse, Programme, erledigte Sessions, Profil
- Kernlogik ohne UI-Abhängigkeiten in `src/lib/` (`scoring.ts`, `programGenerator.ts`)
- Inhalte als typisierte Daten in `src/data/` (`mobilityTests.ts`, `exercises.ts`)

## Roadmap (Phase 2)

- KI-Form-Check: Foto in Testposition → Vision-LLM bewertet (lokal via Ollama oder API)
- Kamera-Pose-Tracking (MediaPipe) für den Mobility-Test
- Übungs-GIFs/Videos, Apple-Health-Sync, Mehrsprachigkeit
