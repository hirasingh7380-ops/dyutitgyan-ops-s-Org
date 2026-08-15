import React, { useState, useEffect } from 'react';
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
  xBase: number;
  y: number;
  speed: number;
  phase: number;
  colorBg: string;
  colorText: string;
  size: number;
}

const BALLOON_COLORS = [
  { bg: 'from-purple-600 via-purple-500 to-indigo-700', text: 'text-yellow-300' },
  { bg: 'from-amber-400 via-yellow-400 to-amber-500', text: 'text-red-700' },
  { bg: 'from-pink-500 via-pink-400 to-rose-600', text: 'text-white' },
  { bg: 'from-red-600 via-red-500 to-rose-700', text: 'text-yellow-300' },
  { bg: 'from-sky-500 via-blue-500 to-indigo-600', text: 'text-white' },
  { bg: 'from-emerald-500 via-green-500 to-teal-600', text: 'text-yellow-300' },
];

const ALPHABETS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const CircularScoreSlider: React.FC<{ score: number; targetLetter: string }> = ({ score, targetLetter }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, score);
  const progressPercent = (clampedScore % 100) / 100;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="7"
          fill="rgba(0, 0, 0, 0.4)"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#ef4444"
          strokeWidth="7"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-lg sm:text-2xl font-black text-yellow-300 leading-none">
          {targetLetter}
        </span>
        <span className="text-xs sm:text-sm font-bold text-white leading-tight">
          {score}
        </span>
      </div>
    </div>
  );
};

