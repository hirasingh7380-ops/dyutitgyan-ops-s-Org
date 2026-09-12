import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, VolumeX, Sparkles, AlertCircle, Play } from 'lucide-react';
import { sounds } from '../utils/audio';
import { SubjectId } from '../types';

import subjectHindiImg from '../assets/images/subject_hindi_1789051936239.jpg';
import subjectEnglishImg from '../assets/images/subject_english_1789051956790.jpg';
import subjectMathImg from '../assets/images/subject_math_1789051970874.jpg';
import subjectArtsImg from '../assets/images/subject_arts_1789051986231.jpg';

interface SubjectSelectScreenProps {
  onSelectSubject: (subject: SubjectId) => void;
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SubjectSelectScreen: React.FC<SubjectSelectScreenProps> = ({
  onSelectSubject,
  onBack,
  soundEnabled,
  onToggleSound,
}) => {
  const [comingSoonSubject, setComingSoonSubject] = useState<{
    name: string;
    hindiName: string;
    color: string;
  } | null>(null);

  const handleSubjectClick = (subject: SubjectId) => {
    sounds.playSnap(soundEnabled);
    if (subject === 'ENGLISH') {
      sounds.playVictory(soundEnabled);
      onSelectSubject('ENGLISH');
    } else if (subject === 'HINDI') {
      sounds.playVictory(soundEnabled);
      onSelectSubject('HINDI');
    } else if (subject === 'MATH') {
      setComingSoonSubject({
        name: 'Math',
        hindiName: 'गणित',
        color: 'from-blue-600 to-cyan-700',
      });
    } else if (subject === 'ARTS') {
      setComingSoonSubject({
        name: 'Arts',
        hindiName: 'आर्ट्स / चित्रकला',
        color: 'from-pink-600 to-purple-700',
      });
    }
  };

  return (
    <div
      id="subject-select-container"
      className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-y-auto overflow-x-hidden min-h-0"
    >
      {/* Top Header Bar */}
      <div
        id="subject-header-bar"
        className="w-full flex items-center justify-between z-20 max-w-5xl px-2 mb-1 shrink-0"
      >
        <button
          onClick={() => {
            sounds.playPop(soundEnabled);
            onBack();
          }}
          className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/40 text-yellow-300 flex items-center gap-1.5 text-xs sm:text-sm font-black active:scale-95 transition-all shadow-md cursor-pointer"
          title="Back to Start Menu"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>वापस (Back)</span>
        </button>

        <div className="bg-black/60 border border-white/30 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-black text-white flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
          <span>विषय चुनें (All 4 Subjects)</span>
        </div>

        <button
          onClick={onToggleSound}
          className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/40 text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all shadow-md cursor-pointer"
          title="Toggle Sound"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="hidden sm:inline">Sound ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              <span className="hidden sm:inline">Sound OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Responsive 4 Subjects Grid: In Landscape/Desktop 4 columns side-by-side; in Portrait 2x2 grid */}
      <div
        id="subject-grid-wrapper"
        className="w-full max-w-5xl flex-1 flex items-center justify-center z-20 px-1 sm:px-2 py-1 min-h-0"
      >
        <div className="grid grid-cols-2 landscape:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-4 w-full my-auto">
          {/* 1. HINDI (Top-Left / Col 1) - 4 Active Games (अ से ज्ञ) */}
          <motion.button
            id="btn-subject-hindi"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSubjectClick('HINDI')}
            onTouchEnd={(e) => {
              // Ensure immediate response on Android mobile touch
              e.currentTarget.click();
            }}
            className="group relative cursor-pointer outline-none rounded-[18px] sm:rounded-[28px] overflow-hidden border-[3px] sm:border-[5px] border-red-600 bg-[#fedac2] shadow-xl h-28 sm:h-38 md:h-44 landscape:h-26 landscape:sm:h-36 flex items-center justify-center ring-3 sm:ring-4 ring-yellow-400/80 active:scale-95 transition-transform"
          >
            <img
              src={subjectHindiImg}
              alt="Hindi Subject"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Active Badge */}
            <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-red-950 px-2 sm:px-3.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-md border-2 border-red-600 flex items-center gap-1 whitespace-nowrap animate-bounce">
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-red-950" />
              <span>👉 हिंदी (4 खेल)</span>
            </div>
          </motion.button>

          {/* 2. ENGLISH (Top-Right / Col 2) - 5 Active Games */}
          <motion.button
            id="btn-subject-english"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSubjectClick('ENGLISH')}
            onTouchEnd={(e) => {
              e.currentTarget.click();
            }}
            className="group relative cursor-pointer outline-none rounded-[18px] sm:rounded-[28px] overflow-hidden border-[3px] sm:border-[5px] border-red-600 bg-[#fedac2] shadow-xl h-28 sm:h-38 md:h-44 landscape:h-26 landscape:sm:h-36 flex items-center justify-center ring-3 sm:ring-4 ring-yellow-400/80 active:scale-95 transition-transform"
          >
            <img
              src={subjectEnglishImg}
              alt="English Subject"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Active Highlight Badge */}
            <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-red-950 px-2 sm:px-3.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-md border-2 border-red-600 flex items-center gap-1 whitespace-nowrap">
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-red-950" />
              <span>English (5 Games)</span>
            </div>
          </motion.button>

          {/* 3. MATH (Bottom-Left / Col 3) */}
          <motion.button
            id="btn-subject-math"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSubjectClick('MATH')}
            className="group relative cursor-pointer outline-none rounded-[18px] sm:rounded-[28px] overflow-hidden border-[3px] sm:border-[5px] border-blue-600 bg-[#aed8f2] shadow-xl h-28 sm:h-38 md:h-44 landscape:h-26 landscape:sm:h-36 flex items-center justify-center"
          >
            <img
              src={subjectMathImg}
              alt="Math Subject"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-2 sm:px-3 py-0.5 rounded-full text-[9px] sm:text-xs font-black shadow-md border border-white/60 whitespace-nowrap">
              MATH (गणित)
            </div>
          </motion.button>

          {/* 4. ARTS (Bottom-Right / Col 4) */}
          <motion.button
            id="btn-subject-arts"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSubjectClick('ARTS')}
            className="group relative cursor-pointer outline-none rounded-[18px] sm:rounded-[28px] overflow-hidden border-[3px] sm:border-[5px] border-purple-600 bg-[#aed8f2] shadow-xl h-28 sm:h-38 md:h-44 landscape:h-26 landscape:sm:h-36 flex items-center justify-center"
          >
            <img
              src={subjectArtsImg}
              alt="Arts Subject"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 bg-purple-700 text-white px-2 sm:px-3 py-0.5 rounded-full text-[9px] sm:text-xs font-black shadow-md border border-white/60 whitespace-nowrap">
              Arts (चित्रकला)
            </div>
          </motion.button>
        </div>
      </div>

      {/* Bottom helper prompt and quick direct play buttons */}
      <div className="z-20 flex flex-wrap items-center justify-center gap-2 mt-1 shrink-0 px-2">
        <button
          onClick={() => handleSubjectClick('HINDI')}
          className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-yellow-300 font-black text-xs sm:text-sm border-2 border-yellow-300 shadow-lg active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-yellow-300" />
          <span>🇮🇳 हिंदी खेलें (4 Games)</span>
        </button>

        <button
          onClick={() => handleSubjectClick('ENGLISH')}
          className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-yellow-300 font-black text-xs sm:text-sm border-2 border-white shadow-lg active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-yellow-300" />
          <span>🇬🇧 English (5 Games)</span>
        </button>
      </div>

      {/* Coming Soon Modal for Math, Arts */}
      <AnimatePresence>
        {comingSoonSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 to-indigo-950 border-4 border-yellow-400 rounded-3xl p-5 sm:p-7 max-w-md w-full text-center shadow-2xl flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center mb-3 text-yellow-300">
                <AlertCircle className="w-7 h-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-yellow-300 mb-1">
                {comingSoonSubject.name} ({comingSoonSubject.hindiName})
              </h3>

              <div className="bg-white/10 px-3 py-1 rounded-full text-yellow-200 text-xs font-bold mb-3 border border-yellow-300/30">
                🚧 खेल जल्द आ रहे हैं! (Coming Soon)
              </div>

              <p className="text-xs sm:text-sm text-white/90 mb-5 leading-relaxed">
                {comingSoonSubject.name} विषय के नए और मजेदार खेल तैयार हो रहे हैं।
                <br />
                अभी आप <strong className="text-yellow-300 font-bold">Hindi (4 खेल)</strong> और <strong className="text-yellow-300 font-bold">English (5 खेल)</strong> खेल सकते हैं!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
                <button
                  onClick={() => setComingSoonSubject(null)}
                  className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 border border-white/40 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  बंद करें (Close)
                </button>

                <button
                  onClick={() => {
                    setComingSoonSubject(null);
                    onSelectSubject('HINDI');
                  }}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-yellow-200 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-transform border-2 border-yellow-300 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-yellow-200" />
                  <span>🇮🇳 Hindi खेलें</span>
                </button>

                <button
                  onClick={() => {
                    setComingSoonSubject(null);
                    onSelectSubject('ENGLISH');
                  }}
                  className="py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-transform border-2 border-white flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-red-950" />
                  <span>🇬🇧 English खेलें</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
