import type { MobilityTest } from '../types';

export const mobilityTests: MobilityTest[] = [
  {
    id: 'wand-schulterflexion',
    name: 'Schulterflexion an der Wand',
    skillBezug: 'Handstand-Linie, Überkopf-Positionen',
    anleitung:
      'Stelle dich mit dem Rücken flach an eine Wand, Fersen ca. 5 cm entfernt. Unterer Rücken bleibt an der Wand. Hebe beide gestreckten Arme über den Kopf und versuche, mit den Daumen die Wand zu berühren.',
    bereiche: { schultern: 1, wirbelsaeule: 0.3 },
    kriterien: {
      voll: 'Beide Daumen berühren die Wand mit gestreckten Ellbogen, ohne dass der untere Rücken abhebt.',
      teilweise: 'Hände kommen über Kopfhöhe, erreichen die Wand aber nicht oder nur mit gebeugten Ellbogen / hohlem Rücken.',
      nicht: 'Arme kommen kaum über Kopfhöhe oder der Rücken hebt deutlich ab.',
    },
  },
  {
    id: 'schulterextension',
    name: 'Schulterextension',
    skillBezug: 'German Hang, Manna, Dips-Tiefe',
    anleitung:
      'Setze dich aufrecht auf den Boden, Beine gestreckt. Platziere die Hände hinter dem Gesäß, Finger zeigen nach hinten. Rutsche mit dem Gesäß nach vorne, ohne die Hände zu bewegen, und halte die Arme gestreckt.',
    bereiche: { schultern: 1 },
    kriterien: {
      voll: 'Arme bleiben gestreckt und erreichen deutlich mehr als 45° Extension hinter dem Körper, Brust bleibt offen.',
      teilweise: 'Etwa 30–45° Extension möglich, danach runden die Schultern ein.',
      nicht: 'Weniger als 30° oder sofortiges Einrunden der Schultern.',
    },
  },
  {
    id: 'handgelenk-extension',
    name: 'Handgelenk-Extension',
    skillBezug: 'Planche, Handstand, Stützpositionen',
    anleitung:
      'Gehe in den Vierfüßlerstand, Handflächen flach am Boden, Finger zeigen nach vorne. Verlagere die Schultern langsam über und vor die Handgelenke, Handflächen bleiben komplett am Boden.',
    bereiche: { handgelenke: 1 },
    kriterien: {
      voll: 'Schultern kommen deutlich vor die Handgelenke (über 90° Extension), Handballen bleibt am Boden, kein Schmerz.',
      teilweise: 'Schultern kommen etwa senkrecht über die Handgelenke, weiter vor nur mit abhebendem Handballen oder Ziehen.',
      nicht: 'Bereits die senkrechte Position ist unangenehm oder der Handballen hebt ab.',
    },
  },
  {
    id: 'pancake',
    name: 'Pancake-Vorbeuge',
    skillBezug: 'Straddle Planche, V-Sit, Press to Handstand',
    anleitung:
      'Setze dich in die Grätsche (ca. 90°), Beine gestreckt, Kniescheiben zeigen zur Decke. Beuge dich mit geradem Rücken aus der Hüfte nach vorne.',
    bereiche: { hamstrings: 0.6, huefte: 0.6 },
    kriterien: {
      voll: 'Brust oder Bauch erreichen fast den Boden, Rücken bleibt lang, Beine gestreckt.',
      teilweise: 'Unterarme erreichen den Boden, aber der Rücken rundet oder die Knie beugen sich.',
      nicht: 'Aufrechtes Sitzen in der Grätsche ist bereits schwer, kaum Vorneigung möglich.',
    },
  },
  {
    id: 'pike',
    name: 'Pike-Vorbeuge im Stehen',
    skillBezug: 'L-Sit, Press to Handstand, Toes-to-Bar',
    anleitung:
      'Stelle dich hüftbreit hin, Beine gestreckt. Beuge dich aus der Hüfte nach vorne und greife so weit wie möglich Richtung Boden bzw. hinter die Fersen.',
    bereiche: { hamstrings: 1 },
    kriterien: {
      voll: 'Handflächen liegen flach am Boden oder du greifst hinter die Fersen, Beine gestreckt.',
      teilweise: 'Fingerspitzen erreichen den Boden oder die Zehen, Beine gestreckt.',
      nicht: 'Hände erreichen maximal die Schienbeine.',
    },
  },
  {
    id: 'tiefe-hocke',
    name: 'Tiefe Hocke',
    skillBezug: 'Grundlage für alle Beugemuster, Sprunggelenks-Basis',
    anleitung:
      'Stelle dich etwa schulterbreit hin, Füße maximal leicht nach außen rotiert. Gehe in die tiefste Hocke, Fersen bleiben am Boden, Arme vor dem Körper.',
    bereiche: { sprunggelenke: 0.8, huefte: 0.5 },
    kriterien: {
      voll: 'Volle Tiefe mit Fersen am Boden, aufrechter Oberkörper, 30 Sekunden entspannt haltbar.',
      teilweise: 'Volle Tiefe nur mit stark vorgeneigtem Oberkörper oder breiter Fußstellung, Fersen bleiben unten.',
      nicht: 'Fersen heben ab oder die tiefe Position ist nicht erreichbar.',
    },
  },
  {
    id: 'bruecke',
    name: 'Brücke',
    skillBezug: 'Überkopf-Mobilität, Back Lever, Bogenspannung',
    anleitung:
      'Lege dich auf den Rücken, stelle die Füße auf, Hände neben den Ohren. Drücke dich in die Brücke und versuche, die Arme zu strecken und die Schultern über die Hände zu schieben.',
    bereiche: { wirbelsaeule: 0.8, schultern: 0.5 },
    kriterien: {
      voll: 'Arme gestreckt, Schultern über oder hinter den Handgelenken, gleichmäßiger Bogen ohne Schmerz im unteren Rücken.',
      teilweise: 'Brücke möglich, aber Ellbogen gebeugt oder Schultern deutlich vor den Händen.',
      nicht: 'Hüfte hebt kaum ab oder die Position ist nicht haltbar.',
    },
  },
  {
    id: 'hueftbeuger',
    name: 'Hüftbeuger-Test (Ausfallschritt)',
    skillBezug: 'Hollow Body, Front Lever Linie, Handstand-Linie',
    anleitung:
      'Gehe in einen tiefen Ausfallschritt, hinteres Knie am Boden. Spanne Gesäß an, Becken aufgerichtet (kein Hohlkreuz), und schiebe die Hüfte nach vorne. Hebe dann den Arm der hinteren Seite über den Kopf.',
    bereiche: { huefte: 1 },
    kriterien: {
      voll: 'Deutliche Hüftstreckung mit aufgerichtetem Becken und gehobenem Arm, ohne ins Hohlkreuz auszuweichen, kein starkes Ziehen.',
      teilweise: 'Hüftstreckung möglich, aber starkes Ziehen vorne oder leichtes Ausweichen ins Hohlkreuz.',
      nicht: 'Kaum Hüftstreckung möglich, Becken kippt sofort nach vorne.',
    },
  },
  {
    id: 'thorakale-extension',
    name: 'Thorakale Extension',
    skillBezug: 'Rumpfspannung, gerade Linie in allen Skills',
    anleitung:
      'Knie dich vor eine Bank oder einen Stuhl, Ellbogen auf der Kante, Hände zusammen. Lasse den Brustkorb Richtung Boden sinken, während der untere Rücken neutral bleibt.',
    bereiche: { wirbelsaeule: 1 },
    kriterien: {
      voll: 'Brustkorb sinkt deutlich unter die Ellbogenlinie, Bewegung kommt sichtbar aus der Brustwirbelsäule.',
      teilweise: 'Etwas Bewegung vorhanden, aber der Großteil kommt aus dem unteren Rücken oder den Schultern.',
      nicht: 'Kaum Bewegung, oberer Rücken bleibt rund.',
    },
  },
  {
    id: 'straddle',
    name: 'Straddle (Seitgrätsche)',
    skillBezug: 'Straddle Planche, Straddle Press, Side Splits',
    anleitung:
      'Stelle dich breit hin und schiebe die Füße langsam weiter auseinander, Fußsohlen bleiben flach, Zehen zeigen nach vorne. Stütze dich bei Bedarf mit den Händen ab.',
    bereiche: { huefte: 0.8, hamstrings: 0.4 },
    kriterien: {
      voll: 'Grätsche deutlich über 120°, Becken bleibt neutral, Position kontrolliert haltbar.',
      teilweise: 'Etwa 90–120° Grätsche möglich.',
      nicht: 'Weniger als 90°, starkes Ziehen an der Innenseite.',
    },
  },
];
