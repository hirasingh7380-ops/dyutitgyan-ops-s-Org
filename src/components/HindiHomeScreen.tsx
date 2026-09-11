import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Sparkles, ArrowLeft, Trophy, MousePointerClick } from 'lucide-react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';
import { HindiGameMode } from '../types';

interface HindiHomeScreenProps {
  onStartGame: (mode: HindiGameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBack?: () => void;
}

export const HindiHomeScreen: React.FC<HindiHomeScreenProps> = ({
  onStartGame,
  soundEnabled,
  onToggleSound,
  onBack,
}) => {
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleTestVoice = () => {
    setIsPlayingTest(true);
    sounds.speakHindiGreeting(soundEnabled);
    setTimeout(() => setIsPlayingTest(false), 2400);
  };

  const handleSelectMode = (mode: HindiGameMode) => {
    sounds.playSnap(soundEnabled);
    onStartGame(mode);
  };

  return (
    <div
      id="hindi-home-screen-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 text-white select-none overflow-y-auto overflow-x-hidden min-h-0"
    >
      {/* Top Bar with Sound Toggle & Subjects Back */}
      <div id="hindi-top-bar" className="w-full flex items-center justify-between z-20 max-w-5xl px-1 sm:px-2 shrink-0 mb-1">
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
            <span className="text-[11px] sm:text-sm font-bold text-yellow-300">हिंदी: 4 खेल (अ से ज्ञ)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-400/50 text-emerald-200 text-xs font-medium">
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
      <div id="hindi-hero-content" className="my-auto flex flex-col items-center text-center z-20 max-w-5xl w-full px-1 sm:px-2 py-1">
        {/* Main Logo Blocks in Hindi: हिं दी व र्ण */}
        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-red-600 border-2 border-white flex items-center justify-center font-black text-yellow-300 text-base sm:text-2xl shadow-md">
            अ
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500 border-2 border-white flex items-center justify-center font-black text-white text-base sm:text-2xl shadow-md">
            आ
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-600 border-2 border-white flex items-center justify-center font-black text-yellow-300 text-base sm:text-2xl shadow-md">
            क
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-600 border-2 border-white flex items-center justify-center font-black text-white text-base sm:text-2xl shadow-md">
            ज्ञ
          </div>
        </div>

        <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-yellow-300 tracking-normal drop-shadow-md">
          हिंदी वर्णमाला खेल (अ से ज्ञ)
        </h1>

        <p className="text-[10px] sm:text-xs font-semibold text-white/90 bg-black/60 border border-white/20 px-2.5 py-0.5 rounded-full mt-0.5 sm:mt-1">
          स्वर व व्यंजन सीखें - शुद्ध हिंदी आवाज़ के साथ!
        </p>

        {/* 4 Hindi Game Cards: Clickable, Fill in Blank, Balloon Pop, Match Word */}
        <div className="grid grid-cols-2 landscape:grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-5xl mt-2 sm:mt-3">
          {/* 1. Click The Letter (अक्षर पहचान) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('HINDI_CLICK_LETTER')}
            className="bg-gradient-to-b from-purple-600 to-indigo-700 active:from-purple-700 active:to-indigo-800 border-2 sm:border-3 border-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-xl cursor-pointer h-26 sm:h-36 md:h-40 landscape:h-25 landscape:sm:h-36 group"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[10px] sm:text-xs">
              <MousePointerClick className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300" />
              <span>अक्षर पहचान</span>
            </div>

            <div className="flex items-center gap-1 text-xs sm:text-base font-black text-white">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-yellow-200">अ</span>
              <span className="text-white/60">→</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-yellow-200">ज्ञ</span>
            </div>

            <p className="text-[8px] sm:text-[10px] font-medium text-white/95 leading-tight line-clamp-1">
              अक्षर छूकर आवाज़ सुनें
            </p>

            <div className="w-full bg-yellow-400 group-hover:bg-yellow-300 text-purple-950 border border-white py-0.5 sm:py-1 rounded-lg font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow">
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-purple-950" />
              <span>खेलें (PLAY)</span>
            </div>
          </motion.button>

          {/* 2. Fill in the Blank (खाली स्थान भरो) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('HINDI_FILL_BLANK')}
            className="bg-gradient-to-b from-blue-600 to-cyan-700 active:from-blue-700 active:to-cyan-800 border-2 sm:border-3 border-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-xl cursor-pointer h-26 sm:h-36 md:h-40 landscape:h-25 landscape:sm:h-36 group"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[10px] sm:text-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300" />
              <span>खाली स्थान</span>
            </div>

            <div className="flex items-center gap-1 text-xs sm:text-base font-black text-white">
              <span className="bg-white/20 px-1 py-0.5 rounded text-yellow-200">अ</span>
              <span className="bg-yellow-400/80 px-1 py-0.5 rounded text-red-900 animate-pulse">_</span>
              <span className="bg-white/20 px-1 py-0.5 rounded text-yellow-200">इ</span>
            </div>

            <p className="text-[8px] sm:text-[10px] font-medium text-white/95 leading-tight line-clamp-1">
              सही अक्षर चुनकर भरो
            </p>

            <div className="w-full bg-yellow-400 group-hover:bg-yellow-300 text-blue-950 border border-white py-0.5 sm:py-1 rounded-lg font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow">
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-blue-950" />
              <span>खेलें (PLAY)</span>
            </div>
          </motion.button>

          {/* 3. Balloon Pop (गुब्बारा फोड़ो) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('HINDI_BALLOON_POP')}
            className="bg-gradient-to-b from-emerald-600 to-teal-700 active:from-emerald-700 active:to-teal-800 border-2 sm:border-3 border-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-xl cursor-pointer h-26 sm:h-36 md:h-40 landscape:h-25 landscape:sm:h-36 group"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[10px] sm:text-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300" />
              <span>गुब्बारा फोड़ो</span>
            </div>

            <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-white">
              <span className="bg-white/20 px-1 py-0.5 rounded text-yellow-200">🎈 क</span>
              <span className="text-white/60">→</span>
              <span className="bg-white/20 px-1 py-0.5 rounded text-yellow-200">🎈 ज्ञ</span>
            </div>

            <p className="text-[8px] sm:text-[10px] font-medium text-white/95 leading-tight line-clamp-1">
              सही गुब्बारा फोड़ो
            </p>

            <div className="w-full bg-yellow-400 group-hover:bg-yellow-300 text-emerald-950 border border-white py-0.5 sm:py-1 rounded-lg font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow">
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-emerald-950" />
              <span>खेलें (PLAY)</span>
            </div>
          </motion.button>

          {/* 4. Match The Word (सही जोड़ी मिलाओ) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode('HINDI_MATCH_WORD')}
            className="bg-gradient-to-b from-amber-600 to-orange-700 active:from-amber-700 active:to-orange-800 border-2 sm:border-3 border-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 text-center flex flex-col items-center justify-between gap-1 shadow-xl cursor-pointer h-26 sm:h-36 md:h-40 landscape:h-25 landscape:sm:h-36 group"
          >
            <div className="flex items-center gap-1 text-yellow-300 font-black text-[10px] sm:text-xs">
              <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300" />
              <span>जोड़ी मिलाओ</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-white">
              <span className="bg-white/20 px-1 py-0.5 rounded text-yellow-200">क</span>
              <span>➔</span>
              <span className="bg-white/20 px-1 py-0.5 rounded text-yellow-200 truncate">कबूतर</span>
            </div>

            <p className="text-[8px] sm:text-[10px] font-medium text-white/95 leading-tight line-clamp-1">
              अक्षर से चित्र मिलाओ
            </p>

            <div className="w-full bg-yellow-400 group-hover:bg-yellow-300 text-amber-950 border border-white py-0.5 sm:py-1 rounded-lg font-black text-[9px] sm:text-xs flex items-center justify-center gap-1 shadow">
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-950" />
              <span>खेलें (PLAY)</span>
            </div>
          </motion.button>
        </div>

        {/* Interactive Teacher Voice Test Button */}
        <button
          onClick={handleTestVoice}
          className={`mt-2 sm:mt-3 flex items-center gap-1.5 text-[11px] sm:text-sm px-3.5 py-1 sm:py-1.5 rounded-full border-2 shadow-lg transition-all cursor-pointer ${
            isPlayingTest
              ? 'bg-yellow-400 text-purple-950 border-white scale-105 font-black ring-4 ring-yellow-300/50'
              : 'bg-emerald-800 hover:bg-emerald-700 text-yellow-300 font-bold border-yellow-300 active:scale-95'
          }`}
          title="शिक्षिका की आवाज़ सुनें"
        >
          <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPlayingTest ? 'text-purple-950 animate-bounce' : 'text-yellow-300 animate-pulse'}`} />
          <span>
            {isPlayingTest
              ? '🔊 बोल रही हैं: "नमस्ते बच्चों! चलो मिलकर हिंदी सीखते हैं!"'
              : '🔊 हिंदी शिक्षिका आवाज (Tap to Test Voice)'}
          </span>
        </button>
      </div>

      {/* Footer info */}
      <div id="hindi-footer-info" className="z-20 text-[10px] sm:text-xs text-white/80 font-medium bg-black/50 px-3 py-0.5 rounded-full border border-white/20 shrink-0">
        Hindi Educational Learning Games
      </div>
    </div>
  );
};
