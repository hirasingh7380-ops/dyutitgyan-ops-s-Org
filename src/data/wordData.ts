import { SuffixGroup, LetterTile } from '../types';

export const SUFFIX_GROUPS: SuffixGroup[] = [
  {
    id: 'AT',
    text: 'AT',
    prefixes: ['C', 'B', 'R', 'H'],
    validWords: ['CAT', 'BAT', 'RAT', 'HAT'],
    color: 'from-[#8B5E3C] to-[#6D4C41]',
    borderColor: 'border-[#8B5E3C]',
    bgGradient: 'bg-gradient-to-br from-[#8B5E3C] to-[#5D4037]',
  },
  {
    id: 'AN',
    text: 'AN',
    prefixes: ['F', 'M', 'V', 'C'],
    validWords: ['FAN', 'MAN', 'VAN', 'CAN'],
    color: 'from-[#556B2F] to-[#3B4A20]',
    borderColor: 'border-[#556B2F]',
    bgGradient: 'bg-gradient-to-br from-[#556B2F] to-[#354F52]',
  },
  {
    id: 'AP',
    text: 'AP',
    prefixes: ['M', 'C', 'T', 'L'],
    validWords: ['MAP', 'CAP', 'TAP', 'LAP'],
    color: 'from-[#354F52] to-[#2F3E46]',
    borderColor: 'border-[#354F52]',
    bgGradient: 'bg-gradient-to-br from-[#354F52] to-[#1A2E35]',
  },
  {
    id: 'ALL',
    text: 'ALL',
    prefixes: ['B', 'H', 'W', 'T'],
    validWords: ['BALL', 'HALL', 'WALL', 'TALL'],
    color: 'from-[#7F5539] to-[#9C6644]',
    borderColor: 'border-[#7F5539]',
    bgGradient: 'bg-gradient-to-br from-[#7F5539] to-[#5C3D2E]',
  },
];

export const INITIAL_PREFIX_TILES: LetterTile[] = SUFFIX_GROUPS.flatMap((group) =>
  group.prefixes.map((letter) => ({
    id: `${group.id}-${letter}`,
    letter,
    groupId: group.id,
    isCompleted: false,
  }))
);
