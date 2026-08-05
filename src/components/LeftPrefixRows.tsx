import React from 'react';
import { LetterTile } from '../types';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';

interface LeftPrefixRowsProps {
  activeSuffix: string | null;
  destroyedTiles: Set<string>;
  soundEnabled: boolean;
  onSelectTile: (tile: LetterTile) => void;
  onActivateSuffix: (suffixId: string) => void;
}

// 4x4 Matrix matching the user's exact screenshot layout:
// Row 1: C (AT), F (AN), M (AP), B (ALL)
// Row 2: R (AT), M (AN), C (AP), H (ALL)
// Row 3: H (AT), V (AN), T (AP), W (ALL)
// Row 4: B (AT), C (AN), L (AP), T (ALL)
const GRID_TILES: { letter: string; groupId: string }[][] = [
  [
    { letter: 'C', groupId: 'AT' },
    { letter: 'F', groupId: 'AN' },
    { letter: 'M', groupId: 'AP' },
    { letter: 'B', groupId: 'ALL' },
  ],
  [
    { letter: 'R', groupId: 'AT' },
    { letter: 'M', groupId: 'AN' },
    { letter: 'C', groupId: 'AP' },
    { letter: 'H', groupId: 'ALL' },
  ],
  [
    { letter: 'H', groupId: 'AT' },
    { letter: 'V', groupId: 'AN' },
    { letter: 'T', groupId: 'AP' },
    { letter: 'W', groupId: 'ALL' },
  ],
  [
    { letter: 'B', groupId: 'AT' },
    { letter: 'C', groupId: 'AN' },
    { letter: 'L', groupId: 'AP' },
    { letter: 'T', groupId: 'ALL' },
  ],
];

export const LeftPrefixRows: React.FC<LeftPrefixRowsProps> = ({
  destroyedTiles,
  soundEnabled,
  onSelectTile,
}) => {
  return (
    <div
      id="left-prefix-container"
      className="flex flex-col justify-center items-center select-none z-10"
    >
      {/* 4x4 Grid of Red Tiles with White Border and Yellow Text */}
      <div id="prefix-grid-4x4" className="grid grid-cols-4 gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4">
        {GRID_TILES.map((row, rowIndex) =>
          row.map((item, colIndex) => {
            const tileId = `${item.groupId}-${item.letter}`;
            const isDestroyed = destroyedTiles.has(tileId);

            const tile: LetterTile = {
              id: tileId,
              letter: item.letter,
              groupId: item.groupId,
              isCompleted: isDestroyed,
            };

            if (isDestroyed) {
              return (
                <div
                  key={`destroyed-${rowIndex}-${colIndex}`}
                  className="w-11 h-9 sm:w-16 sm:h-13 md:w-20 md:h-16 lg:w-22 lg:h-18 rounded-xl sm:rounded-2xl bg-black/30 border-2 border-white/40 backdrop-blur-xs flex items-center justify-center opacity-30"
                />
              );
            }

            return (
              <motion.div
                key={`${item.groupId}-${item.letter}-${rowIndex}-${colIndex}`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                draggable
                onDragStart={(e: React.DragEvent) => {
                  sounds.playPop(soundEnabled);
                  e.dataTransfer.setData(
                    'text/plain',
                    JSON.stringify({ type: 'PREFIX', tile })
                  );
                }}
                onClick={() => {
                  sounds.playSnap(soundEnabled);
                  onSelectTile(tile);
                }}
                className="w-11 h-9 sm:w-16 sm:h-13 md:w-20 md:h-16 lg:w-22 lg:h-18 rounded-xl sm:rounded-2xl bg-red-600 border-2 sm:border-4 border-white flex items-center justify-center text-yellow-300 font-black text-xl sm:text-3xl md:text-4xl shadow-lg cursor-grab active:cursor-grabbing hover:bg-red-500 transition-transform select-none"
              >
                {item.letter}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

