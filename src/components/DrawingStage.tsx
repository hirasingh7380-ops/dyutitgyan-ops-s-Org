import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

import drawingBgLandscape from '../assets/images/drawing_bg_landscape_1789921391908.jpg';

interface DrawingStageProps {
  onHome: () => void;
  soundEnabled: boolean;
}

// Exactly 6 Color Options as specified in reference screenshots (zq15.PNG / zq9.PNG)
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
    borderColor: '#00c8ff', // Distinctive cyan border as shown in screenshot
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
// KITE GEOMETRY (Exact from screenshot zq15.PNG) - Coordinate space (0 0 500 650)
// Diamond vertices:
// Top: (250, 60)
// Left: (50, 240)
// Right: (450, 240)
// Bottom Diamond: (250, 420)
// Horizontal curved cross-spar: starts at (50, 240), curves smoothly through
// (250, 210) to (450, 240) with Casteljau control points (150, 210) and (350, 210).
// Central vertical spine: (250, 60) to (250, 420).
// Tail bow (triangle): (250, 420) to (195, 475) to (305, 475).
// Tail string (wavy): curves from (250, 475) down to (250, 640).
// ============================================================================

// 1. Kite Outline Lines (Thick black strokes as in zq15.PNG)
const KITE_PERIMETER_PATH =
  'M 250 60 L 450 240 L 250 420 L 50 240 Z';

const KITE_VERTICAL_SPINE_PATH =
  'M 250 60 L 250 420';

const KITE_CURVED_SPAR_PATH =
  'M 50 240 Q 150 210 250 210 Q 350 210 450 240';

const KITE_TAIL_BOW_PATH =
  'M 250 420 L 195 475 Q 250 485 305 475 Z';

const KITE_TAIL_STRING_PATH =
  'M 250 480 C 230 520, 215 540, 235 570 C 255 600, 245 615, 235 640';

// ----------------------------------------------------------------------------
// The 4 Body Quadrants and 1 Tail Triangle formed by the Kite.
// EXACT SAME PATHS used for both the cutting images and outline filled slots!
// ----------------------------------------------------------------------------
// 1. Top-Left Quad (upper left triangular piece with curved bottom)
const KITE_QUAD_TOP_LEFT_PATH =
  'M 250 60 L 50 240 Q 150 210 250 210 Z';

// 2. Top-Right Quad (upper right triangular piece with curved bottom)
const KITE_QUAD_TOP_RIGHT_PATH =
  'M 250 60 L 450 240 Q 350 210 250 210 Z';

// 3. Bottom-Left Quad (lower left triangular piece with curved top)
const KITE_QUAD_BOTTOM_LEFT_PATH =
  'M 50 240 L 250 420 L 250 210 Q 150 210 50 240 Z';

// 4. Bottom-Right Quad (lower right triangular piece with curved top)
const KITE_QUAD_BOTTOM_RIGHT_PATH =
  'M 450 240 L 250 420 L 250 210 Q 350 210 450 240 Z';

// 5. Small Center Tail Triangle
const KITE_TAIL_TRIANGLE_PATH =
  'M 250 420 L 195 475 Q 250 485 305 475 Z';

// ============================================================================
// MANGO GEOMETRY (Stage 2 - zq8.png & zq9.PNG)
// ============================================================================
const MANGO_BODY_PATH =
  'M 166 172 C 120 180, 62 232, 48 300 C 32 368, 56 438, 104 496 C 118 514, 134 540, 156 555 C 178 570, 214 570, 244 550 C 305 508, 382 414, 390 310 C 398 214, 305 172, 218 172 Z';
const MANGO_STEM_PATH =
  'M 158 170 C 148 136, 128 106, 112 86 C 118 78, 130 76, 138 80 C 158 102, 176 134, 184 168 Z';
const MANGO_STEM_BASE_PATH =
  'M 148 170 C 148 164, 194 164, 194 170 C 194 176, 148 176, 148 170 Z';
const MANGO_LEAF_PATH =
  'M 180 125 C 220 62, 300 48, 392 146 C 315 106, 238 116, 184 148 Z';
