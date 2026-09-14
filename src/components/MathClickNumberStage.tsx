import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Sparkles, Trophy, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';

interface MathClickNumberStageProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBack: () => void;
}

interface NumberInfo {
  num: number;
  english: string;
  hindi: string;
  color: string;
}

const HINDI_NUMBER_NAMES: string[] = [
  '', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
  'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाइस', 'उनतीस', 'तीस',
  'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
  'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास'
];

const ENGLISH_NUMBER_NAMES: string[] = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
  'Twenty One', 'Twenty Two', 'Twenty Three', 'Twenty Four', 'Twenty Five', 'Twenty Six', 'Twenty Seven', 'Twenty Eight', 'Twenty Nine', 'Thirty',
  'Thirty One', 'Thirty Two', 'Thirty Three', 'Thirty Four', 'Thirty Five', 'Thirty Six', 'Thirty Seven', 'Thirty Eight', 'Thirty Nine', 'Forty',
  'Forty One', 'Forty Two', 'Forty Three', 'Forty Four', 'Forty Five', 'Forty Six', 'Forty Seven', 'Forty Eight', 'Forty Nine', 'Fifty'
];

const CARD_COLORS = [
  'from-rose-500 to-red-600 border-red-300',
  'from-amber-500 to-orange-600 border-amber-300',
  'from-yellow-500 to-amber-600 border-yellow-200',
  'from-emerald-500 to-green-600 border-emerald-300',
  'from-teal-500 to-cyan-600 border-teal-300',
  'from-sky-500 to-blue-600 border-sky-300',
  'from-indigo-500 to-blue-700 border-indigo-300',
  'from-purple-500 to-violet-600 border-purple-300',
  'from-fuchsia-500 to-pink-600 border-fuchsia-300',
  'from-pink-500 to-rose-600 border-pink-300',
];

const ALL_NUMBERS: NumberInfo[] = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;
  return {
    num: n,
    english: ENGLISH_NUMBER_NAMES[n] || String(n),
    hindi: HINDI_NUMBER_NAMES[n] || String(n),
    color: CARD_COLORS[(n - 1) % CARD_COLORS.length],
  };
});

