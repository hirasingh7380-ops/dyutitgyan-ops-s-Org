import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, ArrowLeft, ArrowRight, Trophy, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MathMatchWordStageProps {
  soundEnabled: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

interface MathMatchItem {
  num: number;
  word: string;
  hindiName: string;
}

interface MathMatchSet {
  title: string;
  range: string;
  items: MathMatchItem[];
  defaultBottomOrder: number[];
}

const MATH_MATCH_SETS: MathMatchSet[] = [
  {
    title: 'स्तर 1: 1 से 5 (ONE to FIVE)',
    range: '1–5',
    items: [
      { num: 1, word: 'ONE', hindiName: 'एक' },
      { num: 2, word: 'TWO', hindiName: 'दो' },
      { num: 3, word: 'THREE', hindiName: 'तीन' },
      { num: 4, word: 'FOUR', hindiName: 'चार' },
      { num: 5, word: 'FIVE', hindiName: 'पाँच' },
    ],
    defaultBottomOrder: [3, 5, 1, 4, 2],
  },
  {
    title: 'स्तर 2: 6 से 10 (SIX to TEN)',
    range: '6–10',
    items: [
      { num: 6, word: 'SIX', hindiName: 'छह' },
      { num: 7, word: 'SEVEN', hindiName: 'सात' },
      { num: 8, word: 'EIGHT', hindiName: 'आठ' },
      { num: 9, word: 'NINE', hindiName: 'नौ' },
      { num: 10, word: 'TEN', hindiName: 'दस' },
    ],
    defaultBottomOrder: [8, 10, 6, 9, 7],
  },
  {
    title: 'स्तर 3: 11 से 15 (ELEVEN to FIFTEEN)',
    range: '11–15',
    items: [
      { num: 11, word: 'ELEVEN', hindiName: 'ग्यारह' },
      { num: 12, word: 'TWELVE', hindiName: 'बारह' },
      { num: 13, word: 'THIRTEEN', hindiName: 'तेरह' },
      { num: 14, word: 'FOURTEEN', hindiName: 'चौदह' },
      { num: 15, word: 'FIFTEEN', hindiName: 'पंद्रह' },
    ],
    defaultBottomOrder: [13, 11, 15, 12, 14],
  },
  {
    title: 'स्तर 4: 16 से 20 (SIXTEEN to TWENTY)',
    range: '16–20',
    items: [
      { num: 16, word: 'SIXTEEN', hindiName: 'सोलह' },
      { num: 17, word: 'SEVENTEEN', hindiName: 'सत्रह' },
      { num: 18, word: 'EIGHTEEN', hindiName: 'अठारह' },
      { num: 19, word: 'NINETEEN', hindiName: 'उन्नीस' },
      { num: 20, word: 'TWENTY', hindiName: 'बीस' },
    ],
    defaultBottomOrder: [18, 16, 20, 17, 19],
  },
];

export const MathMatchWordStage: React.FC<MathMatchWordStageProps> = ({
  soundEnabled,
  onHome,
  onToggleSound,
}) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentSet = MATH_MATCH_SETS[levelIndex];

  // Matched number IDs (e.g. 1, 2, 3)
  const [matchedNums, setMatchedNums] = useState<Set<number>>(new Set());

  // Connected permanent lines for SVG overlay
  const [connectedLines, setConnectedLines] = useState<
    { num: number; x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  // Drag line state while dragging
  const [dragLine, setDragLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [activeDragNum, setActiveDragNum] = useState<number | null>(null);
  const [dragFromType, setDragFromType] = useState<'TOP_WORD' | 'BOTTOM_NUM' | null>(null);

  // Tap-to-select states
  const [selectedWordNum, setSelectedWordNum] = useState<number | null>(null);
  const [selectedDigitNum, setSelectedDigitNum] = useState<number | null>(null);
  const [errorNum, setErrorNum] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // Element DOM refs to measure centers for line drawing
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const digitRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Reset lines and matches when changing level
  useEffect(() => {
    setMatchedNums(new Set());
    setConnectedLines([]);
    setDragLine(null);
    setActiveDragNum(null);
    setDragFromType(null);
    setSelectedWordNum(null);
    setSelectedDigitNum(null);
    setErrorNum(null);
  }, [levelIndex]);

  // Recalculate line coordinates on window resize or orientation change
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || connectedLines.length === 0) return;
      const cRect = containerRef.current.getBoundingClientRect();

      setConnectedLines((prev) =>
        prev.map((line) => {
          const wEl = wordRefs.current[line.num];
          const dEl = digitRefs.current[line.num];
          if (wEl && dEl) {
            const wRect = wEl.getBoundingClientRect();
            const dRect = dEl.getBoundingClientRect();
            return {
              num: line.num,
              x1: wRect.left + wRect.width / 2 - cRect.left,
              y1: wRect.bottom - cRect.top,
              x2: dRect.left + dRect.width / 2 - cRect.left,
              y2: dRect.top - cRect.top,
            };
          }
          return line;
        })
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [connectedLines.length]);

  // Handle successful match
  const handleMatchSuccess = (matchedNumber: number) => {
    const item = currentSet.items.find((it) => it.num === matchedNumber);
    if (!item) return;

    sounds.speakMathMatchPair(matchedNumber, item.word, soundEnabled);

    // Calculate line coordinates
    if (containerRef.current) {
      const cRect = containerRef.current.getBoundingClientRect();
      const wEl = wordRefs.current[matchedNumber];
      const dEl = digitRefs.current[matchedNumber];
      if (wEl && dEl) {
        const wRect = wEl.getBoundingClientRect();
        const dRect = dEl.getBoundingClientRect();
        setConnectedLines((prev) => [
          ...prev,
          {
            num: matchedNumber,
            x1: wRect.left + wRect.width / 2 - cRect.left,
            y1: wRect.bottom - cRect.top,
            x2: dRect.left + dRect.width / 2 - cRect.left,
            y2: dRect.top - cRect.top,
          },
        ]);
      }
    }

    setMatchedNums((prev) => new Set(prev).add(matchedNumber));
    setScore((prev) => prev + 20);
    setSelectedWordNum(null);
    setSelectedDigitNum(null);

    // If level is complete (all 5 matched)
    if (matchedNums.size + 1 === currentSet.items.length) {
      setTimeout(() => {
        sounds.playVictory(soundEnabled);
      }, 700);
    }
  };

  // Handle wrong match attempt
  const handleMatchError = (wrongTargetNum: number) => {
    sounds.speakMatchWrong(soundEnabled);
    setErrorNum(wrongTargetNum);
    setTimeout(() => setErrorNum(null), 700);
    setSelectedWordNum(null);
    setSelectedDigitNum(null);
  };

  // Process a pair connection
  const processMatchAttempt = (wordNum: number, digitNum: number) => {
    if (wordNum === digitNum) {
      handleMatchSuccess(wordNum);
    } else {
      handleMatchError(digitNum);
    }
  };

  // --- DRAG INTERACTION ---
  const handleWordPointerDown = (item: MathMatchItem, e: React.PointerEvent) => {
    if (matchedNums.has(item.num)) return;
    e.preventDefault();

    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const el = wordRefs.current[item.num];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 - cRect.left;
    const startY = rect.bottom - cRect.top;

    setActiveDragNum(item.num);
    setDragFromType('TOP_WORD');
    setDragLine({ x1: startX, y1: startY, x2: e.clientX - cRect.left, y2: e.clientY - cRect.top });
    sounds.playSnap(soundEnabled);
  };

  const handleDigitPointerDown = (num: number, e: React.PointerEvent) => {
    if (matchedNums.has(num)) return;
    e.preventDefault();

    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const el = digitRefs.current[num];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 - cRect.left;
    const startY = rect.top - cRect.top;

    setActiveDragNum(num);
    setDragFromType('BOTTOM_NUM');
    setDragLine({ x1: startX, y1: startY, x2: e.clientX - cRect.left, y2: e.clientY - cRect.top });
    sounds.playSnap(soundEnabled);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragLine || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    setDragLine((prev) => (prev ? { ...prev, x2: e.clientX - cRect.left, y2: e.clientY - cRect.top } : null));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragLine || activeDragNum === null) {
      setDragLine(null);
      setActiveDragNum(null);
      setDragFromType(null);
      return;
    }

    const currentDragNum = activeDragNum;
    const currentFromType = dragFromType;

    setDragLine(null);
    setActiveDragNum(null);
    setDragFromType(null);

    // Hit-testing on the destination elements
    if (currentFromType === 'TOP_WORD') {
      // Find which digit card is under pointer
      let targetDigit: number | null = null;
      for (const d of currentSet.defaultBottomOrder) {
        const el = digitRefs.current[d];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            e.clientX >= rect.left - 25 &&
            e.clientX <= rect.right + 25 &&
            e.clientY >= rect.top - 25 &&
            e.clientY <= rect.bottom + 25
          ) {
            targetDigit = d;
            break;
          }
        }
      }
      if (targetDigit !== null) {
        processMatchAttempt(currentDragNum, targetDigit);
      }
    } else if (currentFromType === 'BOTTOM_NUM') {
      // Find which word box is under pointer
      let targetWord: number | null = null;
      for (const it of currentSet.items) {
        const el = wordRefs.current[it.num];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            e.clientX >= rect.left - 25 &&
            e.clientX <= rect.right + 25 &&
            e.clientY >= rect.top - 25 &&
            e.clientY <= rect.bottom + 25
          ) {
            targetWord = it.num;
            break;
          }
        }
      }
      if (targetWord !== null) {
        processMatchAttempt(targetWord, currentDragNum);
      }
    }
  };

  // --- TAP TO SELECT INTERACTION ---
  const handleWordClick = (num: number) => {
    if (matchedNums.has(num)) return;
    sounds.playSnap(soundEnabled);

    if (selectedDigitNum !== null) {
      processMatchAttempt(num, selectedDigitNum);
    } else {
      setSelectedWordNum(selectedWordNum === num ? null : num);
    }
  };

  const handleDigitClick = (num: number) => {
    if (matchedNums.has(num)) return;
    sounds.playSnap(soundEnabled);

    if (selectedWordNum !== null) {
      processMatchAttempt(selectedWordNum, num);
    } else {
      setSelectedDigitNum(selectedDigitNum === num ? null : num);
    }
  };

  const handleNext = () => {
    sounds.playVictory(soundEnabled);
    setLevelIndex((prev) => (prev + 1) % MATH_MATCH_SETS.length);
  };

  const handleReset = () => {
    sounds.playPop(soundEnabled);
    setMatchedNums(new Set());
    setConnectedLines([]);
    setSelectedWordNum(null);
    setSelectedDigitNum(null);
  };

  const isAllMatched = matchedNums.size === currentSet.items.length;

  return (
    <div
      id="math-match-word-stage"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full max-h-[100dvh] overflow-hidden select-none flex flex-col justify-between touch-none box-border"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, #a2e8dd 0%, #a8e063 45%, #56ab2f 100%)',
      }}
    >
      {/* Cartoon Forest Background Scene matching English Match Word */}
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
      <div
        id="match-top-header"
        className="relative z-30 w-full px-2 sm:px-6 pt-1 sm:pt-2 pb-0.5 flex items-center justify-between max-w-7xl mx-auto shrink-0"
      >
        {/* LEFT: Home Button */}
        <motion.button
          id="btn-match-home"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onHome}
          className="bg-sky-400 border-2 sm:border-3 border-red-600 text-yellow-300 font-black text-xs sm:text-lg md:text-xl px-3 sm:px-6 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xl cursor-pointer flex items-center gap-1"
          style={{
            textShadow: '1px 1px 0px #000, -1px -1px 0px #000',
            boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.6)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </motion.button>

        {/* CENTER TITLE: "Match the word" */}
        <div className="flex flex-col items-center justify-center">
          <h1
            className="text-lg sm:text-2xl md:text-3xl font-black text-red-600 tracking-wide uppercase drop-shadow-lg"
            style={{
              textShadow:
                '2px 2px 0px #fef08a, -2px -2px 0px #fef08a, 2px -2px 0px #fef08a, -2px 2px 0px #fef08a, 0 3px 6px rgba(0,0,0,0.3)',
              fontFamily: 'sans-serif',
            }}
          >
            Match the word
          </h1>
          <span className="text-[10px] sm:text-xs font-bold text-emerald-950 bg-yellow-300/90 px-2.5 py-0.5 rounded-full shadow">
            {currentSet.title}
          </span>
        </div>

        {/* RIGHT: Next / Reset Button & Sound Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={onToggleSound}
            className="bg-black/50 border-2 border-white/40 text-yellow-300 p-1 sm:p-2 rounded-xl cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </motion.button>

          <motion.button
            id="btn-match-next"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleNext}
            className="bg-sky-400 border-2 sm:border-3 border-red-600 text-yellow-300 font-black text-xs sm:text-lg md:text-xl px-3 sm:px-6 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xl cursor-pointer flex items-center gap-1"
            style={{
              textShadow: '1px 1px 0px #000, -1px -1px 0px #000',
              boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.6)',
            }}
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* SVG CONNECTING LINES OVERLAY LAYER */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <defs>
          <filter id="math-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render active dragging line */}
        {dragLine && (
          <g id="drag-line-active">
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.9"
              filter="url(#math-glow)"
            />
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#facc15"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Render successfully connected permanent lines */}
        {connectedLines.map((line) => (
          <g key={line.num} className="transition-all duration-300">
            {/* Outer Glow Line */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#15803d"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.85"
              filter="url(#math-glow)"
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
            <circle cx={line.x1} cy={line.y1} r="7" fill="#22c55e" />
            <circle cx={line.x2} cy={line.y2} r="7" fill="#22c55e" />
          </g>
        ))}
      </svg>

      {/* PLAYING CANVAS CONTENT */}
      <div className="relative z-30 flex-1 flex flex-col justify-between w-full max-w-7xl mx-auto py-1 sm:py-2 px-2 sm:px-6">
        {/* TOP ROW: 5 WORD BOXES (ONE, TWO, THREE, FOUR, FIVE) */}
        <div
          id="match-top-words-row"
          className="w-full max-w-4xl mx-auto px-1 flex items-center justify-around sm:justify-center sm:gap-6 md:gap-8 pt-0.5"
        >
          {currentSet.items.map((item) => {
            const isMatched = matchedNums.has(item.num);
            const isSelected = selectedWordNum === item.num;

            return (
              <motion.div
                key={item.num}
                ref={(el) => {
                  wordRefs.current[item.num] = el;
                }}
                onPointerDown={(e) => handleWordPointerDown(item, e)}
                onClick={() => handleWordClick(item.num)}
                whileHover={!isMatched ? { scale: 1.06 } : {}}
                whileTap={!isMatched ? { scale: 0.94 } : {}}
                animate={isSelected ? { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
                className={`relative w-15 sm:w-24 md:w-30 h-13 sm:h-17 md:h-20 rounded-xl sm:rounded-2xl border-3 sm:border-4 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 shadow-xl p-1 select-none touch-manipulation ${
                  isMatched
                    ? 'bg-emerald-600 border-yellow-300 ring-3 ring-emerald-300/80 shadow-emerald-950/70'
                    : isSelected
                    ? 'bg-red-600 border-yellow-300 ring-4 ring-yellow-300/90 shadow-red-950/80 scale-105'
                    : 'bg-red-600 border-yellow-400 shadow-red-950/80 hover:bg-red-500'
                }`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.5), 0 6px 14px rgba(0,0,0,0.4)',
                }}
              >
                {/* BIG BOLD ENGLISH NUMBER WORD */}
                <span
                  className="font-black text-sm sm:text-xl md:text-2xl text-yellow-300 pointer-events-none leading-none tracking-wide text-center"
                  style={{
                    textShadow:
                      '2px 2px 0px #991b1b, -1px -1px 0px #991b1b, 1px -1px 0px #991b1b, -1px 1px 0px #991b1b',
                  }}
                >
                  {item.word}
                </span>

                {/* HINDI SUBTITLE */}
                <span className="text-[9px] sm:text-xs font-bold text-white/95 mt-0.5 sm:mt-1 pointer-events-none drop-shadow">
                  ({item.hindiName})
                </span>

                {/* Checkmark when matched */}
                {isMatched && (
                  <div className="absolute -top-1.5 -right-1.5 bg-yellow-300 text-emerald-900 rounded-full p-0.5 sm:p-1 border-2 border-white shadow-lg pointer-events-none">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* MIDDLE CLEARANCE / INSTRUCTION HINT */}
        <div className="w-full flex-1 min-h-[35px] sm:min-h-[60px] pointer-events-none flex items-center justify-center opacity-40">
          <span className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase bg-black/25 px-3.5 py-0.5 rounded-full backdrop-blur-xs">
            ⬇ शब्द से रेखा खींचकर नीचे सही संख्या पर मिलाएं ⬇
          </span>
        </div>

        {/* BOTTOM ROW: 5 NUMBER DIGIT CARDS (1, 2, 3, 4, 5 shuffled) */}
        <div
          id="match-bottom-digits-row"
          className="w-full max-w-4xl mx-auto px-1 flex items-center justify-around sm:justify-center sm:gap-6 md:gap-8 pb-0.5"
        >
          {currentSet.defaultBottomOrder.map((num) => {
            const isMatched = matchedNums.has(num);
            const isSelected = selectedDigitNum === num;
            const isError = errorNum === num;
            const item = currentSet.items.find((it) => it.num === num);

            return (
              <motion.div
                key={num}
                ref={(el) => {
                  digitRefs.current[num] = el;
                }}
                onPointerDown={(e) => handleDigitPointerDown(num, e)}
                onClick={() => handleDigitClick(num)}
                whileHover={!isMatched ? { scale: 1.06 } : {}}
                whileTap={!isMatched ? { scale: 0.94 } : {}}
                animate={
                  isError
                    ? { x: [-10, 10, -10, 10, 0] }
                    : isSelected
                    ? { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 0.8 } }
                    : {}
                }
                className={`relative w-15 sm:w-22 md:w-26 h-14 sm:h-18 md:h-22 rounded-xl sm:rounded-2xl border-3 sm:border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-xl p-1 select-none touch-manipulation ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300/80 shadow-emerald-950/40'
                    : isSelected
                    ? 'bg-amber-100 border-amber-500 ring-4 ring-yellow-400 shadow-amber-950/40 scale-105'
                    : isError
                    ? 'bg-red-100 border-red-500 ring-4 ring-red-400 shadow-red-950/40'
                    : 'bg-[#fffcf7] border-[#00a2ff] hover:border-sky-300 shadow-sky-950/40'
                }`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.9), 0 6px 16px rgba(0,0,0,0.3)',
                }}
              >
                {/* BIG DIGIT NUMBER */}
                <span
                  className={`font-black text-2xl sm:text-4xl md:text-5xl pointer-events-none leading-none ${
                    isMatched ? 'text-emerald-700' : 'text-blue-700'
                  }`}
                  style={{
                    textShadow: isMatched ? '1px 1px 0px #a7f3d0' : '1px 1px 0px #bfdbfe',
                  }}
                >
                  {num}
                </span>

                {/* Subtitle when matched */}
                {isMatched && item && (
                  <span className="font-black text-[9px] sm:text-[11px] text-emerald-800 uppercase tracking-wider pointer-events-none mt-0.5 leading-none">
                    {item.word}
                  </span>
                )}

                {/* Sparkles on matched card */}
                {isMatched && (
                  <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-5 sm:h-5 text-yellow-400 animate-spin pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FOOTER SCORE BAR */}
      <div
        id="match-footer"
        className="relative z-30 w-full px-3 sm:px-6 py-1 bg-black/40 backdrop-blur-xs flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-300 font-bold text-[10px] sm:text-xs">
            {currentSet.title} • {matchedNums.size}/5 मिले
          </span>
          <button
            onClick={handleReset}
            className="px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>दोबारा</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-300 font-black text-xs sm:text-sm">
            <Trophy className="w-3.5 h-3.5 fill-yellow-300" />
            <span>SCORE:</span>
            <span className="text-white font-black text-sm sm:text-base">{score}</span>
          </div>

          {isAllMatched && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNext}
              className="bg-yellow-400 text-blue-950 font-black text-xs sm:text-sm px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1 cursor-pointer animate-bounce"
            >
              <span>अगला स्तर</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
