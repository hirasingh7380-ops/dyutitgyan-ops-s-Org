import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, RotateCcw, ArrowLeft, Volume2, VolumeX, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MathFillInBlankStageProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBack: () => void;
}

interface MathSlot {
  id: string;
  num: number;
  isPreFilled: boolean;
}

interface MathLevel {
  levelNumber: number;
  title: string;
  range: string;
  slots: MathSlot[];
  missingNumbers: number[];
}

const HINDI_NUM_NAMES: Record<number, string> = {
  1: 'एक', 2: 'दो', 3: 'तीन', 4: 'चार', 5: 'पाँच', 6: 'छह', 7: 'सात', 8: 'आठ', 9: 'नौ', 10: 'दस',
  11: 'ग्यारह', 12: 'बारह', 13: 'तेरह', 14: 'चौदह', 15: 'पंद्रह', 16: 'सोलह', 17: 'सत्रह', 18: 'अठारह', 19: 'उन्नीस', 20: 'बीस',
  21: 'इक्कीस', 22: 'बाईस', 23: 'तेईस', 24: 'चौबीस', 25: 'पच्चीस', 26: 'छब्बीस', 27: 'सत्ताईस', 28: 'अट्ठाइस', 29: 'उनतीस', 30: 'तीस',
  31: 'इकतीस', 32: 'बत्तीस', 33: 'तैंतीस', 34: 'चौंतीस', 35: 'पैंतीस', 36: 'छत्तीस', 37: 'सैंतीस', 38: 'अड़तीस', 39: 'उनतालीस', 40: 'चालीस',
  41: 'इकतालीस', 42: 'बयालीस', 43: 'तैंतालीस', 44: 'चवालीस', 45: 'पैंतालीस', 46: 'छियालीस', 47: 'सैंतालीस', 48: 'अड़तालीस', 49: 'उनचास', 50: 'पचास'
};

const MATH_LEVELS: MathLevel[] = [
  {
    levelNumber: 1,
    title: 'स्तर 1: 1 से 10',
    range: '1–10',
    slots: [
      { id: 's1', num: 1, isPreFilled: true },
      { id: 's2', num: 2, isPreFilled: false },
      { id: 's3', num: 3, isPreFilled: true },
      { id: 's4', num: 4, isPreFilled: true },
      { id: 's5', num: 5, isPreFilled: false },
      { id: 's6', num: 6, isPreFilled: true },
      { id: 's7', num: 7, isPreFilled: false },
      { id: 's8', num: 8, isPreFilled: true },
      { id: 's9', num: 9, isPreFilled: false },
      { id: 's10', num: 10, isPreFilled: true },
    ],
    missingNumbers: [2, 5, 7, 9],
  },
  {
    levelNumber: 2,
    title: 'स्तर 2: 11 से 20',
    range: '11–20',
    slots: [
      { id: 's11', num: 11, isPreFilled: true },
      { id: 's12', num: 12, isPreFilled: false },
      { id: 's13', num: 13, isPreFilled: false },
      { id: 's14', num: 14, isPreFilled: true },
      { id: 's15', num: 15, isPreFilled: true },
      { id: 's16', num: 16, isPreFilled: false },
      { id: 's17', num: 17, isPreFilled: true },
      { id: 's18', num: 18, isPreFilled: false },
      { id: 's19', num: 19, isPreFilled: true },
      { id: 's20', num: 20, isPreFilled: true },
    ],
    missingNumbers: [12, 13, 16, 18],
  },
  {
    levelNumber: 3,
    title: 'स्तर 3: 21 से 30',
    range: '21–30',
    slots: [
      { id: 's21', num: 21, isPreFilled: true },
      { id: 's22', num: 22, isPreFilled: true },
      { id: 's23', num: 23, isPreFilled: false },
      { id: 's24', num: 24, isPreFilled: true },
      { id: 's25', num: 25, isPreFilled: false },
      { id: 's26', num: 26, isPreFilled: true },
      { id: 's27', num: 27, isPreFilled: false },
      { id: 's28', num: 28, isPreFilled: true },
      { id: 's29', num: 29, isPreFilled: false },
      { id: 's30', num: 30, isPreFilled: true },
    ],
    missingNumbers: [23, 25, 27, 29],
  },
  {
    levelNumber: 4,
    title: 'स्तर 4: 31 से 40',
    range: '31–40',
    slots: [
      { id: 's31', num: 31, isPreFilled: false },
      { id: 's32', num: 32, isPreFilled: true },
      { id: 's33', num: 33, isPreFilled: false },
      { id: 's34', num: 34, isPreFilled: true },
      { id: 's35', num: 35, isPreFilled: true },
      { id: 's36', num: 36, isPreFilled: false },
      { id: 's37', num: 37, isPreFilled: true },
      { id: 's38', num: 38, isPreFilled: false },
      { id: 's39', num: 39, isPreFilled: true },
      { id: 's40', num: 40, isPreFilled: false },
    ],
    missingNumbers: [31, 33, 36, 38, 40],
  },
  {
    levelNumber: 5,
    title: 'स्तर 5: 41 से 50',
    range: '41–50',
    slots: [
      { id: 's41', num: 41, isPreFilled: true },
      { id: 's42', num: 42, isPreFilled: false },
      { id: 's43', num: 43, isPreFilled: true },
      { id: 's44', num: 44, isPreFilled: false },
      { id: 's45', num: 45, isPreFilled: true },
      { id: 's46', num: 46, isPreFilled: true },
      { id: 's47', num: 47, isPreFilled: false },
      { id: 's48', num: 48, isPreFilled: false },
      { id: 's49', num: 49, isPreFilled: true },
      { id: 's50', num: 50, isPreFilled: false },
    ],
    missingNumbers: [42, 44, 47, 48, 50],
  },
];

