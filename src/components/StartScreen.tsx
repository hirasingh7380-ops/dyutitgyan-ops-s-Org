import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, LogOut, Check, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface StartScreenProps {
  onOptionClick: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onOptionClick,
  soundEnabled,
  onToggleSound,
}) => {
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [hasQuit, setHasQuit] = useState(false);

  const handleOption = () => {
    sounds.playSnap(soundEnabled);
    onOptionClick();
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
      className="relative w-full h-full flex flex-col items-center justify-center p-4 select-none overflow-hidden"
    >
      {/* Subtle Sound & Orientation header at top corners */}
      <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-2">
        <button
          id="start-sound-toggle-btn"
          onClick={onToggleSound}
          className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/40 text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all shadow-md"
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

      {/* Main 2 Buttons Centered - Pixel-perfect match to user's z14.PNG */}
      {!hasQuit ? (
        <div
          id="start-menu-button-group"
          className="flex flex-col items-center justify-center gap-4 sm:gap-6 z-20"
        >
          {/* 1. OPTION BUTTON:
              Thick Blue & Cyan Border, Vibrant Yellow Background, Bold Red Letters
          */}
          <motion.button
            id="btn-main-option"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOption}
            className="group relative cursor-pointer outline-none focus:outline-none"
          >
            {/* Outer Cyan Accent Ring */}
            <div className="rounded-[22px] sm:rounded-[26px] p-[3px] bg-cyan-400 shadow-2xl">
              {/* Inner Blue Heavy Border with Yellow Center */}
              <div className="rounded-[19px] sm:rounded-[23px] border-[5px] sm:border-[6px] border-blue-700 bg-yellow-400 px-8 sm:px-14 py-2 sm:py-3.5 flex items-center justify-center min-w-[220px] sm:min-w-[280px]">
                <span className="text-3xl sm:text-5xl font-black tracking-wider text-red-600 uppercase drop-shadow-[0_2px_1px_rgba(0,0,0,0.15)] font-sans">
                  OPTION
                </span>
              </div>
            </div>
          </motion.button>

          {/* 2. QUIT BUTTON:
              Thick White Rounded Border, Vibrant Red Background, Bold Yellow Letters
          */}
          <motion.button
            id="btn-main-quit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuitPrompt}
            className="group relative cursor-pointer outline-none focus:outline-none"
          >
            {/* White Border Frame */}
            <div className="rounded-[20px] sm:rounded-[24px] border-[5px] sm:border-[6px] border-white bg-red-600 px-8 sm:px-14 py-2 sm:py-3.5 flex items-center justify-center min-w-[220px] sm:min-w-[280px] shadow-2xl">
              <span className="text-3xl sm:text-5xl font-black tracking-wider text-yellow-300 uppercase drop-shadow-[0_2px_1px_rgba(0,0,0,0.2)] font-sans">
                QUIT
              </span>
            </div>
          </motion.button>
        </div>
      ) : (
        /* Quit State Exit Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-30 bg-black/90 backdrop-blur-md border-4 border-yellow-400 p-6 sm:p-8 rounded-3xl text-center max-w-md flex flex-col items-center shadow-2xl mx-4"
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
