import React from 'react';
import { SuffixGroup } from '../types';
import { SUFFIX_GROUPS } from '../data/wordData';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';

interface RightSuffixColumnProps {
  activeSuffix: string | null;
  destroyedTiles: Set<string>;
  soundEnabled: boolean;
  onSelectSuffix: (suffixId: string) => void;
}

export const RightSuffixColumn: React.FC<RightSuffixColumnProps> = ({
  activeSuffix,
  destroyedTiles,
  soundEnabled,
  onSelectSuffix,
}) => {
  return (
    <div
      id="right-suffix-container"
      className="flex flex-col justify-center items-center select-none z-10"
    >
      <div id="suffix-column-list" className="flex flex-col gap-2 sm:gap-3">
        {SUFFIX_GROUPS.map((group: SuffixGroup) => {
          const isActive = activeSuffix === group.id;
          const groupTileIds = group.prefixes.map((p) => `${group.id}-${p}`);
          const completedCount = groupTileIds.filter((id) => destroyedTiles.has(id)).length;
          const isGroupAllCompleted = completedCount === group.prefixes.length;

          return (
            <motion.button
              key={group.id}
              id={`suffix-btn-${group.id}`}
              whileTap={{ scale: 0.94 }}
              draggable
              onDragStart={(e: React.DragEvent) => {
                sounds.playPop(soundEnabled);
                e.dataTransfer.setData(
                  'text/plain',
                  JSON.stringify({ type: 'SUFFIX', id: group.id })
                );
              }}
              onClick={() => {
                sounds.playSnap(soundEnabled);
                onSelectSuffix(group.id);
              }}
              className={`w-14 h-9 sm:w-18 sm:h-12 md:w-22 md:h-15 rounded-xl border-2 border-white flex items-center justify-center font-bold text-lg sm:text-2xl md:text-3xl shadow-md transition-colors cursor-pointer select-none ${
                isGroupAllCompleted
                  ? 'bg-black/40 text-yellow-300/40 border-white/30 opacity-40'
                  : isActive
                  ? 'bg-red-600 text-yellow-300 ring-4 ring-yellow-300'
                  : 'bg-red-600 text-yellow-300 hover:bg-red-500'
              }`}
            >
              {group.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};