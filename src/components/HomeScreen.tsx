import React from 'react';
import { Play, Volume2, VolumeX, BookOpen, Mic, Trophy, Edit3, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';
import { GameMode } from '../types';

interface HomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  soundEnabled,
  onToggleSound,
}) => {
  const handleSelectMode = (mode: GameMode) => {
    sounds.playVictory(soundEnabled);
    if (mode === 'WORD_BUILDER') {
      sounds.speakHindiWordMeaning('CAT', soundEnabled);
    } else if (mode === 'FILL_BLANK') {
      sounds.speakHindiLetterDrop('B', 'A', soundEnabled);
    } else {
      sounds.speakHindiTargetLetter('A', soundEnabled);
    }
    onStartGame(mode);
  };

  return (
    <div
      id="home-screen-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 text-white select-none overflow-hidden"
    >
      {/* Top Bar with Sound Toggle */}
      <div id="home-top-bar" className="w-full flex items-center justify-between z-20 max-w-5xl px-2">
        <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/20">
          <Trophy className="w-4 h-4 text-yellow-300" />
          <span className="text-xs sm:text-sm font-bold text-yellow-300">5 Game Modes</span>
        </div>

        <button
          onClick={onToggleSound}
          className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white flex items-center gap-1.5 text-xs font-semibold active:scale-95 transition-transform"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-yellow-300" />
              <span>Sound: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span>Sound: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Home Screen Hero Content */}
      <div id="home-hero-content" className="my-auto flex flex-col items-center text-center z-20 max-w-4xl w-full px-2">
        {/* Main Logo Blocks */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center font-black text-yellow-300 text-xl sm:text-2xl shadow-md">
            W
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-amber-500 border-2 border-white flex items-center justify-center font-black text-white text-xl sm:text-2xl shadow-md">
            O
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center font-black text-yellow-300 text-xl sm:text-2xl shadow-md">
            R
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-blue-600 border-2 border-white flex items-center justify-center font-black text-white text-xl sm:text-2xl shadow-md">
            D
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-yellow-300 tracking-normal uppercase">
          WORD & ALPHABET GAME
        </h1>

        <p className="text-[11px] sm:text-xs font-semibold text-white/90 bg-black/60 border border-white/20 px-3 py-0.5 rounded-full mt-1">
          Kids Learning Game with Audio
        </p>

        {/* Game Mode Selection Cards */}
        <div className="grid grid-cols-5 gap-2 w-full mt-3 sm:mt-4">
          {/* Mode 1: Word Builder */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('WORD_BUILDER')}
            className="bg-red-600 active:bg-red-700 border-2 border-white rounded-2xl p-2 text-center flex flex-col items-center justify-between gap-1 shadow-md cursor-pointer h-28 sm:h-32"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-bold text-[11px] sm:text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>BUILDER</span>
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-white leading-tight">
              C + AT = CAT
            </p>
            <div className="w-full bg-yellow-300 text-red-900 border border-white py-1 rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1">
              <Play className="w-3 h-3 fill-red-900" />
              <span>PLAY</span>
            </div>
          </motion.button>

          {/* Mode 2: Fill in the Blank */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('FILL_BLANK')}
            className="bg-sky-500 active:bg-sky-600 border-2 border-white rounded-2xl p-2 text-center flex flex-col items-center justify-between gap-1 shadow-md cursor-pointer h-28 sm:h-32"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-bold text-[11px] sm:text-xs">
              <Edit3 className="w-3.5 h-3.5" />
              <span>BLANK</span>
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-white leading-tight">
              A _ C _ E
            </p>
            <div className="w-full bg-yellow-300 text-sky-900 border border-white py-1 rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1">
              <Play className="w-3 h-3 fill-sky-900" />
              <span>PLAY</span>
            </div>
          </motion.button>

          {/* Mode 3: Balloon Pop */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('BALLOON_POP')}
            className="bg-emerald-600 active:bg-emerald-700 border-2 border-white rounded-2xl p-2 text-center flex flex-col items-center justify-between gap-1 shadow-md cursor-pointer h-28 sm:h-32"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-bold text-[11px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BALLOON</span>
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-white leading-tight">
              Pop Letters
            </p>
            <div className="w-full bg-yellow-300 text-emerald-900 border border-white py-1 rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1">
              <Play className="w-3 h-3 fill-emerald-900" />
              <span>PLAY</span>
            </div>
          </motion.button>

          {/* Mode 4: Click The Letter */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('CLICK_LETTER')}
            className="bg-purple-600 active:bg-purple-700 border-2 border-white rounded-2xl p-2 text-center flex flex-col items-center justify-between gap-1 shadow-md cursor-pointer h-28 sm:h-32"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-bold text-[11px] sm:text-xs">
              <Trophy className="w-3.5 h-3.5" />
              <span>LETTERS</span>
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-white leading-tight">
              A - Z / वर्ण
            </p>
            <div className="w-full bg-yellow-300 text-purple-900 border border-white py-1 rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1">
              <Play className="w-3 h-3 fill-purple-900" />
              <span>PLAY</span>
            </div>
          </motion.button>

          {/* Mode 5: Match The Word */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('MATCH_WORD')}
            className="bg-amber-600 active:bg-amber-700 border-2 border-white rounded-2xl p-2 text-center flex flex-col items-center justify-between gap-1 shadow-md cursor-pointer h-28 sm:h-32"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-bold text-[11px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MATCH</span>
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-white leading-tight">
              A ➔ Apple
            </p>
            <div className="w-full bg-yellow-300 text-amber-950 border border-white py-1 rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1">
              <Play className="w-3 h-3 fill-amber-950" />
              <span>PLAY</span>
            </div>
          </motion.button>
        </div>

        {/* Hindi voice indicator */}
        <div className="mt-3 flex items-center gap-1.5 text-yellow-300 font-medium text-[11px] sm:text-xs bg-black/60 px-3 py-1 rounded-full border border-white/20">
          <Mic className="w-3.5 h-3.5 text-yellow-300" />
          <span>Hindi Audio Voice Included</span>
        </div>
      </div>

      {/* Footer info */}
      <div id="home-footer-info" className="z-20 text-[10px] sm:text-xs text-white/80 font-medium bg-black/50 px-3 py-0.5 rounded-full border border-white/20">
        Android Landscape Game
      </div>
    </div>
  );
};