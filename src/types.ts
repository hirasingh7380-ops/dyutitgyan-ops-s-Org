export type GameMode = 'WORD_BUILDER' | 'FILL_BLANK' | 'BALLOON_POP' | 'CLICK_LETTER' | 'MATCH_WORD';

export interface SuffixGroup {
  id: string; // 'AT' | 'AN' | 'AP' | 'ALL'
  text: string;
  prefixes: string[]; // e.g. ['C', 'B', 'R', 'H']
  validWords: string[]; // e.g. ['CAT', 'BAT', 'RAT', 'HAT']
  color: string; // Tailwind color theme
  borderColor: string;
  bgGradient: string;
}

export interface LetterTile {
  id: string; // Unique tile ID, e.g. 'AT-C'
  letter: string;
  groupId: string; // 'AT', 'AN', 'AP', 'ALL'
  isCompleted: boolean;
}

export interface FillBlankSlot {
  id: string; // Slot ID e.g. 'row1-slot2'
  targetLetter: string; // Correct letter, e.g. 'B'
  filledLetter: string | null; // Currently filled letter or null
  isPreFilled: boolean; // True if pre-filled by level
}

export interface FillBlankRow {
  id: string;
  slots: FillBlankSlot[];
}

export interface FillBlankLevel {
  levelNumber: number;
  rows: FillBlankRow[];
  leftOptions: string[]; // e.g. ['A', 'B', 'C', 'D']
  rightOptions: string[]; // e.g. ['E', 'B', 'E', 'D']
}

export interface GameState {
  gameMode: GameMode;
  activeSuffix: string | null; // Currently placed suffix in drop box ('AT', 'AN', etc.)
  currentPrefixInBox: LetterTile | null; // Currently placed prefix tile in drop box
  completedWords: string[]; // List of formed and destroyed words, e.g. ['CAT', 'BAT']
  destroyedTiles: Set<string>; // IDs of destroyed prefix tiles
  score: number;
  comboCount: number;
  isWordDestroying: boolean;
  destroyingWord: string | null;
  soundEnabled: boolean;
  isGameWon: boolean;
}

