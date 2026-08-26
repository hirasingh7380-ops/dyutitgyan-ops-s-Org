import React from 'react';
import { LetterTile } from '../types';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DropBoxProps {
  activeSuffix: string | null;
  currentPrefix: LetterTile | null;
  isDestroying: boolean;
  destroyingWord: string | null;
  onDropSuffix: (suffixId: string) => void;
  onDropPrefix: (tile: LetterTile) => void;
  onClearPrefix: () => void;
  onClearSuffix: () => void;
}

const HINDI_MEANINGS: Record<string, string> = {
  CAT: 'बिल्ली (Billi)',
  BAT: 'बल्ला (Balla)',
  RAT: 'चूहा (Chuha)',
  HAT: 'टोपी (Topi)',
  FAN: 'पंखा (Pankha)',
  MAN: 'आदमी (Aadmi)',
  VAN: 'गाड़ी (Gaadi)',
  CAN: 'डिब्बा (Dibba)',
  MAP: 'नक्शा (Naksha)',
  CAP: 'टोपी (Topi)',
  TAP: 'नल (Nal)',
  LAP: 'गोद (Lap)',
  BALL: 'गेंद (Gend)',
  HALL: 'बड़ा कमरा (Hall)',
  WALL: 'दीवार (Wall)',
  TALL: 'लंबा (Tall)',
};

export const DropBox: React.FC<DropBoxProps> = ({
  activeSuffix,
  currentPrefix,
  isDestroying,
  destroyingWord,
  onDropSuffix,
  onDropPrefix,
}) => {
  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Handle Drop on DropBox
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'SUFFIX') {
        onDropSuffix(parsed.id);
      } else if (parsed.type === 'PREFIX') {
        const tile: LetterTile = parsed.tile;
        onDropPrefix(tile);
      }
    } catch {
      // fallback
    }
  };

  const hindiTranslation = destroyingWord ? HINDI_MEANINGS[destroyingWord.toUpperCase()] : null;

  return (
    <div
      id="center-dropbox-stage"
      className="flex-1 flex flex-col items-center justify-start pt-1 sm:pt-4 md:pt-6 select-none z-10"
    >
      {/* Destroying Explosion Popup - Fast & Exciting 2.2s */}
      <AnimatePresence>
        {isDestroying && destroyingWord && (
          <motion.div
            id="word-destroy-overlay"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          >
            <div className="flex flex-col items-center gap-2 bg-red-600 border-4 sm:border-8 border-white px-6 py-5 sm:px-10 sm:py-7 rounded-3xl shadow-2xl text-center max-w-md w-full relative">
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

              {/* Fast 2s Progress Bar */}
              <div className="w-full bg-black/40 h-2.5 rounded-full mt-3 overflow-hidden border border-white/40">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 2.2, ease: 'linear' }}
                  className="bg-yellow-300 h-full rounded-full"
                />
              </div>
            </div>

            <p className="text-lg sm:text-2xl font-black text-yellow-300 uppercase tracking-widest mt-4">
              💥 WORD DESTROYED! +100 PTS
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Drop Box Frame (Blue border with Yellow bg and 2 Red slots) */}
      <div
        id="dropbox-main-frame"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-4 sm:border-6 md:border-8 border-blue-600 bg-yellow-300 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center gap-2.5 sm:gap-4"
        style={{
          boxShadow: '0 12px 28px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.7)',
        }}
      >
        {/* Left Slot: Prefix Letter */}
        <div
          id="slot-prefix"
          className="w-14 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 lg:w-28 lg:h-22 rounded-xl sm:rounded-2xl bg-red-600 border-2 sm:border-4 border-white flex items-center justify-center text-yellow-300 font-black text-2xl sm:text-4xl md:text-5xl shadow-lg transition-all"
          style={{
            boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          {currentPrefix ? currentPrefix.letter : ''}
        </div>

        {/* Right Slot: Suffix Word */}
        <div
          id="slot-suffix"
          className="w-18 h-12 sm:w-26 sm:h-16 md:w-30 md:h-20 lg:w-36 lg:h-22 rounded-xl sm:rounded-2xl bg-red-600 border-2 sm:border-4 border-white flex items-center justify-center text-yellow-300 font-black text-2xl sm:text-4xl md:text-5xl shadow-lg transition-all"
          style={{
            boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          {activeSuffix ? activeSuffix : ''}
        </div>
      </div>
    </div>
  );
};

