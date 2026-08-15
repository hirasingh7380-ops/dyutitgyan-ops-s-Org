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
  id: string;
  letter: string;
  wordName: string;
  svgType: string;
}

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
        className="w-full h-full object-cover rounded-xl pointer-events-none"
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-20 sm:h-20">
      <circle cx="50" cy="50" r="35" fill="#f59e0b" />
      <text x="50" y="60" fontSize="28" textAnchor="middle" fill="#fff" fontWeight="bold">?</text>
    </svg>
  );
};

export const MatchWordStage: React.FC<MatchWordStageProps> = ({
  soundEnabled,
  onHome,
}) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentSet = MATCH_SETS[levelIndex];

  const [letterItems, setLetterItems] = useState<MatchItem[]>(currentSet.items);
  const [objectItems, setObjectItems] = useState<MatchItem[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const objectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [lines, setLines] = useState<{ id: string; x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [dragLine, setDragLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

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
        const y1 = lRect.bottom - containerRect.top - 6;

        const x2 = oRect.left + oRect.width / 2 - containerRect.left;
        const y2 = oRect.top - containerRect.top + 6;

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

  const handleLetterPointerDown = (item: MatchItem, e: React.PointerEvent) => {
    if (matchedIds.has(item.id)) return;

    sounds.playSnap(soundEnabled);
    setSelectedLetterId(item.id);
    setDraggingFrom(item.id);

    const lEl = letterRefs.current[item.id];
    if (lEl && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const lRect = lEl.getBoundingClientRect();
      const startX = lRect.left + lRect.width / 2 - containerRect.left;
      const startY = lRect.bottom - containerRect.top - 6;

      const currentX = e.clientX - containerRect.left;
      const currentY = e.clientY - containerRect.top;

      setDragLine({ x1: startX, y1: startY, x2: currentX, y2: currentY });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingFrom || !dragLine || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    setDragLine((prev) => (prev ? { ...prev, x2: currentX, y2: currentY } : null));
  };

  const processMatchAttempt = (letterId: string, targetObjItem: MatchItem) => {
    if (matchedIds.has(targetObjItem.id)) return;

    if (letterId === targetObjItem.id) {
      const newMatched = new Set(matchedIds).add(targetObjItem.id);
      setMatchedIds(newMatched);
      setSelectedLetterId(null);
      setScore((prev) => prev + 10);
      sounds.speakMatchWord(targetObjItem.letter, targetObjItem.wordName, soundEnabled);
    } else {
      sounds.speakMatchWrong(soundEnabled);
      setErrorId(targetObjItem.id);
      setTimeout(() => setErrorId(null), 400);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingFrom) return;

    const activeLetterId = draggingFrom;
    setDraggingFrom(null);
    setDragLine(null);

    const targetElement = document.elementFromPoint(e.clientX, e.clientY);
    if (targetElement) {
      const cardElement = targetElement.closest('[data-object-id]');
      if (cardElement) {
        const targetId = cardElement.getAttribute('data-object-id');
        const targetItem = objectItems.find((it) => it.id === targetId);
        if (targetItem) {
          processMatchAttempt(activeLetterId, targetItem);
        }
      }
    }
  };

  const handleObjectClick = (item: MatchItem) => {
    if (matchedIds.has(item.id)) return;
    if (!selectedLetterId) {
      sounds.playSnap(soundEnabled);
      return;
    }
    processMatchAttempt(selectedLetterId, item);
  };

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
      className="relative w-full h-screen overflow-hidden select-none flex flex-col justify-between touch-none"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, #a2e8dd 0%, #a8e063 45%, #56ab2f 100%)',
      }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-0 inset-x-0 h-40 sm:h-56 bg-gradient-to-t from-emerald-800 via-green-600 to-transparent" />
      </div>

      {/* TOP HEADER */}
      <div id="match-top-header" className="relative z-30 w-full px-3 sm:px-6 pt-2 flex items-center justify-between max-w-6xl mx-auto">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="bg-sky-400 border-2 border-white text-yellow-300 font-bold text-base sm:text-xl px-4 sm:px-6 py-1 rounded-xl shadow cursor-pointer"
        >
          Home
        </motion.button>

        <h1 className="text-xl sm:text-3xl font-black text-red-600 uppercase tracking-wide">
          Match The Word
        </h1>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="bg-sky-400 border-2 border-white text-yellow-300 font-bold text-base sm:text-xl px-4 sm:px-6 py-1 rounded-xl shadow cursor-pointer"
        >
          Next
        </motion.button>
      </div>

      {/* SVG CONNECTING LINES */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {dragLine && (
          <g>
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#ef4444"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx={dragLine.x1} cy={dragLine.y1} r="6" fill="#facc15" />
            <circle cx={dragLine.x2} cy={dragLine.y2} r="6" fill="#ef4444" />
          </g>
        )}

        {lines.map((line) => (
          <g key={line.id}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#22c55e"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx={line.x1} cy={line.y1} r="6" fill="#22c55e" />
            <circle cx={line.x2} cy={line.y2} r="6" fill="#22c55e" />
          </g>
        ))}
      </svg>

      {/* PLAYING CARDS */}
      <div className="relative z-30 flex-1 flex flex-col justify-between my-auto py-2 max-w-5xl w-full mx-auto">
        {/* TOP ROW: LETTER TILES */}
        <div id="match-letters-row" className="w-full px-2 flex items-center justify-around sm:justify-center sm:gap-6">
          {letterItems.map((item) => {
            const isMatched = matchedIds.has(item.id);
            const isSelected = selectedLetterId === item.id;

            return (
              <motion.div
                key={item.id}
                ref={(el) => { letterRefs.current[item.id] = el; }}
                onPointerDown={(e) => handleLetterPointerDown(item, e)}
                whileTap={!isMatched ? { scale: 0.92 } : {}}
                className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-2 sm:border-3 flex items-center justify-center cursor-grab active:cursor-grabbing transition-all shadow-md ${
                  isMatched
                    ? 'bg-emerald-600 border-yellow-300'
                    : isSelected
                    ? 'bg-red-600 border-yellow-300 ring-4 ring-yellow-300'
                    : 'bg-red-600 border-white hover:bg-red-500'
                }`}
              >
                <span className="font-bold text-3xl sm:text-5xl text-yellow-300 pointer-events-none">
                  {item.letter}
                </span>

                {isMatched && (
                  <div className="absolute -top-1.5 -right-1.5 bg-yellow-300 text-emerald-900 rounded-full p-0.5 border border-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM ROW: OBJECT CARDS */}
        <div id="match-objects-row" className="w-full px-2 flex items-center justify-around sm:justify-center sm:gap-6">
          {objectItems.map((item) => {
            const isMatched = matchedIds.has(item.id);
            const isError = errorId === item.id;

            return (
              <motion.div
                key={item.id}
                data-object-id={item.id}
                ref={(el) => { objectRefs.current[item.id] = el; }}
                whileTap={!isMatched ? { scale: 0.94 } : {}}
                animate={isError ? { x: [-8, 8, -8, 8, 0] } : {}}
                onClick={() => handleObjectClick(item)}
                className={`relative w-16 h-20 sm:w-24 sm:h-32 rounded-2xl border-2 sm:border-3 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md p-1 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-500'
                    : 'bg-white border-blue-400 hover:border-blue-500'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                  <MatchSvgIllustration type={item.svgType} />
                </div>

                {isMatched && (
                  <span className="font-bold text-[10px] text-emerald-800 uppercase tracking-wider mt-0.5">
                    {item.wordName}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div id="match-footer" className="relative z-30 w-full px-4 py-1.5 bg-black/40 backdrop-blur-sm flex items-center justify-between">
        <div className="text-yellow-300 font-medium text-xs">
          {currentSet.title} • अक्षर से रेखा खींचकर चित्र मिलाएं
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-300 font-bold text-xs">SCORE:</span>
          <span className="text-white font-bold text-sm sm:text-base">{score}</span>
        </div>
      </div>
    </div>
  );
};