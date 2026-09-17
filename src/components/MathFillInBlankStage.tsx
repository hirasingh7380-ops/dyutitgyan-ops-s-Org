import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, RotateCcw, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MathFillInBlankStageProps {
  soundEnabled: boolean;
  onBack: () => void;
  onToggleSound: () => void;
}

interface MathSlot {
  id: string;
  targetNum: number;
  isPreFilled: boolean;
}

interface MathRow {
  id: string;
  slots: MathSlot[];
}

interface MathLevelData {
  levelNumber: number;
  rangeLabel: string;
  rows: MathRow[];
  leftOptions: number[];
  rightOptions: number[];
}

const MATH_FILL_LEVELS: MathLevelData[] = [
  {
    levelNumber: 1,
    rangeLabel: '1 to 10',
    rows: [
      {
        id: 'r1',
        slots: [
          { id: 's1', targetNum: 1, isPreFilled: true },
          { id: 's2', targetNum: 2, isPreFilled: true },
          { id: 's3', targetNum: 3, isPreFilled: false },
          { id: 's4', targetNum: 4, isPreFilled: true },
        ],
      },
      {
        id: 'r2',
        slots: [
          { id: 's5', targetNum: 5, isPreFilled: true },
          { id: 's6', targetNum: 6, isPreFilled: false },
          { id: 's7', targetNum: 7, isPreFilled: true },
        ],
      },
      {
        id: 'r3',
        slots: [
          { id: 's8', targetNum: 8, isPreFilled: true },
          { id: 's9', targetNum: 9, isPreFilled: false },
          { id: 's10', targetNum: 10, isPreFilled: true },
        ],
      },
    ],
    leftOptions: [3, 9],
    rightOptions: [6],
  },
  {
    levelNumber: 2,
    rangeLabel: '11 to 20',
    rows: [
      {
        id: 'r1',
        slots: [
          { id: 's11', targetNum: 11, isPreFilled: true },
          { id: 's12', targetNum: 12, isPreFilled: false },
          { id: 's13', targetNum: 13, isPreFilled: true },
          { id: 's14', targetNum: 14, isPreFilled: true },
        ],
      },
      {
        id: 'r2',
        slots: [
          { id: 's15', targetNum: 15, isPreFilled: false },
          { id: 's16', targetNum: 16, isPreFilled: true },
          { id: 's17', targetNum: 17, isPreFilled: true },
        ],
      },
      {
        id: 'r3',
        slots: [
          { id: 's18', targetNum: 18, isPreFilled: true },
          { id: 's19', targetNum: 19, isPreFilled: false },
          { id: 's20', targetNum: 20, isPreFilled: true },
        ],
      },
    ],
    leftOptions: [12, 19],
    rightOptions: [15],
  },
  {
    levelNumber: 3,
    rangeLabel: '21 to 30',
    rows: [
      {
        id: 'r1',
        slots: [
          { id: 's21', targetNum: 21, isPreFilled: true },
          { id: 's22', targetNum: 22, isPreFilled: true },
          { id: 's23', targetNum: 23, isPreFilled: false },
          { id: 's24', targetNum: 24, isPreFilled: true },
        ],
      },
      {
        id: 'r2',
        slots: [
          { id: 's25', targetNum: 25, isPreFilled: true },
          { id: 's26', targetNum: 26, isPreFilled: false },
          { id: 's27', targetNum: 27, isPreFilled: true },
        ],
      },
      {
        id: 'r3',
        slots: [
          { id: 's28', targetNum: 28, isPreFilled: true },
          { id: 's29', targetNum: 29, isPreFilled: false },
          { id: 's30', targetNum: 30, isPreFilled: true },
        ],
      },
    ],
    leftOptions: [23, 29],
    rightOptions: [26],
  },
  {
    levelNumber: 4,
    rangeLabel: '31 to 40',
    rows: [
      {
        id: 'r1',
        slots: [
          { id: 's31', targetNum: 31, isPreFilled: true },
          { id: 's32', targetNum: 32, isPreFilled: false },
          { id: 's33', targetNum: 33, isPreFilled: true },
          { id: 's34', targetNum: 34, isPreFilled: true },
        ],
      },
      {
        id: 'r2',
        slots: [
          { id: 's35', targetNum: 35, isPreFilled: false },
          { id: 's36', targetNum: 36, isPreFilled: true },
          { id: 's37', targetNum: 37, isPreFilled: true },
        ],
      },
      {
        id: 'r3',
        slots: [
          { id: 's38', targetNum: 38, isPreFilled: true },
          { id: 's39', targetNum: 39, isPreFilled: false },
          { id: 's40', targetNum: 40, isPreFilled: true },
        ],
      },
    ],
    leftOptions: [32, 39],
    rightOptions: [35],
  },
  {
    levelNumber: 5,
    rangeLabel: '41 to 50',
    rows: [
      {
        id: 'r1',
        slots: [
          { id: 's41', targetNum: 41, isPreFilled: true },
          { id: 's42', targetNum: 42, isPreFilled: true },
          { id: 's43', targetNum: 43, isPreFilled: false },
          { id: 's44', targetNum: 44, isPreFilled: true },
        ],
      },
      {
        id: 'r2',
        slots: [
          { id: 's45', targetNum: 45, isPreFilled: true },
          { id: 's46', targetNum: 46, isPreFilled: false },
          { id: 's47', targetNum: 47, isPreFilled: true },
        ],
      },
      {
        id: 'r3',
        slots: [
          { id: 's48', targetNum: 48, isPreFilled: true },
          { id: 's49', targetNum: 49, isPreFilled: false },
          { id: 's50', targetNum: 50, isPreFilled: true },
        ],
      },
    ],
    leftOptions: [43, 49],
    rightOptions: [46],
  },
];

