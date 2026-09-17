import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowLeft, Volume2, VolumeX, ArrowRight, Mic } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MathBalloonPopStageProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBack: () => void;
}

interface BalloonItem {
  id: string;
  num: number;
  xBase: number; // percentage horizontally (6 - 84)
  y: number; // percentage from bottom (-20 to 110)
  speed: number;
  phase: number;
  paletteIndex: number;
  size: number;
}

// Realistic 3D Latex Balloon Themes
const REALISTIC_BALLOON_THEMES = [
  {
    name: 'Ruby Red',
    bodyGradient: 'radial-gradient(circle at 35% 28%, #ff6b81 0%, #ee1d36 45%, #9b0014 90%)',
    knotColor: '#9b0014',
    shadowColor: 'rgba(155, 0, 20, 0.45)',
    highlightColor: 'rgba(255, 255, 255, 0.75)',
  },
  {
    name: 'Ocean Blue',
    bodyGradient: 'radial-gradient(circle at 35% 28%, #68d8d6 0%, #079992 45%, #004d40 90%)',
    knotColor: '#004d40',
    shadowColor: 'rgba(0, 77, 64, 0.45)',
    highlightColor: 'rgba(255, 255, 255, 0.75)',
  },
  {
    name: 'Royal Purple',
    bodyGradient: 'radial-gradient(circle at 35% 28%, #c56cf0 0%, #8854d0 45%, #3c1361 90%)',
    knotColor: '#3c1361',
    shadowColor: 'rgba(60, 19, 97, 0.45)',
    highlightColor: 'rgba(255, 255, 255, 0.75)',
  },
  {
    name: 'Bright Gold',
    bodyGradient: 'radial-gradient(circle at 35% 28%, #ffeaa7 0%, #fdcb6e 45%, #d35400 90%)',
    knotColor: '#d35400',
    shadowColor: 'rgba(211, 84, 0, 0.45)',
    highlightColor: 'rgba(255, 255, 255, 0.85)',
  },
  {
    name: 'Emerald Green',
    bodyGradient: 'radial-gradient(circle at 35% 28%, #7bed9f 0%, #2ed573 45%, #0e6230 90%)',
    knotColor: '#0e6230',
    shadowColor: 'rgba(14, 98, 48, 0.45)',
    highlightColor: 'rgba(255, 255, 255, 0.75)',
  },
  {
    name: 'Hot Pink',
    bodyGradient: 'radial-gradient(circle at 35% 28%, #ff9ff3 0%, #f368e0 45%, #830065 90%)',
    knotColor: '#830065',
    shadowColor: 'rgba(131, 0, 101, 0.45)',
    highlightColor: 'rgba(255, 255, 255, 0.75)',
  },
  {
    name: 'Vibrant Orange',
    bodyGradient: 'radial-gradient(circle at 35% 28%, #ffb142 0%, #ff5252 45%, #a81c1c 90%)',
    knotColor: '#a81c1c',
    shadowColor: 'rgba(168, 28, 28, 0.45)',
    highlightColor: 'rgba(255, 255, 255, 0.75)',
  },
];