export const MathClickNumberStage: React.FC<MathClickNumberStageProps> = ({
  soundEnabled,
  onToggleSound,
  onBack,
}) => {
  // Page 0 = Numbers 1 to 25; Page 1 = Numbers 26 to 50
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [clickedNumbers, setClickedNumbers] = useState<Set<number>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [activeNumber, setActiveNumber] = useState<NumberInfo | null>(null);
  const [popParticle, setPopParticle] = useState<{ id: number; num: number } | null>(null);

  const displayedNumbers = pageIndex === 0
    ? ALL_NUMBERS.slice(0, 25)
    : ALL_NUMBERS.slice(25, 50);

  const handleTileClick = (item: NumberInfo) => {
    // Play voice and chime
    sounds.speakMathNumberClick(item.num, soundEnabled);
    setActiveNumber(item);

    // Score bonus if newly discovered
    if (!clickedNumbers.has(item.num)) {
      setClickedNumbers((prev) => new Set(prev).add(item.num));
      setScore((s) => s + 10);
      setPopParticle({ id: Date.now(), num: item.num });
      setTimeout(() => setPopParticle(null), 1200);
    }
  };

  const handleResetProgress = () => {
    sounds.playPop(soundEnabled);
    setClickedNumbers(new Set());
    setScore(0);
    setActiveNumber(null);
  };

  const progressPercent = Math.round((clickedNumbers.size / 50) * 100);

  return (
    <div
      id="math-click-stage-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-1.5 sm:p-3 text-white select-none overflow-hidden min-h-0"
    >
      {/* Top Header Bar */}
      <div
        id="math-click-header"
        className="w-full flex items-center justify-between z-20 max-w-5xl px-1 sm:px-2 shrink-0 gap-1 sm:gap-2 mb-1"
      >
        {/* Back button */}
        <button
          onClick={() => {
            sounds.playPop(soundEnabled);
            onBack();
          }}
          className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-yellow-300 flex items-center gap-1 text-xs sm:text-sm font-black active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
          title="Back to Math Menu"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>वापस (Back)</span>
        </button>

        {/* Page Switcher Tabs */}
        <div className="flex items-center bg-black/70 p-0.5 rounded-full border border-white/30 shrink-0">
          <button
            onClick={() => {
              sounds.playSnap(soundEnabled);
              setPageIndex(0);
            }}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              pageIndex === 0
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                : 'text-white/80 hover:text-white'
            }`}
          >
            1 से 25 (Part 1)
          </button>
          <button
            onClick={() => {
              sounds.playSnap(soundEnabled);
              setPageIndex(1);
            }}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              pageIndex === 1
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                : 'text-white/80 hover:text-white'
            }`}
          >
            26 से 50 (Part 2)
          </button>
        </div>

        {/* Score & Sound */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 bg-amber-500/90 text-slate-950 font-black px-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm shadow-md border border-yellow-200">
            <Trophy className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>{score}</span>
          </div>

          <button
            onClick={onToggleSound}
            className="p-1 sm:p-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white active:scale-95 transition-transform cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-yellow-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-red-400" />
            )}
          </button>
        </div>
      </div>

      {/* Sub-Header: Active Number Card Banner & Stats */}
      <div className="w-full max-w-5xl flex items-center justify-between px-2 py-0.5 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-yellow-200">
            {pageIndex === 0 ? 'संख्या 1 से 25 दबाएं:' : 'संख्या 26 से 50 दबाएं:'}
          </span>
          <span className="text-[11px] bg-blue-900/60 border border-blue-400/40 text-blue-200 px-2 py-0.5 rounded-full font-semibold">
            खोजी गईं: {clickedNumbers.size} / 50 ({progressPercent}%)
          </span>
        </div>

        {/* Active Number Spoken Banner */}
        {activeNumber && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 bg-yellow-400 text-blue-950 px-3 py-0.5 rounded-full font-black text-xs sm:text-sm shadow-lg border border-white"
          >
            <Sparkles className="w-3.5 h-3.5 fill-blue-950" />
            <span>{activeNumber.num} : {activeNumber.english} ({activeNumber.hindi})</span>
          </motion.div>
        )}
      </div>

      {/* Main Grid: 25 Number Tiles (5x5 or 7x4 responsive grid optimized for Android landscape & mobile) */}
      <div
        id="math-number-tiles-grid"
        className="flex-1 w-full max-w-5xl flex items-center justify-center p-1 z-10 overflow-y-auto min-h-0"
      >
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-1.5 sm:gap-2.5 w-full max-w-4xl h-full max-h-[70vh] my-auto">
          {displayedNumbers.map((item) => {
            const isClicked = clickedNumbers.has(item.num);
            const isSelected = activeNumber?.num === item.num;

            return (
              <motion.button
                key={item.num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleTileClick(item)}
                className={`group relative rounded-xl sm:rounded-2xl border-2 sm:border-3 transition-all flex flex-col items-center justify-center cursor-pointer shadow-md select-none touch-manipulation min-h-[44px] sm:min-h-[56px] ${
                  item.color
                } bg-gradient-to-br ${
                  isSelected
                    ? 'ring-4 ring-yellow-300 scale-105 shadow-yellow-400/50 shadow-lg'
                    : isClicked
                    ? 'ring-2 ring-emerald-300/80 shadow-sm'
                    : 'hover:brightness-110'
                }`}
              >
                {/* Number Digit */}
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-none">
                  {item.num}
                </span>

                {/* Subtitle: Hindi & English Name */}
                <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-extrabold text-yellow-200 mt-0.5 leading-tight px-1 text-center truncate max-w-full">
                  <span>{item.hindi}</span>
                  <span className="opacity-75 hidden sm:inline">({item.english})</span>
                </div>

                {/* Checked Badge */}
                {isClicked && (
                  <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-yellow-300">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-emerald-600 text-yellow-300" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Floating Star Animation for newly clicked number */}
      <AnimatePresence>
        {popParticle && (
          <motion.div
            key={popParticle.id}
            initial={{ scale: 0.4, opacity: 1, y: 30 }}
            animate={{ scale: 1.5, opacity: 0, y: -40 }}
            exit={{ opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 bg-yellow-400 text-blue-950 font-black text-xl sm:text-2xl px-5 py-2 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2"
          >
            <Sparkles className="w-6 h-6 fill-blue-950 animate-spin" />
            <span>+10 शाबाश! {popParticle.num}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar: Next/Previous Page Controls & Reset */}
      <div
        id="math-bottom-nav"
        className="w-full max-w-5xl flex items-center justify-between px-2 pt-1 z-20 shrink-0 gap-2"
      >
        <button
          onClick={handleResetProgress}
          className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white/80 hover:text-white flex items-center gap-1 text-[11px] font-semibold active:scale-95 transition-all cursor-pointer"
          title="Reset Discovered Numbers"
        >
          <RotateCcw className="w-3 h-3" />
          <span>रीसेट (Reset)</span>
        </button>

        <div className="flex items-center gap-2">
          {pageIndex === 1 ? (
            <button
              onClick={() => {
                sounds.playSnap(soundEnabled);
                setPageIndex(0);
              }}
              className="px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border border-white text-yellow-300 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>पिछला: 1 से 25</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playSnap(soundEnabled);
                setPageIndex(1);
              }}
              className="px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 border border-white text-yellow-300 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>अगला: 26 से 50</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
