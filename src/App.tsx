import React, { useState, useEffect } from 'react';
import { LetterTile, GameMode, AppScreen, HindiGameMode } from './types';
import { SUFFIX_GROUPS } from './data/wordData';
import { HeaderBar } from './components/HeaderBar';
import { LeftPrefixRows } from './components/LeftPrefixRows';
import { DropBox } from './components/DropBox';
import { RightSuffixColumn } from './components/RightSuffixColumn';
import { VictoryModal } from './components/VictoryModal';
import { WordDestroyModal } from './components/WordDestroyModal';
import { StartScreen } from './components/StartScreen';
import { SubjectSelectScreen } from './components/SubjectSelectScreen';
import { HomeScreen } from './components/HomeScreen';
import { HindiHomeScreen } from './components/HindiHomeScreen';
import { FillInTheBlankStage } from './components/FillInTheBlankStage';
import { BalloonPopStage } from './components/BalloonPopStage';
import { ClickLetterStage } from './components/ClickLetterStage';
import { MatchWordStage } from './components/MatchWordStage';
import { HindiBalloonPopStage } from './components/HindiBalloonPopStage';
import { HindiMatchWordStage } from './components/HindiMatchWordStage';
import { HindiFillInTheBlankStage } from './components/HindiFillInTheBlankStage';
import { LandscapeWrapper } from './components/LandscapeWrapper';
import { sounds } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('START');
  const [gameMode, setGameMode] = useState<GameMode>('WORD_BUILDER');
  const [hindiGameMode, setHindiGameMode] = useState<HindiGameMode>('HINDI_CLICK_LETTER');
  const [activeSuffix, setActiveSuffix] = useState<string | null>(null);
  const [currentPrefix, setCurrentPrefix] = useState<LetterTile | null>(null);
  const [destroyedTiles, setDestroyedTiles] = useState<Set<string>>(new Set());
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isDestroying, setIsDestroying] = useState<boolean>(false);
  const [destroyingWord, setDestroyingWord] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const TOTAL_WORDS = 16;

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentScreen('GAME_PLAY');
  };

  const handleStartHindiGame = (mode: HindiGameMode) => {
    setHindiGameMode(mode);
    setCurrentScreen('HINDI_GAME_PLAY');
  };

  // Evaluate word when prefix is placed or changed
  useEffect(() => {
    if (gameMode !== 'WORD_BUILDER' || !currentPrefix || !activeSuffix || isDestroying) return;

    const group = SUFFIX_GROUPS.find((g) => g.id === activeSuffix);
    if (!group) return;

    const formedWord = `${currentPrefix.letter}${activeSuffix}`;

    if (group.validWords.includes(formedWord)) {
      // Valid word formed!
      setIsDestroying(true);
      setDestroyingWord(formedWord);
      sounds.playWordDestroy(soundEnabled);
      sounds.speakHindiWordMeaning(formedWord, soundEnabled);

      const tileId = currentPrefix.id;

      setTimeout(() => {
        setDestroyedTiles((prev) => new Set(prev).add(tileId));
        setCompletedWords((prev) => [...prev, formedWord]);
        setScore((prev) => prev + 100);

        setCurrentPrefix(null);
        setIsDestroying(false);
        setDestroyingWord(null);
      }, 2700);
    }
  }, [currentPrefix, activeSuffix, isDestroying, soundEnabled, gameMode]);

  // Handlers
  const handleSelectSuffix = (suffixId: string) => {
    if (activeSuffix === suffixId) return;
    setActiveSuffix(suffixId);
    setCurrentPrefix(null);
    sounds.playSnap(soundEnabled);
  };

  const handleSelectPrefixTile = (tile: LetterTile) => {
    if (destroyedTiles.has(tile.id)) return;

    // If prefix tile belongs to another group, change active suffix automatically
    if (activeSuffix !== tile.groupId) {
      setActiveSuffix(tile.groupId);
    }

    setCurrentPrefix(tile);
    sounds.playSnap(soundEnabled);
  };

  const handleClearPrefix = () => {
    setCurrentPrefix(null);
    sounds.playPop(soundEnabled);
  };

  const handleClearSuffix = () => {
    setActiveSuffix(null);
    setCurrentPrefix(null);
    sounds.playPop(soundEnabled);
  };

  const handleReset = () => {
    setActiveSuffix(null);
    setCurrentPrefix(null);
    setDestroyedTiles(new Set());
    setCompletedWords([]);
    setScore(0);
    setIsDestroying(false);
    setDestroyingWord(null);
    sounds.playPop(soundEnabled);
  };

  const isGameWon = destroyedTiles.size === TOTAL_WORDS;

  return (
    <LandscapeWrapper>
      {currentScreen === 'START' ? (
        <StartScreen
          onOptionClick={() => setCurrentScreen('SUBJECT_SELECT')}
          onPlayHindi={() => setCurrentScreen('HINDI_MENU')}
          onPlayHindiMode={(mode) => {
            setHindiGameMode(mode);
            setCurrentScreen('HINDI_GAME_PLAY');
          }}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : currentScreen === 'SUBJECT_SELECT' ? (
        <SubjectSelectScreen
          onSelectSubject={(subject) => {
            if (subject === 'ENGLISH') {
              setCurrentScreen('ENGLISH_MENU');
            } else if (subject === 'HINDI') {
              setCurrentScreen('HINDI_MENU');
            }
          }}
          onBack={() => setCurrentScreen('START')}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : currentScreen === 'ENGLISH_MENU' ? (
        <HomeScreen
          onStartGame={handleStartGame}
          onBack={() => setCurrentScreen('SUBJECT_SELECT')}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : currentScreen === 'HINDI_MENU' ? (
        <HindiHomeScreen
          onStartGame={handleStartHindiGame}
          onBack={() => setCurrentScreen('SUBJECT_SELECT')}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : currentScreen === 'HINDI_GAME_PLAY' ? (
        hindiGameMode === 'HINDI_BALLOON_POP' ? (
          <HindiBalloonPopStage
            soundEnabled={soundEnabled}
            onHome={() => setCurrentScreen('HINDI_MENU')}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
          />
        ) : hindiGameMode === 'HINDI_MATCH_WORD' ? (
          <HindiMatchWordStage
            soundEnabled={soundEnabled}
            onHome={() => setCurrentScreen('HINDI_MENU')}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
          />
        ) : hindiGameMode === 'HINDI_FILL_BLANK' ? (
          <HindiFillInTheBlankStage
            soundEnabled={soundEnabled}
            onHome={() => setCurrentScreen('HINDI_MENU')}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
          />
        ) : (
          <ClickLetterStage
            soundEnabled={soundEnabled}
            onHome={() => setCurrentScreen('HINDI_MENU')}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            initialPageIndex={0}
            defaultLanguage="HINDI"
          />
        )
      ) : gameMode === 'FILL_BLANK' ? (
        <FillInTheBlankStage
          soundEnabled={soundEnabled}
          onHome={() => setCurrentScreen('ENGLISH_MENU')}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : gameMode === 'BALLOON_POP' ? (
        <BalloonPopStage
          soundEnabled={soundEnabled}
          onHome={() => setCurrentScreen('ENGLISH_MENU')}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : gameMode === 'CLICK_LETTER' ? (
        <ClickLetterStage
          soundEnabled={soundEnabled}
          onHome={() => setCurrentScreen('ENGLISH_MENU')}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : gameMode === 'MATCH_WORD' ? (
        <MatchWordStage
          soundEnabled={soundEnabled}
          onHome={() => setCurrentScreen('ENGLISH_MENU')}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : (
        <>
          {/* Game Header */}
          <HeaderBar
            score={score}
            completedCount={destroyedTiles.size}
            totalWords={TOTAL_WORDS}
            soundEnabled={soundEnabled}
            activeSuffix={activeSuffix}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onReset={handleReset}
            onHome={() => setCurrentScreen('ENGLISH_MENU')}
          />

          {/* Main Game Stage - Landscape Layout */}
          <main id="main-landscape-game-stage" className="flex-1 flex flex-row items-center justify-between w-full h-[calc(100vh-56px)] overflow-hidden px-4 sm:px-8">
            {/* LEFT COLUMN: 4 Prefix Rows (C B R H | F M V C | M C T L | B H W T) */}
            <LeftPrefixRows
              activeSuffix={activeSuffix}
              destroyedTiles={destroyedTiles}
              soundEnabled={soundEnabled}
              onSelectTile={handleSelectPrefixTile}
              onActivateSuffix={handleSelectSuffix}
            />

            {/* CENTER COLUMN: Drop Box & Construction Area */}
            <DropBox
              activeSuffix={activeSuffix}
              currentPrefix={currentPrefix}
              isDestroying={isDestroying}
              destroyingWord={destroyingWord}
              onDropSuffix={handleSelectSuffix}
              onDropPrefix={handleSelectPrefixTile}
              onClearPrefix={handleClearPrefix}
              onClearSuffix={handleClearSuffix}
            />

            {/* RIGHT COLUMN: 4 Suffix Tiles (AT | AN | AP | ALL) */}
            <RightSuffixColumn
              activeSuffix={activeSuffix}
              destroyedTiles={destroyedTiles}
              soundEnabled={soundEnabled}
              onSelectSuffix={handleSelectSuffix}
            />
          </main>

          {/* Word Destroy Explosion Modal - Rendered at top level with z-[99999] so it shows in front of all words */}
          <WordDestroyModal
            isDestroying={isDestroying}
            destroyingWord={destroyingWord}
            soundEnabled={soundEnabled}
          />

          {/* Victory Celebration Modal when all 16 words are destroyed */}
          {isGameWon && (
            <VictoryModal
              score={score}
              completedCount={destroyedTiles.size}
              soundEnabled={soundEnabled}
              onReset={handleReset}
            />
          )}
        </>
      )}
    </LandscapeWrapper>
  );
}

