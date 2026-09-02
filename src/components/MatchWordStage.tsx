import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

import dogImg from '../assets/images/cute_golden_puppy_1785687671241.jpg';
import elephantImg from '../assets/images/cute_baby_elephant_1785687685978.jpg';
import appleImg from '../assets/images/shiny_red_apple_1785687700388.jpg';
import ballImg from '../assets/images/beach_ball_3d_1785687713302.jpg';
import catImg from '../assets/images/cute_orange_cat_1785687825964.jpg';

import fishImg from '../assets/images/cute_fish_3d_1785735375470.jpg';
import grapesImg from '../assets/images/purple_grapes_3d_1785735388218.jpg';
import hatImg from '../assets/images/blue_sun_hat_3d_1785735511651.jpg';
import icecreamImg from '../assets/images/ice_cream_cone_3d_1785735399773.jpg';
import jugImg from '../assets/images/water_jug_3d_1785735521539.jpg';

import kiteImg from '../assets/images/flying_kite_3d_1785735532364.jpg';
import lionImg from '../assets/images/cute_lion_cub_3d_1785735409317.jpg';
import mangoImg from '../assets/images/fresh_mango_3d_1785735420713.jpg';
import nestImg from '../assets/images/bird_nest_3d_1785735542169.jpg';
import orangeImg from '../assets/images/fresh_orange_3d_1785735432711.jpg';

import parrotImg from '../assets/images/cute_parrot_3d_1785735443865.jpg';
import queenImg from '../assets/images/golden_crown_3d_1785735553541.jpg';
import roseImg from '../assets/images/red_rose_3d_1785735454378.jpg';
import sunImg from '../assets/images/happy_sun_3d_1785735466543.jpg';
import tigerImg from '../assets/images/cute_tiger_cub_3d_1785735477708.jpg';

import umbrellaImg from '../assets/images/purple_umbrella_3d_1785735563346.jpg';
import vanImg from '../assets/images/red_van_toy_3d_1785735489075.jpg';
import watchImg from '../assets/images/wrist_watch_3d_1785735498414.jpg';
import xylophoneImg from '../assets/images/toy_xylophone_3d_1785735573158.jpg';
import yakImg from '../assets/images/fluffy_yak_3d_1785735583724.jpg';