export const MathFillInBlankStage: React.FC<MathFillInBlankStageProps> = ({
  soundEnabled,
  onToggleSound,
  onBack,
}) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = MATH_LEVELS[levelIndex];

  // Track filled status of blank slots: key is slot.id, value is filled number
  const [filledSlots, setFilledSlots] = useState<Record<string, number>>({});
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  // Available candidate numbers (shuffled with an extra distraction number)
  const [candidates, setCandidates] = useState<number[]>(() => {
    return [...currentLevel.missingNumbers].sort(() => Math.random() - 0.5);
  });

  const loadLevel = (idx: number) => {
    setLevelIndex(idx);
    setFilledSlots({});
    setSelectedCandidate(null);
    setWrongSlotId(null);
    setShowLevelComplete(false);

    const lvl = MATH_LEVELS[idx];
    setCandidates([...lvl.missingNumbers].sort(() => Math.random() - 0.5));
  };

  const handleSlotClick = (slot: MathSlot) => {
    if (slot.isPreFilled || filledSlots[slot.id]) return;

    if (selectedCandidate === null) return;

    // Check if selected candidate matches slot.num
    if (selectedCandidate === slot.num) {
      // Correct!
      setFilledSlots((prev) => ({
        ...prev,
        [slot.id]: selectedCandidate,
      }));

      // Remove from candidate pool
      setCandidates((prev) => {
        const copy = [...prev];
        const i = copy.indexOf(selectedCandidate);
        if (i !== -1) copy.splice(i, 1);
        return copy;
      });

      setSelectedCandidate(null);
      setScore((s) => s + 20);

      // Play teacher voice: e.g. "3 ke baad 4, bilkul sahi!"
      sounds.speakMathNumberDrop(slot.num, slot.num - 1, soundEnabled);

      // Check if level completed
      const remainingBlanks = currentLevel.slots.filter(
        (s) => !s.isPreFilled && s.id !== slot.id && !filledSlots[s.id]
      ).length;

      if (remainingBlanks === 0) {
        setTimeout(() => {
          sounds.playVictory(soundEnabled);
          setShowLevelComplete(true);
        }, 800);
      }
    } else {
      // Incorrect!
      sounds.speakMathWrongAnswer(soundEnabled);
      setWrongSlotId(slot.id);
      setTimeout(() => setWrongSlotId(null), 600);
    }
  };

  const handleCandidateClick = (num: number) => {
    sounds.speakMathNumberClick(num, soundEnabled);
    if (selectedCandidate === num) {
      setSelectedCandidate(null);
    } else {
      setSelectedCandidate(num);
    }
  };

  const totalBlanks = currentLevel.missingNumbers.length;
  const filledCount = Object.keys(filledSlots).length;

  return (
    <div
      id="math-fill-blank-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-1.5 sm:p-3 text-white select-none overflow-hidden min-h-0"
    >
      {/* Top Header Bar */}
      <div
        id="math-fill-header"
        className="w-full flex items-center justify-between z-20 max-w-5xl px-1 sm:px-2 shrink-0 gap-1 sm:gap-2 mb-1"
      >
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

        {/* Level Switcher */}
        <div className="flex items-center gap-1 bg-black/70 p-0.5 rounded-full border border-white/30 overflow-x-auto max-w-[60vw]">
          {MATH_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.levelNumber}
              onClick={() => {
                sounds.playSnap(soundEnabled);
                loadLevel(idx);
              }}
              className={`px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                levelIndex === idx
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-yellow-300 shadow-md ring-2 ring-yellow-400'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {lvl.range}
            </button>
          ))}
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

      {/* Level Subheader Prompt */}
      <div className="w-full max-w-5xl flex items-center justify-between px-2 py-0.5 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-yellow-300">
            {currentLevel.title}:
          </span>
          <span className="text-[11px] text-emerald-200">
            नीचे से संख्या चुनकर खाली स्थान में लगाएं ({filledCount}/{totalBlanks})
          </span>
        </div>

        <button
          onClick={() => loadLevel(levelIndex)}
          className="px-2 py-0.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white/80 text-[10px] sm:text-xs flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>दोबारा करें</span>
        </button>
      </div>

      {/* Sequence Slots Area (10 slots in 2 rows of 5 for optimal mobile touch and visibility) */}
      <div
        id="math-slots-grid-area"
        className="flex-1 w-full max-w-4xl flex items-center justify-center p-1 z-10 min-h-0"
      >
        <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-2xl my-auto">
          {currentLevel.slots.map((slot) => {
            const isFilled = slot.isPreFilled || filledSlots[slot.id] !== undefined;
            const displayValue = slot.isPreFilled ? slot.num : filledSlots[slot.id];
            const isWrong = wrongSlotId === slot.id;

            return (
              <motion.div
                key={slot.id}
                animate={isWrong ? { x: [-8, 8, -6, 6, 0] } : {}}
                onClick={() => handleSlotClick(slot)}
                className={`relative rounded-xl sm:rounded-2xl flex flex-col items-center justify-center min-h-[56px] sm:min-h-[72px] transition-all shadow-md select-none touch-manipulation cursor-pointer ${
                  slot.isPreFilled
                    ? 'bg-gradient-to-br from-blue-700 to-indigo-900 border-2 border-blue-300/80 text-white'
                    : isFilled
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-800 border-3 border-yellow-300 text-yellow-200 ring-2 ring-emerald-400'
                    : isWrong
                    ? 'bg-red-900/80 border-2 border-red-400 text-red-200 ring-2 ring-red-500'
                    : selectedCandidate !== null
                    ? 'bg-amber-950/60 border-2 border-dashed border-yellow-400 animate-pulse text-yellow-300 ring-2 ring-yellow-400/50'
                    : 'bg-black/50 border-2 border-dashed border-white/40 text-white/40'
                }`}
              >
                {isFilled ? (
                  <>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                      {displayValue}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-yellow-200 mt-0.5">
                      {HINDI_NUM_NAMES[displayValue!]}
                    </span>
                    {!slot.isPreFilled && (
                      <div className="absolute top-1 right-1">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-yellow-300" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xl sm:text-2xl font-black text-yellow-300/80">?</span>
                    <span className="text-[9px] font-bold text-yellow-400/70">खाली स्थान</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Candidate Numbers Bank at Bottom */}
      <div
        id="math-candidate-bank"
        className="w-full max-w-4xl bg-black/60 backdrop-blur-md rounded-2xl border border-white/30 p-2 sm:p-2.5 z-20 shrink-0 flex flex-col items-center gap-1.5"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-200">
          <Sparkles className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
          <span>
            {selectedCandidate !== null
              ? `संख्या ${selectedCandidate} चुनी गई है! ऊपर सही खाली स्थान पर दबाएं:`
              : 'संख्या पर दबाएं, फिर खाली स्थान भरें:'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {candidates.map((num) => {
            const isSelected = selectedCandidate === num;
            return (
              <motion.button
                key={num}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleCandidateClick(num)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-black text-lg sm:text-2xl shadow-lg border-2 sm:border-3 transition-all cursor-pointer select-none touch-manipulation flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-yellow-400 text-blue-950 border-white ring-4 ring-yellow-300 scale-105 shadow-yellow-300/50'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-200 text-white hover:brightness-110'
                }`}
              >
                <span>{num}</span>
                <span className="text-[10px] sm:text-xs font-bold opacity-80">
                  ({HINDI_NUM_NAMES[num]})
                </span>
              </motion.button>
            );
          })}
          {candidates.length === 0 && (
            <div className="text-emerald-300 font-bold text-sm py-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-yellow-300" />
              <span>सभी खाली स्थान सफलतापूर्वक भर दिए गए!</span>
            </div>
          )}
        </div>
      </div>

      {/* Level Complete Celebration Modal */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 30 }}
              className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border-4 border-yellow-400 rounded-3xl p-5 sm:p-7 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-3 text-white"
            >
              <div className="w-16 h-16 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-blue-950 shadow-lg">
                <Trophy className="w-9 h-9 fill-blue-950 animate-bounce" />
              </div>

              <h2 className="text-2xl font-black text-yellow-300 drop-shadow">
                शानदार! स्तर पूरा हुआ!
              </h2>

              <p className="text-xs sm:text-sm text-blue-100">
                आपने {currentLevel.range} तक की सभी संख्याएं बिल्कुल सही क्रम में भर दीं!
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => loadLevel(levelIndex)}
                  className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>दोबारा</span>
                </button>

                {levelIndex < MATH_LEVELS.length - 1 ? (
                  <button
                    onClick={() => loadLevel(levelIndex + 1)}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border border-white text-yellow-300 font-black text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                  >
                    <span>अगला स्तर ({MATH_LEVELS[levelIndex + 1].range})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onBack}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-blue-950 font-black text-sm flex items-center gap-1.5 shadow-lg"
                  >
                    <span>मुख्य मेन्यू (Menu)</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
