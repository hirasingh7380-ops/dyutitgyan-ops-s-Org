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
    <div id="victory-modal-backdrop" className="fixed inset-0 z-50 bg-[#2C2C2C]/60 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        id="victory-modal-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#F9F7F2] border-2 border-[#8B5E3C] rounded-3xl p-6 shadow-2xl text-center text-[#2C2C2C] flex flex-col items-center gap-4 relative overflow-hidden"
      >
        <div className="w-20 h-20 rounded-3xl bg-[#8B5E3C] flex items-center justify-center shadow-lg ring-4 ring-[#8B5E3C]/30 animate-bounce">
          <Trophy className="w-12 h-12 text-white" />
        </div>

        <div className="flex items-center gap-1.5 text-[#556B2F] font-extrabold text-xs uppercase tracking-widest bg-[#E8EFE0] px-3.5 py-1 rounded-full border border-[#A3B18A]">
          <Sparkles className="w-4 h-4 text-[#556B2F]" /> STAGE COMPLETE! <Sparkles className="w-4 h-4 text-[#556B2F]" />
        </div>

        <h2 className="text-3xl font-black text-[#8B5E3C]">
          ALL WORDS DESTROYED!
        </h2>

        <p className="text-xs text-[#6D4C41] font-medium leading-relaxed">
          Awesome job! You successfully unlocked all 4 lines (AT, AN, AP, ALL) and destroyed all 16 words!
        </p>

        {/* Stats Summary */}
        <div className="w-full grid grid-cols-2 gap-3 bg-white p-3 rounded-2xl border border-[#D8CFC4] shadow-xs">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#8D6E63] font-bold uppercase">Final Score</span>
            <span className="text-2xl font-black text-[#8B5E3C]">{score}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#8D6E63] font-bold uppercase">Words Destroyed</span>
            <span className="text-2xl font-black text-[#556B2F] flex items-center gap-1">
              <Flame className="w-4 h-4 text-[#8B5E3C]" /> {completedCount}
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-3.5 rounded-2xl bg-[#8B5E3C] hover:bg-[#6D4C41] font-black text-base text-white shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          PLAY AGAIN
        </button>
      </motion.div>
    </div>
  );
};
