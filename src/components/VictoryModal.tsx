import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';

interface VictoryModalProps {
  score: number;
  completedCount: number;
  soundEnabled: boolean;
  onReset: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  completedCount,
  soundEnabled,
  onReset,
}) => {
  useEffect(() => {
    sounds.playVictory(soundEnabled);

    // Fire confetti fireworks
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [soundEnabled]);

  return (
    <div id="victory-modal-backdrop" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        id="victory-modal-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white border-4 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center text-slate-900 flex flex-col items-center gap-4 relative overflow-hidden"
      >
        <div className="w-20 h-20 rounded-3xl bg-yellow-400 border-4 border-white flex items-center justify-center shadow-xl ring-4 ring-yellow-400/40 animate-bounce">
          <Trophy className="w-12 h-12 text-red-600" />
        </div>

        <div className="flex items-center gap-1.5 text-red-700 font-black text-xs uppercase tracking-widest bg-yellow-100 px-4 py-1 rounded-full border-2 border-yellow-300">
          <Sparkles className="w-4 h-4 text-yellow-500" /> STAGE COMPLETE! <Sparkles className="w-4 h-4 text-yellow-500" />
        </div>

        <h2 className="text-3xl font-black text-red-600">
          ALL WORDS DESTROYED!
        </h2>

        <p className="text-xs text-slate-600 font-bold leading-relaxed">
          Awesome job! You successfully unlocked all 4 lines (AT, AN, AP, ALL) and destroyed all 16 words!
        </p>

        {/* Stats Summary */}
        <div className="w-full grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 shadow-xs">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Final Score</span>
            <span className="text-2xl font-black text-red-600">{score}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Words Destroyed</span>
            <span className="text-2xl font-black text-emerald-600 flex items-center gap-1">
              <Flame className="w-4 h-4 text-red-500" /> {completedCount}
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 font-black text-base text-yellow-300 border-3 border-white shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          PLAY AGAIN
        </button>
      </motion.div>
    </div>
  );
};

