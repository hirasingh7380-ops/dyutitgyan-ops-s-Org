import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

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
  soundEnabled?: boolean;
}

export const WordDestroyModal: React.FC<WordDestroyModalProps> = ({
  isDestroying,
  destroyingWord,
  soundEnabled = true,
}) => {
  const hindiTranslation = destroyingWord ? HINDI_WORD_MAP[destroyingWord.toUpperCase()] || '' : '';

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (destroyingWord) {
      sounds.speakHindiWordMeaning(destroyingWord, soundEnabled);
    }
  };

  return (
    <AnimatePresence>
      {isDestroying && destroyingWord && (
        <motion.div
          id="word-destroy-overlay"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4 select-none pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-2 bg-red-600 border-4 sm:border-8 border-white px-6 py-4 sm:px-10 sm:py-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center max-w-md w-full relative">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-spin" />
              <span className="text-4xl sm:text-6xl font-black text-yellow-300 tracking-widest drop-shadow-lg">
                {destroyingWord}
              </span>
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-spin" />
            </div>

            {hindiTranslation && (
              <div className="bg-yellow-300 text-red-900 border-2 border-white px-4 py-1.5 rounded-full font-black text-xl sm:text-3xl shadow-md mt-1">
                {destroyingWord} = {hindiTranslation}
              </div>
            )}

            {/* Young Hindi Teacher Voice Prompt + Replay Button */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5 text-yellow-200 text-xs sm:text-sm font-bold bg-black/40 px-3 py-1 rounded-full border border-white/20">
                <Volume2 className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>शिक्षिका आवाज</span>
              </div>
              <button
                onClick={handleReplay}
                className="flex items-center gap-1 text-xs font-bold bg-yellow-400 text-red-950 px-2.5 py-1 rounded-full border border-white active:scale-95 cursor-pointer shadow"
              >
                <RotateCcw className="w-3 h-3" />
                <span>फिर से सुनें</span>
              </button>
            </div>

            {/* 2.7s Progress Bar */}
            <div className="w-full bg-black/40 h-2.5 rounded-full mt-2 overflow-hidden border border-white/40">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 2.7, ease: 'linear' }}
                className="bg-yellow-300 h-full rounded-full"
              />
            </div>
          </div>

          <p className="text-lg sm:text-2xl font-black text-yellow-300 uppercase tracking-widest mt-3 drop-shadow-md">
            💥 WORD DESTROYED! +100 PTS
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
