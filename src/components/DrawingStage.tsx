import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

import drawingBgLandscape from '../assets/images/drawing_bg_landscape_1789921391908.jpg';

interface DrawingStageProps {
  onHome: () => void;
  soundEnabled: boolean;
}

// Exactly 6 Color Options as specified in reference screenshot (zq9.PNG)
interface ColorOption {
  id: string;
  name: string;
  hex: string;
  textColor: string;
  borderColor: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  {
    id: 'RED',
    name: 'RED',
    hex: '#ff0000',
    textColor: '#ff0000',
    borderColor: '#ff0000',
  },
  {
    id: 'GREEN',
    name: 'GREEN',
    hex: '#00c853',
    textColor: '#00c853',
    borderColor: '#ff0000',
  },
  {
    id: 'BLUE',
    name: 'BLUE',
    hex: '#00a2ff',
    textColor: '#00a2ff',
    borderColor: '#ff0000',
  },
  {
    id: 'YELLOW',
    name: 'YELLOW',
    hex: '#ffd600',
    textColor: '#ffd600',
    borderColor: '#00c8ff', // Distinctive cyan/light-blue border as shown in screenshot
  },
  {
    id: 'PINK',
    name: 'PINK',
    hex: '#ff2d87',
    textColor: '#ff1493',
    borderColor: '#ff0000',
  },
  {
    id: 'BLACK',
    name: 'BLACK',
    hex: '#18181b',
    textColor: '#000000',
    borderColor: '#ff0000',
  },
];

// ============================================================================
// MANGO GEOMETRY (Exact from screenshot zq9.PNG) - Coordinate space (0 0 500 500)
// ============================================================================

// 1. Mango Fruit Outline & Fill (starts at top notch under stem)
const MANGO_BODY_OUTLINE_PATH =
  'M 185 142 ' +
  'C 135 142, 52 192, 34 270 ' +
  'C 16 340, 48 420, 106 455 ' +
  'C 128 468, 150 466, 164 452 ' +
  'C 225 400, 355 372, 380 270 ' +
  'C 402 182, 280 142, 185 142 Z';

// 2. Mango Stem Outline (curves up and to the left, hollow interior as in screenshot)
const MANGO_STEM_OUTLINE_PATH =
  'M 170 145 ' +
  'C 156 112, 134 80, 108 58 ' +
  'C 116 50, 128 48, 138 52 ' +
  'C 162 76, 182 110, 194 140 ' +
  'Z';

// 3. Mango Leaf Outline (curves up-right to a tip, hollow interior as in screenshot)
const MANGO_LEAF_OUTLINE_PATH =
  'M 182 128 ' +
  'C 230 62, 320 45, 415 150 ' +
  'C 330 106, 248 118, 192 148 ' +
  'Z';

// 4. White Cutting Pieces (Right side of zq9.PNG)
// Piece 4: Large white mango fruit silhouette with notch at top
const MANGO_CUTTING_BODY_PATH =
  'M 185 142 ' +
  'C 135 142, 52 192, 34 270 ' +
  'C 16 340, 48 420, 106 455 ' +
  'C 128 468, 150 466, 164 452 ' +
  'C 225 400, 355 372, 380 270 ' +
  'C 402 182, 280 142, 198 142 ' +
  'C 192 142, 188 150, 182 153 ' +
  'C 176 150, 172 142, 166 142 ' +
  'C 158 142, 142 142, 185 142 Z';

// Piece 1: Top Splash Arc (Crescent/droplet arc at upper left of mango)
const MANGO_SPLASH_1_PATH =
  'M 55 12 C 72 36, 80 65, 76 92 C 68 85, 62 60, 50 32 Z';

// Piece 2: Middle Splash Swoosh (Crescent swoosh at middle left of mango)
const MANGO_SPLASH_2_PATH =
  'M 15 62 C 55 42, 105 75, 145 155 C 95 118, 52 98, 15 62 Z';

// Piece 3: Bottom Splash Swoosh (Crescent swoosh at bottom left of mango)
const MANGO_SPLASH_3_PATH =
  'M 35 25 C 75 22, 118 58, 158 128 C 110 95, 72 72, 35 25 Z';

// ============================================================================
// APPLE GEOMETRY (Optional Stage 2) - Coordinate space (0 0 400 400)
// ============================================================================
const APPLE_BODY_PATH =
  'M 200 115 ' +
  'C 150 72, 60 92, 45 172 ' +
  'C 35 235, 52 315, 112 365 ' +
  'C 152 398, 185 378, 200 362 ' +
  'C 215 378, 248 398, 288 365 ' +
  'C 348 315, 365 235, 355 172 ' +
  'C 340 92, 250 72, 200 115 Z';