export const MathBalloonPopStage: React.FC<MathBalloonPopStageProps> = ({
  soundEnabled,
  onToggleSound,
  onBack,
}) => {
  const [rangeMode, setRangeMode] = useState<'PART1' | 'PART2' | 'ALL'>('PART1');

  const activeNumbers =
    rangeMode === 'PART1'
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

  // CRITICAL REQUIREMENT:
  // 1. NO written sentence on top like "number 25 wala gubbara fodo"
  // 2. Only the teacher speaks it!
  // 3. If user has not popped the balloon, teacher repeats after every 10 seconds!
  useEffect(() => {
    // Speak immediately when target changes
    sounds.speakMathTargetNumber(targetNumber, soundEnabled);

    // Repeat voice prompt every 10 seconds if user hasn't popped it
    const timer = setInterval(() => {
      sounds.speakMathTargetNumber(targetNumber, soundEnabled);
    }, 10000);

    return () => clearInterval(timer);
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

        const remaining = updated.filter((b) => b.y < 115);

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

    const paletteIdx = Math.floor(Math.random() * REALISTIC_BALLOON_THEMES.length);
    const randomXBase = 7 + Math.floor(Math.random() * 78);

    return {
      id: `m-balloon-${seedKey}-${Math.random()}`,
      num: chosenNum,
      xBase: randomXBase,
      y: startY,
      speed: 0.38 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      paletteIndex: paletteIdx,
      size: 84 + Math.floor(Math.random() * 22),
    };
  }

  const handlePopBalloon = (balloon: BalloonItem, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    const isCorrect = balloon.num === targetNumber;
    sounds.speakMathBalloonPop(balloon.num, isCorrect, targetNumber, soundEnabled);

    const currentX = balloon.xBase + Math.sin(balloon.y * 0.08 + balloon.phase) * 3.5;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setTimeout(() => {
        // Pick next random target from current active range
        const nextCandidates = activeNumbers.filter((n) => n !== targetNumber);
        const nextTarget = nextCandidates[Math.floor(Math.random() * nextCandidates.length)] || activeNumbers[0];
        setTargetNumber(nextTarget);
      }, 900);
    }

    // Trigger visual pop effect
    const effectId = `pop-${Date.now()}-${Math.random()}`;
    setPopEffects((prev) => [
      ...prev,
      {
        id: effectId,
        x: currentX,
        y: balloon.y,
        text: isCorrect ? '+10' : '✕',
        isCorrect,
      },
    ]);

    setTimeout(() => {
      setPopEffects((prev) => prev.filter((item) => item.id !== effectId));
    }, 800);

    // Remove popped balloon
    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
  };

  const handleRangeChange = (mode: 'PART1' | 'PART2' | 'ALL') => {
    sounds.playSnap(soundEnabled);
    setRangeMode(mode);
    const newNumbers =
      mode === 'PART1'
        ? Array.from({ length: 25 }, (_, i) => i + 1)
        : mode === 'PART2'
        ? Array.from({ length: 25 }, (_, i) => i + 26)
        : Array.from({ length: 50 }, (_, i) => i + 1);

    setTargetNumber(newNumbers[Math.floor(Math.random() * newNumbers.length)]);
  };

  // Re-play voice on demand
  const handleRepeatVoice = () => {
    sounds.speakMathTargetNumber(targetNumber, soundEnabled);
  };

  return (
    <div
      id="math-balloon-stage-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-1.5 sm:p-3 text-white select-none overflow-hidden min-h-0 bg-gradient-to-b from-[#0c2461] via-[#1e3799] to-[#0a1532]"
    >
      {/* Cartoon Sky Cloud Backdrops */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-8 left-10 w-40 h-16 bg-white rounded-full blur-sm" />
        <div className="absolute top-16 right-16 w-52 h-20 bg-white rounded-full blur-sm" />
        <div className="absolute top-44 left-1/3 w-64 h-24 bg-white/60 rounded-full blur-md" />
      </div>

      {/* TOP HEADER BAR (Clean, no long text sentences, ONLY teacher voice prompt & game controls) */}
      <div
        id="math-balloon-header"
        className="w-full flex items-center justify-between z-30 max-w-5xl px-1 sm:px-3 shrink-0 gap-2 mb-1"
      >
        {/* Left: Back button */}
        <button
          onClick={() => {
            sounds.playPop(soundEnabled);
            onBack();
          }}
          className="px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-yellow-300 flex items-center gap-1 text-xs sm:text-sm font-black active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
          title="Back to Math Menu"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>वापस</span>
        </button>

        {/* Center: Range Tabs (1–25, 26–50, 1–50) */}
        <div className="flex items-center bg-black/70 p-0.5 rounded-full border border-white/30 shrink-0">
          <button
            onClick={() => handleRangeChange('PART1')}
            className={`px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
              rangeMode === 'PART1'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                : 'text-white/80 hover:text-white'
            }`}
          >
            1–25
          </button>
          <button
            onClick={() => handleRangeChange('PART2')}
            className={`px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
              rangeMode === 'PART2'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                : 'text-white/80 hover:text-white'
            }`}
          >
            26–50
          </button>
          <button
            onClick={() => handleRangeChange('ALL')}
            className={`px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
              rangeMode === 'ALL'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                : 'text-white/80 hover:text-white'
            }`}
          >
            1–50
          </button>
        </div>

        {/* Right: Repeat Teacher Voice button + Score + Sound Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Pulsing Teacher Voice Speaker button to hear instruction anytime */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleRepeatVoice}
            className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-blue-950 font-black px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg border-2 border-white ring-2 ring-yellow-300 cursor-pointer animate-pulse"
            title="शिक्षिका की आवाज दोबारा सुनें"
          >
            <Mic className="w-3.5 h-3.5 fill-blue-950" />
            <span className="hidden sm:inline">आवाज सुनें</span>
          </motion.button>

          <div className="flex items-center gap-1 bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm shadow-md border border-yellow-200">
            <Trophy className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>{score}</span>
          </div>

          <button
            onClick={onToggleSound}
            className="p-1 sm:p-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white active:scale-95 transition-transform cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-300" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
        </div>
      </div>

      {/* Balloons Sky Playfield */}
      <div
        id="math-balloons-stage-area"
        className="relative flex-1 w-full max-w-5xl h-full overflow-hidden z-10 min-h-0"
      >
        {balloons.map((balloon) => {
          const x = balloon.xBase + Math.sin(balloon.y * 0.08 + balloon.phase) * 3.5;
          const theme = REALISTIC_BALLOON_THEMES[balloon.paletteIndex % REALISTIC_BALLOON_THEMES.length];
          const balloonWidth = balloon.size;
          const balloonHeight = balloon.size * 1.25;

          return (
            <div
              key={balloon.id}
              onClick={(e) => handlePopBalloon(balloon, e)}
              onTouchStart={(e) => handlePopBalloon(balloon, e)}
              style={{
                left: `${x}%`,
                bottom: `${balloon.y}%`,
                width: `${balloonWidth}px`,
                height: `${balloonHeight + 36}px`, // room for knot + string
                transform: `translateX(-50%) rotate(${Math.sin(balloon.phase + balloon.y * 0.05) * 5}deg)`,
              }}
              className="absolute cursor-pointer select-none touch-manipulation transition-transform active:scale-90 flex flex-col items-center justify-start z-10"
            >
              {/* REALISTIC 3D LATEX BALLOON BODY */}
              <div
                style={{
                  width: `${balloonWidth}px`,
                  height: `${balloonHeight}px`,
                  background: theme.bodyGradient,
                  boxShadow: `inset -8px -10px 18px rgba(0,0,0,0.5), inset 6px 8px 16px rgba(255,255,255,0.45), 0 12px 24px ${theme.shadowColor}`,
                }}
                className="relative rounded-[50%_50%_50%_50%/40%_40%_60%_60%] flex flex-col items-center justify-center"
              >
                {/* 1. Curved Primary Gloss Reflection (Top-Left 3D specular highlight) */}
                <div
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 75%)',
                  }}
                  className="absolute top-2.5 left-3 w-5 h-8 rounded-full rotate-[-30deg] pointer-events-none"
                />

                {/* 2. Secondary Diffuse Rim Reflection (Bottom-Right glow) */}
                <div
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                  }}
                  className="absolute bottom-3 right-3 w-4 h-6 rounded-full rotate-[40deg] pointer-events-none"
                />

                {/* 3. Number Display - Big, bold, clear white with strong depth */}
                <span
                  className="text-3xl sm:text-4xl font-black text-white pointer-events-none leading-none tracking-tight"
                  style={{
                    textShadow: '0 2px 5px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.9)',
                  }}
                >
                  {balloon.num}
                </span>

                {/* 4. Realistic Balloon Tie Knot at bottom tip */}
                <div
                  style={{
                    backgroundColor: theme.knotColor,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                  }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3 rounded-b-sm border-t border-black/20"
                />
              </div>

              {/* 5. Realistic Wavy Dangling Balloon String (SVG curve) */}
              <div className="relative -mt-0.5 w-6 h-10 overflow-visible pointer-events-none">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 24 40">
                  <path
                    d="M 12,0 Q 7,8 15,16 Q 8,24 13,32 Q 16,36 12,40"
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}

        {/* Floating Pop Effects */}
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
              className={`absolute -translate-x-1/2 pointer-events-none z-40 font-black text-2xl sm:text-3xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] ${
                effect.isCorrect ? 'text-yellow-300' : 'text-red-400'
              }`}
            >
              {effect.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Subtle bottom footer info */}
      <div className="w-full max-w-5xl flex items-center justify-between px-2 py-0.5 z-20 text-[10px] sm:text-xs text-white/70">
        <span>शिक्षिका की आवाज सुनकर सही गुब्बारा फोड़ें!</span>
        <span>10 सेकंड में आवाज दोहराई जाएगी</span>
      </div>
    </div>
  );
};
