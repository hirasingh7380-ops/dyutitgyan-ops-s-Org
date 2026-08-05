import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Trophy, Flame, Home } from 'lucide-react';

interface HeaderBarProps {
  score: number;
  completedCount: number;
  totalWords: number;
  soundEnabled: boolean;
  activeSuffix: string | null;
  onToggleSound: () => void;
  onReset: () => void;
  onHome?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  score,
  completedCount,
  totalWords,
  soundEnabled,
  activeSuffix,
  onToggleSound,
  onReset,
  onHome,
}) => {
  const percentage = Math.round((completedCount / totalWords) * 100);

  return (
    <header id="game-header-bar" className="w-full bg-black/40 backdrop-blur-md border-b border-white/20 px-3 py-1.5 sm:px-6 sm:py-2 flex items-center justify-between text-white select-none z-20">
      {/* Title & Brand */}
      <div id="game-logo-container" className="flex items-center gap-2">
        <div id="game-icon-box" className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-600 border-2 border-white flex items-center justify-center font-black text-yellow-300 shadow-md text-sm sm:text-lg">
          W
        </div>
        <div>
          <h1 id="game-title" className="text-sm sm:text-base md:text-lg font-black tracking-wide text-yellow-300 leading-tight">
            Word Builder
          </h1>
          <p id="game-subtitle" className="text-[10px] sm:text-xs text-white/80 font-medium leading-none mt-0.5 hidden sm:block">
            {activeSuffix ? (
              <span>
                Active Target: <span className="text-yellow-300 font-black">{activeSuffix}</span>
              </span>
            ) : (
              'Drag or tap a letter & suffix into Drop Box'
            )}
          </p>
        </div>
      </div>

      {/* Progress & Stats */}
      <div id="game-stats-container" className="flex items-center gap-2 sm:gap-4">
        {/* Score */}
        <div id="stat-score-box" className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-white/30 text-xs sm:text-sm">
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
          <span className="text-[10px] sm:text-xs text-white/70 uppercase font-bold">Score</span>
          <span id="stat-score-value" className="font-black text-yellow-300">{score}</span>
        </div>

        {/* Progress Bar */}
        <div id="stat-progress-box" className="hidden md:flex flex-col w-28 sm:w-36 gap-1">
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-white/90">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" /> Progress
            </span>
            <span id="stat-words-count" className="text-yellow-300">{completedCount}/{totalWords}</span>
          </div>
          <div id="progress-bar-bg" className="w-full bg-white/20 h-2 rounded-full overflow-hidden border border-white/30">
            <div
              id="progress-bar-fill"
              className="bg-yellow-300 h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Destroyed count */}
        <div id="stat-combo-box" className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full border border-white/30 text-xs">
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span className="font-black text-yellow-300">{completedCount}/{totalWords}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div id="game-actions-container" className="flex items-center gap-1.5 sm:gap-2">
        {onHome && (
          <button
            id="btn-home"
            onClick={onHome}
            className="p-1.5 sm:p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/30 text-white transition-all active:scale-95 shadow-xs"
            title="Home Screen"
            aria-label="Home Screen"
          >
            <Home className="w-4 h-4 text-yellow-300" />
          </button>
        )}

        <button
          id="btn-toggle-sound"
          onClick={onToggleSound}
          className="p-1.5 sm:p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/30 text-white transition-all active:scale-95 shadow-xs"
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-300" /> : <VolumeX className="w-4 h-4 text-white/50" />}
        </button>

        <button
          id="btn-reset-game"
          onClick={onReset}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-red-600 hover:bg-red-500 border border-white text-yellow-300 text-xs font-black transition-all active:scale-95 flex items-center gap-1 shadow-xs"
          title="Reset Game"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};