interface SelectedOption {
  id: string;
  num: number;
}

export const MathFillInBlankStage: React.FC<MathFillInBlankStageProps> = ({
  soundEnabled,
  onBack,
  onToggleSound,
}) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel = MATH_FILL_LEVELS[currentLevelIndex];

  // Track filled states for slots: key is slotId, value is number
  const [filledSlots, setFilledSlots] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    currentLevel.rows.forEach((row) => {
      row.slots.forEach((slot) => {
        if (slot.isPreFilled) {
          initial[slot.id] = slot.targetNum;
        }
      });
    });
    return initial;
  });

  // Track destroyed/consumed option card IDs (e.g. "left-0", "right-0")
  const [destroyedOptionIds, setDestroyedOptionIds] = useState<Set<string>>(new Set());
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);
  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  // Refs to slots for touch drag drop hit-testing
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const loadLevel = (levelIdx: number) => {
    const lvl = MATH_FILL_LEVELS[levelIdx];
    const initial: Record<string, number> = {};
    lvl.rows.forEach((row) => {
      row.slots.forEach((slot) => {
        if (slot.isPreFilled) {
          initial[slot.id] = slot.targetNum;
        }
      });
    });
    setFilledSlots(initial);
    setDestroyedOptionIds(new Set());
    setSelectedOption(null);
    setWrongSlotId(null);
  };

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
    num: number,
    slotId: string,
    targetNum: number,
    rowSlots: MathSlot[],
    slotIdx: number
  ) => {
    if (filledSlots[slotId] !== undefined) return; // Slot already filled

    if (num === targetNum) {
      // Correct answer!
      const prevSlot = slotIdx > 0 ? rowSlots[slotIdx - 1] : null;
      const prevNum = prevSlot ? (filledSlots[prevSlot.id] ?? prevSlot.targetNum) : undefined;

      setFilledSlots((prev) => ({
        ...prev,
        [slotId]: num,
      }));

      if (optionId) {
        setDestroyedOptionIds((prev) => new Set(prev).add(optionId));
      }

      setSelectedOption(null);
      setScore((prev) => prev + 20);

      sounds.speakMathNumberDrop(num, prevNum, soundEnabled);

      if (currentFilledCount + 1 === totalBlankSlots) {
        setTimeout(() => {
          sounds.playVictory(soundEnabled);
        }, 800);
      }
    } else {
      // Wrong answer!
      sounds.speakMathWrongAnswer(soundEnabled);
      setWrongSlotId(slotId);
      setTimeout(() => setWrongSlotId(null), 600);
    }
  };

  const handleSlotClick = (slotId: string, targetNum: number, rowSlots: MathSlot[], slotIdx: number) => {
    if (!selectedOption) return;
    processSlotFill(selectedOption.id, selectedOption.num, slotId, targetNum, rowSlots, slotIdx);
  };

  const handleDragEnd = (optionId: string, num: number, dropX: number, dropY: number) => {
    for (const row of currentLevel.rows) {
      for (let slotIdx = 0; slotIdx < row.slots.length; slotIdx++) {
        const slot = row.slots[slotIdx];
        if (slot.isPreFilled || filledSlots[slot.id] !== undefined) continue;

        const el = slotRefs.current[slot.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            dropX >= rect.left - 25 &&
            dropX <= rect.right + 25 &&
            dropY >= rect.top - 25 &&
            dropY <= rect.bottom + 25
          ) {
            processSlotFill(optionId, num, slot.id, slot.targetNum, row.slots, slotIdx);
            return;
          }
        }
      }
    }
  };

  const handleNextLevel = () => {
    sounds.playVictory(soundEnabled);
    const nextIdx = (currentLevelIndex + 1) % MATH_FILL_LEVELS.length;
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
      className="relative flex-1 flex flex-col justify-between w-full h-full max-h-[100dvh] overflow-hidden select-none px-2 sm:px-6 pt-0.5 sm:pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] touch-none box-border"
    >
      {/* Top Bar matching English Stage */}
      <div className="relative z-30 w-full flex items-center justify-between px-1 sm:px-4 pt-0.5 shrink-0 max-w-5xl mx-auto">
        {/* Left: Home / Back */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="bg-sky-400 border-2 sm:border-3 border-red-600 text-yellow-300 font-black text-xs sm:text-base px-3 sm:px-5 py-1 rounded-xl sm:rounded-2xl shadow-xl cursor-pointer flex items-center gap-1"
          style={{
            textShadow: '1px 1px 0px #000, -1px -1px 0px #000',
            boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.6)',
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </motion.button>

        {/* Center Banner Title: "fill in the blank" (exact match to English) */}
        <div id="fill-blank-title-container" className="flex flex-col items-center justify-center">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-base sm:text-2xl md:text-3xl font-black text-red-600 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] stroke-white leading-tight"
            style={{ textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, 2px -2px 0px #fff, -2px 2px 0px #fff' }}
          >
            fill in the blank
          </motion.h1>
          <span className="text-[10px] sm:text-xs font-bold text-blue-900 bg-yellow-300 px-2.5 py-0.5 rounded-full shadow border border-blue-600">
            गणित: {currentLevel.rangeLabel}
          </span>
        </div>

        {/* Right: Sound & Reset */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={onToggleSound}
            className="bg-black/50 border-2 border-white/40 text-yellow-300 p-1 sm:p-1.5 rounded-xl cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleResetLevel}
            className="bg-black/50 border-2 border-white/40 text-white p-1 sm:p-1.5 rounded-xl cursor-pointer"
            title="Reset Level"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Main Playing Area: Left Options | 3 Center Rows | Right Options (Exact English Layout) */}
      <div
        id="fill-blank-main-grid"
        className="flex-1 flex flex-row items-center justify-between w-full my-auto max-w-5xl mx-auto gap-1.5 sm:gap-3 md:gap-5 z-10 px-1 sm:px-3 overflow-visible"
      >
        {/* LEFT COLUMN OPTIONS (Red cards with white border & yellow numbers) */}
        <div id="left-options-column" className="relative z-30 flex flex-col gap-1.5 sm:gap-3 items-center justify-center overflow-visible shrink-0">
          {currentLevel.leftOptions.map((num, idx) => {
            const optionId = `left-${idx}`;
            const isDestroyed = destroyedOptionIds.has(optionId);
            const isSelected = selectedOption?.id === optionId;

            if (isDestroyed) {
              return (
                <div key={optionId} className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 opacity-0 pointer-events-none" />
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
                onDragEnd={(_e, info) => handleDragEnd(optionId, num, info.point.x, info.point.y)}
                onClick={() => {
                  sounds.playSnap(soundEnabled);
                  setSelectedOption(isSelected ? null : { id: optionId, num });
                }}
                className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl bg-red-600 border-2 sm:border-3 md:border-4 ${
                  isSelected ? 'border-yellow-300 ring-4 ring-yellow-300 scale-105 shadow-yellow-400/50' : 'border-white'
                } flex items-center justify-center text-yellow-300 font-black text-xl sm:text-3xl md:text-4xl lg:text-5xl shadow-xl cursor-grab active:cursor-grabbing select-none touch-none`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.3)',
                  touchAction: 'none',
                }}
              >
                {num}
              </motion.div>
            );
          })}
        </div>

        {/* CENTER COLUMN: 3 Horizontal Sequence Rows inside Blue-Bordered White Bars */}
        <div id="center-rows-container" className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3.5 px-1 sm:px-3 max-w-xl">
          {currentLevel.rows.map((row) => (
            <div
              key={row.id}
              className="bg-white border-2 sm:border-3 md:border-4 border-blue-600 rounded-xl sm:rounded-2xl md:rounded-3xl p-1 sm:p-1.5 shadow-xl flex items-center justify-between gap-1 sm:gap-2 w-full"
              style={{
                boxShadow: '0 8px 18px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.8)',
              }}
            >
              {row.slots.map((slot, slotIdx) => {
                const filledNum = filledSlots[slot.id];
                const isWrong = wrongSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    ref={(el) => {
                      slotRefs.current[slot.id] = el;
                    }}
                    onClick={() => handleSlotClick(slot.id, slot.targetNum, row.slots, slotIdx)}
                    className={`flex-1 h-10 sm:h-13 md:h-15 lg:h-18 rounded-lg sm:rounded-xl flex items-center justify-center relative cursor-pointer border-r-2 sm:border-r-3 border-blue-600 last:border-r-0 ${
                      isWrong ? 'animate-shake bg-red-200' : 'bg-white'
                    }`}
                  >
                    {filledNum !== undefined ? (
                      /* Red Tile with White Border & Yellow Text */
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 lg:w-15 lg:h-15 rounded-lg sm:rounded-xl bg-red-600 border-2 sm:border-3 border-white flex items-center justify-center text-yellow-300 font-black text-lg sm:text-2xl md:text-3xl shadow-md"
                      >
                        {filledNum}
                      </motion.div>
                    ) : (
                      /* Empty Blank Slot (Target Box) */
                      <div
                        className={`w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 lg:w-15 lg:h-15 rounded-lg sm:rounded-xl border-2 sm:border-3 border-dashed ${
                          selectedOption
                            ? 'border-yellow-500 bg-yellow-100/70 animate-pulse'
                            : 'border-blue-400 bg-blue-50/50'
                        } flex items-center justify-center`}
                      >
                        <span className="text-blue-300 font-black text-sm sm:text-lg">?</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN OPTIONS (Red cards with white border & yellow numbers) */}
        <div id="right-options-column" className="relative z-30 flex flex-col gap-1.5 sm:gap-3 items-center justify-center overflow-visible shrink-0">
          {currentLevel.rightOptions.map((num, idx) => {
            const optionId = `right-${idx}`;
            const isDestroyed = destroyedOptionIds.has(optionId);
            const isSelected = selectedOption?.id === optionId;

            if (isDestroyed) {
              return (
                <div key={optionId} className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 opacity-0 pointer-events-none" />
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
                onDragEnd={(_e, info) => handleDragEnd(optionId, num, info.point.x, info.point.y)}
                onClick={() => {
                  sounds.playSnap(soundEnabled);
                  setSelectedOption(isSelected ? null : { id: optionId, num });
                }}
                className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl bg-red-600 border-2 sm:border-3 md:border-4 ${
                  isSelected ? 'border-yellow-300 ring-4 ring-yellow-300 scale-105 shadow-yellow-400/50' : 'border-white'
                } flex items-center justify-center text-yellow-300 font-black text-xl sm:text-3xl md:text-4xl lg:text-5xl shadow-xl cursor-grab active:cursor-grabbing select-none touch-none`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.3)',
                  touchAction: 'none',
                }}
              >
                {num}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FOOTER BAR: Level progress & Next Level Button */}
      <div className="relative z-30 w-full flex items-center justify-between px-3 sm:px-6 py-1 bg-black/40 backdrop-blur-xs shrink-0">
        {/* Level indicators */}
        <div className="flex items-center gap-1 sm:gap-2">
          {MATH_FILL_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.levelNumber}
              onClick={() => {
                sounds.playSnap(soundEnabled);
                setCurrentLevelIndex(idx);
                loadLevel(idx);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black cursor-pointer transition-all ${
                currentLevelIndex === idx
                  ? 'bg-yellow-400 text-blue-950 ring-2 ring-white shadow'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {lvl.rangeLabel}
            </button>
          ))}
        </div>

        {/* Score & Next Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-500/90 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-xs sm:text-sm shadow border border-yellow-200">
            <Trophy className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>{score}</span>
          </div>

          {isLevelComplete && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNextLevel}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-yellow-300 font-black text-xs sm:text-sm px-4 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1 cursor-pointer animate-bounce"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>अगला स्तर (Next)</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
