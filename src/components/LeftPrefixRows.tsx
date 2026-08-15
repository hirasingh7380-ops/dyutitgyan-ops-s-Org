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
      <div id="prefix-grid-4x4" className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-3">
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
                  className="w-11 h-9 sm:w-15 sm:h-12 md:w-18 md:h-15 rounded-xl bg-black/30 border border-white/30 flex items-center justify-center opacity-25"
                />
              );
            }

            return (
              <motion.button
                key={`${item.groupId}-${item.letter}-${rowIndex}-${colIndex}`}
                whileTap={{ scale: 0.9 }}
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
                className="w-11 h-9 sm:w-15 sm:h-12 md:w-18 md:h-15 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center text-yellow-300 font-bold text-lg sm:text-2xl md:text-3xl shadow-md cursor-pointer hover:bg-red-500 transition-colors"
              >
                {item.letter}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
};