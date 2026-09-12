import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, LogOut, Check, X, Play, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import { HindiGameMode } from '../types';

interface StartScreenProps {
  onOptionClick: () => void;
  onPlayHindi?: () => void;
  onPlayHindiMode?: (mode: HindiGameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onOptionClick,
  onPlayHindi,
  onPlayHindiMode,
  soundEnabled,
  onToggleSound,
}) => {
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [hasQuit, setHasQuit] = useState(false);

  const handleOption = () => {
    sounds.playSnap(soundEnabled);
    onOptionClick();
  };

  const handleDirectHindi = () => {
    sounds.playVictory(soundEnabled);
    if (onPlayHindi) {
      onPlayHindi();
    } else {
      onOptionClick();
    }
  };

  const handleDirectHindiMode = (mode: HindiGameMode) => {
    sounds.playSnap(soundEnabled);
    if (onPlayHindiMode) {
      onPlayHindiMode(mode);
    } else if (onPlayHindi) {
      onPlayHindi();
    } else {
      onOptionClick();
    }
  };

  const handleQuitPrompt = () => {
    sounds.playPop(soundEnabled);
    setShowQuitModal(true);
  };

  const handleConfirmQuit = () => {
    sounds.playPop(soundEnabled);
    setHasQuit(true);
    setShowQuitModal(false);

    // Attempt browser/app exit APIs
    try {
      if (typeof window !== 'undefined') {
        window.close();
      }
      if ((window as any)?.navigator?.app?.exitApp) {
        (window as any).navigator.app.exitApp();
      }
    } catch {
      // Browser sandboxing may prevent direct window.close
    }
  };

  return (
    <div
      id="start-screen-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-y-auto overflow-x-hidden min-h-0"
    >
      {/* Subtle Sound & Orientation header at top corners */}
      <div className="w-full flex items-center justify-between z-30 max-w-4xl px-2 pt-1 shrink-0">
        <div className="flex items-center gap-1.5 bg-black/60 border border-white/30 px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-yellow-300 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>बाल ज्ञान वाटिका (Kids Learning Game)</span>
        </div>

        <button
          id="start-sound-toggle-btn"
          onClick={onToggleSound}
          className="px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/40 text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all shadow-md cursor-pointer"
          title="Toggle Sound"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline">Sound ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Sound OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Action Group: Prominent Hindi Launcher + Classic Option & Quit */}
      {!hasQuit ? (
        <div
          id="start-menu-button-group"
          className="flex flex-col items-center justify-center gap-2 sm:gap-3 z-20 my-auto w-full max-w-md px-2"
        >
          {/* 🌟 DIRECT HINDI GAMES LAUNCH BUTTON */}
          <motion.button
            id="btn-direct-hindi-games"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDirectHindi}
            className="w-full group relative cursor-pointer outline-none focus:outline-none"
          >
            <div className="rounded-[22px] sm:rounded-[26px] p-[3px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-2xl">
              <div className="rounded-[19px] sm:rounded-[23px] border-[4px] sm:border-[5px] border-red-700 bg-gradient-to-b from-red-600 to-red-800 px-4 sm:px-6 py-2 sm:py-3 flex flex-col items-center justify-center text-center shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🇮🇳</span>
                  <span className="text-2xl sm:text-3xl font-black tracking-wide text-yellow-300 uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] font-sans">
                    हिंदी खेल (HINDI GAMES)
                  </span>
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-white/95 mt-0.5">
                  अ से ज्ञ वर्णमाला, खाली स्थान, गुब्बारा और जोड़ी खेल (4 खेल)
                </p>
              </div>
            </div>
          </motion.button>

          {/* Quick 4 Hindi Game Direct Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 w-full">
            <button
              onClick={() => handleDirectHindiMode('HINDI_CLICK_LETTER')}
              className="px-2 py-1 rounded-xl bg-purple-700 hover:bg-purple-600 active:scale-95 border-2 border-yellow-300 text-white font-bold text-[10px] sm:text-xs shadow flex items-center justify-center gap-1 cursor-pointer transition-transform"
            >
              <span>🎯</span>
              <span>अक्षर पहचान</span>
            </button>
            <button
              onClick={() => handleDirectHindiMode('HINDI_FILL_BLANK')}
              className="px-2 py-1 rounded-xl bg-blue-700 hover:bg-blue-600 active:scale-95 border-2 border-yellow-300 text-white font-bold text-[10px] sm:text-xs shadow flex items-center justify-center gap-1 cursor-pointer transition-transform"
            >
              <span>✏️</span>
              <span>खाली स्थान</span>
            </button>
            <button
              onClick={() => handleDirectHindiMode('HINDI_BALLOON_POP')}
              className="px-2 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 border-2 border-yellow-300 text-white font-bold text-[10px] sm:text-xs shadow flex items-center justify-center gap-1 cursor-pointer transition-transform"
            >
              <span>🎈</span>
              <span>गुब्बारा फोड़ो</span>
            </button>
            <button
              onClick={() => handleDirectHindiMode('HINDI_MATCH_WORD')}
              className="px-2 py-1 rounded-xl bg-amber-700 hover:bg-amber-600 active:scale-95 border-2 border-yellow-300 text-white font-bold text-[10px] sm:text-xs shadow flex items-center justify-center gap-1 cursor-pointer transition-transform"
            >
              <span>🧩</span>
              <span>जोड़ी मिलाओ</span>
            </button>
          </div>

          {/* SECONDARY ROW: CLASSIC OPTION & QUIT BUTTONS */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 w-full mt-1">
            {/* 1. OPTION BUTTON:
                Thick Blue & Cyan Border, Vibrant Yellow Background, Bold Red Letters
            */}
            <motion.button
              id="btn-main-option"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOption}
              className="group relative cursor-pointer outline-none focus:outline-none flex-1 max-w-[200px]"
            >
              {/* Outer Cyan Accent Ring */}
              <div className="rounded-[18px] sm:rounded-[22px] p-[2.5px] bg-cyan-400 shadow-xl">
                {/* Inner Blue Heavy Border with Yellow Center */}
                <div className="rounded-[15px] sm:rounded-[19px] border-[4px] sm:border-[5px] border-blue-700 bg-yellow-400 px-3 sm:px-5 py-1.5 sm:py-2 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-3xl font-black tracking-wider text-red-600 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] font-sans">
                    OPTION
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-blue-900 leading-none">
                    सभी विषय (Subjects)
                  </span>
                </div>
              </div>
            </motion.button>

            {/* 2. QUIT BUTTON:
                Thick White Rounded Border, Vibrant Red Background, Bold Yellow Letters
            */}
            <motion.button
              id="btn-main-quit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleQuitPrompt}
              className="group relative cursor-pointer outline-none focus:outline-none flex-1 max-w-[200px]"
            >
              {/* White Border Frame */}
              <div className="rounded-[18px] sm:rounded-[22px] border-[4px] sm:border-[5px] border-white bg-red-600 px-3 sm:px-5 py-1.5 sm:py-2 flex flex-col items-center justify-center shadow-xl">
                <span className="text-xl sm:text-3xl font-black tracking-wider text-yellow-300 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] font-sans">
                  QUIT
                </span>
                <span className="text-[9px] sm:text-[10px] font-black text-white/90 leading-none">
                  बाहर निकलें (Exit)
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      ) : (
        /* Quit State Exit Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-30 bg-black/90 backdrop-blur-md border-4 border-yellow-400 p-6 sm:p-8 rounded-3xl text-center max-w-md flex flex-col items-center shadow-2xl mx-4 my-auto"
        >
          <div className="w-16 h-16 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center mb-3">
            <LogOut className="w-9 h-9 text-red-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 mb-1">खेल बंद हो गया (Game Exited)</h2>
          <p className="text-sm sm:text-base text-white/95 font-medium mb-1">अलविदा बच्चों! खेल समाप्त हो चुका है।</p>
          <p className="text-xs text-white/75 mb-5">आप अब इस ब्राउज़र टैब को बंद कर सकते हैं। (You can safely close this window/tab now.)</p>
          <button
            onClick={() => setHasQuit(false)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-red-950 font-black text-sm border-2 border-white shadow-xl active:scale-95 transition-transform cursor-pointer flex items-center gap-2"
          >
            <span>🔄 फिर से खेलें (Restart Game)</span>
          </button>
        </motion.div>
      )}

      {/* Subtle footer */}
      <div className="z-20 text-center text-white/70 text-[10px] pb-1 shrink-0">
        <span>Android & iOS के लिए अनुकूलित • खेल-खेल में सीखें</span>
      </div>

      {/* Quit Confirmation Modal */}
      <AnimatePresence>
        {showQuitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-blue-900 to-indigo-950 border-4 border-yellow-400 rounded-3xl p-5 sm:p-6 max-w-md w-full text-center shadow-2xl"
            >
              <h3 className="text-xl sm:text-2xl font-black text-yellow-300 mb-2">
                खेल बंद करें? (Quit Game?)
              </h3>
              <p className="text-xs sm:text-sm text-white/90 mb-6 font-medium">
                क्या आप वाकई गेम से बाहर निकलना चाहते हैं?
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowQuitModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-2 border-white text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>नहीं, खेलें (Stay)</span>
                </button>

                <button
                  onClick={handleConfirmQuit}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 border-2 border-white text-yellow-200 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>हाँ, बाहर निकलें (Quit)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