const MANGO_CUTTING_BODY_PATH =
  'M 166 172 C 120 180, 62 232, 48 300 C 32 368, 56 438, 104 496 C 118 514, 134 540, 156 555 C 178 570, 214 570, 244 550 C 305 508, 382 414, 390 310 C 398 214, 305 172, 218 172 C 208 172, 204 180, 198 183 C 192 180, 188 172, 180 172 C 172 172, 168 172, 166 172 Z';
const MANGO_SPLASH_1_PATH = 'M 45 10 C 62 34, 70 62, 66 88 C 58 80, 52 56, 40 30 Z';
const MANGO_SPLASH_2_PATH = 'M 12 55 C 50 36, 96 66, 134 140 C 88 106, 48 88, 12 55 Z';
const MANGO_SPLASH_3_PATH = 'M 30 20 C 68 18, 106 50, 144 115 C 100 85, 65 64, 30 20 Z';

type GameStage = 'KITE' | 'MANGO';

export const DrawingStage: React.FC<DrawingStageProps> = ({ onHome, soundEnabled }) => {
  // Current game stage: starts on KITE as requested
  const [currentStage, setCurrentStage] = useState<GameStage>('KITE');

  // Currently active selected color from bottom 6 buttons
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]); // Default RED

  // ---------------------------------------------------------
  // KITE STAGE STATES (zq15.PNG)
  // Exactly 5 Cutting Pieces:
  // 1. Top-Left Quad
  // 2. Top-Right Quad
  // 3. Bottom-Left Quad
  // 4. Bottom-Right Quad
  // 5. Small Center Tail Triangle
  // ---------------------------------------------------------
  const [kiteTLColor, setKiteTLColor] = useState<string>('#ffffff');
  const [isKiteTLPlaced, setIsKiteTLPlaced] = useState<boolean>(false);

  const [kiteTRColor, setKiteTRColor] = useState<string>('#ffffff');
  const [isKiteTRPlaced, setIsKiteTRPlaced] = useState<boolean>(false);

  const [kiteBLColor, setKiteBLColor] = useState<string>('#ffffff');
  const [isKiteBLPlaced, setIsKiteBLPlaced] = useState<boolean>(false);

  const [kiteBRColor, setKiteBRColor] = useState<string>('#ffffff');
  const [isKiteBRPlaced, setIsKiteBRPlaced] = useState<boolean>(false);

  const [kiteTailColor, setKiteTailColor] = useState<string>('#ffffff');
  const [isKiteTailPlaced, setIsKiteTailPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // MANGO STAGE STATES (zq8.png & zq9.PNG)
  // ---------------------------------------------------------
  const [splash1Color, setSplash1Color] = useState<string>('#ffffff');
  const [isSplash1Placed, setIsSplash1Placed] = useState<boolean>(false);
  const [splash2Color, setSplash2Color] = useState<string>('#ffffff');
  const [isSplash2Placed, setIsSplash2Placed] = useState<boolean>(false);
  const [splash3Color, setSplash3Color] = useState<string>('#ffffff');
  const [isSplash3Placed, setIsSplash3Placed] = useState<boolean>(false);
  const [mangoBodyColor, setMangoBodyColor] = useState<string>('#ffffff');
  const [isMangoBodyPlaced, setIsMangoBodyPlaced] = useState<boolean>(false);

  const outlineAreaRef = useRef<HTMLDivElement>(null);

  // Shikshika (Teacher) Voice intro
  useEffect(() => {
    const timer = setTimeout(() => {
      sounds.speakDrawingIntro(soundEnabled, currentStage === 'KITE' ? 'kite' : 'mango');
    }, 400);
    return () => clearTimeout(timer);
  }, [soundEnabled, currentStage]);

  // Color selection from bottom buttons
  const handleSelectColor = (color: ColorOption) => {
    setSelectedColor(color);
    sounds.speakDrawingColorSelected(color.id, soundEnabled);
  };

  // Drop detection: Checks if dropped anywhere in the left outline area
  const checkDroppedInOutline = (dropX: number, dropY: number) => {
    if (!outlineAreaRef.current) return false;
    const rect = outlineAreaRef.current.getBoundingClientRect();
    const relX = (dropX - rect.left) / rect.width;
    const relY = (dropY - rect.top) / rect.height;
    return relX >= -0.2 && relX <= 1.2 && relY >= -0.2 && relY <= 1.2;
  };

  // Check if entire Kite is assembled
  const checkKiteVictory = (
    nextTL: boolean,
    nextTR: boolean,
    nextBL: boolean,
    nextBR: boolean,
    nextTail: boolean
  ) => {
    if (nextTL && nextTR && nextBL && nextBR && nextTail) {
      triggerVictory('kite');
    }
  };

  // Drag handlers for the 5 Kite Pieces (zq15.PNG)
  const handleKiteTLDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setKiteTLColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsKiteTLPlaced(true);
      sounds.speakDrawingPiecePlaced('kite_quad', soundEnabled);
      checkKiteVictory(true, isKiteTRPlaced, isKiteBLPlaced, isKiteBRPlaced, isKiteTailPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleKiteTRDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setKiteTRColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsKiteTRPlaced(true);
      sounds.speakDrawingPiecePlaced('kite_quad', soundEnabled);
      checkKiteVictory(isKiteTLPlaced, true, isKiteBLPlaced, isKiteBRPlaced, isKiteTailPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleKiteBLDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setKiteBLColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsKiteBLPlaced(true);
      sounds.speakDrawingPiecePlaced('kite_quad', soundEnabled);
      checkKiteVictory(isKiteTLPlaced, isKiteTRPlaced, true, isKiteBRPlaced, isKiteTailPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleKiteBRDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setKiteBRColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsKiteBRPlaced(true);
      sounds.speakDrawingPiecePlaced('kite_quad', soundEnabled);
      checkKiteVictory(isKiteTLPlaced, isKiteTRPlaced, isKiteBLPlaced, true, isKiteTailPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleKiteTailDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setKiteTailColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('kite_tail', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsKiteTailPlaced(true);
      sounds.speakDrawingPiecePlaced('kite_tail', soundEnabled);
      checkKiteVictory(isKiteTLPlaced, isKiteTRPlaced, isKiteBLPlaced, isKiteBRPlaced, true);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Mango drag handlers
  const handleMangoBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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

  // Celebration
  const triggerVictory = (stage: 'kite' | 'mango') => {
    sounds.speakDrawingComplete(stage, soundEnabled);
    try {
      confetti({
        particleCount: 85,
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
    if (currentStage === 'KITE') {
      setCurrentStage('MANGO');
      sounds.speakDrawingNext('mango', soundEnabled);
    } else {
      setCurrentStage('KITE');
      sounds.speakDrawingNext('kite', soundEnabled);
    }
  };

  // Reset Kite Pieces
  const handleResetKite = () => {
    setIsKiteTLPlaced(false);
    setIsKiteTRPlaced(false);
    setIsKiteBLPlaced(false);
    setIsKiteBRPlaced(false);
    setIsKiteTailPlaced(false);
    setKiteTLColor('#ffffff');
    setKiteTRColor('#ffffff');
    setKiteBLColor('#ffffff');
    setKiteBRColor('#ffffff');
    setKiteTailColor('#ffffff');
    sounds.playPop(soundEnabled);
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

  const isKiteAllPlaced =
    isKiteTLPlaced && isKiteTRPlaced && isKiteBLPlaced && isKiteBRPlaced && isKiteTailPlaced;

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
              color: '#d6006c',
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
      {/* Left: Outline Image (zq15.PNG)                                     */}
      {/* Right: Cutting Image (zq15.PNG) - SAME TO SAME                     */}
      {/* Both use identical aspect ratio and viewBox (0 0 500 650)          */}
      {/* ================================================================== */}
      <main
        id="drawing-main-stage"
        className="w-full flex-1 flex flex-row items-center justify-between px-2 sm:px-6 md:px-10 py-1 max-w-6xl mx-auto min-h-0 z-20 gap-2 sm:gap-6"
      >
        {currentStage === 'KITE' ? (
          // ================================================================
          // KITE GAME SCREEN (zq15.PNG) - EXACT OUTLINE & CUTTING IMAGE
          // ================================================================
          <>
            {/* ------------------------------------------------------------ */}
            {/* LEFT SIDE: KITE OUTLINE IMAGE                                */}
            {/* ------------------------------------------------------------ */}
            <div
              ref={outlineAreaRef}
              id="kite-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[500/650] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 500 650"
                className="w-full h-full drop-shadow-md overflow-visible"
              >
                {/* Placed Pieces: perfectly fill the exact slot with no overflow or size distortion */}
                {isKiteTLPlaced && (
                  <path
                    d={KITE_QUAD_TOP_LEFT_PATH}
                    fill={kiteTLColor}
                    onClick={() => {
                      setKiteTLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}
                {isKiteTRPlaced && (
                  <path
                    d={KITE_QUAD_TOP_RIGHT_PATH}
                    fill={kiteTRColor}
                    onClick={() => {
                      setKiteTRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}
                {isKiteBLPlaced && (
                  <path
                    d={KITE_QUAD_BOTTOM_LEFT_PATH}
                    fill={kiteBLColor}
                    onClick={() => {
                      setKiteBLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}
                {isKiteBRPlaced && (
                  <path
                    d={KITE_QUAD_BOTTOM_RIGHT_PATH}
                    fill={kiteBRColor}
                    onClick={() => {
                      setKiteBRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}
                {isKiteTailPlaced && (
                  <path
                    d={KITE_TAIL_BOW_PATH}
                    fill={kiteTailColor}
                    onClick={() => {
                      setKiteTailColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_tail', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}

                {/* 1. Outer Diamond Perimeter Outline (Thick Black) */}
                <path
                  d={KITE_PERIMETER_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* 2. Curved Horizontal Cross Spar */}
                <path
                  d={KITE_CURVED_SPAR_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* 3. Central Vertical Spine (Straight line) */}
                <path
                  d={KITE_VERTICAL_SPINE_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* 4. Tail Triangle Bow (attached under bottom tip) */}
                <path
                  d={KITE_TAIL_BOW_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* 5. Wavy Tail String (trailing downward) */}
                <path
                  d={KITE_TAIL_STRING_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
              </svg>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* RIGHT SIDE: KITE CUTTING IMAGES (zq15.PNG)                   */}
            {/* Rendered at 1:1 Scale with identical coordinates!            */}
            {/* ------------------------------------------------------------ */}
            <div
              id="kite-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[500/650] flex items-center justify-center"
            >
              {isKiteAllPlaced && (
                <div className="absolute top-0 right-2 z-40">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetKite}
                    className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                  >
                    ↺ फिर से बनाएँ
                  </motion.button>
                </div>
              )}

              {/* Exact relative positioning: Each cutting piece shares the exact viewBox (0 0 500 650) */}
              <div className="relative w-full h-full">
                {/* 1. Top-Left Quad Cutting Piece (Offset up-left matching zq15.PNG) */}
                {!isKiteTLPlaced && (
                  <motion.div
                    id="cutting-kite-tl"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleKiteTLDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setKiteTLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 500 650"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <g transform="translate(-40, -28)">
                        <path
                          d={KITE_QUAD_TOP_LEFT_PATH}
                          fill={kiteTLColor}
                          stroke="#e2e8f0"
                          strokeWidth="1.2"
                        />
                      </g>
                    </svg>
                  </motion.div>
                )}

                {/* 2. Top-Right Quad Cutting Piece (Offset up-right matching zq15.PNG) */}
                {!isKiteTRPlaced && (
                  <motion.div
                    id="cutting-kite-tr"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleKiteTRDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setKiteTRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 500 650"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <g transform="translate(40, -28)">
                        <path
                          d={KITE_QUAD_TOP_RIGHT_PATH}
                          fill={kiteTRColor}
                          stroke="#e2e8f0"
                          strokeWidth="1.2"
                        />
                      </g>
                    </svg>
                  </motion.div>
                )}

                {/* 3. Small Center Tail Triangle Cutting Piece (In center gap matching zq15.PNG) */}
                {!isKiteTailPlaced && (
                  <motion.div
                    id="cutting-kite-tail"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleKiteTailDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setKiteTailColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_tail', soundEnabled);
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 500 650"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <g transform="translate(0, -165)">
                        <path
                          d={KITE_TAIL_TRIANGLE_PATH}
                          fill={kiteTailColor}
                          stroke="#e2e8f0"
                          strokeWidth="1.2"
                        />
                      </g>
                    </svg>
                  </motion.div>
                )}

                {/* 4. Bottom-Left Quad Cutting Piece (Offset down-left matching zq15.PNG) */}
                {!isKiteBLPlaced && (
                  <motion.div
                    id="cutting-kite-bl"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleKiteBLDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setKiteBLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 500 650"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <g transform="translate(-40, 40)">
                        <path
                          d={KITE_QUAD_BOTTOM_LEFT_PATH}
                          fill={kiteBLColor}
                          stroke="#e2e8f0"
                          strokeWidth="1.2"
                        />
                      </g>
                    </svg>
                  </motion.div>
                )}

                {/* 5. Bottom-Right Quad Cutting Piece (Offset down-right matching zq15.PNG) */}
                {!isKiteBRPlaced && (
                  <motion.div
                    id="cutting-kite-br"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleKiteBRDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setKiteBRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('kite_quad', soundEnabled);
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="0 0 500 650"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <g transform="translate(40, 40)">
                        <path
                          d={KITE_QUAD_BOTTOM_RIGHT_PATH}
                          fill={kiteBRColor}
                          stroke="#e2e8f0"
                          strokeWidth="1.2"
                        />
                      </g>
                    </svg>
                  </motion.div>
                )}

                {/* Victory Banner when completely assembled */}
                {isKiteAllPlaced && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center gap-3"
                  >
                    <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                      ⭐ पतंग सही जगह लग गई! शाबाश! ⭐
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </>
        ) : (
          // ================================================================
          // MANGO GAME SCREEN (zq8.png & zq9.PNG)
          // ================================================================
          <>
            {/* LEFT: Mango Outline */}
            <div
              ref={outlineAreaRef}
              id="mango-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[420/580] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 420 580"
                className="w-full h-full drop-shadow-md overflow-visible"
              >
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
                {isSplash1Placed && (
                  <g transform="translate(340, 60) scale(1.1)">
                    <path d={MANGO_SPLASH_1_PATH} fill={splash1Color} />
                  </g>
                )}
                {isSplash2Placed && (
                  <g transform="translate(330, 200) scale(1.0)">
                    <path d={MANGO_SPLASH_2_PATH} fill={splash2Color} />
                  </g>
                )}
                {isSplash3Placed && (
                  <g transform="translate(350, 360) scale(1.0)">
                    <path d={MANGO_SPLASH_3_PATH} fill={splash3Color} />
                  </g>
                )}
                <path
                  d={MANGO_STEM_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={MANGO_STEM_BASE_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={MANGO_LEAF_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={MANGO_BODY_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* RIGHT: Mango Cutting */}
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
                {!isSplash1Placed && (
                  <motion.div
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
                    style={{ left: '18%', top: '16%', width: '18%', height: '24%' }}
                  >
                    <svg viewBox="0 0 90 110" className="w-full h-full drop-shadow-md">
                      <path d={MANGO_SPLASH_1_PATH} fill={splash1Color} stroke="#e2e8f0" strokeWidth="1" />
                    </svg>
                  </motion.div>
                )}
                {!isSplash2Placed && (
                  <motion.div
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
                    style={{ left: '6%', top: '40%', width: '32%', height: '30%' }}
                  >
                    <svg viewBox="0 0 150 160" className="w-full h-full drop-shadow-md">
                      <path d={MANGO_SPLASH_2_PATH} fill={splash2Color} stroke="#e2e8f0" strokeWidth="1" />
                    </svg>
                  </motion.div>
                )}
                {!isSplash3Placed && (
                  <motion.div
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
                    style={{ left: '18%', top: '63%', width: '32%', height: '24%' }}
                  >
                    <svg viewBox="0 0 160 130" className="w-full h-full drop-shadow-md">
                      <path d={MANGO_SPLASH_3_PATH} fill={splash3Color} stroke="#e2e8f0" strokeWidth="1" />
                    </svg>
                  </motion.div>
                )}
                {!isMangoBodyPlaced ? (
                  <motion.div
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
                    style={{ right: '0%', top: '12%', width: '74%', height: '82%' }}
                  >
                    <svg viewBox="30 160 380 430" className="w-full h-full drop-shadow-md">
                      <path d={MANGO_CUTTING_BODY_PATH} fill={mangoBodyColor} stroke="#e2e8f0" strokeWidth="1.2" />
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
        )}
      </main>

      {/* ================================================================== */}
      {/* 3. BOTTOM ROW: Exactly 6 Color Buttons                              */}
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
