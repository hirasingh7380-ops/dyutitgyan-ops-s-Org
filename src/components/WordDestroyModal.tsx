import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

const HINDI_WORD_MAP: Record<string, string> = {
  CAT: 'बिल्ली',
  BAT: 'बल्ला',
  RAT: 'चूहा',
  HAT: 'टोपी',
  FAN: 'पंखा',
  MAN: 'आदमी',
  VAN: 'गाड़ी',
  CAN: 'डिब्बा',
  MAP: 'नक्शा',
  CAP: 'टोपी',
  TAP: 'नल',
  LAP: 'गोद',
  BALL: 'गेंद',
  HALL: 'हॉल',
  WALL: 'दीवार',
  TALL: 'लंबा',
};

interface WordDestroyModalProps {
  isDestroying: boolean;
  destroyingWord: string | null;
}

export const WordDestroyModal: React.FC<WordDestroyModalProps> = ({
  isDestroying,
  destroyingWord,
}) => {
  const hindiTranslation = destroyingWord ? HINDI_WORD_MAP[destroyingWord.toUpperCase()] || '' : '';

  return (
    <AnimatePresence>
      {isDestroying && destroyingWord && (
        <motion.div
          id="word-destroy-overlay"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4 select-none pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-2 bg-red-600 border-4 sm:border-8 border-white px-6 py-5 sm:px-10 sm:py-7 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center max-w-md w-full relative">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-spin" />
              <span className="text-4xl sm:text-6xl font-black text-yellow-300 tracking-widest drop-shadow-lg">
                {destroyingWord}
              </span>
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-spin" />
            </div>

            {hindiTranslation && (
              <div className="bg-yellow-300 text-red-900 border-2 border-white px-4 py-2 rounded-full font-black text-xl sm:text-3xl shadow-md mt-1">
                {destroyingWord} = {hindiTranslation}
              </div>
            )}

            {/* Fast 2.2s Progress Bar */}
            <div className="w-full bg-black/40 h-2.5 rounded-full mt-3 overflow-hidden border border-white/40">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 2.2, ease: 'linear' }}
                className="bg-yellow-300 h-full rounded-full"
              />
            </div>
          </div>

          <p className="text-lg sm:text-2xl font-black text-yellow-300 uppercase tracking-widest mt-4 drop-shadow-md">
            💥 WORD DESTROYED! +100 PTS
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
