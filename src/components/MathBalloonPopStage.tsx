import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowLeft, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MathBalloonPopStageProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBack: () => void;
}

interface BalloonItem {
  id: string;
  num: number;
  xBase: number; // percentage horizontally (5 - 85)
  y: number; // percentage from bottom (-20 to 110)
  speed: number;
  phase: number;
  colorBg: string;
  colorBorder: string;
  size: number;
}

const HINDI_NUMBER_NAMES: Record<number, string> = {
  1: 'एक', 2: 'दो', 3: 'तीन', 4: 'चार', 5: 'पाँच', 6: 'छह', 7: 'सात', 8: 'आठ', 9: 'नौ', 10: 'दस',
  11: 'ग्यारह', 12: 'बारह', 13: 'तेरह', 14: 'चौदह', 15: 'पंद्रह', 16: 'सोलह', 17: 'सत्रह', 18: 'अठारह', 19: 'उन्नीस', 20: 'बीस',
  21: 'इक्कीस', 22: 'बाईस', 23: 'तेईस', 24: 'चौबीस', 25: 'पच्चीस', 26: 'छब्बीस', 27: 'सत्ताईस', 28: 'अट्ठाइस', 29: 'उनतीस', 30: 'तीस',
  31: 'इकतीस', 32: 'बत्तीस', 33: 'तैंतीस', 34: 'चौंतीस', 35: 'पैंतीस', 36: 'छत्तीस', 37: 'सैंतीस', 38: 'अड़तीस', 39: 'उनतालीस', 40: 'चालीस',
  41: 'इकतालीस', 42: 'बयालीस', 43: 'तैंतालीस', 44: 'चवालीस', 45: 'पैंतालीस', 46: 'छियालीस', 47: 'सैंतालीस', 48: 'अड़तालीस', 49: 'उनचास', 50: 'पचास'
};

const BALLOON_PALETTES = [
  { bg: 'from-red-500 to-rose-600', border: 'border-red-300' },
  { bg: 'from-amber-500 to-orange-600', border: 'border-amber-300' },
  { bg: 'from-emerald-500 to-green-600', border: 'border-emerald-300' },
  { bg: 'from-cyan-500 to-blue-600', border: 'border-cyan-300' },
  { bg: 'from-blue-600 to-indigo-700', border: 'border-blue-300' },
  { bg: 'from-purple-500 to-violet-700', border: 'border-purple-300' },
  { bg: 'from-pink-500 to-rose-600', border: 'border-pink-300' },
];

