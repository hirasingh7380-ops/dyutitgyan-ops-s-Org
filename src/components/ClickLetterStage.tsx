import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ClickLetterStageProps {
  soundEnabled: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

// Letter pages - Swar, Vyanjan, English
const LETTER_PAGES = [
  {
    id: 'SWAR',
    title: 'स्वर (अ - अः)',
    letters: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
    gridClass: 'grid-cols-7 sm:grid-cols-7 gap-1.5 sm:gap-3',
    tileSize: 'w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 text-xl sm:text-3xl md:text-4xl',
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
    gridClass: 'grid-cols-9 sm:grid-cols-9 md:grid-cols-12 gap-1 sm:gap-1.5',
    tileSize: 'w-8 h-8 sm:w-10 sm:h-10 md:w-13 md:h-13 text-sm sm:text-xl md:text-2xl',
  },
  {
    id: 'ENGLISH',
    title: 'ALPHABETS (A - Z)',
    letters: [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'
    ],
    gridClass: 'grid-cols-9 sm:grid-cols-9 md:grid-cols-9 gap-1 sm:gap-2',
    tileSize: 'w-8 h-8 sm:w-11 sm:h-11 md:w-15 md:h-15 text-sm sm:text-2xl md:text-3xl',
  }
];

export const ClickLetterStage: React.FC<ClickLetterStageProps> = ({
  soundEnabled,
  onHome,
}) => {
  const [pageIndex, setPageIndex] = useState(0); // 0 = Swar, 1 = Vyanjan, 2 = English
  const currentPage = LETTER_PAGES[pageIndex];

  const [clickedLetters, setClickedLetters] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [popAnim, setPopAnim] = useState<string | null>(null);

  // Handle clicking a letter tile
  const handleTileClick = (letter: string) => {
    // Play correct chime sound & speak letter name
    sounds.speakHindiLetterClick(letter, soundEnabled);

    // If not already clicked, add +10 score
    if (!clickedLetters.has(letter)) {
      setClickedLetters((prev) => new Set(prev).add(letter));
      setScore((prev) => prev + 10);
    }

    setPopAnim(letter);
    setTimeout(() => setPopAnim(null), 400);
  };

  // Next page (Cycles Swar -> Vyanjan -> English -> Swar)
  const handleNext = () => {
    sounds.playVictory(soundEnabled);
    setPageIndex((prev) => (prev + 1) % LETTER_PAGES.length);
    setClickedLetters(new Set());
  };

  // Direct tab toggle
  const handleSelectPage = (idx: number) => {
    sounds.playSnap(soundEnabled);
    setPageIndex(idx);
    setClickedLetters(new Set());
  };

  return (
    <div
      id="click-letter-stage"
      className="relative w-full h-full max-h-full overflow-hidden select-none flex flex-col justify-between"
      style={{
        backgroundImage: 'linear-gradient(to bottom, #7cdbf8 0%, #a2ebff 50%, #cbf2fe 70%, #8ac730 70%, #599711 75%, #a66a38 75%, #6a3e15 100%)',
      }}
    >
      {/* BACKGROUND SKY CLOUDS & GROUND SCENE */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Fluffy Clouds */}
        <div className="absolute top-2 left-[5%] w-24 h-8 bg-white/80 rounded-full blur-[1px]" />
        <div className="absolute top-4 left-[25%] w-36 h-9 bg-white/90 rounded-full blur-[1px]" />
        <div className="absolute top-2 right-[20%] w-32 h-8 bg-white/85 rounded-full blur-[1px]" />
        <div className="absolute top-5 right-[5%] w-20 h-6 bg-white/75 rounded-full blur-[1px]" />

        {/* Green Grass Meadow Strip */}
        <div className="absolute top-[72%] inset-x-0 h-5 bg-gradient-to-r from-lime-500 via-emerald-500 to-green-600 border-t-2 border-yellow-300/40" />

        {/* Soil Brown Earth Bottom */}
        <div className="absolute top-[76%] inset-x-0 bottom-0 bg-gradient-to-b from-amber-900 via-amber-950 to-amber-950 shadow-inner">
          <div className="w-full h-full opacity-30 flex flex-wrap gap-8 p-3">
            <div className="w-5 h-3 bg-amber-800 rounded-full" />
            <div className="w-7 h-4 bg-amber-700 rounded-full" />
            <div className="w-4 h-2 bg-amber-900 rounded-full" />
            <div className="w-8 h-5 bg-amber-800 rounded-full" />
          </div>
        </div>
      </div>

      {/* TOP HEADER SECTION */}
      <div id="click-top-header" className="relative z-20 w-full px-2 sm:px-6 pt-1 sm:pt-2 pb-0.5 flex items-center justify-between max-w-7xl mx-auto shrink-0">
        {/* Left: Category Indicator / Switcher */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {LETTER_PAGES.map((pg, idx) => (
            <button
              key={pg.id}
              onClick={() => handleSelectPage(idx)}
              className={`text-[10px] sm:text-xs md:text-sm font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white shadow-md cursor-pointer transition-all ${
                pageIndex === idx
                  ? 'bg-yellow-400 text-red-900 scale-105'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              {pg.title}
            </button>
          ))}
        </div>

        {/* Center Title: "click the letter" */}
        <div className="flex flex-col items-center justify-center">
          <h1
            className="text-xl sm:text-3xl md:text-4xl font-black text-yellow-300 tracking-wider uppercase drop-shadow-md"
            style={{
              textShadow: '2px 2px 0px #0284c7, -2px -2px 0px #0284c7, 2px -2px 0px #0284c7, -2px 2px 0px #0284c7, 0 3px 6px rgba(0,0,0,0.3)',
            }}
          >
            click the letter
          </h1>
        </div>

        {/* Right Score Banner */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-black/40 border border-white/40 px-2 sm:px-3 py-0.5 rounded-full">
            <span
              className="text-xs sm:text-base font-black text-yellow-300 uppercase tracking-wide"
            >
              Score:
            </span>
            <span
              className="text-sm sm:text-xl font-black text-red-500 leading-none"
            >
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN LETTERS GRID AREA WITH DISTANCE & SPACING */}
      <div id="click-letters-grid-container" className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-1.5 sm:px-6 flex items-center justify-center py-1 overflow-visible my-auto">
        <div className={`grid ${currentPage.gridClass} w-full justify-items-center items-center`}>
          {currentPage.letters.map((letter) => {
            const isClicked = clickedLetters.has(letter);

            return (
              <motion.button
                key={letter}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                animate={popAnim === letter ? { scale: [1, 1.3, 1] } : {}}
                onClick={() => handleTileClick(letter)}
                className={`relative ${currentPage.tileSize} rounded-lg sm:rounded-xl md:rounded-2xl border-2 sm:border-3 md:border-4 flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 ${
                  isClicked
                    ? 'bg-emerald-600 border-yellow-300 shadow-emerald-950/60'
                    : 'bg-red-600 border-yellow-400 shadow-red-950/70 hover:bg-red-500'
                }`}
                style={{
                  boxShadow: isClicked
                    ? 'inset 0 2px 4px rgba(255,255,255,0.45), 0 4px 8px rgba(0,0,0,0.4)'
                    : 'inset 0 2px 4px rgba(255,255,255,0.45), 0 4px 8px rgba(0,0,0,0.5)',
                }}
              >
                {/* LETTER TEXT inside box */}
                <span
                  className={`font-black leading-none ${
                    isClicked ? 'text-yellow-300' : 'text-sky-300'
                  }`}
                  style={{
                    textShadow: isClicked
                      ? '1px 1px 0px #15803d, -1px -1px 0px #15803d'
                      : '1px 1px 0px #991b1b, -1px -1px 0px #991b1b',
                  }}
                >
                  {letter}
                </span>

                {/* Star Sparkle on clicked */}
                {isClicked && (
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-200 animate-spin" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CONTROL BAR WITH HOME AND NEXT BUTTONS ON SOIL GROUND */}
      <div id="click-bottom-bar" className="relative z-20 w-full px-2 sm:px-6 pb-2 sm:pb-3 pt-0.5 flex items-center justify-between max-w-7xl mx-auto shrink-0">
        {/* LEFT: Home Button (Blue pill, white outline, yellow text) */}
        <motion.button
          id="btn-click-home"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onHome}
          className="bg-sky-400 border-2 sm:border-3 border-white text-yellow-300 font-black text-sm sm:text-2xl px-4 sm:px-8 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl cursor-pointer flex items-center justify-center"
          style={{ textShadow: '1px 1px 0px #000' }}
        >
          Home
        </motion.button>

        {/* CENTER: Current Category Name Pill */}
        <div className="bg-amber-950/80 border border-yellow-400/80 text-yellow-300 font-bold text-[10px] sm:text-sm px-3 sm:px-5 py-1 rounded-full shadow-lg">
          {currentPage.title}
        </div>

        {/* RIGHT: Next Button (Blue pill, white outline, yellow text) */}
        <motion.button
          id="btn-click-next"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleNext}
          className="bg-sky-400 border-2 sm:border-3 border-white text-yellow-300 font-black text-sm sm:text-2xl px-4 sm:px-8 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl cursor-pointer flex items-center justify-center"
          style={{ textShadow: '1px 1px 0px #000' }}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