interface MatchWordStageProps {
  soundEnabled: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

interface MatchItem {
  id: string; // e.g. 'A'
  letter: string; // 'A'
  wordName: string; // 'Apple'
  svgType: string;
}

// Data sets for sets of 5 letters each
const MATCH_SETS: { title: string; items: MatchItem[]; defaultBottomOrder?: string[] }[] = [
  {
    title: 'Level 1: A - E',
    items: [
      { id: 'A', letter: 'A', wordName: 'Apple', svgType: 'apple' },
      { id: 'B', letter: 'B', wordName: 'Ball', svgType: 'ball' },
      { id: 'C', letter: 'C', wordName: 'Cat', svgType: 'cat' },
      { id: 'D', letter: 'D', wordName: 'Dog', svgType: 'dog' },
      { id: 'E', letter: 'E', wordName: 'Elephant', svgType: 'elephant' },
    ],
    defaultBottomOrder: ['D', 'E', 'A', 'B', 'C'],
  },
  {
    title: 'Level 2: F - J',
    items: [
      { id: 'F', letter: 'F', wordName: 'Fish', svgType: 'fish' },
      { id: 'G', letter: 'G', wordName: 'Grapes', svgType: 'grapes' },
      { id: 'H', letter: 'H', wordName: 'Hat', svgType: 'hat' },
      { id: 'I', letter: 'I', wordName: 'Ice cream', svgType: 'icecream' },
      { id: 'J', letter: 'J', wordName: 'Jug', svgType: 'jug' },
    ],
    defaultBottomOrder: ['H', 'J', 'F', 'I', 'G'],
  },
  {
    title: 'Level 3: K - O',
    items: [
      { id: 'K', letter: 'K', wordName: 'Kite', svgType: 'kite' },
      { id: 'L', letter: 'L', wordName: 'Lion', svgType: 'lion' },
      { id: 'M', letter: 'M', wordName: 'Mango', svgType: 'mango' },
      { id: 'N', letter: 'N', wordName: 'Nest', svgType: 'nest' },
      { id: 'O', letter: 'O', wordName: 'Orange', svgType: 'orange' },
    ],
    defaultBottomOrder: ['M', 'O', 'K', 'N', 'L'],
  },
  {
    title: 'Level 4: P - T',
    items: [
      { id: 'P', letter: 'P', wordName: 'Parrot', svgType: 'parrot' },
      { id: 'Q', letter: 'Q', wordName: 'Queen', svgType: 'queen' },
      { id: 'R', letter: 'R', wordName: 'Rose', svgType: 'rose' },
      { id: 'S', letter: 'S', wordName: 'Sun', svgType: 'sun' },
      { id: 'T', letter: 'T', wordName: 'Tiger', svgType: 'tiger' },
    ],
    defaultBottomOrder: ['S', 'P', 'T', 'Q', 'R'],
  },
  {
    title: 'Level 5: U - Z',
    items: [
      { id: 'U', letter: 'U', wordName: 'Umbrella', svgType: 'umbrella' },
      { id: 'V', letter: 'V', wordName: 'Van', svgType: 'van' },
      { id: 'W', letter: 'W', wordName: 'Watch', svgType: 'watch' },
      { id: 'X', letter: 'X', wordName: 'Xylophone', svgType: 'xylophone' },
      { id: 'Y', letter: 'Y', wordName: 'Yak', svgType: 'yak' },
    ],
    defaultBottomOrder: ['W', 'Y', 'U', 'X', 'V'],
  },
];

// Vector / Realistic Image renderer for object cards matching the screenshot style
const MatchSvgIllustration: React.FC<{ type: string }> = ({ type }) => {
  const imgMap: { [key: string]: { src: string; alt: string } } = {
    dog: { src: dogImg, alt: 'Dog' },
    elephant: { src: elephantImg, alt: 'Elephant' },
    apple: { src: appleImg, alt: 'Apple' },
    ball: { src: ballImg, alt: 'Ball' },
    cat: { src: catImg, alt: 'Cat' },
    fish: { src: fishImg, alt: 'Fish' },
    grapes: { src: grapesImg, alt: 'Grapes' },
    hat: { src: hatImg, alt: 'Hat' },
    icecream: { src: icecreamImg, alt: 'Ice Cream' },
    jug: { src: jugImg, alt: 'Jug' },
    kite: { src: kiteImg, alt: 'Kite' },
    lion: { src: lionImg, alt: 'Lion' },
    mango: { src: mangoImg, alt: 'Mango' },
    nest: { src: nestImg, alt: 'Nest' },
    orange: { src: orangeImg, alt: 'Orange' },
    parrot: { src: parrotImg, alt: 'Parrot' },
    queen: { src: queenImg, alt: 'Queen Crown' },
    rose: { src: roseImg, alt: 'Rose' },
    sun: { src: sunImg, alt: 'Sun' },
    tiger: { src: tigerImg, alt: 'Tiger' },
    umbrella: { src: umbrellaImg, alt: 'Umbrella' },
    van: { src: vanImg, alt: 'Van' },
    watch: { src: watchImg, alt: 'Watch' },
    xylophone: { src: xylophoneImg, alt: 'Xylophone' },
    yak: { src: yakImg, alt: 'Yak' },
  };

  const item = imgMap[type];
  if (item) {
    return (
      <img
        src={item.src}
        alt={item.alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-xl sm:rounded-2xl pointer-events-none drop-shadow-md"
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-xl">
      <circle cx="50" cy="50" r="35" fill="#f59e0b" />
      <text x="50" y="60" fontSize="30" textAnchor="middle" fill="#fff" fontWeight="bold">?</text>
    </svg>
  );
};

export const MatchWordStage: React.FC<MatchWordStageProps> = ({
  soundEnabled,
  onHome,
}) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentSet = MATCH_SETS[levelIndex];

  // Top letter items (A, B, C, D, E)
  const [letterItems, setLetterItems] = useState<MatchItem[]>(currentSet.items);
  // Bottom object cards
  const [objectItems, setObjectItems] = useState<MatchItem[]>([]);

  // State for matched pairs (store set of matched item IDs, e.g. 'A')
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  // Currently selected top letter ID
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

  // Score
  const [score, setScore] = useState(0);

  // Container ref for measuring precise SVG line coordinates
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const objectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Line coordinates state: { id: string, x1: number, y1: number, x2: number, y2: number }
  const [lines, setLines] = useState<{ id: string; x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Live Line Drag state
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [dragLine, setDragLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // Error shake animation state
  const [errorId, setErrorId] = useState<string | null>(null);

  // Initialize level items and set bottom object cards order
  useEffect(() => {
    const items = MATCH_SETS[levelIndex].items;
    setLetterItems(items);

    if (MATCH_SETS[levelIndex].defaultBottomOrder) {
      const orderMap = MATCH_SETS[levelIndex].defaultBottomOrder!;
      const ordered = orderMap
        .map((id) => items.find((it) => it.id === id))
        .filter((it): it is MatchItem => it !== undefined);
      setObjectItems(ordered);
    } else {
      setObjectItems([...items]);
    }

    setMatchedIds(new Set());
    setSelectedLetterId(null);
    setDraggingFrom(null);
    setDragLine(null);
    setLines([]);
  }, [levelIndex]);

  // Recalculate locked line coordinates when matches change or on window resize
  const updateLineCoordinates = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newLines: { id: string; x1: number; y1: number; x2: number; y2: number }[] = [];

    matchedIds.forEach((id) => {
      const lEl = letterRefs.current[id];
      const oEl = objectRefs.current[id];

      if (lEl && oEl) {
        const lRect = lEl.getBoundingClientRect();
        const oRect = oEl.getBoundingClientRect();

        const x1 = lRect.left + lRect.width / 2 - containerRect.left;
        const y1 = lRect.bottom - containerRect.top - 8;

        const x2 = oRect.left + oRect.width / 2 - containerRect.left;
        const y2 = oRect.top - containerRect.top + 8;

        newLines.push({ id, x1, y1, x2, y2 });
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    updateLineCoordinates();
    window.addEventListener('resize', updateLineCoordinates);
    return () => window.removeEventListener('resize', updateLineCoordinates);
  }, [matchedIds, levelIndex, objectItems]);

  // Handle pointer down on letter tile -> Start interactive line drawing
  const handleLetterPointerDown = (item: MatchItem, e: React.PointerEvent) => {
    if (matchedIds.has(item.id)) return;

    sounds.playSnap(soundEnabled);
    setSelectedLetterId(item.id);
    setDraggingFrom(item.id);

    try {
      if (containerRef.current) {
        containerRef.current.setPointerCapture(e.pointerId);
      }
    } catch {
      // Ignore if pointer capture is not supported
    }

    const lEl = letterRefs.current[item.id];
    if (lEl && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const lRect = lEl.getBoundingClientRect();
      const startX = lRect.left + lRect.width / 2 - containerRect.left;
      const startY = lRect.bottom - containerRect.top - 8;

      const currentX = e.clientX - containerRect.left;
      const currentY = e.clientY - containerRect.top;

      setDragLine({ x1: startX, y1: startY, x2: currentX, y2: currentY });
    }
  };

  // Global Pointer Move -> Update live line endpoint
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingFrom || !dragLine || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    setDragLine((prev) => (prev ? { ...prev, x2: currentX, y2: currentY } : null));
  };

  // Check and register a match attempt between letter ID and target object item
  const processMatchAttempt = (letterId: string, targetObjItem: MatchItem) => {
    if (matchedIds.has(targetObjItem.id)) return;

    if (letterId === targetObjItem.id) {
      // SUCCESSFUL MATCH!
      const newMatched = new Set(matchedIds).add(targetObjItem.id);
      setMatchedIds(newMatched);
      setSelectedLetterId(null);
      setScore((prev) => prev + 10);

      // Play victory audio and speak e.g. "A for Apple"
      sounds.speakMatchWord(targetObjItem.letter, targetObjItem.wordName, soundEnabled);
    } else {
      // INCORRECT MATCH!
      sounds.speakMatchWrong(soundEnabled);
      setErrorId(targetObjItem.id);
      setTimeout(() => setErrorId(null), 500);
    }
  };

  // Global Pointer Up -> Complete line drag & drop match evaluation
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingFrom) return;

    const activeLetterId = draggingFrom;
    setDraggingFrom(null);
    setDragLine(null);

    let targetItem: MatchItem | null = null;

    // 1. Evaluate target element directly under drop coordinates
    const targetElement = document.elementFromPoint(e.clientX, e.clientY);
    if (targetElement) {
      const cardElement = targetElement.closest('[data-object-id]');
      if (cardElement) {
        const targetId = cardElement.getAttribute('data-object-id');
        targetItem = objectItems.find((it) => it.id === targetId) || null;
      }
    }

    // 2. Mobile touch tolerance fallback: distance check to object card rects
    if (!targetItem) {
      for (const it of objectItems) {
        const el = objectRefs.current[it.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            e.clientX >= rect.left - 30 &&
            e.clientX <= rect.right + 30 &&
            e.clientY >= rect.top - 30 &&
            e.clientY <= rect.bottom + 30
          ) {
            targetItem = it;
            break;
          }
        }
      }
    }

    if (targetItem) {
      processMatchAttempt(activeLetterId, targetItem);
    }
  };

  // Handle tap / click on bottom object card
  const handleObjectClick = (item: MatchItem) => {
    if (matchedIds.has(item.id)) return;

    if (!selectedLetterId) {
      sounds.playSnap(soundEnabled);
      return;
    }

    processMatchAttempt(selectedLetterId, item);
  };

  // Advance level on "Next" button click
  const handleNext = () => {
    sounds.playVictory(soundEnabled);
    setLevelIndex((prev) => (prev + 1) % MATCH_SETS.length);
  };

  return (
    <div
      id="match-word-stage"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full max-h-full overflow-hidden select-none flex flex-col justify-between touch-none"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, #a2e8dd 0%, #a8e063 45%, #56ab2f 100%)',
      }}
    >
      {/* Cartoon Forest Background Scene */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Big Tree */}
        <div className="absolute -top-10 -left-12 w-48 sm:w-80 h-full bg-amber-900/40 rounded-r-full" />
        <div className="absolute -top-16 -left-20 w-64 sm:w-96 h-80 sm:h-[450px] bg-green-600/90 rounded-full border-b-8 border-green-400 shadow-2xl" />

