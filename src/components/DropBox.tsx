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
  const [countdown, setCountdown] = React.useState(10);

  React.useEffect(() => {
    if (isDestroying) {
      setCountdown(10);
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isDestroying]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

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
      className="flex-1 flex flex-col items-center justify-start pt-1 sm:pt-4 select-none z-10"
    >
      {/* Destroying Explosion Popup */}
      <AnimatePresence>
        {isDestroying && destroyingWord && (
          <motion.div
            id="word-destroy-overlay"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4"
          >
            <div className="flex flex-col items-center gap-2 bg-red-600 border-4 border-white px-6 py-4 rounded-3xl shadow-xl text-center max-w-sm w-full relative">
              <div className="absolute -top-3 -right-2 bg-yellow-300 text-red-900 border border-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                {countdown}s
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-3xl sm:text-4xl font-black text-yellow-300 tracking-wider">
                  {destroyingWord}
                </span>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>

              {hindiTranslation && (
                <div className="bg-yellow-300 text-red-900 border border-white px-3 py-1 rounded-full font-bold text-base sm:text-lg shadow<dyad-write path="src/components/DropBox.tsx" description="Complete DropBox component with clean standard Android mobile typography">
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
  const [countdown, setCountdown] = React.useState(10);

  React.useEffect(() => {
    if (isDestroying) {
      setCountdown(10);
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isDestroying]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

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
      className="flex-1 flex flex-col items-center justify-start pt-1 sm:pt-4 select-none z-10"
    >
      {/* Destroying Explosion Popup */}
      <AnimatePresence>
        {isDestroying && destroyingWord && (
          <motion.div
            id="word-destroy-overlay"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4"
          >
            <div className="flex flex-col items-center gap-2 bg-red-600 border-4 border-white px-6 py-4 rounded-3xl shadow-xl text-center max-w-sm w-full relative">
              <div className="absolute -top-3 -right-2 bg-yellow-300 text-red-900 border border-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                {countdown}s
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-3xl sm:text-4xl font-black text-yellow-300 tracking-wider">
                  {destroyingWord}
                </span>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>

              {hindiTranslation && (
                <div className="bg-yellow-300 text-red-900 border border-white px-3 py-1 rounded-full font-bold text-base sm:text-lg shadow">
                  {destroyingWord} = {hindiTranslation}
                </div>
              )}

              <div className="w-full bg-black/40 h-2 rounded-full mt-2 overflow-hidden border border-white/40">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 10, ease: 'linear' }}
                  className="bg-yellow-300 h-full rounded-full"
                />
              </div>
            </div>

            <p className="text-base sm:text-lg font-bold text-yellow-300 uppercase tracking-wide mt-3">
              WORD DESTROYED! +100 PTS
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Drop Box Frame */}
      <div
        id="dropbox-main-frame"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-3 sm:border-4 border-blue-600 bg-yellow-300 p-2 rounded-2xl shadow-lg flex items-center justify-center gap-2"
      >
        {/* Left Slot: Prefix Letter */}
        <div
          id="slot-prefix"
          className="w-11 h-9 sm:w-16 sm:h-13 md:w-18 md:h-15 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center text-yellow-300 font-bold text-xl sm:text-2xl md:text-3xl shadow-sm"
        >
          {currentPrefix ? currentPrefix.letter : ''}
        </div>

        {/* Right Slot: Suffix Word */}
        <div
          id="slot-suffix"
          className="w-14 h-9 sm:w-20 sm:h-13 md:w-22 md:h-15 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center text-yellow-300 font-bold text-xl sm:text-2xl md:text-3xl shadow-sm"
        >
          {activeSuffix ? activeSuffix : ''}
        </div>
      </div>
    </div>
  );
};