import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

import drawingBgLandscape from '../assets/images/drawing_bg_landscape_1789921391908.jpg';

interface DrawingStageProps {
  onHome: () => void;
  soundEnabled: boolean;
}

// Exactly 6 Color Options as requested (RED, GREEN, BLUE, YELLOW, PINK, BLACK)
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
    borderColor: '#00c8ff', // Distinctive cyan border as in zq9
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
// EXACT MANGO GEOMETRY FROM USER'S IMAGE (zq8.png & zq9.PNG)
// ViewBox: 0 0 420 580
// Features from zq8.png:
// 1. Stem: Curves up-left, capped top
// 2. Stem Base Rim: Small horizontal oval where stem joins fruit top
// 3. Leaf: Attached to right side of stem, arching up-right and pointed tip
// 4. Mango Body: Full bulbous fruit curving left, hook at bottom left, rounded base
// ============================================================================

// Mango Fruit Body Path (from zq8.png)
const MANGO_BODY_PATH =
  'M 166 172 ' +
  'C 120 180, 62 232, 48 300 ' +
  'C 32 368, 56 438, 104 496 ' +
  'C 118 514, 134 540, 156 555 ' +
  'C 178 570, 214 570, 244 550 ' +
  'C 305 508, 382 414, 390 310 ' +
  'C 398 214, 305 172, 218 172 ' +
  'Z';

// Mango Stem Outline (from zq8.png)
const MANGO_STEM_PATH =
  'M 158 170 ' +
  'C 148 136, 128 106, 112 86 ' +
  'C 118 78, 130 76, 138 80 ' +
  'C 158 102, 176 134, 184 168 ' +
  'Z';

// Mango Stem Base Rim Oval (exact detail from zq8.png where stem meets fruit top)
const MANGO_STEM_BASE_PATH =
  'M 148 170 ' +
  'C 148 164, 194 164, 194 170 ' +
  'C 194 176, 148 176, 148 170 ' +
  'Z';

// Mango Leaf Outline (from zq8.png)
const MANGO_LEAF_PATH =
  'M 180 125 ' +
  'C 220 62, 300 48, 392 146 ' +
  'C 315 106, 238 116, 184 148 ' +
  'Z';

// ----------------------------------------------------------------------------
// CUTTING IMAGES FROM SCREENSHOT (zq9.PNG):
// Exactly 4 Cutting Images:
// 1. Top Splash Arc
// 2. Middle Splash Swoosh
// 3. Bottom Splash Swoosh
// 4. Mango Fruit Silhouette (zq8 shape) with top notch cutout
// ----------------------------------------------------------------------------

// Mango Fruit Cutting Silhouette with top stem cutout
const MANGO_CUTTING_BODY_PATH =
  'M 166 172 ' +
  'C 120 180, 62 232, 48 300 ' +
  'C 32 368, 56 438, 104 496 ' +
  'C 118 514, 134 540, 156 555 ' +
  'C 178 570, 214 570, 244 550 ' +
  'C 305 508, 382 414, 390 310 ' +
  'C 398 214, 305 172, 218 172 ' +
  'C 208 172, 204 180, 198 183 ' +
  'C 192 180, 188 172, 180 172 ' +
  'C 172 172, 168 172, 166 172 ' +
  'Z';

// Splash 1: Top Arc Splash
const MANGO_SPLASH_1_PATH =
  'M 45 10 C 62 34, 70 62, 66 88 C 58 80, 52 56, 40 30 Z';

// Splash 2: Middle Splash Swoosh
const MANGO_SPLASH_2_PATH =
  'M 12 55 C 50 36, 96 66, 134 140 C 88 106, 48 88, 12 55 Z';

// Splash 3: Bottom Splash Swoosh
const MANGO_SPLASH_3_PATH =
  'M 30 20 C 68 18, 106 50, 144 115 C 100 85, 65 64, 30 20 Z';

// ============================================================================
// APPLE GEOMETRY (Optional stage on Next)
// ============================================================================
const APPLE_BODY_PATH =
  'M 200 115 C 150 72, 60 92, 45 172 C 35 235, 52 315, 112 365 C 152 398, 185 378, 200 362 C 215 378, 248 398, 288 365 C 348 315, 365 235, 355 172 C 340 92, 250 72, 200 115 Z';