export const MathBalloonPopStage: React.FC<MathBalloonPopStageProps> = ({
  soundEnabled,
  onToggleSound,
  onBack,
}) => {
  const [rangeMode, setRangeMode] = useState<'PART1' | 'PART2' | 'ALL'>('PART1');

  const activeNumbers = rangeMode === 'PART1'
    ? Array.from({ length: 25 }, (_, i) => i + 1)
    : rangeMode === 'PART2'
    ? Array.from({ length: 25 }, (_, i) => i + 26)
    : Array.from({ length: 50 }, (_, i) => i + 1);

  const [targetNumber, setTargetNumber] = useState<number>(() => {
    return activeNumbers[Math.floor(Math.random() * activeNumbers.length)];
  });

  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [popEffects, setPopEffects] = useState<
    { id: string; x: number; y: number; text: string; isCorrect: boolean }[]
  >([]);

  // Speak target number whenever target changes
  useEffect(() => {
    sounds.speakMathTargetNumber(targetNumber, soundEnabled);
  }, [targetNumber, soundEnabled]);

  // Initial balloon setup
  useEffect(() => {
    const initialList: BalloonItem[] = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      initialList.push(createRandomBalloon(i, targetNumber, i * -18));
    }
    setBalloons(initialList);
  }, [targetNumber, rangeMode]);

  // Floating animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) => {
        const updated = prev.map((b) => ({
          ...b,
          y: b.y + b.speed,
        }));

        const remaining = updated.filter((b) => b.y < 112);

        while (remaining.length < 7) {
          remaining.push(
            createRandomBalloon(Date.now() + Math.random(), targetNumber, -25 - Math.random() * 20)
          );
        }

        return remaining;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [targetNumber, activeNumbers]);

  function createRandomBalloon(seedKey: number | string, currentTarget: number, startY = -25): BalloonItem {
    const isTarget = Math.random() < 0.45;
    let chosenNum = currentTarget;

    if (!isTarget) {
      const otherNumbers = activeNumbers.filter((n) => n !== currentTarget);
      chosenNum = otherNumbers[Math.floor(Math.random() * otherNumbers.length)] || currentTarget;
    }

    const palette = BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)];
    const randomXBase = 8 + Math.floor(Math.random() * 76);

    return {
      id: `m-balloon-${seedKey}-${Math.random()}`,
      num: chosenNum,
      xBase: randomXBase,
      y: startY,
      speed: 0.38 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      colorBg: palette.bg,
      colorBorder: palette.border,
      size: 78 + Math.floor(Math.random() * 24),
    };
  }

  const handlePopBalloon = (balloon: BalloonItem, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    const isCorrect = balloon.num === targetNumber;
    sounds.speakMathBalloonPop(balloon.num, isCorrect, targetNumber, soundEnabled);

    const currentX = balloon.xBase + Math.sin(balloon.y * 0.08 + balloon.phase) * 3.5;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      // Switch to next target number after successful pop
      setTimeout(() => {
        const remaining = activeNumbers.filter((n) => n !== targetNumber);
        const nextTarget = remaining[Math.floor(Math.random() * remaining.length)] || activeNumbers[0];
        setTargetNumber(nextTarget);
      }, 700);
    } else {
      setScore((prev) => Math.max(0, prev - 10));
    }

    const effectId = `pop-${Date.now()}-${Math.random()}`;
    setPopEffects((prev) => [
      ...prev,
      {
        id: effectId,
        x: currentX,
        y: balloon.y,
        text: isCorrect ? '+10' : '-10',
        isCorrect,
      },
    ]);

    setTimeout(() => {
      setPopEffects((prev) => prev.filter((p) => p.id !== effectId));
    }, 800);

    setBalloons((prev) => {
      const filtered = prev.filter((b) => b.id !== balloon.id);
      filtered.push(createRandomBalloon(Date.now(), targetNumber, -25 - Math.random() * 15));
      return filtered;
    });
  };

  const handleNextTarget = () => {
    sounds.playVictory(soundEnabled);
    const remaining = activeNumbers.filter((n) => n !== targetNumber);
    const nextTarget = remaining[Math.floor(Math.random() * remaining.length)] || activeNumbers[0];
    setTargetNumber(nextTarget);
  };

  const handleRangeChange = (mode: 'PART1' | 'PART2' | 'ALL') => {
    sounds.playSnap(soundEnabled);
    setRangeMode(mode);
    const newNumbers = mode === 'PART1'
      ? Array.from({ length: 25 }, (_, i) => i + 1)
      : mode === 'PART2'
      ? Array.from({ length: 25 }, (_, i) => i + 26)
      : Array.from({ length: 50 }, (_, i) => i + 1);

    setTargetNumber(newNumbers[Math.floor(Math.random() * newNumbers.length)]);
  };

  return (
    <div
      id="math-balloon-stage-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-1.5 sm:p-3 text-white select-none overflow-hidden min-h-0 bg-gradient-to-b from-sky-900/60 via-indigo-950/70 to-slate-950"
    >
      {/* Top Header Bar */}
      <div
        id="math-balloon-header"
        className="w-full flex items-center justify-between z-30 max-w-5xl px-1 sm:px-2 shrink-0 gap-1 sm:gap-2 mb-1"
      >
        <button
          onClick={() => {
            sounds.playPop(soundEnabled);
            onBack();
          }}
          className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-yellow-300 flex items-center gap-1 text-xs sm:text-sm font-black active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
          title="Back to Math Menu"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>वापस (Back)</span>
        </button>

        {/* Range Tabs */}
        <div className="flex items-center bg-black/70 p-0.5 rounded-full border border-white/30 shrink-0">
          <button
            onClick={() => handleRangeChange('PART1')}
            className={`px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
              rangeMode === 'PART1'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                : 'text-white/80 hover:text-white'
            }`}
          >
            1–25
          </button>
          <button
            onClick={() => handleRangeChange('PART2')}
            className={`px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
              rangeMode === 'PART2'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                : 'text-white/80 hover:text-white'
            }`}
          >
            26–50
          </button>
          <button
            onClick={() => handleRangeChange('ALL')}
            className={`px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
              rangeMode === 'ALL'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                : 'text-white/80 hover:text-white'
            }`}
          >
            1–50
          </button>
        </div>

        {/* Score & Sound */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 bg-amber-500/90 text-slate-950 font-black px-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm shadow-md border border-yellow-200">
            <Trophy className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>{score}</span>
          </div>

          <button
            onClick={onToggleSound}
            className="p-1 sm:p-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white active:scale-95 transition-transform cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-yellow-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-red-400" />
            )}
          </button>
        </div>
      </div>

      {/* Prominent Target Number Banner in Header */}
      <div className="w-full max-w-5xl flex items-center justify-between px-2 py-0.5 z-30 shrink-0">
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-blue-950 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full font-black text-sm sm:text-base shadow-xl border-2 border-white ring-2 ring-yellow-300">
          <Sparkles className="w-4 h-4 fill-blue-950 animate-spin" />
          <span>लक्ष्य:</span>
          <span className="text-xl sm:text-2xl font-black underline decoration-blue-950">
            नंबर {targetNumber}
          </span>
          <span className="text-xs sm:text-sm font-extrabold opacity-90">
            ({HINDI_NUMBER_NAMES[targetNumber]})
          </span>
          <span>वाला गुब्बारा फोड़ो!</span>

          {/* Audio Replay Button */}
          <button
            onClick={() => sounds.speakMathTargetNumber(targetNumber, soundEnabled)}
            className="ml-1 p-1 bg-blue-950/20 hover:bg-blue-950/40 rounded-full transition-all cursor-pointer"
            title="Repeat Voice"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-950" />
          </button>
        </div>

        {/* Skip to Next Target */}
        <button
          onClick={handleNextTarget}
          className="px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-yellow-300 text-xs font-black flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <span>अगला अंक</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Balloons Sky Playfield */}
      <div
        id="math-balloons-stage-area"
        className="relative flex-1 w-full max-w-5xl h-full overflow-hidden z-10 min-h-0"
      >
        {balloons.map((balloon) => {
          const x = balloon.xBase + Math.sin(balloon.y * 0.08 + balloon.phase) * 3.5;
          const isTarget = balloon.num === targetNumber;

          return (
            <div
              key={balloon.id}
              onClick={(e) => handlePopBalloon(balloon, e)}
              onTouchStart={(e) => handlePopBalloon(balloon, e)}
              style={{
                left: `${x}%`,
                bottom: `${balloon.y}%`,
                width: `${balloon.size}px`,
                height: `${balloon.size * 1.22}px`,
                transform: `translateX(-50%) rotate(${Math.sin(balloon.phase + balloon.y * 0.05) * 6}deg)`,
              }}
              className="absolute cursor-pointer select-none touch-manipulation transition-transform active:scale-90 flex flex-col items-center justify-center z-10"
            >
              {/* Balloon Body */}
              <div
                className={`relative w-full h-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-br ${balloon.colorBg} border-2 ${balloon.colorBorder} shadow-2xl flex flex-col items-center justify-center ${
                  isTarget ? 'ring-2 ring-yellow-300' : ''
                }`}
              >
                {/* Shiny Highlight */}
                <div className="absolute top-2 left-3 w-3 h-5 bg-white/40 rounded-full rotate-[-25deg]" />

                {/* Number Display */}
                <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none">
                  {balloon.num}
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-yellow-200 drop-shadow mt-0.5 leading-none">
                  {HINDI_NUMBER_NAMES[balloon.num]}
                </span>

                {/* Balloon Tie Knot */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-inherit border-b border-black/30 rotate-45" />
              </div>

              {/* Balloon String */}
              <div className="w-[1.5px] h-8 sm:h-10 bg-white/40 origin-top animate-pulse" />
            </div>
          );
        })}

        {/* Pop Effects (+10 or -10) */}
        <AnimatePresence>
          {popEffects.map((effect) => (
            <motion.div
              key={effect.id}
              initial={{ scale: 0.5, opacity: 1, y: 0 }}
              animate={{ scale: 1.5, opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              style={{
                left: `${effect.x}%`,
                bottom: `${effect.y}%`,
              }}
              className={`absolute -translate-x-1/2 pointer-events-none z-40 font-black text-xl sm:text-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] ${
                effect.isCorrect ? 'text-yellow-300' : 'text-red-400'
              }`}
            >
              {effect.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Info Prompt */}
      <div className="w-full text-center text-[10px] sm:text-xs text-blue-200/80 z-20 py-0.5 shrink-0">
        लक्ष्य संख्या वाला गुब्बारा छूकर फोड़ें! +10 अंक पाएं!
      </div>
    </div>
  );
};
