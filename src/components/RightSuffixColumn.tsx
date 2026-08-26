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
  // Handle Framer Motion Drag End for Suffix tile
  const handleDragEnd = (suffixId: string, dropX: number, dropY: number) => {
    const dropBox = document.getElementById('dropbox-main-frame');
    if (dropBox) {
      const rect = dropBox.getBoundingClientRect();
      if (
        dropX >= rect.left - 60 &&
        dropX <= rect.right + 60 &&
        dropY >= rect.top - 60 &&
        dropY <= rect.bottom + 60
      ) {
        sounds.playSnap(soundEnabled);
        onSelectSuffix(suffixId);
      }
    }
  };

  return (
    <div
      id="right-suffix-container"
      className="relative z-30 flex flex-col justify-center items-center select-none overflow-visible touch-none"
    >
      <div id="suffix-column-list" className="flex flex-col gap-2.5 sm:gap-3.5 md:gap-4 overflow-visible">
        {SUFFIX_GROUPS.map((group: SuffixGroup) => {
          const isActive = activeSuffix === group.id;

          // Check progress for this group
          const groupTileIds = group.prefixes.map((p) => `${group.id}-${p}`);
          const completedCount = groupTileIds.filter((id) => destroyedTiles.has(id)).length;
          const isGroupAllCompleted = completedCount === group.prefixes.length;

          return (
            <motion.button
              key={group.id}
              id={`suffix-btn-${group.id}`}
              drag={!isGroupAllCompleted}
              dragSnapToOrigin
              dragElastic={0}
              dragMomentum={false}
              whileDrag={{ scale: 1.2, zIndex: 9999 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onDragStart={() => sounds.playPop(soundEnabled)}
              onDragEnd={(_e, info) => handleDragEnd(group.id, info.point.x, info.point.y)}
              onClick={() => {
                sounds.playSnap(soundEnabled);
                onSelectSuffix(group.id);
              }}
              className={`w-16 h-11 sm:w-22 sm:h-14 md:w-26 md:h-17 lg:w-30 lg:h-19 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl shadow-xl cursor-grab active:cursor-grabbing select-none touch-none ${
                isGroupAllCompleted
                  ? 'bg-red-950/60 text-yellow-300/40 border-white/50 opacity-50 pointer-events-none'
                  : isActive
                  ? 'bg-red-600 text-yellow-300 ring-4 ring-yellow-300 scale-105 shadow-yellow-400/50'
                  : 'bg-red-600 text-yellow-300 hover:bg-red-500'
              }`}
              style={{
                boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.4), 0 6px 14px rgba(0,0,0,0.3)',
                touchAction: 'none',
              }}
            >
              {group.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

