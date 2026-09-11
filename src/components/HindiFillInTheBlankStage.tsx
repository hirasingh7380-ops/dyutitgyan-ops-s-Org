import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, RotateCcw, ArrowLeft, Play } from 'lucide-react';
import { FillBlankLevel } from '../types';
import { HINDI_FILL_BLANK_LEVELS } from '../data/hindiFillBlankData';
import { sounds } from '../utils/audio';

interface HindiFillInTheBlankStageProps {
  soundEnabled: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

interface SelectedOption {
  id: string;
  letter: string;
}

export const HindiFillInTheBlankStage: React.FC<HindiFillInTheBlankStageProps> = ({
  soundEnabled,
  onHome,
}) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel: FillBlankLevel = HINDI_FILL_BLANK_LEVELS[currentLevelIndex];

  // Track filled states for slots: key is slotId, value is letter string
  const [filledSlots, setFilledSlots] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    currentLevel.rows.forEach((row) => {
      row.slots.forEach((slot) => {
        if (slot.isPreFilled && slot.filledLetter) {
          initial[slot.id] = slot.filledLetter;
        }
      });
    });
    return initial;
  });

  // Track destroyed/consumed option card IDs (e.g. "left-0", "right-2")
  const [destroyedOptionIds, setDestroyedOptionIds] = useState<Set<string>>(new Set());
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);
  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null);

  // Refs to slots for touch drag drop hit-testing
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const loadLevel = (levelIdx: number) => {
    const lvl = HINDI_FILL_BLANK_LEVELS[levelIdx];
    const initial: Record<string, string> = {};
    lvl.rows.forEach((row) => {
      row.slots.forEach((slot) => {
        if (slot.isPreFilled && slot.filledLetter) {
          initial[slot.id] = slot.filledLetter;
        }
      });
    });
    setFilledSlots(initial);
    setDestroyedOptionIds(new Set());
    setSelectedOption(null);
    setWrongSlotId(null);
  };

  // Check if level is completely filled
  const totalBlankSlots = currentLevel.rows.reduce(
    (acc, row) => acc + row.slots.filter((s) => !s.isPreFilled).length,
    0
  );
  const currentFilledCount = Object.keys(filledSlots).filter((slotId) => {
    const slot = currentLevel.rows.flatMap((r) => r.slots).find((s) => s.id === slotId);
    return slot && !slot.isPreFilled;
  }).length;

  const isLevelComplete = currentFilledCount === totalBlankSlots && totalBlankSlots > 0;

  const processSlotFill = (
    optionId: string | null,
    letter: string,
    slotId: string,
    targetLetter: string
  ) => {
    if (filledSlots[slotId]) return;

    if (letter === targetLetter) {
      setFilledSlots((prev) => ({
        ...prev,
        [slotId]: letter,
      }));

      if (optionId) {
        setDestroyedOptionIds((prev) => new Set(prev).add(optionId));
      }

      setSelectedOption(null);
      sounds.speakHindiLetterClick(letter, soundEnabled);

      if (currentFilledCount + 1 === totalBlankSlots) {
        setTimeout(() => {
          sounds.playVictory(soundEnabled);
        }, 800);
      }
    } else {
      sounds.speakMatchWrong(soundEnabled);
      setWrongSlotId(slotId);
      setTimeout(() => setWrongSlotId(null), 600);
    }
  };

  const handleSlotClick = (slotId: string, targetLetter: string) => {
    if (!selectedOption) return;
    processSlotFill(selectedOption.id, selectedOption.letter, slotId, targetLetter);
  };

  const handleDragEnd = (optionId: string, letter: string, dropX: number, dropY: number) => {
    for (const row of currentLevel.rows) {
      for (const slot of row.slots) {
        if (slot.isPreFilled || filledSlots[slot.id]) continue;

        const el = slotRefs.current[slot.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            dropX >= rect.left - 25 &&
            dropX <= rect.right + 25 &&
            dropY >= rect.top - 25 &&
            dropY <= rect.bottom + 25
          ) {
            processSlotFill(optionId, letter, slot.id, slot.targetLetter);
            return;
          }
        }
      }
    }
  };

  const handleNextLevel = () => {
    sounds.playVictory(soundEnabled);
    const nextIdx = (currentLevelIndex + 1) % HINDI_FILL_BLANK_LEVELS.length;
    setCurrentLevelIndex(nextIdx);
    loadLevel(nextIdx);
  };

  const handleResetLevel = () => {
    sounds.playPop(soundEnabled);
    loadLevel(currentLevelIndex);
  };

  return (
    <div
      id="hindi-fill-blank-stage"
      className="relative flex-1 flex flex-col justify-between w-full h-full max-h-full overflow-y-auto select-none px-1 sm:px-6 pt-1 pb-2 box-border min-h-0"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, #38bdf8 0%, #0284c7 50%, #0369a1 100%)',
      }}
    >
      {/* Top Header Bar */}
      <div
        id="hindi-fill-top-bar"
        className="w-full flex items-center justify-between z-20 max-w-5xl mx-auto px-1 sm:px-2 pt-0.5 shrink-0"
      >
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="bg-sky-400 border-2 border-white text-yellow-300 font-black text-xs sm:text-sm px-3 sm:px-4 py-1 rounded-xl shadow cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वापस (Home)</span>
          </motion.button>

          <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-white/20">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span className="text-xs font-black text-yellow-300">लेवल {currentLevel.levelNumber} / {HINDI_FILL_BLANK_LEVELS.length}</span>
          </div>
        </div>

        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-base sm:text-2xl font-black text-yellow-300 uppercase tracking-wide drop-shadow-md"
          style={{ textShadow: '2px 2px 0px #991b1b, -1px -1px 0px #991b1b' }}
        >
          खाली स्थान भरो (Fill in the Blank)
        </motion.h1>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleResetLevel}
          className="bg-red-600 hover:bg-red-500 border-2 border-white text-white p-1.5 sm:px-3 sm:py-1 rounded-xl shadow cursor-pointer flex items-center gap-1 text-xs font-bold"
          title="Reset Level"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">रीसेट (Reset)</span>
        </motion.button>
      </div>

      {/* Main Playing Area: Left Options | Center Rows with Blank Slots | Right Options */}
      <div
        id="hindi-fill-main-grid"
        className="flex-1 flex flex-row items-center justify-between w-full my-auto max-w-5xl mx-auto gap-2 sm:gap-4 md:gap-6 z-10 px-1 sm:px-3 overflow-visible"
      >
        {/* LEFT COLUMN OPTIONS */}
        <div className="relative z-30 flex flex-col gap-1.5 sm:gap-3 items-center justify-center overflow-visible shrink-0">
          {currentLevel.leftOptions.map((letter, idx) => {
            const optionId = `left-${idx}`;
            const isDestroyed = destroyedOptionIds.has(optionId);
            const isSelected = selectedOption?.id === optionId;

            if (isDestroyed) {
              return (
                <div key={optionId} className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 opacity-0 pointer-events-none" />
              );
            }

            return (
              <motion.div
                key={optionId}
                drag
                dragSnapToOrigin
                dragElastic={0.2}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onPointerDown={() => {
                  sounds.playSnap(soundEnabled);
                  setSelectedOption({ id: optionId, letter });
                }}
                onDragEnd={(_e, info) => {
                  handleDragEnd(optionId, letter, info.point.x, info.point.y);
                }}
                className={`relative w-11 h-11 sm:w-15 sm:h-15 md:w-19 md:h-19 rounded-xl sm:rounded-2xl border-3 sm:border-4 flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-shadow duration-150 z-30 touch-none shadow-xl ${
                  isSelected
                    ? 'bg-red-600 border-yellow-300 ring-4 ring-yellow-300/80 scale-105'
                    : 'bg-red-600 border-white hover:border-yellow-300'
                }`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 14px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  className="font-black text-2xl sm:text-4xl md:text-5xl text-yellow-300 pointer-events-none leading-none"
                  style={{
                    textShadow: '2px 2px 0px #991b1b, -1px -1px 0px #991b1b',
                  }}
                >
                  {letter}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* CENTER SLOTS ROWS */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 z-10 w-full max-w-2xl px-1">
          {currentLevel.rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3.5 w-full"
            >
              {row.slots.map((slot) => {
                const filledValue = filledSlots[slot.id];
                const isFilled = Boolean(filledValue);
                const isWrong = wrongSlotId === slot.id;

                return (
                  <motion.div
                    key={slot.id}
                    ref={(el) => {
                      slotRefs.current[slot.id] = el;
                    }}
                    onClick={() => handleSlotClick(slot.id, slot.targetLetter)}
                    animate={
                      isWrong
                        ? { x: [-8, 8, -8, 8, 0], backgroundColor: '#ef4444' }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                    className={`relative w-11 h-11 sm:w-15 sm:h-15 md:w-19 md:h-19 rounded-xl sm:rounded-2xl border-3 sm:border-4 flex items-center justify-center select-none transition-all duration-200 shadow-lg ${
                      slot.isPreFilled
                        ? 'bg-red-600 border-white text-yellow-300'
                        : isFilled
                        ? 'bg-emerald-600 border-yellow-300 text-yellow-300 ring-2 sm:ring-4 ring-emerald-300/70'
                        : selectedOption
                        ? 'bg-black/40 border-dashed border-yellow-300 ring-2 ring-yellow-400/50 cursor-pointer animate-pulse'
                        : 'bg-black/35 border-dashed border-white/60'
                    }`}
                    style={{
                      boxShadow: isFilled || slot.isPreFilled
                        ? 'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 14px rgba(0,0,0,0.3)'
                        : 'inset 0 2px 6px rgba(0,0,0,0.5)',
                    }}
                  >
                    {isFilled ? (
                      <motion.span
                        initial={!slot.isPreFilled ? { scale: 0.2, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                        className="font-black text-2xl sm:text-4xl md:text-5xl pointer-events-none leading-none text-yellow-300"
                        style={{
                          textShadow: slot.isPreFilled
                            ? '2px 2px 0px #991b1b, -1px -1px 0px #991b1b'
                            : '2px 2px 0px #15803d, -1px -1px 0px #15803d',
                        }}
                      >
                        {filledValue}
                      </motion.span>
                    ) : (
                      <span className="text-white/40 font-bold text-xl sm:text-3xl pointer-events-none">
                        _
                      </span>
                    )}

                    {!slot.isPreFilled && isFilled && (
                      <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-5 sm:h-5 text-yellow-200 animate-spin pointer-events-none" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}

          <div className="mt-1 text-[10px] sm:text-xs font-bold text-white/90 bg-black/40 px-3 py-0.5 rounded-full">
            {selectedOption
              ? `चयनित अक्षर: '${selectedOption.letter}' - अब खाली बॉक्स पर टैप करें`
              : 'अक्षर को खाली बॉक्स में खींचें या टैप करें'}
          </div>
        </div>

        {/* RIGHT COLUMN OPTIONS */}
        <div className="relative z-30 flex flex-col gap-1.5 sm:gap-3 items-center justify-center overflow-visible shrink-0">
          {currentLevel.rightOptions.map((letter, idx) => {
            const optionId = `right-${idx}`;
            const isDestroyed = destroyedOptionIds.has(optionId);
            const isSelected = selectedOption?.id === optionId;

            if (isDestroyed) {
              return (
                <div key={optionId} className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 opacity-0 pointer-events-none" />
              );
            }

            return (
              <motion.div
                key={optionId}
                drag
                dragSnapToOrigin
                dragElastic={0.2}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onPointerDown={() => {
                  sounds.playSnap(soundEnabled);
                  setSelectedOption({ id: optionId, letter });
                }}
                onDragEnd={(_e, info) => {
                  handleDragEnd(optionId, letter, info.point.x, info.point.y);
                }}
                className={`relative w-11 h-11 sm:w-15 sm:h-15 md:w-19 md:h-19 rounded-xl sm:rounded-2xl border-3 sm:border-4 flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-shadow duration-150 z-30 touch-none shadow-xl ${
                  isSelected
                    ? 'bg-red-600 border-yellow-300 ring-4 ring-yellow-300/80 scale-105'
                    : 'bg-red-600 border-white hover:border-yellow-300'
                }`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 14px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  className="font-black text-2xl sm:text-4xl md:text-5xl text-yellow-300 pointer-events-none leading-none"
                  style={{
                    textShadow: '2px 2px 0px #991b1b, -1px -1px 0px #991b1b',
                  }}
                >
                  {letter}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* LEVEL VICTORY MODAL */}
      <AnimatePresence>
        {isLevelComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-blue-900 to-indigo-950 border-4 border-yellow-400 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center"
            >
              <Sparkles className="w-14 h-14 text-yellow-300 animate-spin mb-2" />
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 mb-1">
                बहुत बढ़िया! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mb-4 font-medium">
                आपने <strong className="text-yellow-300">लेवल {currentLevel.levelNumber}</strong> के सभी खाली स्थान सही भर लिए हैं!
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={handleResetLevel}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 border border-white/40 text-white font-bold text-xs sm:text-sm shadow active:scale-95"
                >
                  दोबारा खेलें
                </button>

                <button
                  onClick={handleNextLevel}
                  className="flex-1 py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black text-xs sm:text-sm shadow active:scale-95 border-2 border-white flex items-center justify-center gap-1"
                >
                  <Play className="w-4 h-4 fill-red-950" />
                  <span>अगला लेवल</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
