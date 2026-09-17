import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Sparkles, ArrowLeft, Trophy, MousePointerClick, Hash, GitCommit } from 'lucide-react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';
import { MathGameMode } from '../types';

interface MathHomeScreenProps {
  onStartGame: (mode: MathGameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBack?: () => void;
}

export const MathHomeScreen: React.FC<MathHomeScreenProps> = ({
  onStartGame,
  soundEnabled,
  onToggleSound,
  onBack,
}) => {
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleTestVoice = () => {
    setIsPlayingTest(true);
    sounds.speakMathGreeting(soundEnabled);
    setTimeout(() => setIsPlayingTest(false), 2600);
  };

  const handleSelectMode = (mode: MathGameMode) => {
    sounds.playSnap(soundEnabled);
    onStartGame(mode);
  };

  return (
    <div
      id="math-home-screen-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 text-white select-none overflow-y-auto overflow-x-hidden min-h-0"
    >
      {/* Top Bar with Sound Toggle & Subjects Back */}
      <div id="math-top-bar" className="w-full flex items-center justify-between z-20 max-w-6xl px-1 sm:px-2 shrink-0 mb-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onBack && (
            <button
              onClick={() => {
                sounds.playPop(soundEnabled);
                onBack();
              }}
              className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-yellow-300 flex items-center gap-1 text-xs sm:text-sm font-black active:scale-95 transition-all shadow-md cursor-pointer"
              title="Back to Subjects"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>विषय (Subjects)</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-black/60 px-2.5 sm:px-3 py-1 rounded-full border border-white/20">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
            <span className="text-[11px] sm:text-sm font-bold text-yellow-300">गणित: 4 खेल (1 से 50)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-blue-950/70 px-2.5 py-1 rounded-full border border-blue-400/50 text-blue-200 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>शिक्षिका आवाज Active</span>
          </div>
        </div>

        <button
          onClick={onToggleSound}
          className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white flex items-center gap-1 text-xs font-semibold active:scale-95 transition-transform cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
              <span>Sound: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              <span>Sound: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Home Screen Hero Content */}
      <div id="math-hero-content" className="my-auto flex flex-col items-center text-center z-20 max-w-6xl w-full px-1 sm:px-2 py-0.5">
        {/* Main Logo Blocks: 1, 2, 3, 50 */}
        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 border-2 border-white flex items-center justify-center font-black text-yellow-300 text-base sm:text-xl shadow-md">
            1
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 border-2 border-white flex items-center justify-center font-black text-white text-base sm:text-xl shadow-md">
            2
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500 border-2 border-white flex items-center justify-center font-black text-white text-base sm:text-xl shadow-md">
            3
          </div>
          <span className="text-yellow-300 text-base sm:text-xl font-black mx-0.5">...</span>
          <div className="w-10 h-8 sm:w-12 sm:h-10 rounded-xl bg-purple-600 border-2 border-white flex items-center justify-center font-black text-yellow-300 text-sm sm:text-lg shadow-md">
            50
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-yellow-300 drop-shadow-md tracking-wide">
          गणित खेल (Math 1–50)
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-blue-100 drop-shadow mt-0.5 max-w-xl">
          1 से 50 तक संख्याएं सीखें, खाली स्थान भरें, शब्द मिलाएं और गुब्बारे फोड़ें!
        </p>

        {/* 4 Game Modes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5 w-full max-w-5xl mt-2.5 sm:mt-4">
          {/* Card 1: अंक पहचान (1 - 50 Click Number Game) */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectMode('MATH_CLICK_NUMBER')}
            className="group relative cursor-pointer bg-gradient-to-br from-blue-700/90 to-indigo-900/90 backdrop-blur-md border-2 sm:border-3 border-blue-400/80 hover:border-yellow-300 rounded-2xl p-2.5 sm:p-3.5 text-left shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="bg-yellow-400 text-blue-950 text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                1–25 व 26–50
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500/40 border border-blue-300/50 flex items-center justify-center text-yellow-300">
                <MousePointerClick className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-black text-white group-hover:text-yellow-300 transition-colors">
                अंक पहचान
              </h2>
              <p className="text-[10px] sm:text-[11px] text-blue-200 mt-0.5 line-clamp-2">
                1 से 50 तक हर अंक को दबाकर बोलें और पहचानें।
              </p>
            </div>

            <div className="mt-2 pt-1.5 border-t border-blue-400/30 flex items-center justify-between text-xs font-bold text-yellow-300">
              <span>Play</span>
              <Play className="w-3 h-3 fill-yellow-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: खाली स्थान भरो (1 - 50 Fill in the Blank) */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectMode('MATH_FILL_BLANK')}
            className="group relative cursor-pointer bg-gradient-to-br from-emerald-700/90 to-teal-950/90 backdrop-blur-md border-2 sm:border-3 border-emerald-400/80 hover:border-yellow-300 rounded-2xl p-2.5 sm:p-3.5 text-left shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="bg-yellow-400 text-emerald-950 text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                5 स्तर (Levels)
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/40 border border-emerald-300/50 flex items-center justify-center text-yellow-300">
                <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-black text-white group-hover:text-yellow-300 transition-colors">
                खाली स्थान भरो
              </h2>
              <p className="text-[10px] sm:text-[11px] text-emerald-200 mt-0.5 line-clamp-2">
                क्रम से 1 से 50 तक छूटी हुई संख्याएं भरें!
              </p>
            </div>

            <div className="mt-2 pt-1.5 border-t border-emerald-400/30 flex items-center justify-between text-xs font-bold text-yellow-300">
              <span>Play</span>
              <Play className="w-3 h-3 fill-yellow-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 3: शब्द और अंक मिलाओ (Match The Word: 1 - 20) */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectMode('MATH_MATCH_WORD')}
            className="group relative cursor-pointer bg-gradient-to-br from-purple-700/90 to-indigo-950/90 backdrop-blur-md border-2 sm:border-3 border-purple-400/80 hover:border-yellow-300 rounded-2xl p-2.5 sm:p-3.5 text-left shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="bg-yellow-400 text-purple-950 text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                1 से 20 (Words)
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-500/40 border border-purple-300/50 flex items-center justify-center text-yellow-300">
                <GitCommit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-black text-white group-hover:text-yellow-300 transition-colors">
                Match The Word
              </h2>
              <p className="text-[10px] sm:text-[11px] text-purple-200 mt-0.5 line-clamp-2">
                ऊपर 5 शब्द (ONE, TWO...) और नीचे सही अंक मिलाएं।
              </p>
            </div>

            <div className="mt-2 pt-1.5 border-t border-purple-400/30 flex items-center justify-between text-xs font-bold text-yellow-300">
              <span>Play</span>
              <Play className="w-3 h-3 fill-yellow-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 4: गुब्बारा फोड़ो (1 - 50 Balloon Pop) */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectMode('MATH_BALLOON_POP')}
            className="group relative cursor-pointer bg-gradient-to-br from-amber-600/90 to-red-900/90 backdrop-blur-md border-2 sm:border-3 border-amber-400/80 hover:border-yellow-300 rounded-2xl p-2.5 sm:p-3.5 text-left shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="bg-yellow-400 text-red-950 text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                3D Real गुब्बारे
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/40 border border-amber-300/50 flex items-center justify-center text-yellow-300">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-black text-white group-hover:text-yellow-300 transition-colors">
                गुब्बारा फोड़ो
              </h2>
              <p className="text-[10px] sm:text-[11px] text-amber-200 mt-0.5 line-clamp-2">
                शिक्षिका की आवाज सुनकर सही गुब्बारा फोड़ें!
              </p>
            </div>

            <div className="mt-2 pt-1.5 border-t border-amber-400/30 flex items-center justify-between text-xs font-bold text-yellow-300">
              <span>Play</span>
              <Play className="w-3 h-3 fill-yellow-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>

        {/* Teacher Voice Test Trigger */}
        <div className="mt-2.5 sm:mt-3.5 flex items-center gap-2">
          <button
            onClick={handleTestVoice}
            disabled={isPlayingTest}
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isPlayingTest
                ? 'bg-yellow-400 text-blue-950 scale-105 ring-2 ring-yellow-200'
                : 'bg-black/60 hover:bg-black/80 border border-white/30 text-white active:scale-95'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlayingTest ? 'text-blue-950 animate-bounce' : 'text-yellow-300'}`} />
            <span>{isPlayingTest ? 'शिक्षिका बोल रही हैं...' : 'शिक्षिका आवाज सुनें (Test Voice)'}</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div id="math-footer-bar" className="w-full text-center text-[10px] sm:text-xs text-blue-200/80 z-20 py-0.5 shrink-0">
        गणित शिक्षा: 1 से 50 तक संख्याएं व 1 से 20 तक शब्द पहचान
      </div>
    </div>
  );
};