const APPLE_STEM_PATH =
  'M 194 118 ' +
  'C 190 70, 172 38, 142 22 ' +
  'C 150 20, 160 22, 164 26 ' +
  'C 190 48, 204 78, 206 118 Z';

const APPLE_LEAF_PATH =
  'M 205 110 ' +
  'C 220 52, 280 25, 335 38 ' +
  'C 305 85, 250 120, 205 110 Z';

export const DrawingStage: React.FC<DrawingStageProps> = ({ onHome, soundEnabled }) => {
  // Primary Fruit: Starts immediately on MANGO as requested in prompt & screenshot
  const [currentFruit, setCurrentFruit] = useState<'MANGO' | 'APPLE'>('MANGO');

  // Currently active selected color from bottom 6 buttons
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]); // Default RED

  // ---------------------------------------------------------
  // Mango Cutting Images States (3-4 Cutting Images as in zq9.PNG)
  // ---------------------------------------------------------
  // Piece 1: Top Splash Arc
  const [splash1Color, setSplash1Color] = useState<string>('#ffffff');
  const [isSplash1Placed, setIsSplash1Placed] = useState<boolean>(false);

  // Piece 2: Middle Splash Swoosh
  const [splash2Color, setSplash2Color] = useState<string>('#ffffff');
  const [isSplash2Placed, setIsSplash2Placed] = useState<boolean>(false);

  // Piece 3: Bottom Splash Swoosh
  const [splash3Color, setSplash3Color] = useState<string>('#ffffff');
  const [isSplash3Placed, setIsSplash3Placed] = useState<boolean>(false);

  // Piece 4: Mango Body Silhouette
  const [mangoBodyColor, setMangoBodyColor] = useState<string>('#ffffff');
  const [isMangoBodyPlaced, setIsMangoBodyPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // Apple Stage States
  // ---------------------------------------------------------
  const [appleBodyColor, setAppleBodyColor] = useState<string>('#ffffff');
  const [appleLeafColor, setAppleLeafColor] = useState<string>('#ffffff');
  const [isAppleBodyPlaced, setIsAppleBodyPlaced] = useState<boolean>(false);
  const [isAppleLeafPlaced, setIsAppleLeafPlaced] = useState<boolean>(false);

  // Outline container ref for drop detection
  const outlineAreaRef = useRef<HTMLDivElement>(null);

  // Voice intro when screen opens
  useEffect(() => {
    const timer = setTimeout(() => {
      sounds.speakDrawingIntro(soundEnabled, currentFruit === 'MANGO' ? 'mango' : 'apple');
    }, 400);
    return () => clearTimeout(timer);
  }, [soundEnabled, currentFruit]);

  // Color selection from bottom buttons
  const handleSelectColor = (color: ColorOption) => {
    setSelectedColor(color);
    sounds.speakDrawingColorSelected(color.id, soundEnabled);

    // If mango body is not placed, also auto-tint it if white, or allow direct painting
    if (currentFruit === 'MANGO') {
      if (!isMangoBodyPlaced) {
        setMangoBodyColor(color.hex);
      }
    }
  };

  // Check drop in outline zone
  const checkDroppedInOutline = (dropX: number, dropY: number) => {
    if (!outlineAreaRef.current) return false;
    const rect = outlineAreaRef.current.getBoundingClientRect();
    const relX = (dropX - rect.left) / rect.width;
    const relY = (dropY - rect.top) / rect.height;
    // Generous drop zone covering the outline area on the left
    return relX >= -0.25 && relX <= 1.25 && relY >= -0.25 && relY <= 1.25;
  };

  // Drag Mango Body End
  const handleMangoBodyDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      // Tap to paint
      setMangoBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('mango', soundEnabled);
      return;
    }

    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsMangoBodyPlaced(true);
      triggerVictory('mango');
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Drag Splash 1 End
  const handleSplash1DragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setSplash1Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('splash', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsSplash1Placed(true);
      sounds.speakDrawingPiecePlaced('splash', soundEnabled);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Drag Splash 2 End
  const handleSplash2DragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setSplash2Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('splash', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsSplash2Placed(true);
      sounds.speakDrawingPiecePlaced('splash', soundEnabled);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Drag Splash 3 End
  const handleSplash3DragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setSplash3Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('splash', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsSplash3Placed(true);
      sounds.speakDrawingPiecePlaced('splash', soundEnabled);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Apple Piece Drag Ends
  const handleAppleDragEnd = (
    piece: 'body' | 'leaf',
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      if (piece === 'body') setAppleBodyColor(selectedColor.hex);
      else setAppleLeafColor(selectedColor.hex);
      sounds.speakDrawingPieceColored(piece, soundEnabled);
      return;
    }

    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      if (piece === 'body') {
        setIsAppleBodyPlaced(true);
        if (isAppleLeafPlaced) triggerVictory('apple');
        else sounds.speakDrawingPiecePlaced('body', soundEnabled);
      } else {
        setIsAppleLeafPlaced(true);
        if (isAppleBodyPlaced) triggerVictory('apple');
        else sounds.speakDrawingPiecePlaced('leaf', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Victory Celebration
  const triggerVictory = (fruit: 'apple' | 'mango') => {
    sounds.speakDrawingComplete(fruit, soundEnabled);
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignore
    }
  };

  // NEXT Button Handler
  const handleNext = () => {
    sounds.playPop(soundEnabled);
    if (currentFruit === 'MANGO') {
      // Cycle to Apple or reset Mango
      setCurrentFruit('APPLE');
      sounds.speakDrawingNext('apple', soundEnabled);
    } else {
      setCurrentFruit('MANGO');
      sounds.speakDrawingNext('mango', soundEnabled);
    }
  };

  // Reset Mango Pieces
  const handleResetMango = () => {
    setIsMangoBodyPlaced(false);
    setIsSplash1Placed(false);
    setIsSplash2Placed(false);
    setIsSplash3Placed(false);
    setMangoBodyColor('#ffffff');
    setSplash1Color('#ffffff');
    setSplash2Color('#ffffff');
    setSplash3Color('#ffffff');
    sounds.playPop(soundEnabled);
  };

  return (
    <div
      id="drawing-game-container"
      className="relative w-full h-full select-none overflow-hidden flex flex-col justify-between"
      style={{
        backgroundImage: `url(${drawingBgLandscape})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center center',
      }}
    >
      {/* ================================================================== */}
      {/* 1. TOP HEADER: HOME (Left) and NEXT (Right)                        */}
      {/* Exactly as in zq9.PNG: Yellow background, Red border, BIG BOLD TEXT*/}
      {/* ================================================================== */}
      <header
        id="drawing-top-bar"
        className="w-full flex items-center justify-between px-3 sm:px-6 pt-2 sm:pt-3 h-12 sm:h-14 z-30 shrink-0"
      >
        {/* HOME Button */}
        <motion.button
          id="btn-drawing-home"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sounds.playPop(soundEnabled);
            onHome();
          }}
          className="cursor-pointer px-4 sm:px-7 py-1 sm:py-1.5 rounded-2xl bg-[#ffff00] border-4 border-[#ff0000] shadow-[0_3px_0_#b30000] active:translate-y-0.5 active:shadow-none transition-transform flex items-center justify-center"
        >
          <span
            className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider block"
            style={{
              color: '#d6006c', // Magenta/pinkish-red as in zq9.PNG
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            HOME
          </span>
        </motion.button>

        {/* NEXT Button */}
        <motion.button
          id="btn-drawing-next"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleNext}
          className="cursor-pointer px-4 sm:px-7 py-1 sm:py-1.5 rounded-2xl bg-[#ffff00] border-4 border-[#ff0000] shadow-[0_3px_0_#b30000] active:translate-y-0.5 active:shadow-none transition-transform flex items-center justify-center"
        >
          <span
            className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider block"
            style={{
              color: '#ff0000', // Pure Red as in zq9.PNG
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            NEXT
          </span>
        </motion.button>
      </header>

      {/* ================================================================== */}
      {/* 2. MAIN GAME AREA:                                                 */}
      {/* Left: Outline Image (Made Larger as requested)                     */}
      {/* Right: 3-4 Cutting Images (SAME TO SAME as in zq9.PNG)             */}
      {/* ================================================================== */}
      <main
        id="drawing-main-stage"
        className="w-full flex-1 flex flex-row items-center justify-between px-2 sm:px-6 md:px-10 py-1 max-w-6xl mx-auto min-h-0 z-20 gap-2 sm:gap-6"
      >
        {currentFruit === 'MANGO' ? (
          // ================================================================
          // MANGO GAME SCREEN (Exact visual match with zq9.PNG)
          // ================================================================
          <>
            {/* ------------------------------------------------------------ */}
            {/* LEFT SIDE: MANGO OUTLINE IMAGE (Stem + Leaf + Mango Body)   */}
            {/* Outline is made larger ("thoda sa outline image ko badda kare")*/}
            {/* ------------------------------------------------------------ */}
            <div
              ref={outlineAreaRef}
              id="mango-outline-container"
              className="relative flex-1 h-[68vh] max-h-[460px] min-h-[220px] aspect-square flex items-center justify-center"
            >
              <svg
                viewBox="0 0 500 500"
                className="w-full h-full drop-shadow-md overflow-visible"
              >
                {/* Placed Mango Body Color Fill */}
                {isMangoBodyPlaced && (
                  <path
                    d={MANGO_BODY_OUTLINE_PATH}
                    fill={mangoBodyColor}
                    onClick={() => {
                      setMangoBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}

                {/* Placed Splash 1 around outline */}
                {isSplash1Placed && (
                  <g transform="translate(360, 40) scale(1.1)">
                    <path d={MANGO_SPLASH_1_PATH} fill={splash1Color} />
                  </g>
                )}

                {/* Placed Splash 2 around outline */}
                {isSplash2Placed && (
                  <g transform="translate(350, 160) scale(1.0)">
                    <path d={MANGO_SPLASH_2_PATH} fill={splash2Color} />
                  </g>
                )}

                {/* Placed Splash 3 around outline */}
                {isSplash3Placed && (
                  <g transform="translate(370, 310) scale(1.0)">
                    <path d={MANGO_SPLASH_3_PATH} fill={splash3Color} />
                  </g>
                )}

                {/* Stem Outline: Thick black outline, hollow inside matching zq9.PNG */}
                <path
                  d={MANGO_STEM_OUTLINE_PATH}
                  fill="transparent"
                  stroke="#000000"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Leaf Outline: Thick black outline, hollow inside matching zq9.PNG */}
                <path
                  d={MANGO_LEAF_OUTLINE_PATH}
                  fill="transparent"
                  stroke="#000000"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Mango Body Outline: Thick black outline, hollow inside matching zq9.PNG */}
                <path
                  d={MANGO_BODY_OUTLINE_PATH}
                  fill="transparent"
                  stroke="#000000"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
              </svg>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* RIGHT SIDE: 3-4 CUTTING IMAGES (SAME TO SAME as in zq9.PNG)  */}
            {/* 1. Top Splash Arc                                            */}
            {/* 2. Middle Splash Swoosh                                      */}
            {/* 3. Bottom Splash Swoosh                                      */}
            {/* 4. White Mango Body Silhouette                               */}
            {/* ------------------------------------------------------------ */}
            <div
              id="mango-cutting-container"
              className="relative flex-1 h-[68vh] max-h-[460px] min-h-[220px] aspect-square flex items-center justify-center"
            >
              {/* Reset link if assembled */}
              {isMangoBodyPlaced && (
                <div className="absolute top-0 right-2 z-40">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetMango}
                    className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                  >
                    ↺ फिर से बनाएँ
                  </motion.button>
                </div>
              )}

              {/* Exact relative positioning matching zq9.PNG */}
              <div className="relative w-full h-full">
                {/* 1. Top Splash Cutting Piece */}
                {!isSplash1Placed && (
                  <motion.div
                    id="cutting-splash-1"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleSplash1DragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSplash1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('splash', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '20%',
                      top: '18%',
                      width: '18%',
                      height: '24%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 100 120"
                      className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={MANGO_SPLASH_1_PATH}
                        fill={splash1Color}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Middle Splash Cutting Piece */}
                {!isSplash2Placed && (
                  <motion.div
                    id="cutting-splash-2"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleSplash2DragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSplash2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('splash', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '8%',
                      top: '42%',
                      width: '32%',
                      height: '30%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 160 180"
                      className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={MANGO_SPLASH_2_PATH}
                        fill={splash2Color}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Bottom Splash Cutting Piece */}
                {!isSplash3Placed && (
                  <motion.div
                    id="cutting-splash-3"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleSplash3DragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSplash3Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('splash', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '20%',
                      top: '64%',
                      width: '32%',
                      height: '24%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 170 140"
                      className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={MANGO_SPLASH_3_PATH}
                        fill={splash3Color}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Large White Mango Body Cutting Silhouette */}
                {!isMangoBodyPlaced ? (
                  <motion.div
                    id="cutting-mango-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleMangoBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setMangoBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      right: '0%',
                      top: '12%',
                      width: '74%',
                      height: '82%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="30 135 380 340"
                      className="w-full h-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] overflow-visible"
                    >
                      <path
                        d={MANGO_CUTTING_BODY_PATH}
                        fill={mangoBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center gap-3"
                  >
                    <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                      ⭐ आम सही जगह लग गया! शाबाश! ⭐
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </>
        ) : (
          // ================================================================
          // APPLE GAME SCREEN (Optional Stage 2)
          // ================================================================
          <>
            {/* LEFT: Apple Outline */}
            <div
              ref={outlineAreaRef}
              id="apple-outline-container"
              className="relative flex-1 h-[68vh] max-h-[460px] min-h-[220px] aspect-square flex items-center justify-center"
            >
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-md overflow-visible"
              >
                {isAppleBodyPlaced && (
                  <path
                    d={APPLE_BODY_PATH}
                    fill={appleBodyColor}
                    onClick={() => {
                      setAppleBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}
                {isAppleLeafPlaced && (
                  <path
                    d={APPLE_LEAF_PATH}
                    fill={appleLeafColor}
                    onClick={() => {
                      setAppleLeafColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('leaf', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}
                {/* Stem */}
                <path d={APPLE_STEM_PATH} fill="#000000" />
                {/* Leaf Outline */}
                <path
                  d={APPLE_LEAF_PATH}
                  fill="transparent"
                  stroke="#000000"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Body Outline */}
                <path
                  d={APPLE_BODY_PATH}
                  fill="transparent"
                  stroke="#000000"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* RIGHT: Apple Cutting Images */}
            <div
              id="apple-cutting-container"
              className="relative flex-1 h-[68vh] max-h-[460px] min-h-[220px] aspect-square flex flex-col items-center justify-between py-2"
            >
              {/* Leaf */}
              <div className="w-full h-[36%] flex items-center justify-center relative">
                {!isAppleLeafPlaced ? (
                  <motion.div
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={(e, info) => handleAppleDragEnd('leaf', e, info)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAppleLeafColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('leaf', soundEnabled);
                    }}
                    className="cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ width: '110px', height: '65px' }}
                  >
                    <svg viewBox="195 20 150 110" className="w-full h-full drop-shadow-md">
                      <path
                        d={APPLE_LEAF_PATH}
                        fill={appleLeafColor}
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <div className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full">
                    ✓ पत्ती लग गई
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="w-full h-[62%] flex items-center justify-center relative">
                {!isAppleBodyPlaced ? (
                  <motion.div
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={(e, info) => handleAppleDragEnd('body', e, info)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAppleBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('body', soundEnabled);
                    }}
                    className="cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ width: '160px', height: '160px' }}
                  >
                    <svg viewBox="35 70 330 330" className="w-full h-full drop-shadow-md">
                      <path
                        d={APPLE_BODY_PATH}
                        fill={appleBodyColor}
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <div className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full">
                    ✓ सेब लग गया
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* ================================================================== */}
      {/* 3. BOTTOM ROW: Exactly 6 Color Buttons                              */}
      {/* (RED, GREEN, BLUE, YELLOW, PINK, BLACK)                            */}
      {/* "sare button ke text ko bhi thoda sa bada kare ok"                 */}
      {/* ================================================================== */}
      <footer
        id="drawing-color-buttons-bar"
        className="w-full flex items-center justify-center gap-1.5 xs:gap-2.5 sm:gap-3.5 px-2 sm:px-6 pb-2 sm:pb-3 h-12 sm:h-16 z-30 shrink-0 max-w-5xl mx-auto"
      >
        {COLOR_OPTIONS.map((color) => {
          const isSelected = selectedColor.id === color.id;
          return (
            <motion.button
              key={color.id}
              id={`btn-color-${color.id.toLowerCase()}`}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleSelectColor(color)}
              className={`cursor-pointer flex-1 py-1 sm:py-2 rounded-xl sm:rounded-2xl bg-[#ffff00] border-4 shadow-[0_3px_0_#b38f00] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center ${
                isSelected
                  ? 'ring-4 ring-white shadow-[0_0_14px_rgba(255,255,255,0.95)] scale-105'
                  : 'opacity-95 hover:opacity-100'
              }`}
              style={{
                borderColor: color.borderColor, // Red border, or Cyan border for Yellow as in zq9.PNG
              }}
            >
              <span
                className="text-sm xs:text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider block whitespace-nowrap"
                style={{
                  color: color.textColor,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                {color.name}
              </span>
            </motion.button>
          );
        })}
      </footer>
    </div>
  );
};
