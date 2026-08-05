import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface BalloonPopStageProps {
  soundEnabled: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

interface BalloonItem {
  id: string;
  letter: string;
  xBase: number; // base horizontal percentage (8% to 84%)
  y: number; // vertical percentage (-25% to 115%)
  speed: number; // float speed multiplier
  phase: number; // wobble phase offset
  colorBg: string;
  colorText: string;
  size: number;
}

const BALLOON_COLORS = [
  { bg: 'from-purple-600 via-purple-500 to-indigo-700', text: 'text-yellow-300' },
  { bg: 'from-amber-400 via-yellow-400 to-amber-500', text: 'text-red-600' },
  { bg: 'from-pink-500 via-pink-400 to-rose-600', text: 'text-emerald-400' },
  { bg: 'from-red-600 via-red-500 to-rose-700', text: 'text-yellow-300' },
  { bg: 'from-sky-500 via-blue-500 to-indigo-600', text: 'text-yellow-300' },
  { bg: 'from-emerald-500 via-green-500 to-teal-600', text: 'text-yellow-300' },
];

const ALPHABETS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Circular Score Ring Slider Component
const CircularScoreSlider: React.FC<{ score: number; targetLetter: string }> = ({ score, targetLetter }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, score);
  const progressPercent = (clampedScore % 100) / 100;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 88 88">
        {/* Background Track Circle */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="9"
          fill="rgba(0, 0, 0, 0.4)"
        />
        {/* Animated Score Progress Arc */}
        <motion.circle
          cx="44"
          cy="44"
          r={radius}
          stroke="#ef4444"
          strokeWidth="9"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {/* Center Info inside Ring */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="text-lg sm:text-2xl font-black text-yellow-300 leading-none"
          style={{ textShadow: '2px 2px 0px #000, -1px -1px 0px #000' }}
        >
          {targetLetter}
        </span>
        <span
          className="text-xs sm:text-sm font-black text-white leading-tight mt-0.5"
          style={{ textShadow: '1px 1px 0px #000' }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

export const BalloonPopStage: React.FC<BalloonPopStageProps> = ({
  soundEnabled,
  onHome,
  onToggleSound,
}) => {
  const [targetLetterIndex, setTargetLetterIndex] = useState(0);
  const targetLetter = ALPHABETS[targetLetterIndex];

  const [score, setScore] = useState(0);
  const [scoreAnimation, setScoreAnimation] = useState<'plus' | 'minus' | null>(null);

  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [popEffects, setPopEffects] = useState<
    { id: string; x: number; y: number; text: string; isCorrect: boolean }[]
  >([]);

  // Announce target letter when changed
  useEffect(() => {
    sounds.speakHindiTargetLetter(targetLetter, soundEnabled);
  }, [targetLetterIndex, soundEnabled]);

  // Spawn initial balloons spread out vertically below and in lower viewport
  useEffect(() => {
    const initialList: BalloonItem[] = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      initialList.push(createRandomBalloon(i, targetLetter, i * -18));
    }
    setBalloons(initialList);
  }, [targetLetter]);

  // Smooth floating tick loop with sway wobble
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) => {
        const updated = prev.map((b) => ({
          ...b,
          y: b.y + b.speed,
        }));

        // Remove balloons that float past top screen (> 112%)
        const remaining = updated.filter((b) => b.y < 112);

        // Replenish missing balloons at bottom
        while (remaining.length < 7) {
          remaining.push(createRandomBalloon(Date.now() + Math.random(), targetLetter, -25 - Math.random() * 20));
        }

        return remaining;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [targetLetter]);

  // Helper to create a single balloon item
  function createRandomBalloon(seedKey: number | string, currentTarget: string, startY = -25): BalloonItem {
    const isTarget = Math.random() < 0.5;
    let chosenLetter = currentTarget;

    if (!isTarget) {
      const otherLetters = ALPHABETS.filter((l) => l !== currentTarget);
      chosenLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)];
    }

    const colorObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const randomXBase = 6 + Math.floor(Math.random() * 80); // 6% to 86%

    return {
      id: `balloon-${seedKey}-${Math.random()}`,
      letter: chosenLetter,
      xBase: randomXBase,
      y: startY,
      speed: 0.38 + Math.random() * 0.32,
      phase: Math.random() * Math.PI * 2,
      colorBg: colorObj.bg,
      colorText: colorObj.text,
      size: 88 + Math.floor(Math.random() * 32), // 88px to 120px
    };
  }

  // Handle popping a balloon
  const handlePopBalloon = (balloon: BalloonItem, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    const isCorrect = balloon.letter.toUpperCase() === targetLetter.toUpperCase();

    // Sound & Voice
    sounds.speakHindiBalloonPop(balloon.letter, isCorrect, targetLetter, soundEnabled);

    // Current horizontal sway position
    const currentX = balloon.xBase + Math.sin(balloon.y * 0.08 + balloon.phase) * 3.5;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setScoreAnimation('plus');
    } else {
      setScore((prev) => prev - 20);
      setScoreAnimation('minus');
    }

    setTimeout(() => setScoreAnimation(null), 800);

    // Pop particle burst effect
    const effectId = `pop-${Date.now()}-${Math.random()}`;
    setPopEffects((prev) => [
      ...prev,
      {
        id: effectId,
        x: currentX,
        y: balloon.y,
        text: isCorrect ? '+10' : '-20',
        isCorrect,
      },
    ]);

    setTimeout(() => {
      setPopEffects((prev) => prev.filter((p) => p.id !== effectId));
    }, 900);

    // Destroy balloon and spawn new one at bottom
    setBalloons((prev) => {
      const filtered = prev.filter((b) => b.id !== balloon.id);
      filtered.push(createRandomBalloon(Date.now(), targetLetter, -25 - Math.random() * 15));
      return filtered;
    });
  };

  const handleNextLetter = () => {
    sounds.playVictory(soundEnabled);
    const nextIdx = (targetLetterIndex + 1) % ALPHABETS.length;
    setTargetLetterIndex(nextIdx);
  };

  return (
    <div
      id="balloon-pop-stage"
      className="relative w-full h-screen overflow-hidden select-none flex flex-col justify-between"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, #87ceeb 0%, #a8e063 50%, #56ab2f 100%)',
      }}
    >
      {/* Cartoon Forest Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Tree Trunks on Far Edges */}
        <div className="absolute bottom-0 left-[2%] w-12 sm:w-16 h-3/4 bg-amber-900/60 rounded-t-full border-r-4 border-amber-950/40" />
        <div className="absolute bottom-0 right-[2%] w-12 sm:w-16 h-3/4 bg-amber-900/60 rounded-t-full border-l-4 border-amber-950/40" />

        {/* Subtle Top Leaf Gradient Frame */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-emerald-900/70 via-emerald-800/40 to-transparent" />

        {/* Bottom Grass Meadow */}
        <div className="absolute bottom-0 w-full h-16 sm:h-20 bg-gradient-to-t from-emerald-800 via-green-600 to-transparent" />
      </div>

      {/* TOP HEADER BAR */}
      <div
        id="balloon-top-bar"
        className="relative z-20 w-full px-3 sm:px-8 py-2 sm:py-3 flex items-center justify-between max-w-7xl mx-auto bg-emerald-600/95 border-b-4 border-emerald-300/80 shadow-2xl rounded-b-3xl"
      >
        {/* LEFT: Home Button */}
        <motion.button
          id="btn-balloon-home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="bg-sky-400 border-3 sm:border-4 border-white text-yellow-300 font-black text-xl sm:text-3xl px-5 sm:px-8 py-1 sm:py-2 rounded-2xl sm:rounded-3xl shadow-2xl cursor-pointer flex items-center justify-center"
          style={{ textShadow: '2px 2px 0px #000' }}
        >
          Home
        </motion.button>

        {/* CENTER: Target Letter Display with CIRCULAR SCORE RING SLIDER */}
        <div id="target-letter-banner" className="flex items-center gap-3 sm:gap-6 flex-1 justify-center max-w-xl mx-2">
          <span
            className="text-4xl sm:text-7xl font-black text-red-600 uppercase"
            style={{ textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, 2px -2px 0px #fff, -2px 2px 0px #fff' }}
          >
            {targetLetter}
          </span>

          {/* CIRCULAR SCORE SLIDER RING */}
          <CircularScoreSlider score={score} targetLetter={targetLetter} />

          <span
            className="text-4xl sm:text-7xl font-black text-red-600 uppercase"
            style={{ textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, 2px -2px 0px #fff, -2px 2px 0px #fff' }}
          >
            {targetLetter}
          </span>
        </div>

        {/* RIGHT: Score Badge & Next Button */}
        <div id="balloon-score-next-container" className="flex items-center gap-2 sm:gap-4">
          {/* Score Numerical Badge */}
          <div className="flex flex-col items-center">
            <span
              className="text-base sm:text-2xl font-black text-yellow-300 leading-none uppercase"
              style={{ textShadow: '2px 2px 0px #000, -1px -1px 0px #000' }}
            >
              Score
            </span>
            <motion.span
              animate={
                scoreAnimation === 'plus'
                  ? { scale: [1, 1.4, 1], color: ['#ef4444', '#22c55e', '#ef4444'] }
                  : scoreAnimation === 'minus'
                  ? { scale: [1, 1.4, 1], x: [-5, 5, -5, 0] }
                  : {}
              }
              className="text-2xl sm:text-4xl font-black text-red-600 leading-none"
              style={{ textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, 2px -2px 0px #fff, -2px 2px 0px #fff' }}
            >
              {score}
            </motion.span>
          </div>

          {/* Next Button */}
          <motion.button
            id="btn-balloon-next"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextLetter}
            className="bg-sky-400 border-3 sm:border-4 border-white text-yellow-300 font-black text-xl sm:text-3xl px-5 sm:px-8 py-1 sm:py-2 rounded-2xl sm:rounded-3xl shadow-2xl cursor-pointer flex items-center justify-center"
            style={{ textShadow: '2px 2px 0px #000' }}
          >
            Next
          </motion.button>
        </div>
      </div>

      {/* FLOATING BALLOONS CANVAS AREA */}
      <div id="balloons-floating-area" className="relative flex-1 w-full z-10 overflow-hidden">
        {balloons.map((balloon) => {
          // Calculate gentle horizontal sway position using sine wave
          const xSway = balloon.xBase + Math.sin(balloon.y * 0.08 + balloon.phase) * 3.5;

          return (
            <div
              key={balloon.id}
              onClick={(e) => handlePopBalloon(balloon, e)}
              onTouchStart={(e) => handlePopBalloon(balloon, e)}
              className="absolute cursor-pointer transition-transform active:scale-90 select-none"
              style={{
                left: `${xSway}%`,
                bottom: `${balloon.y}%`,
              }}
            >
              {/* GLOSSY BALLOON GRAPHIC WITH BOLD ALPHABET */}
              <div className="relative flex flex-col items-center">
                {/* Balloon Oval Body */}
                <div
                  className={`rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-br ${balloon.colorBg} border-2 border-white/40 shadow-2xl flex items-center justify-center relative overflow-hidden`}
                  style={{
                    width: `${balloon.size}px`,
                    height: `${balloon.size * 1.22}px`,
                    boxShadow: 'inset -12px -12px 25px rgba(0,0,0,0.35), 0 10px 20px rgba(0,0,0,0.25)',
                  }}
                >
                  {/* Glossy Light Reflection Spot */}
                  <div className="absolute top-2 left-3 w-4 h-8 bg-white/45 rounded-full rotate-[-30deg] blur-[0.5px]" />
                  <div className="absolute top-3 left-7 w-2 h-3 bg-white/30 rounded-full rotate-[-30deg]" />

                  {/* Centered Letter */}
                  <span
                    className={`font-black text-4xl sm:text-6xl ${balloon.colorText} drop-shadow-[0_4px_4px_rgba(0,0,0,0.7)]`}
                    style={{
                      textShadow:
                        balloon.letter.toUpperCase() === 'A'
                          ? '3px 3px 0px #fff, -3px -3px 0px #fff, 3px -3px 0px #fff, -3px 3px 0px #fff'
                          : '3px 3px 0px #000, -2px -2px 0px #000',
                    }}
                  >
                    {balloon.letter}
                  </span>
                </div>

                {/* Balloon Bottom Knot */}
                <div className="w-4 h-3 bg-amber-800/80 rounded-b-md -mt-1 shadow-sm" />

                {/* Balloon String Line */}
                <svg className="w-6 h-12 -mt-0.5 overflow-visible pointer-events-none">
                  <path
                    d="M 12 0 Q 18 20 6 35 T 12 50"
                    fill="none"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          );
        })}

        {/* POP VISUAL PARTICLE EFFECTS */}
        <AnimatePresence>
          {popEffects.map((eff) => (
            <motion.div
              key={eff.id}
              initial={{ scale: 0.5, opacity: 1, y: 0 }}
              animate={{ scale: 1.8, opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute z-30 pointer-events-none flex flex-col items-center"
              style={{
                left: `${eff.x}%`,
                bottom: `${eff.y}%`,
              }}
            >
              {/* Confetti Sparkles & Score Pop Floating Text */}
              <div className="flex items-center gap-1">
                <Sparkles
                  className={`w-10 h-10 ${
                    eff.isCorrect ? 'text-yellow-300 animate-spin' : 'text-red-500'
                  }`}
                />
                <span
                  className={`text-3xl sm:text-5xl font-black ${
                    eff.isCorrect ? 'text-yellow-300' : 'text-red-600'
                  }`}
                  style={{
                    textShadow: '2px 2px 0px #000, -2px -2px 0px #000',
                  }}
                >
                  {eff.text}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