export const BalloonPopStage: React.FC<BalloonPopStageProps> = ({
  soundEnabled,
  onHome,
}) => {
  const [targetLetterIndex, setTargetLetterIndex] = useState(0);
  const targetLetter = ALPHABETS[targetLetterIndex];

  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [popEffects, setPopEffects] = useState<
    { id: string; x: number; y: number; text: string; isCorrect: boolean }[]
  >([]);

  useEffect(() => {
    sounds.speakHindiTargetLetter(targetLetter, soundEnabled);
  }, [targetLetterIndex, soundEnabled]);

  useEffect(() => {
    const initialList: BalloonItem[] = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      initialList.push(createRandomBalloon(i, targetLetter, i * -18));
    }
    setBalloons(initialList);
  }, [targetLetter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) => {
        const updated = prev.map((b) => ({
          ...b,
          y: b.y + b.speed,
        }));

        const remaining = updated.filter((b) => b.y < 112);

        while (remaining.length < 7) {
          remaining.push(createRandomBalloon(Date.now() + Math.random(), targetLetter, -25 - Math.random() * 20));
        }

        return remaining;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [targetLetter]);

  function createRandomBalloon(seedKey: number | string, currentTarget: string, startY = -25): BalloonItem {
    const isTarget = Math.random() < 0.5;
    let chosenLetter = currentTarget;

    if (!isTarget) {
      const otherLetters = ALPHABETS.filter((l) => l !== currentTarget);
      chosenLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)];
    }

    const colorObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const randomXBase = 6 + Math.floor(Math.random() * 80);

    return {
      id: `balloon-${seedKey}-${Math.random()}`,
      letter: chosenLetter,
      xBase: randomXBase,
      y: startY,
      speed: 0.38 + Math.random() * 0.32,
      phase: Math.random() * Math.PI * 2,
      colorBg: colorObj.bg,
      colorText: colorObj.text,
      size: 80 + Math.floor(Math.random() * 28),
    };
  }

  const handlePopBalloon = (balloon: BalloonItem, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    const isCorrect = balloon.letter.toUpperCase() === targetLetter.toUpperCase();
    sounds.speakHindiBalloonPop(balloon.letter, isCorrect, targetLetter, soundEnabled);

    const currentX = balloon.xBase + Math.sin(balloon.y * 0.08 + balloon.phase) * 3.5;

    if (isCorrect) {
      setScore((prev) => prev + 10);
    } else {
      setScore((prev) => Math.max(0, prev - 20));
    }

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
    }, 800);

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
      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-0 left-[2%] w-12 sm:w-16 h-3/4 bg-amber-900/60 rounded-t-full" />
        <div className="absolute bottom-0 right-[2%] w-12 sm:w-16 h-3/4 bg-amber-900/60 rounded-t-full" />
        <div className="absolute bottom-0 w-full h-16 sm:h-20 bg-gradient-to-t from-emerald-800 via-green-600 to-transparent" />
      </div>

      {/* TOP HEADER */}
      <div
        id="balloon-top-bar"
        className="relative z-20 w-full px-3 sm:px-6 py-2 flex items-center justify-between max-w-6xl mx-auto bg-emerald-600/95 border-b-2 border-emerald-300 shadow-lg rounded-b-2xl"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="bg-sky-400 border-2 border-white text-yellow-300 font-bold text-base sm:text-xl px-4 sm:px-6 py-1 rounded-xl shadow cursor-pointer"
        >
          Home
        </motion.button>

        <div id="target-letter-banner" className="flex items-center gap-3 sm:gap-5">
          <span className="text-3xl sm:text-5xl font-black text-red-600 uppercase">
            {targetLetter}
          </span>
          <CircularScoreSlider score={score} targetLetter={targetLetter} />
          <span className="text-3xl sm:text-5xl font-black text-red-600 uppercase">
            {targetLetter}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-yellow-300 uppercase">Score</span>
            <span className="text-lg sm:text-2xl font-black text-white">{score}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNextLetter}
            className="bg-sky-400 border-2 border-white text-yellow-300 font-bold text-base sm:text-xl px-4 sm:px-6 py-1 rounded-xl shadow cursor-pointer"
          >
            Next
          </motion.button>
        </div>
      </div>

      {/* BALLOONS AREA */}
      <div id="balloons-floating-area" className="relative flex-1 w-full z-10 overflow-hidden">
        {balloons.map((balloon) => {
          const xSway = balloon.xBase + Math.sin(balloon.y * 0.08 + balloon.phase) * 3.5;

          return (
            <div
              key={balloon.id}
              onClick={(e) => handlePopBalloon(balloon, e)}
              onTouchStart={(e) => handlePopBalloon(balloon, e)}
              className="absolute cursor-pointer select-none"
              style={{
                left: `${xSway}%`,
                bottom: `${balloon.y}%`,
              }}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-br ${balloon.colorBg} border-2 border-white/40 shadow-xl flex items-center justify-center relative overflow-hidden`}
                  style={{
                    width: `${balloon.size}px`,
                    height: `${balloon.size * 1.2}px`,
                  }}
                >
                  <div className="absolute top-2 left-3 w-3 h-6 bg-white/40 rounded-full rotate-[-30deg]" />
                  <span className={`font-black text-3xl sm:text-5xl ${balloon.colorText}`}>
                    {balloon.letter}
                  </span>
                </div>

                <div className="w-3.5 h-2.5 bg-amber-800 rounded-b-md -mt-0.5" />
                <svg className="w-4 h-10 -mt-0.5 overflow-visible pointer-events-none">
                  <path
                    d="M 8 0 Q 14 15 4 25 T 8 40"
                    fill="none"
                    stroke="rgba(0,0,0,0.35)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          );
        })}

        <AnimatePresence>
          {popEffects.map((eff) => (
            <motion.div
              key={eff.id}
              initial={{ scale: 0.5, opacity: 1, y: 0 }}
              animate={{ scale: 1.5, opacity: 0, y: -30 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute z-30 pointer-events-none flex items-center gap-1"
              style={{
                left: `${eff.x}%`,
                bottom: `${eff.y}%`,
              }}
            >
              <Sparkles className={`w-6 h-6 ${eff.isCorrect ? 'text-yellow-300' : 'text-red-500'}`} />
              <span className={`text-2xl sm:text-3xl font-black ${eff.isCorrect ? 'text-yellow-300' : 'text-red-500'}`}>
                {eff.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};