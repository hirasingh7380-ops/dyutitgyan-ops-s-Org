import React from 'react';
import { Play, Volume2, VolumeX, Sparkles, BookOpen, Mic, Trophy, Edit3 } from 'lucide-react';
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
      className="relative w-full h-screen flex flex-col items-center justify-between p-3 sm:p-6 text-white select-none overflow-y-auto"
    >
      {/* Top Bar with Sound Toggle */}
      <div id="home-top-bar" className="w-full flex items-center justify-between z-20 max-w-4xl">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <Trophy className="w-4 h-4 text-yellow-300" />
          <span className="text-xs sm:text-sm font-black text-yellow-300">5 Fun Game Categories</span>
        </div>

        <button
          onClick={onToggleSound}
          className="p-2 sm:p-2.5 rounded-2xl bg-black/50 hover:bg-black/70 border-2 border-white/30 text-white transition-all active:scale-95 shadow-lg flex items-center gap-2 text-xs font-bold"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
              <span>Sound ON (आवाज़ चालू)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span>Sound OFF (आवाज़ बंद)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Home Screen Hero Content */}
      <div id="home-hero-content" className="my-auto flex flex-col items-center text-center z-20 max-w-3xl px-2">
        {/* Animated Main Logo */}
        <motion.div
          initial={{ scale: 0.8, y: -15 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="flex items-center gap-1.5 sm:gap-2.5 mb-1"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-red-600 border-3 border-white flex items-center justify-center font-black text-yellow-300 text-2xl sm:text-4xl shadow-2xl -rotate-6">
            W
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-yellow-400 border-3 border-white flex items-center justify-center font-black text-red-600 text-2xl sm:text-4xl shadow-2xl rotate-3">
            O
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-red-600 border-3 border-white flex items-center justify-center font-black text-yellow-300 text-2xl sm:text-4xl shadow-2xl -rotate-3">
            R
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 border-3 border-white flex items-center justify-center font-black text-yellow-300 text-2xl sm:text-4xl shadow-2xl rotate-6">
            D
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black text-yellow-300 tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] uppercase"
        >
          WORD & ALPHABET GAME
        </motion.h1>

        <p className="text-xs sm:text-base font-extrabold text-white bg-black/50 border border-white/20 px-4 py-1 rounded-full mt-1.5 shadow-lg">
          वर्णमाला खेल (Learn Words & Sequences with Hindi Kid Sound!)
        </p>

        {/* Game Mode Selection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 w-full mt-3 sm:mt-5">
          {/* Mode 1: Word Builder */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectMode('WORD_BUILDER')}
            className="bg-red-600 hover:bg-red-500 border-3 sm:border-4 border-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-2xl cursor-pointer"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[11px] sm:text-sm">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>WORD BUILDER</span>
            </div>
            <p className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">
              C + AT = CAT <br />
              शब्द बनाओ!
            </p>
            <div className="w-full bg-yellow-300 text-red-900 border-2 border-white py-0.5 sm:py-1 rounded-xl font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow-md">
              <Play className="w-3 h-3 fill-red-900" />
              <span>PLAY</span>
            </div>
          </motion.button>

          {/* Mode 2: Fill in the Blank */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectMode('FILL_BLANK')}
            className="bg-sky-500 hover:bg-sky-400 border-3 sm:border-4 border-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-2xl cursor-pointer"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[11px] sm:text-sm">
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>FILL BLANK</span>
            </div>
            <p className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">
              A [ _ ] C [ _ ] E <br />
              वर्ण भरो!
            </p>
            <div className="w-full bg-yellow-300 text-sky-900 border-2 border-white py-0.5 sm:py-1 rounded-xl font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow-md">
              <Play className="w-3 h-3 fill-sky-900" />
              <span>PLAY</span>
            </div>
          </motion.button>

          {/* Mode 3: Balloon Pop */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectMode('BALLOON_POP')}
            className="bg-emerald-600 hover:bg-emerald-500 border-3 sm:border-4 border-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-2xl cursor-pointer"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[11px] sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              <span>BALLOON POP</span>
            </div>
            <p className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">
              A वाले गुब्बारे <br />
              फोड़ो!
            </p>
            <div className="w-full bg-yellow-300 text-emerald-900 border-2 border-white py-0.5 sm:py-1 rounded-xl font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow-md">
              <Play className="w-3 h-3 fill-emerald-900" />
              <span>PLAY</span>
            </div>
          </motion.button>

          {/* Mode 4: Click The Letter */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectMode('CLICK_LETTER')}
            className="bg-purple-600 hover:bg-purple-500 border-3 sm:border-4 border-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-2xl cursor-pointer"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[11px] sm:text-sm">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>CLICK LETTER</span>
            </div>
            <p className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">
              वर्णमाला पर <br />
              क्लिक करें!
            </p>
            <div className="w-full bg-yellow-300 text-purple-900 border-2 border-white py-0.5 sm:py-1 rounded-xl font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow-md">
              <Play className="w-3 h-3 fill-purple-900" />
              <span>PLAY</span>
            </div>
          </motion.button>

          {/* Mode 5: Match The Word */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectMode('MATCH_WORD')}
            className="bg-amber-600 hover:bg-amber-500 border-3 sm:border-4 border-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-2xl cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[11px] sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
              <span>MATCH WORD</span>
            </div>
            <p className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">
              A ➔ Apple <br />
              चित्र मिलाओ!
            </p>
            <div className="w-full bg-yellow-300 text-amber-950 border-2 border-white py-0.5 sm:py-1 rounded-xl font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow-md">
              <Play className="w-3 h-3 fill-amber-950" />
              <span>PLAY</span>
            </div>
          </motion.button>
        </div>

        {/* Sound feature note */}
        <div className="mt-4 flex items-center gap-2 text-yellow-300 font-bold text-xs sm:text-sm bg-black/50 px-3 py-1 rounded-full border border-white/20">
          <Mic className="w-4 h-4 animate-bounce text-yellow-300" />
          <span>बच्चों की मजेदार हिंदी आवाज में ऑडियो सपोर्ट शामिल है!</span>
        </div>
      </div>

      {/* Footer info */}
      <div id="home-footer-info" className="z-20 text-[10px] sm:text-xs text-white/80 font-bold bg-black/40 px-4 py-1 rounded-full border border-white/20">
        Landscape Educational Game for Kids
      </div>
    </div>
  );
};

