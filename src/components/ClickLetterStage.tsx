import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ClickLetterStageProps {
  soundEnabled: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

const LETTER_PAGES = [
  {
    id: 'SWAR',
    title: 'स्वर (अ - अः)',
    letters: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
    gridClass: 'grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4',
  },
  {
    id: 'VYANJAN',
    title: 'व्यंजन (क - ज्ञ)',
    letters: [
      'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ',
      'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न',
      'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श',
      'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'
    ],
    gridClass: 'grid-cols-6 sm:grid-cols-9 gap-1.5 sm:gap-2.5',
  },
  {
    id: 'ENGLISH',
    title: 'Alphabets (A - Z)',
    letters: [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'
    ],
    gridClass: 'grid-cols-5 sm:grid-cols-9 gap-1.5 sm:gap-3',
  }
];

export const ClickLetterStage: React.FC<ClickLetterStageProps> = ({
  soundEnabled,
  onHome,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const currentPage = LETTER_PAGES[pageIndex];

  const [clickedLetters, setClickedLetters] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [popAnim, setPopAnim] = useState<string | null>(null);

  const handleTileClick = (letter: string) => {
    sounds.speakHindiLetterClick(letter, soundEnabled);

    if (!clickedLetters.has(letter)) {
      setClickedLetters((prev) => new Set(prev).add(letter));
      setScore((prev) => prev + 10);
    }

    setPopAnim(letter);
    setTimeout(() => setPopAnim(null), 300);
  };

  const handleNext = () => {
    sounds.playVictory(soundEnabled);
    setPageIndex((prev) => (prev + 1) % LETTER_PAGES.length);
    setClickedLetters(new Set());
  };

  const handleSelectPage = (idx: number) => {
    sounds.playSnap(soundEnabled);
    setPageIndex(idx);
    setClickedLetters(new Set());
  };

  return (
    <div
      id="click-letter-stage"
      className="relative w-full h-screen overflow-hidden select-none flex flex-col justify-between"
      style={{
        backgroundImage: 'linear-gradient(to bottom, #7cdbf8 0%, #a2ebff 50%, #cbf2fe 70%, #8ac730 70%, #599711 75%, #a66a38 75%, #6a3e15 100%)',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-3 left-[5%] w-32 h-10 bg-white/70 rounded-full blur-[1px]" />
        <div className="absolute top-6 left-[25%] w-48 h-12 bg-white/80 rounded-full blur-[1px]" />
        <div className="absolute top-2 right-[20%] w-40 h-11 bg-white/75 rounded-full blur-[1px]" />
        <div className="absolute top-[72%] inset-x-0 h-6 bg-green-600" />
        <div className="absolute top-[76%] inset-x-0 bottom-0 bg-amber-950" />
      </div>

      {/* TOP HEADER */}
      <div id="click-top-header" className="relative z-20 w-full px-3 sm:px-6 pt-2 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5">
          {LETTER_PAGES.map((pg, idx) => (
            <button
              key={pg.id}
              onClick={() => handleSelectPage(idx)}
              className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full border border-white cursor-pointer transition-all ${
                pageIndex === idx
                  ? 'bg-yellow-400 text-red-900 shadow-md scale-105'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              {pg.title}
            </button>
          ))}
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-yellow-300 uppercase tracking-wide">
          Click The Letter
        </h1>

        <div className="flex items-center gap-1 bg-black/50 border border-white/30 px-3 py-1 rounded-full">
          <span className="text-xs sm:text-sm text-yellow-300 font-bold">SCORE:</span>
          <span className="text-sm sm:text-lg text-white font-black">{score}</span>
        </div>
      </div>

      {/* LETTERS GRID */}
      <div id="click-letters-grid-container" className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 flex items-center justify-center py-2">
        <div className={`grid ${currentPage.gridClass} w-full justify-items-center items-center`}>
          {currentPage.letters.map((letter) => {
            const isClicked = clickedLetters.has(letter);

            return (
              <motion.button
                key={letter}
                whileTap={{ scale: 0.9 }}
                animate={popAnim === letter ? { scale: [1, 1.2, 1] } : {}}
                onClick={() => handleTileClick(letter)}
                className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl border-2 sm:border-3 flex items-center justify-center shadow-md cursor-pointer transition-colors ${
                  isClicked
                    ? 'bg-emerald-600 border-yellow-300'
                    : 'bg-red-600 border-white hover:bg-red-500'
                }`}
              >
                <span
                  className={`font-bold text-xl sm:text-2xl ${
                    isClicked ? 'text-yellow-300' : 'text-white'
                  }`}
                >
                  {letter}
                </span>

                {isClicked && (
                  <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-200" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div id="click-bottom-bar" className="relative z-20 w-full px-3 sm:px-8 pb-3 flex items-center justify-between max-w-6xl mx-auto">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="bg-sky-400 border-2 border-white text-yellow-300 font-bold text-base sm:text-xl px-5 sm:px-8 py-1.5 rounded-2xl shadow-lg cursor-pointer"
        >
          Home
        </motion.button>

        <div className="bg-black/60 border border-yellow-400/80 text-yellow-300 font-bold text-xs sm:text-sm px-4 py-1 rounded-full">
          {currentPage.title}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="bg-sky-400 border-2 border-white text-yellow-300 font-bold text-base sm:text-xl px-5 sm:px-8 py-1.5 rounded-2xl shadow-lg cursor-pointer"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};