const APPLE_STEM_PATH =
  'M 194 118 C 190 70, 172 38, 142 22 C 150 20, 160 22, 164 26 C 190 48, 204 78, 206 118 Z';
const APPLE_LEAF_PATH =
  'M 205 110 C 220 52, 280 25, 335 38 C 305 85, 250 120, 205 110 Z';

export const DrawingStage: React.FC<DrawingStageProps> = ({ onHome, soundEnabled }) => {
  // Starts directly on MANGO as requested
  const [currentFruit, setCurrentFruit] = useState<'MANGO' | 'APPLE'>('MANGO');

  // Currently active selected color
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]); // Default RED

  // ---------------------------------------------------------
  // Mango Cutting Images States (3-4 Cutting Images from zq9)
  // ---------------------------------------------------------
  const [splash1Color, setSplash1Color] = useState<string>('#ffffff');
  const [isSplash1Placed, setIsSplash1Placed] = useState<boolean>(false);

  const [splash2Color, setSplash2Color] = useState<string>('#ffffff');
  const [isSplash2Placed, setIsSplash2Placed] = useState<boolean>(false);

  const [splash3Color, setSplash3Color] = useState<string>('#ffffff');
  const [isSplash3Placed, setIsSplash3Placed] = useState<boolean>(false);

  const [mangoBodyColor, setMangoBodyColor] = useState<string>('#ffffff');
  const [isMangoBodyPlaced, setIsMangoBodyPlaced] = useState<boolean>(false);

  // Apple States
  const [appleBodyColor, setAppleBodyColor] = useState<string>('#ffffff');
  const [appleLeafColor, setAppleLeafColor] = useState<string>('#ffffff');
  const [isAppleBodyPlaced, setIsAppleBodyPlaced] = useState<boolean>(false);
  const [isAppleLeafPlaced, setIsAppleLeafPlaced] = useState<boolean>(false);

  const outlineAreaRef = useRef<HTMLDivElement>(null);

  // Shikshika (Teacher) Voice intro
  useEffect(() => {
    const timer = setTimeout(() => {
      sounds.speakDrawingIntro(soundEnabled, currentFruit === 'MANGO' ? 'mango' : 'apple');
    }, 400);
    return () => clearTimeout(timer);
  }, [soundEnabled, currentFruit]);

  // Color selection
  const handleSelectColor = (color: ColorOption) => {
    setSelectedColor(color);
    sounds.speakDrawingColorSelected(color.id, soundEnabled);

    if (currentFruit === 'MANGO' && !isMangoBodyPlaced) {
      setMangoBodyColor(color.hex);
    }
  };

  // Drop detection
  const checkDroppedInOutline = (dropX: number, dropY: number) => {
    if (!outlineAreaRef.current) return false;
    const rect = outlineAreaRef.current.getBoundingClientRect();
    const relX = (dropX - rect.left) / rect.width;
    const relY = (dropY - rect.top) / rect.height;
    return relX >= -0.3 && relX <= 1.3 && relY >= -0.3 && relY <= 1.3;
  };

  // Drag Handlers
  const handleMangoBodyDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
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

  const handleSplash1DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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

  const handleSplash2DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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

  const handleSplash3DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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

  const handleAppleDragEnd = (
    piece: 'body' | 'leaf',
    _e: MouseEvent | TouchEvent | PointerEvent,
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

  const handleNext = () => {
    sounds.playPop(soundEnabled);
    if (currentFruit === 'MANGO') {
      setCurrentFruit('APPLE');
      sounds.speakDrawingNext('apple', soundEnabled);
    } else {
      setCurrentFruit('MANGO');
      sounds.speakDrawingNext('mango', soundEnabled);
    }
  };

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
      {/* ================================================================== */}
      <header
        id="drawing-top-bar"
        className="w-full flex items-center justify-between px-3 sm:px-6 pt-2 sm:pt-3 h-12 sm:h-14 z-30 shrink-0"
      >
        {/* HOME Button with enlarged text */}
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
              color: '#d6006c',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            HOME
          </span>
        </motion.button>

        {/* NEXT Button with enlarged text */}
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
              color: '#ff0000',
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
      {/* Left: Outline Image (zq8.png - stem, base rim, leaf, fruit)       */}
      {/* Right: 3-4 Cutting Images (zq9.PNG - 3 splashes + mango body)      */}
      {/* ================================================================== */}
      <main
        id="drawing-main-stage"
        className="w-full flex-1 flex flex-row items-center justify-between px-2 sm:px-6 md:px-10 py-1 max-w-6xl mx-auto min-h-0 z-20 gap-2 sm:gap-6"
      >
        {currentFruit === 'MANGO' ? (
          <>
            {/* ------------------------------------------------------------ */}
            {/* LEFT SIDE: EXACT MANGO OUTLINE IMAGE FROM zq8.png           */}
            {/* Made larger as requested ("thoda sa outline image ko badda kare")*/}
            {/* ------------------------------------------------------------ */}
            <div
              ref={outlineAreaRef}
              id="mango-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[420/580] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 420 580"
                className="w-full h-full drop-shadow-md overflow-visible"
              >
                {/* Placed Mango Body Fill */}
                {isMangoBodyPlaced && (
                  <path
                    d={MANGO_BODY_PATH}
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
                  <g transform="translate(340, 60) scale(1.1)">
                    <path d={MANGO_SPLASH_1_PATH} fill={splash1Color} />
                  </g>
                )}

                {/* Placed Splash 2 around outline */}
                {isSplash2Placed && (
                  <g transform="translate(330, 200) scale(1.0)">
                    <path d={MANGO_SPLASH_2_PATH} fill={splash2Color} />
                  </g>
                )}

                {/* Placed Splash 3 around outline */}
                {isSplash3Placed && (
                  <g transform="translate(350, 360) scale(1.0)">
                    <path d={MANGO_SPLASH_3_PATH} fill={splash3Color} />
                  </g>
                )}

                {/* Stem Outline: Exact shape from zq8.png */}
                <path
                  d={MANGO_STEM_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Stem Base Oval Rim: Exact feature from zq8.png */}
                <path
                  d={MANGO_STEM_BASE_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Leaf Outline: Exact shape from zq8.png */}
                <path
                  d={MANGO_LEAF_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Mango Fruit Body Outline: Exact shape from zq8.png */}
                <path
                  d={MANGO_BODY_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
              </svg>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* RIGHT SIDE: 3-4 CUTTING IMAGES AS SHOWN IN zq9.PNG          */}
            {/* 1. Top Splash Arc                                            */}
            {/* 2. Middle Splash Swoosh                                      */}
            {/* 3. Bottom Splash Swoosh                                      */}
            {/* 4. White Mango Body Silhouette (from zq8.png with notch)     */}
            {/* ------------------------------------------------------------ */}
            <div
              id="mango-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[420/580] flex items-center justify-center"
            >
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

              <div className="relative w-full h-full">
                {/* 1. Cutting Image 1: Top Splash Arc */}
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
                      left: '18%',
                      top: '16%',
                      width: '18%',
                      height: '24%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 90 110"
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

                {/* 2. Cutting Image 2: Middle Splash Swoosh */}
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
                      left: '6%',
                      top: '40%',
                      width: '32%',
                      height: '30%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 150 160"
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

                {/* 3. Cutting Image 3: Bottom Splash Swoosh */}
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
                      left: '18%',
                      top: '63%',
                      width: '32%',
                      height: '24%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 160 130"
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

                {/* 4. Cutting Image 4: Mango Fruit Silhouette (zq8 body shape with notch) */}
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
                      viewBox="30 160 380 430"
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
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-square flex items-center justify-center"
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
                <path d={APPLE_STEM_PATH} fill="#000000" />
                <path
                  d={APPLE_LEAF_PATH}
                  fill="transparent"
                  stroke="#000000"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-square flex flex-col items-center justify-between py-2"
            >
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
      {/* All button text made larger as requested                           */}
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
                borderColor: color.borderColor,
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