        {/* Right Big Tree */}
        <div className="absolute -top-10 -right-12 w-48 sm:w-80 h-full bg-amber-900/40 rounded-l-full" />
        <div className="absolute -top-16 -right-20 w-64 sm:w-96 h-80 sm:h-[450px] bg-green-600/90 rounded-full border-b-8 border-green-400 shadow-2xl" />

        {/* Distant Hills */}
        <div className="absolute bottom-0 inset-x-0 h-40 sm:h-56 bg-gradient-to-t from-emerald-800 via-green-600 to-transparent" />
      </div>

      {/* TOP HEADER BAR */}
      <div id="match-top-header" className="relative z-30 w-full px-2 sm:px-6 pt-1 sm:pt-2 pb-0.5 flex items-center justify-between max-w-7xl mx-auto shrink-0">
        {/* LEFT: Home Button */}
        <motion.button
          id="btn-match-home"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onHome}
          className="bg-sky-400 border-2 sm:border-3 border-red-600 text-yellow-300 font-black text-sm sm:text-2xl px-4 sm:px-8 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xl cursor-pointer flex items-center justify-center"
          style={{
            textShadow: '1px 1px 0px #000, -1px -1px 0px #000',
            boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.6)',
          }}
        >
          Home
        </motion.button>

        {/* CENTER TITLE: "Match the word" */}
        <div className="flex flex-col items-center justify-center">
          <h1
            className="text-xl sm:text-3xl md:text-4xl font-black text-red-600 tracking-wide uppercase drop-shadow-lg"
            style={{
              textShadow: '2px 2px 0px #fef08a, -2px -2px 0px #fef08a, 2px -2px 0px #fef08a, -2px 2px 0px #fef08a, 0 3px 6px rgba(0,0,0,0.3)',
              fontFamily: 'sans-serif',
            }}
          >
            Match the word
          </h1>
        </div>

        {/* RIGHT: Next Button */}
        <motion.button
          id="btn-match-next"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleNext}
          className="bg-sky-400 border-2 sm:border-3 border-red-600 text-yellow-300 font-black text-sm sm:text-2xl px-4 sm:px-8 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xl cursor-pointer flex items-center justify-center"
          style={{
            textShadow: '1px 1px 0px #000, -1px -1px 0px #000',
            boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.6)',
          }}
        >
          Next
        </motion.button>
      </div>

      {/* SVG CONNECTING LINES OVERLAY LAYER */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render active dragging live line */}
        {dragLine && (
          <g id="drag-line-active">
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#ef4444"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.9"
              filter="url(#glow)"
            />
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#facc15"
              strokeWidth="5"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
            <circle cx={dragLine.x1} cy={dragLine.y1} r="9" fill="#facc15" />
            <circle cx={dragLine.x2} cy={dragLine.y2} r="9" fill="#ef4444" />
          </g>
        )}

        {/* Render locked matched lines */}
        {lines.map((line) => (
          <g key={line.id}>
            {/* Outer Glow Line */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#22c55e"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.8"
              filter="url(#glow)"
            />
            {/* Inner Core Line */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#fef08a"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Start and end node dots */}
            <circle cx={line.x1} cy={line.y1} r="8" fill="#22c55e" />
            <circle cx={line.x2} cy={line.y2} r="8" fill="#22c55e" />
          </g>
        ))}
      </svg>

      {/* PLAYING CANVAS CONTENT (Spaced out top and bottom rows with maximum vertical separation) */}
      <div className="relative z-30 flex-1 flex flex-col justify-between w-full max-w-7xl mx-auto py-1 sm:py-3 px-2 sm:px-6 my-auto">
        {/* TOP ROW: LETTER TILES (Anchored at the top) */}
        <div id="match-letters-row" className="w-full max-w-5xl mx-auto px-2 flex items-center justify-around sm:justify-center sm:gap-8 pt-1">
          {letterItems.map((item) => {
            const isMatched = matchedIds.has(item.id);
            const isSelected = selectedLetterId === item.id;

            return (
              <motion.div
                key={item.id}
                ref={(el) => { letterRefs.current[item.id] = el; }}
                onPointerDown={(e) => handleLetterPointerDown(item, e)}
                whileHover={!isMatched ? { scale: 1.08 } : {}}
                whileTap={!isMatched ? { scale: 0.92 } : {}}
                animate={isSelected ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
                className={`relative w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl md:rounded-3xl border-3 sm:border-4 md:border-6 flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 shadow-xl ${
                  isMatched
                    ? 'bg-emerald-600 border-yellow-300 ring-4 ring-emerald-300/80 shadow-emerald-950/70'
                    : isSelected
                    ? 'bg-red-600 border-yellow-300 ring-4 ring-yellow-300/90 shadow-red-950/80'
                    : 'bg-red-600 border-yellow-400 shadow-red-950/80 hover:bg-red-500'
                }`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.5), 0 6px 14px rgba(0,0,0,0.4)',
                }}
              >
                {/* BIG BOLD YELLOW LETTER TEXT */}
                <span
                  className="font-black text-2xl sm:text-5xl md:text-6xl text-yellow-300 pointer-events-none leading-none"
                  style={{
                    textShadow: '2px 2px 0px #991b1b, -1px -1px 0px #991b1b, 1px -1px 0px #991b1b, -1px 1px 0px #991b1b',
                  }}
                >
                  {item.letter}
                </span>

                {/* Checkmark when matched */}
                {isMatched && (
                  <div className="absolute -top-1.5 -right-1.5 bg-yellow-300 text-emerald-900 rounded-full p-0.5 sm:p-1 border-2 border-white shadow-lg pointer-events-none">
                    <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[3]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* MIDDLE LINE-DRAWING CLEARANCE ZONE */}
        <div className="w-full flex-1 min-h-[30px] sm:min-h-[60px] pointer-events-none flex items-center justify-center opacity-30">
          <span className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase">
            ⬇ Drag line to match ⬇
          </span>
        </div>

        {/* BOTTOM ROW: OBJECT CARDS (Anchored at the bottom) */}
        <div id="match-objects-row" className="w-full max-w-5xl mx-auto px-2 flex items-center justify-around sm:justify-center sm:gap-8 pb-1">
          {objectItems.map((item) => {
            const isMatched = matchedIds.has(item.id);
            const isError = errorId === item.id;

            return (
              <motion.div
                key={item.id}
                data-object-id={item.id}
                ref={(el) => { objectRefs.current[item.id] = el; }}
                whileHover={!isMatched ? { scale: 1.06 } : {}}
                whileTap={!isMatched ? { scale: 0.94 } : {}}
                animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                onClick={() => handleObjectClick(item)}
                className={`relative w-16 h-20 sm:w-24 sm:h-30 md:w-30 md:h-36 rounded-xl sm:rounded-2xl md:rounded-[28px] border-3 sm:border-4 md:border-[5px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-xl p-1 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300/80'
                    : 'bg-[#fffcf7] border-[#00a2ff] hover:border-sky-300 shadow-sky-950/40'
                }`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.9), 0 6px 16px rgba(0,0,0,0.3)',
                }}
              >
                {/* Illustration SVG or High Quality 3D Image */}
                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg sm:rounded-xl md:rounded-[20px]">
                  <MatchSvgIllustration type={item.svgType} />
                </div>

                {/* Item Label text when matched */}
                {isMatched && (
                  <span className="font-black text-[9px] sm:text-xs text-emerald-800 uppercase tracking-wider pointer-events-none mt-0.5">
                    {item.wordName}
                  </span>
                )}

                {/* Sparkles on matched card */}
                {isMatched && (
                  <Sparkles className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 animate-spin pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FOOTER SCORE BAR */}
      <div id="match-footer" className="relative z-30 w-full px-4 sm:px-6 py-1 bg-black/40 backdrop-blur-xs flex items-center justify-between shrink-0">
        <div className="text-yellow-300 font-bold text-[10px] sm:text-xs">
          {currentSet.title} • अक्षर से रेखा खींचकर चित्र पर मिलाएं!
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-300 font-black text-xs sm:text-sm">SCORE:</span>
          <span className="text-white font-black text-sm sm:text-lg">{score}</span>
        </div>
      </div>
    </div>
  );
};
