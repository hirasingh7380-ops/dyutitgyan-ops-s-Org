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
    <header id="game-header-bar" className="w-full bg-black/60 border-b border-white/20 px-3 py-1.5 sm:px-5 sm:py-2 flex items-center justify-between text-white select-none z-20">
      {/* Title & Brand */}
      <div id="game-logo-container" className="flex items-center gap-2">
        <div id="game-icon-box" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600 border border-white flex items-center justify-center font-bold text-yellow-300 text-sm sm:text-base">
          W
        </div>
        <div>
          <h1 id="game-title" className="text-xs sm:text-sm font-bold text-yellow-300 leading-tight">
            Word Builder
          </h1>
          <p id="game-subtitle" className="text-[10px] text-white/80 font-normal leading-none mt-0.5 hidden sm:block">
            {activeSuffix ? `Target: ${activeSuffix}` : 'Tap letter & suffix into Drop Box'}
          </p>
        </div>
      </div>

      {/* Progress & Stats */}
      <div id="game-stats-container" className="flex items-center gap-2 sm:gap-3">
        {/* Score */}
        <div id="stat-score-box" className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full border border-white/20 text-xs">
          <Trophy className="w-3.5 h-3.5 text-yellow-300" />
          <span className="text-[10px] text-white/70 font-semibold">Score:</span>
          <span id="stat-score-value" className="font-bold text-yellow-300">{score}</span>
        </div>

        {/* Progress Bar */}
        <div id="stat-progress-box" className="hidden md:flex flex-col w-24 sm:w-32 gap-0.5">
          <div className="flex justify-between items-center text-[10px] font-semibold text-white/90">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" /> Progress
            </span>
            <span id="stat-words-count" className="text-yellow-300">{completedCount}/{totalWords}</span>
          </div>
          <div id="progress-bar-bg" className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden border border-white/20">
            <div
              id="progress-bar-fill"
              className="bg-yellow-300 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Destroyed count */}
        <div id="stat-combo-box" className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full border border-white/20 text-xs">
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span className="font-bold text-yellow-300">{completedCount}/{totalWords}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div id="game-actions-container" className="flex items-center gap-1.5">
        {onHome && (
          <button
            id="btn-home"
            onClick={onHome}
            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 text-white active:scale-95"
            title="Home"
          >
            <Home className="w-4 h-4 text-yellow-300" />
          </button>
        )}

        <button
          id="btn-toggle-sound"
          onClick={onToggleSound}
          className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 text-white active:scale-95"
          title="Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-300" /> : <VolumeX className="w-4 h-4 text-white/50" />}
        </button>

        <button
          id="btn-reset-game"
          onClick={onReset}
          className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 border border-white text-yellow-300 text-xs font-bold active:scale-95 flex items-center gap-1"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};