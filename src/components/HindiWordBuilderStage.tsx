import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  Home,
} from 'lucide-react';
import { LetterTile, SuffixGroup } from '../types';
import {
  HINDI_SUFFIX_GROUPS,
  HINDI_GRID_TILES,
  HINDI_WORD_DETAILS,
} from '../data/hindiWordBuilderData';
import { sounds } from '../utils/audio';

interface HindiWordBuilderStageProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onHome: () => void;
}

export const HindiWordBuilderStage: React.FC<HindiWordBuilderStageProps> = ({
  soundEnabled,
  onToggleSound,
  onHome,
}) => {
  const [activeSuffix, setActiveSuffix] = useState<string | null>(null);
  const [suffixExplicitlyPicked, setSuffixExplicitlyPicked] = useState<boolean>(false);
  const [currentPrefix, setCurrentPrefix] = useState<LetterTile | null>(null);
  const [destroyedTiles, setDestroyedTiles] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [isDestroying, setIsDestroying] = useState<boolean>(false);
  const [destroyingWord, setDestroyingWord] = useState<string | null>(null);
  const [destroyingParts, setDestroyingParts] = useState<[string, string] | null>(null);

  const destroyTimerRef = useRef<number | null>(null);
  const TOTAL_WORDS = 16;
  const isGameWon = destroyedTiles.size === TOTAL_WORDS;

  // Speak intro when entering the stage
  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      sounds.speakHindiWordBuilderIntro(soundEnabled);
    }, 250);
    return () => {
      window.clearTimeout(introTimer);
      if (destroyTimerRef.current) {
        window.clearTimeout(destroyTimerRef.current);
      }
    };
  }, []);

  // Victory confetti & audio
  useEffect(() => {
    if (!isGameWon) return;

    sounds.speakHindiWordBuilderVictory(soundEnabled);
    const duration = 3000;
    const end = Date.now() + duration;
    let rafId = 0;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) {
        rafId = requestAnimationFrame(frame);
      }
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isGameWon, soundEnabled]);

  // Evaluate formed Hindi word when prefix & suffix are both placed
  useEffect(() => {
    if (!currentPrefix || !activeSuffix || isDestroying) return;

    const group = HINDI_SUFFIX_GROUPS.find((g) => g.id === activeSuffix);
    if (!group) return;

    const formedWord = `${currentPrefix.letter}${activeSuffix}`;

    if (group.validWords.includes(formedWord)) {
      setIsDestroying(true);
      setDestroyingWord(formedWord);
      setDestroyingParts([currentPrefix.letter, activeSuffix]);

      const details = HINDI_WORD_DETAILS[formedWord];
      if (details) {
        sounds.speakHindiWordBuilderComplete(
          formedWord,
          details.audioKey,
          details.speech,
          soundEnabled
        );
      } else {
        sounds.playWordDestroy(soundEnabled);
      }

      const targetTileId = `${activeSuffix}-${currentPrefix.letter}`;

      if (destroyTimerRef.current) {
        window.clearTimeout(destroyTimerRef.current);
      }

      destroyTimerRef.current = window.setTimeout(() => {
        setDestroyedTiles((prev) => new Set(prev).add(targetTileId));
        setScore((prev) => prev + 100);
        setCurrentPrefix(null);
        setSuffixExplicitlyPicked(false);
        setIsDestroying(false);
        setDestroyingWord(null);
        setDestroyingParts(null);
      }, 2700);
    }
  }, [currentPrefix, activeSuffix, isDestroying, soundEnabled]);

  const handleSelectSuffix = (suffixId: string) => {
    if (isDestroying) return;
    if (activeSuffix === suffixId && suffixExplicitlyPicked) return;
    setActiveSuffix(suffixId);
    setSuffixExplicitlyPicked(true);
    setCurrentPrefix(null);
    sounds.playSnap(soundEnabled);
  };

  const handleSelectPrefixTile = (tile: LetterTile) => {
    if (isDestroying || destroyedTiles.has(tile.id)) return;

    // If user explicitly picked a suffix from the right column first, check if this letter forms a valid uncompleted word with it
    if (suffixExplicitlyPicked && activeSuffix) {
      const explicitGroup = HINDI_SUFFIX_GROUPS.find((g) => g.id === activeSuffix);
      const matchingTileId = `${activeSuffix}-${tile.letter}`;
      if (
        explicitGroup &&
        explicitGroup.prefixes.includes(tile.letter) &&
        !destroyedTiles.has(matchingTileId)
      ) {
        setCurrentPrefix({
          id: matchingTileId,
          letter: tile.letter,
          groupId: activeSuffix,
          isCompleted: false,
        });
        sounds.playSnap(soundEnabled);
        return;
      }
    }

    // Default behavior (mirrors English Word Builder): align suffix with the clicked tile's group
    if (activeSuffix !== tile.groupId) {
      setActiveSuffix(tile.groupId);
    }
    setSuffixExplicitlyPicked(false);
    setCurrentPrefix(tile);
    sounds.playSnap(soundEnabled);
  };

  const handleClearPrefix = () => {
    if (isDestroying || !currentPrefix) return;
    setCurrentPrefix(null);
    sounds.playPop(soundEnabled);
  };

  const handleClearSuffix = () => {
    if (isDestroying || !activeSuffix) return;
    setActiveSuffix(null);
    setSuffixExplicitlyPicked(false);
    setCurrentPrefix(null);
    sounds.playPop(soundEnabled);
  };

  const handleReset = () => {
    if (destroyTimerRef.current) {
      window.clearTimeout(destroyTimerRef.current);
    }
    setActiveSuffix(null);
    setSuffixExplicitlyPicked(false);
    setCurrentPrefix(null);
    setDestroyedTiles(new Set());
    setScore(0);
    setIsDestroying(false);
    setDestroyingWord(null);
    setDestroyingParts(null);
    sounds.playPop(soundEnabled);
  };

  const handlePrefixDragEnd = (tile: LetterTile, dropX: number, dropY: number) => {
    const dropBox = document.getElementById('hindi-dropbox-main-frame');
    if (dropBox) {
      const rect = dropBox.getBoundingClientRect();
      if (
        dropX >= rect.left - 60 &&
        dropX <= rect.right + 60 &&
        dropY >= rect.top - 60 &&
        dropY <= rect.bottom + 60
      ) {
        handleSelectPrefixTile(tile);
      }
    }
  };

  const handleSuffixDragEnd = (suffixId: string, dropX: number, dropY: number) => {
    const dropBox = document.getElementById('hindi-dropbox-main-frame');
    if (dropBox) {
      const rect = dropBox.getBoundingClientRect();
      if (
        dropX >= rect.left - 60 &&
        dropX <= rect.right + 60 &&
        dropY >= rect.top - 60 &&
        dropY <= rect.bottom + 60
      ) {
        handleSelectSuffix(suffixId);
      }
    }
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'SUFFIX') {
        handleSelectSuffix(parsed.id);
      } else if (parsed.type === 'PREFIX') {
        handleSelectPrefixTile(parsed.tile);
      }
    } catch {
      // Ignore invalid drag payload
    }
  };

  const percentage = Math.round((destroyedTiles.size / TOTAL_WORDS) * 100);
  const wordDetails = destroyingWord ? HINDI_WORD_DETAILS[destroyingWord] : null;

  return (
    <div id="hindi-word-builder-wrapper" className="w-full h-full flex flex-col select-none overflow-hidden">
      {/* Header Bar - Mirrors English Word Builder HeaderBar */}
      <header
        id="hindi-wb-header-bar"
        className="w-full bg-black/60 border-b border-white/20 px-3 py-1.5 sm:px-5 sm:py-2 flex items-center justify-between text-white select-none z-20 shrink-0"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600 border border-white flex items-center justify-center font-black text-yellow-300 text-sm sm:text-base">
            श
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-yellow-300 leading-tight whitespace-nowrap">
              शब्द जोड़ (Word Builder)
            </h1>
            <p className="text-[10px] text-white/80 font-normal leading-none mt-0.5 hidden sm:block">
              {activeSuffix ? `लक्ष्य अक्षर: ${activeSuffix}` : 'अक्षर खींचकर या दबाकर शब्द बनाएं'}
            </p>
          </div>
        </div>

        {/* Score & Progress */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full border border-white/20 text-xs">
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-[10px] text-white/70 font-semibold">Score:</span>
            <span className="font-bold text-yellow-300 tabular-nums">{score}</span>
          </div>

          <div className="hidden md:flex flex-col w-24 sm:w-32 gap-0.5">
            <div className="flex justify-between items-center text-[10px] font-semibold text-white/90">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" /> प्रगति
              </span>
              <span className="text-yellow-300 tabular-nums">
                {destroyedTiles.size}/{TOTAL_WORDS}
              </span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden border border-white/20">
              <div
                className="bg-yellow-300 h-full transition-all duration-300 ease-out rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full border border-white/20 text-xs">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span className="font-bold text-yellow-300 tabular-nums">
              {destroyedTiles.size}/{TOTAL_WORDS}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sounds.playPop(soundEnabled);
              onHome();
            }}
            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 text-white active:scale-95 cursor-pointer"
            title="Home"
          >
            <Home className="w-4 h-4 text-yellow-300" />
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 text-white active:scale-95 cursor-pointer"
            title="Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-yellow-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/50" />
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 border border-white text-yellow-300 text-xs font-bold active:scale-95 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Main Landscape Game Stage matching Screenshot Z68_b7aff98b.PNG */}
      <main
        id="hindi-wb-landscape-stage"
        className="flex-1 flex flex-row items-center justify-between w-full h-[calc(100vh-56px)] overflow-hidden px-3 sm:px-8 gap-2 sm:gap-4"
      >
        {/* LEFT COLUMN: 4x4 Matrix of Hindi Akshar Tiles */}
        <div
          id="hindi-left-prefix-container"
          className="relative z-30 flex flex-col justify-center items-center select-none overflow-visible touch-none"
        >
          <div
            id="hindi-prefix-grid-4x4"
            className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-3.5 lg:gap-4 overflow-visible"
          >
            {HINDI_GRID_TILES.map((row, rowIndex) =>
              row.map((item, colIndex) => {
                const tileId = `${item.groupId}-${item.letter}`;
                const isDestroyed = destroyedTiles.has(tileId);

                const tile: LetterTile = {
                  id: tileId,
                  letter: item.letter,
                  groupId: item.groupId,
                  isCompleted: isDestroyed,
                };

                if (isDestroyed) {
                  return (
                    <div
                      key={`hindi-destroyed-${rowIndex}-${colIndex}`}
                      className="w-13 h-11 sm:w-16 sm:h-14 md:w-20 md:h-16 lg:w-24 lg:h-19 rounded-xl sm:rounded-2xl bg-black/30 border-2 border-white/40 backdrop-blur-xs flex items-center justify-center opacity-30 pointer-events-none"
                    />
                  );
                }

                return (
                  <motion.button
                    type="button"
                    key={`hindi-tile-${tileId}-${rowIndex}-${colIndex}`}
                    drag
                    dragSnapToOrigin
                    dragElastic={0}
                    dragMomentum={false}
                    whileDrag={{ scale: 1.2, zIndex: 9999 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onDragStart={() => sounds.playPop(soundEnabled)}
                    onDragEnd={(_e, info) => handlePrefixDragEnd(tile, info.point.x, info.point.y)}
                    onClick={() => handleSelectPrefixTile(tile)}
                    className="w-13 h-11 sm:w-16 sm:h-14 md:w-20 md:h-16 lg:w-24 lg:h-19 rounded-xl sm:rounded-2xl bg-red-600 border-2 sm:border-4 border-white flex items-center justify-center text-yellow-300 font-black text-2xl sm:text-3xl md:text-4xl shadow-xl cursor-grab active:cursor-grabbing hover:bg-red-500 select-none touch-none"
                    style={{
                      boxShadow:
                        'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 14px rgba(0,0,0,0.3)',
                      touchAction: 'none',
                    }}
                  >
                    {item.letter}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* CENTER-UPPER AREA: Yellow Drop Box with Blue Border & 2 Red White-Bordered Slots */}
        <div
          id="hindi-center-dropbox-stage"
          className="flex-1 flex flex-col items-center justify-start self-start mt-4 sm:mt-8 md:mt-10 select-none z-10"
        >
          <div
            id="hindi-dropbox-main-frame"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={handleDropZoneDrop}
            className={`border-4 sm:border-6 md:border-8 border-blue-600 bg-yellow-300 p-2 sm:p-3.5 pr-4 sm:pr-7 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center gap-2 sm:gap-3.5 transition-all ${
              isDestroying ? 'animate-pulse ring-4 ring-yellow-400' : ''
            }`}
            style={{
              boxShadow:
                '0 12px 28px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.7)',
            }}
          >
            {/* Left Slot: First Akshar */}
            <button
              type="button"
              id="hindi-slot-prefix"
              onClick={handleClearPrefix}
              title={currentPrefix ? 'हटाने के लिए दबाएं' : undefined}
              className={`w-14 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 lg:w-28 lg:h-22 rounded-xl sm:rounded-2xl bg-red-600 border-2 sm:border-4 border-white flex items-center justify-center text-yellow-300 font-black text-2xl sm:text-4xl md:text-5xl shadow-lg transition-all ${
                currentPrefix ? 'cursor-pointer hover:bg-red-500' : 'cursor-default'
              }`}
              style={{
                boxShadow:
                  'inset 0 3px 6px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.3)',
              }}
            >
              {currentPrefix ? currentPrefix.letter : ''}
            </button>

            {/* Right Slot: Second Akshar (Suffix) */}
            <button
              type="button"
              id="hindi-slot-suffix"
              onClick={handleClearSuffix}
              title={activeSuffix ? 'हटाने के लिए दबाएं' : undefined}
              className={`w-14 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 lg:w-28 lg:h-22 rounded-xl sm:rounded-2xl bg-red-600 border-2 sm:border-4 border-white flex items-center justify-center text-yellow-300 font-black text-2xl sm:text-4xl md:text-5xl shadow-lg transition-all ${
                activeSuffix ? 'cursor-pointer hover:bg-red-500' : 'cursor-default'
              }`}
              style={{
                boxShadow:
                  'inset 0 3px 6px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.3)',
              }}
            >
              {activeSuffix ? activeSuffix : ''}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Suffix Tiles (ल | ग | न | ट) */}
        <div
          id="hindi-right-suffix-container"
          className="relative z-30 flex flex-col justify-center items-center select-none overflow-visible touch-none"
        >
          <div
            id="hindi-suffix-column-list"
            className="flex flex-col gap-2.5 sm:gap-3.5 md:gap-4 overflow-visible"
          >
            {HINDI_SUFFIX_GROUPS.map((group: SuffixGroup) => {
              const isActive = activeSuffix === group.id;
              const groupTileIds = group.prefixes.map((p) => `${group.id}-${p}`);
              const completedCount = groupTileIds.filter((id) =>
                destroyedTiles.has(id)
              ).length;
              const isGroupAllCompleted = completedCount === group.prefixes.length;

              return (
                <motion.button
                  type="button"
                  key={`hindi-suffix-${group.id}`}
                  id={`hindi-suffix-btn-${group.id}`}
                  drag={!isGroupAllCompleted}
                  dragSnapToOrigin
                  dragElastic={0}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.2, zIndex: 9999 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onDragStart={() => sounds.playPop(soundEnabled)}
                  onDragEnd={(_e, info) =>
                    handleSuffixDragEnd(group.id, info.point.x, info.point.y)
                  }
                  onClick={() => handleSelectSuffix(group.id)}
                  className={`w-16 h-11 sm:w-20 sm:h-14 md:w-24 md:h-17 lg:w-28 lg:h-19 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl shadow-xl cursor-grab active:cursor-grabbing select-none touch-none ${
                    isGroupAllCompleted
                      ? 'bg-red-950/60 text-yellow-300/40 border-white/50 opacity-50 pointer-events-none'
                      : isActive
                      ? 'bg-red-600 text-yellow-300 ring-4 ring-yellow-300 scale-105 shadow-yellow-400/50'
                      : 'bg-red-600 text-yellow-300 hover:bg-red-500'
                  }`}
                  style={{
                    boxShadow:
                      'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 14px rgba(0,0,0,0.3)',
                    touchAction: 'none',
                  }}
                >
                  {group.text}
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Word Formed Explosion Modal */}
      <AnimatePresence>
        {isDestroying && destroyingWord && (
          <motion.div
            id="hindi-word-destroy-overlay"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4 select-none pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-2 bg-red-600 border-4 sm:border-8 border-white px-6 py-4 sm:px-10 sm:py-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center max-w-md w-full relative">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-spin" />
                <span className="text-4xl sm:text-6xl font-black text-yellow-300 tracking-wide drop-shadow-lg">
                  {destroyingWord}
                </span>
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-spin" />
              </div>

              {destroyingParts && (
                <div className="bg-yellow-300 text-red-900 border-2 border-white px-4 py-1.5 rounded-full font-black text-lg sm:text-2xl shadow-md mt-1">
                  {destroyingParts[0]} + {destroyingParts[1]} = {destroyingWord}
                  {wordDetails?.meaning ? ` (${wordDetails.meaning})` : ''}
                </div>
              )}

              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5 text-yellow-200 text-xs sm:text-sm font-bold bg-black/40 px-3 py-1 rounded-full border border-white/20">
                  <Volume2 className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  <span>शिक्षिका आवाज</span>
                </div>
                {wordDetails && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.speakHindiWordBuilderComplete(
                        destroyingWord,
                        wordDetails.audioKey,
                        wordDetails.speech,
                        soundEnabled
                      );
                    }}
                    className="flex items-center gap-1 text-xs font-bold bg-yellow-400 text-red-950 px-2.5 py-1 rounded-full border border-white active:scale-95 cursor-pointer shadow"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>फिर से सुनें</span>
                  </button>
                )}
              </div>

              <div className="w-full bg-black/40 h-2.5 rounded-full mt-2 overflow-hidden border border-white/40">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 2.7, ease: 'linear' }}
                  className="bg-yellow-300 h-full rounded-full"
                />
              </div>
            </div>

            <p className="text-lg sm:text-2xl font-black text-yellow-300 tracking-wide mt-3 drop-shadow-md">
              💥 शाबाश! शब्द बन गया! +100 PTS
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Modal when all 16 Hindi words are formed */}
      {isGameWon && (
        <div
          id="hindi-wb-victory-backdrop"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none"
        >
          <motion.div
            id="hindi-wb-victory-card"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white border-4 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center text-slate-900 flex flex-col items-center gap-4 relative overflow-hidden"
          >
            <div className="w-20 h-20 rounded-3xl bg-yellow-400 border-4 border-white flex items-center justify-center shadow-xl ring-4 ring-yellow-400/40 animate-bounce">
              <Trophy className="w-12 h-12 text-red-600" />
            </div>

            <div className="flex items-center gap-1.5 text-red-700 font-black text-xs uppercase tracking-wider bg-yellow-100 px-4 py-1 rounded-full border-2 border-yellow-300">
              <Sparkles className="w-4 h-4 text-yellow-500" /> खेल पूरा हुआ! <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-red-600">
              सभी 16 शब्द बन गए!
            </h2>

            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              बहुत बढ़िया! आपने ल, ग, न और ट वाले सभी 16 हिंदी शब्द सफलतापूर्वक जोड़ लिए हैं!
            </p>

            <div className="w-full grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 shadow-xs">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase">कुल स्कोर</span>
                <span className="text-2xl font-black text-red-600 tabular-nums">{score}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase">बनाए गए शब्द</span>
                <span className="text-2xl font-black text-emerald-600 flex items-center gap-1 tabular-nums">
                  <Flame className="w-4 h-4 text-red-500" /> {destroyedTiles.size}
                </span>
              </div>
            </div>

            <div className="w-full flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 font-black text-sm sm:text-base text-yellow-300 border-3 border-white shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-5 h-5" />
                फिर से खेलें
              </button>
              <button
                onClick={onHome}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-black text-sm sm:text-base text-white border-3 border-white shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Home className="w-5 h-5 text-yellow-300" />
                मेनू
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
