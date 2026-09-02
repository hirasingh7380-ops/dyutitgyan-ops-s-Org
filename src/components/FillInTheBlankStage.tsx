import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { FillBlankLevel } from '../types';
import { FILL_BLANK_LEVELS } from '../data/fillBlankData';
import { sounds } from '../utils/audio';

interface FillInTheBlankStageProps {
  soundEnabled: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

interface SelectedOption {
  id: string;
  letter: string;
}

export const FillInTheBlankStage: React.FC<FillInTheBlankStageProps> = ({
  soundEnabled,
  onHome,
}) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel: FillBlankLevel = FILL_BLANK_LEVELS[currentLevelIndex];

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

  // Reset or change level helper
  const loadLevel = (levelIdx: number) => {
    const lvl = FILL_BLANK_LEVELS[levelIdx];
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

  // Process filling a slot with an option
  const processSlotFill = (
    optionId: string | null,
    letter: string,
    slotId: string,
    targetLetter: string,
    rowSlots: typeof currentLevel.rows[0]['slots'],
    slotIdx: number
  ) => {
    if (filledSlots[slotId]) return; // Slot already filled

    // Check if correct
    if (letter.toUpperCase() === targetLetter.toUpperCase()) {
      // Correct answer!
      const prevSlot = slotIdx > 0 ? rowSlots[slotIdx - 1] : null;
      const prevLetter = prevSlot ? (filledSlots[prevSlot.id] || prevSlot.targetLetter) : undefined;

      setFilledSlots((prev) => ({
        ...prev,
        [slotId]: letter,
      }));

      // Destroy the option card if an optionId was provided
      if (optionId) {
        setDestroyedOptionIds((prev) => new Set(prev).add(optionId));
      }

      setSelectedOption(null);

      // Play victory sound & Hindi speech
      sounds.speakHindiLetterDrop(letter, prevLetter, soundEnabled);

      if (currentFilledCount + 1 === totalBlankSlots) {
        setTimeout(() => {
          sounds.playVictory(soundEnabled);
        }, 900);
      }
    } else {
      // Wrong answer!
      sounds.speakHindiWrongAnswer(soundEnabled);
      setWrongSlotId(slotId);
      setTimeout(() => setWrongSlotId(null), 600);
    }
  };

  // Handle tap on slot when an option is selected
  const handleSlotClick = (slotId: string, targetLetter: string, rowSlots: typeof currentLevel.rows[0]['slots'], slotIdx: number) => {
    if (!selectedOption) return;
    processSlotFill(selectedOption.id, selectedOption.letter, slotId, targetLetter, rowSlots, slotIdx);
  };

  // Handle Touch / Framer Motion Drag End for an Option Tile
  const handleDragEnd = (optionId: string, letter: string, dropX: number, dropY: number) => {
    // Check all slots in current level
    for (const row of currentLevel.rows) {
      for (let slotIdx = 0; slotIdx < row.slots.length; slotIdx++) {
        const slot = row.slots[slotIdx];
        if (slot.isPreFilled || filledSlots[slot.id]) continue;

        const el = slotRefs.current[slot.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          // Check if drop point is within slot bounds with generous padding for mobile fingers
          if (
            dropX >= rect.left - 25 &&
            dropX <= rect.right + 25 &&
            dropY >= rect.top - 25 &&
            dropY <= rect.bottom + 25
          ) {
            processSlotFill(optionId, letter, slot.id, slot.targetLetter, row.slots, slotIdx);
            return;
          }
        }
      }
    }
  };

  const handleNextLevel = () => {
    sounds.playVictory(soundEnabled);
    const nextIdx = (currentLevelIndex + 1) % FILL_BLANK_LEVELS.length;
    setCurrentLevelIndex(nextIdx);
    loadLevel(nextIdx);
  };

  const handleResetLevel = () => {
    sounds.playPop(soundEnabled);
    loadLevel(currentLevelIndex);
  };

  return (
    <div
      id="fill-blank-game-stage"
      className="relative flex-1 flex flex-col justify-between w-full h-full max-h-full overflow-hidden select-none px-2 sm:px-4 py-1 sm:py-2 touch-none"
    >
      {/* Top Banner Title: "fill in the blank" */}
      <div id="fill-blank-title-container" className="flex flex-col items-center justify-center pt-0.5 sm:pt-1 z-10 shrink-0">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl sm:text-3xl md:text-4xl font-black text-red-600 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] stroke-white"
          style={{ textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, 2px -2px 0px #fff, -2px 2px 0px #fff' }}
        >
          fill in the blank
        </motion.h1>
      </div>

      {/* Main Playing Area: Left Options | 3 Center Rows | Right Options */}
      <div id="fill-blank-main-grid" className="flex-1 flex flex-row items-center justify-between w-full my-auto max-w-5xl mx-auto gap-1.5 sm:gap-3 md:gap-5 z-10 px-1 sm:px-3 overflow-visible">
        {/* LEFT COLUMN OPTIONS (Red cards with white border & yellow letters) */}
        <div id="left-options-column" className="relative z-30 flex flex-col gap-1.5 sm:gap-3 items-center justify-center overflow-visible shrink-0">
          {currentLevel.leftOptions.map((letter, idx) => {
            const optionId = `left-${idx}`;
            const isDestroyed = destroyedOptionIds.has(optionId);
            const isSelected = selectedOption?.id === optionId;

            if (isDestroyed) {
              return (
                <div key={optionId} className="w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-0 pointer-events-none" />
              );
            }

            return (
              <motion.div
                key={optionId}
                drag
                dragSnapToOrigin
                dragElastic={0}
                dragMomentum={false}
                whileDrag={{ scale: 1.2, zIndex: 9999 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onDragStart={() => sounds.playPop(soundEnabled)}
                onDragEnd={(_e, info) => handleDragEnd(optionId, letter, info.point.x, info.point.y)}
                onClick={() => {
                  sounds.playSnap(soundEnabled);
                  setSelectedOption(isSelected ? null : { id: optionId, letter });
                }}
                className={`w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl md:rounded-3xl bg-red-600 border-2 sm:border-3 md:border-4 ${
                  isSelected ? 'border-yellow-300 ring-4 ring-yellow-300 scale-105 shadow-yellow-400/50' : 'border-white'
                } flex items-center justify-center text-yellow-300 font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl shadow-xl cursor-grab active:cursor-grabbing select-none touch-none`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.3)',
                  touchAction: 'none',
                }}
              >
                {letter}
              </motion.div>
            );
          })}
        </div>

        {/* CENTER COLUMN: 3 Horizontal Sequence Rows */}
        <div id="center-rows-container" className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1.5 sm:gap-3 md:gap-4 px-1 sm:px-3 max-w-xl">
          {currentLevel.rows.map((row) => (
            <div
              key={row.id}
              className="bg-white border-2 sm:border-3 md:border-4 border-blue-600 rounded-xl sm:rounded-2xl md:rounded-3xl p-1 sm:p-2 shadow-xl flex items-center justify-between gap-1 sm:gap-2 w-full"
              style={{
                boxShadow: '0 8px 18px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.8)',
              }}
            >
              {row.slots.map((slot, slotIdx) => {
                const filledLetter = filledSlots[slot.id];
                const isWrong = wrongSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    ref={(el) => { slotRefs.current[slot.id] = el; }}
                    onClick={() => handleSlotClick(slot.id, slot.targetLetter, row.slots, slotIdx)}
                    className={`flex-1 h-11 sm:h-15 md:h-18 lg:h-22 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center relative cursor-pointer border-r-2 sm:border-r-3 border-blue-600 last:border-r-0 ${
                      isWrong ? 'animate-shake bg-red-200' : 'bg-white'
                    }`}
                  >
                    {filledLetter ? (
                      /* Red Tile with White Border & Yellow Text */
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-9 h-9 sm:w-13 sm:h-13 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-lg sm:rounded-xl md:rounded-2xl bg-red-600 border-2 sm:border-3 border-white flex items-center justify-center text-yellow-300 font-black text-xl sm:text-3xl md:text-4xl shadow-md"
                      >
                        {filledLetter}
                      </motion.div>
                    ) : (
                      /* Empty Blank Drop Area */
                      <div className="w-full h-full border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center hover:bg-blue-50/70 transition-colors">
                        <span className="text-blue-400 font-black text-sm sm:text-xl">?</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN OPTIONS (Red cards with white border & yellow letters) */}
        <div id="right-options-column" className="relative z-30 flex flex-col gap-1.5 sm:gap-3 items-center justify-center overflow-visible shrink-0">
          {currentLevel.rightOptions.map((letter, idx) => {
            const optionId = `right-${idx}`;
            const isDestroyed = destroyedOptionIds.has(optionId);
            const isSelected = selectedOption?.id === optionId;

            if (isDestroyed) {
              return (
                <div key={optionId} className="w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-0 pointer-events-none" />
              );
            }

            return (
              <motion.div
                key={optionId}
                drag
                dragSnapToOrigin
                dragElastic={0}
                dragMomentum={false}
                whileDrag={{ scale: 1.2, zIndex: 9999 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onDragStart={() => sounds.playPop(soundEnabled)}
                onDragEnd={(_e, info) => handleDragEnd(optionId, letter, info.point.x, info.point.y)}
                onClick={() => {
                  sounds.playSnap(soundEnabled);
                  setSelectedOption(isSelected ? null : { id: optionId, letter });
                }}
                className={`w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl md:rounded-3xl bg-red-600 border-2 sm:border-3 md:border-4 ${
                  isSelected ? 'border-yellow-300 ring-4 ring-yellow-300 scale-105 shadow-yellow-400/50' : 'border-white'
                } flex items-center justify-center text-yellow-300 font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl shadow-xl cursor-grab active:cursor-grabbing select-none touch-none`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.3)',
                  touchAction: 'none',
                }}
              >
                {letter}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Level Victory Overlay */}
      <AnimatePresence>
        {isLevelComplete && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs p-4"
          >
            <div className="bg-red-600 border-4 sm:border-8 border-white p-5 sm:p-8 rounded-3xl text-center flex flex-col items-center gap-2 sm:gap-3 shadow-2xl max-w-md">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 animate-spin" />
              <h2 className="text-2xl sm:text-4xl font-black text-yellow-300 tracking-wider">
                EXCELLENT! (बहुत बढ़िया!)
              </h2>
              <p className="text-white text-sm sm:text-lg font-bold">
                सारे blanks सही भर दिए!
              </p>
              <button
                onClick={handleNextLevel}
                className="mt-2 px-6 sm:px-8 py-2 sm:py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-red-900 border-3 sm:border-4 border-white text-lg sm:text-2xl font-black shadow-lg cursor-pointer animate-bounce"
              >
                NEXT LEVEL ➔
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar: Home Button (Left) | Reset & Next Button (Right) */}
      <div id="fill-blank-bottom-bar" className="w-full flex items-center justify-between z-10 px-1 sm:px-4 pb-1 sm:pb-2 shrink-0">
        {/* Left: Home Button (Blue pill with yellow text) */}
        <motion.button
          id="btn-fill-home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="bg-sky-400 border-2 sm:border-3 border-white text-yellow-300 font-black text-sm sm:text-2xl px-4 sm:px-8 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-1.5 cursor-pointer"
        >
          Home
        </motion.button>

        {/* Right Action Buttons: Reset & Next */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={handleResetLevel}
            className="bg-red-700 border-2 border-white text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 shadow-md hover:bg-red-600 cursor-pointer"
            title="Reset Level"
          >
            <RotateCcw className="w-3.5 h-3.5 text-yellow-300" />
            <span>Reset</span>
          </button>

          {/* Right: Next Button (Blue pill with yellow text) */}
          <motion.button
            id="btn-fill-next"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextLevel}
            className={`border-2 sm:border-3 border-white font-black text-sm sm:text-2xl px-5 sm:px-8 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-1 cursor-pointer ${
              isLevelComplete
                ? 'bg-yellow-400 text-red-900 animate-pulse border-white'
                : 'bg-sky-400 text-yellow-300'
            }`}
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
};

