import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

import drawingBgLandscape from '../assets/images/drawing_bg_landscape_1789921391908.jpg';

interface DrawingStageProps {
  onHome: () => void;
  soundEnabled: boolean;
}

// 6 Color Options as specified in z16.PNG
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
    borderColor: '#00c8ff', // Cyan-blue border as in z16.PNG
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

// SVG Paths in coordinate box (0 0 400 400)
// Apple Body Path
const APPLE_BODY_PATH =
  'M 200 115 ' +
  'C 150 72, 60 92, 45 172 ' +
  'C 35 235, 52 315, 112 365 ' +
  'C 152 398, 185 378, 200 362 ' +
  'C 215 378, 248 398, 288 365 ' +
  'C 348 315, 365 235, 355 172 ' +
  'C 340 92, 250 72, 200 115 Z';

// Apple Stem Path (Curved to the top-left)
const APPLE_STEM_PATH =
  'M 194 118 ' +
  'C 190 70, 172 38, 142 22 ' +
  'C 150 20, 160 22, 164 26 ' +
  'C 190 48, 204 78, 206 118 Z';

// Apple Leaf Path (Pointing up-right)
const APPLE_LEAF_PATH =
  'M 205 110 ' +
  'C 220 52, 280 25, 335 38 ' +
  'C 305 85, 250 120, 205 110 Z';

export const DrawingStage: React.FC<DrawingStageProps> = ({ onHome, soundEnabled }) => {
  // Currently active selected color (from the 6 bottom buttons)
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]); // Default RED

  // Colors of cutting pieces (default white as shown in z16.PNG)
  const [bodyColor, setBodyColor] = useState<string>('#ffffff');
  const [leafColor, setLeafColor] = useState<string>('#ffffff');

  // Placement state of the cutting images
  const [isBodyPlaced, setIsBodyPlaced] = useState<boolean>(false);
  const [isLeafPlaced, setIsLeafPlaced] = useState<boolean>(false);

  // Success celebration state
  const [, setIsCompleted] = useState<boolean>(false);

  // References to the outline drop target areas
  const containerRef = useRef<HTMLDivElement>(null);
  const outlineAreaRef = useRef<HTMLDivElement>(null);

  // Shikshika (Teacher) Voice intro when game loads
  useEffect(() => {
    const timer = setTimeout(() => {
      sounds.speakDrawingIntro(soundEnabled);
    }, 600);
    return () => clearTimeout(timer);
  }, [soundEnabled]);

  // Select a color from bottom buttons: Shikshika speaks the color in Hindi
  const handleSelectColor = (color: ColorOption) => {
    setSelectedColor(color);
    sounds.speakDrawingColorSelected(color.id, soundEnabled);
  };

  // Color a cutting piece with the active selected color
  const handleColorPiece = (piece: 'body' | 'leaf') => {
    if (piece === 'body') {
      setBodyColor(selectedColor.hex);
    } else {
      setLeafColor(selectedColor.hex);
    }
    // Teacher voice feedback
    sounds.speakDrawingPieceColored(piece, soundEnabled);
  };

  // Handle Drag End for Cutting Images
  const handleDragEnd = (
    piece: 'body' | 'leaf',
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // If movement is very small, treat as a tap/click to color the piece
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      handleColorPiece(piece);
      return;
    }

    // Check drop target bounds
    if (!outlineAreaRef.current) return;
    const outlineRect = outlineAreaRef.current.getBoundingClientRect();

    // Release coordinates
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Relative position inside the outline box (0 to 1)
    const relX = (dropX - outlineRect.left) / outlineRect.width;
    const relY = (dropY - outlineRect.top) / outlineRect.height;

    // Check target zones adapted for all Android screens:
    // Leaf target is the upper-right section: relX ~ 0.25 to 1.15, relY ~ -0.25 to 0.48
    // Apple body target is the central and lower body section: relX ~ -0.2 to 1.2, relY ~ 0.10 to 1.25
    let isCorrectTarget = false;
    if (piece === 'leaf') {
      isCorrectTarget = relX >= 0.25 && relX <= 1.15 && relY >= -0.25 && relY <= 0.48;
    } else if (piece === 'body') {
      isCorrectTarget = relX >= -0.2 && relX <= 1.2 && relY >= 0.10 && relY <= 1.25;
    }

    if (isCorrectTarget) {
      // Successfully dropped on outline!
      if (piece === 'body') {
        setIsBodyPlaced(true);
        if (isLeafPlaced) {
          triggerVictory();
        } else {
          sounds.speakDrawingPiecePlaced('body', soundEnabled);
        }
      } else if (piece === 'leaf') {
        setIsLeafPlaced(true);
        if (isBodyPlaced) {
          triggerVictory();
        } else {
          sounds.speakDrawingPiecePlaced('leaf', soundEnabled);
        }
      }
    } else {
      // Dropped on wrong place!
      // "aur galat jagah per drop karne per cutting image drop na ho"
      // Shikshika speaks: "ओहो! यह गलत जगह है, आउटलाइन में सही जगह लगाओ!"
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Trigger celebration when both pieces are assembled into the outline
  const triggerVictory = () => {
    setIsCompleted(true);
    sounds.speakDrawingComplete(soundEnabled);
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignore
    }
  };

  // Reset or Next round
  const handleNext = () => {
    sounds.speakDrawingNext(soundEnabled);
    setIsBodyPlaced(false);
    setIsLeafPlaced(false);
    setIsCompleted(false);
    setBodyColor('#ffffff');
    setLeafColor('#ffffff');
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.4 },
      });
    } catch {
      // Ignore
    }
  };

  return (
    <div
      ref={containerRef}
      id="drawing-game-container"
      className="relative w-full h-full select-none overflow-hidden flex flex-col justify-between"
      style={{
        backgroundImage: `url(${drawingBgLandscape})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
      }}
    >
      {/* 1. TOP HEADER BAR: HOME (Left) and NEXT (Right) - Scaled specifically for Android landscape */}
      <div
        id="drawing-top-bar"
        className="w-full flex items-center justify-between px-3 sm:px-6 pt-1.5 sm:pt-2 h-9 sm:h-11 z-30 shrink-0"
      >
        {/* HOME Button: Red border, yellow bg, bold magenta text - sized for mobile */}
        <motion.button
          id="btn-drawing-home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sounds.playPop(soundEnabled);
            onHome();
          }}
          className="cursor-pointer px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-[#ffff00] border-2 sm:border-[3px] border-[#ff0000] shadow-[0_2px_0_#990000] active:translate-y-0.5 active:shadow-none transition-transform"
        >
          <span
            className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider block"
            style={{
              color: '#d6006c',
              textShadow: '1px 1px 0px #ffff00',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            HOME
          </span>
        </motion.button>

        {/* NEXT Button: Red border, yellow bg, bold red text - sized for mobile */}
        <motion.button
          id="btn-drawing-next"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="cursor-pointer px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-[#ffff00] border-2 sm:border-[3px] border-[#ff0000] shadow-[0_2px_0_#990000] active:translate-y-0.5 active:shadow-none transition-transform"
        >
          <span
            className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider block"
            style={{
              color: '#ff0000',
              textShadow: '1px 1px 0px #ffff00',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            NEXT
          </span>
        </motion.button>
      </div>

      {/* 2. MAIN SCENE: Outline Image on Left & Cutting Images on Right - Scaled for Android mobile */}
      <div
        id="drawing-main-scene"
        className="w-full flex-1 flex flex-row items-center justify-center px-3 sm:px-8 py-0.5 max-w-4xl mx-auto min-h-0 z-20 gap-4 sm:gap-10"
      >
        {/* LEFT: Outline Image Container - Sized proportionally for mobile landscape (max-h ~200px) */}
        <div
          ref={outlineAreaRef}
          id="outline-image-container"
          className="relative flex-1 max-h-[175px] xs:max-h-[195px] sm:max-h-[230px] md:max-h-[260px] aspect-square flex items-center justify-center"
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-md overflow-visible"
          >
            {/* Placed Apple Body Cutting Image */}
            {isBodyPlaced && (
              <path
                d={APPLE_BODY_PATH}
                fill={bodyColor}
                onClick={() => handleColorPiece('body')}
                className="cursor-pointer hover:opacity-95 transition-colors duration-150"
              />
            )}

            {/* Placed Apple Leaf Cutting Image */}
            {isLeafPlaced && (
              <path
                d={APPLE_LEAF_PATH}
                fill={leafColor}
                onClick={() => handleColorPiece('leaf')}
                className="cursor-pointer hover:opacity-95 transition-colors duration-150"
              />
            )}

            {/* Stem: Solid Black as in z16.PNG */}
            <path d={APPLE_STEM_PATH} fill="#000000" />

            {/* Outline: Leaf (Thick black outline) */}
            <path
              d={APPLE_LEAF_PATH}
              fill="transparent"
              stroke="#000000"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none"
            />

            {/* Outline: Apple Body (Thick black outline) */}
            <path
              d={APPLE_BODY_PATH}
              fill="transparent"
              stroke="#000000"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none"
            />
          </svg>
        </div>

        {/* RIGHT: Cutting Images Area - Sized proportionally to fit beside outline without overflowing */}
        <div
          id="cutting-images-container"
          className="relative flex-1 max-h-[175px] xs:max-h-[195px] sm:max-h-[230px] md:max-h-[260px] aspect-square flex flex-col items-center justify-between py-1"
        >
          {/* Cutting Image 1: LEAF */}
          <div className="w-full h-[36%] flex items-center justify-center relative">
            {!isLeafPlaced ? (
              <motion.div
                id="cutting-piece-leaf"
                drag
                dragSnapToOrigin={true}
                dragElastic={0.15}
                onDragEnd={(e, info) => handleDragEnd('leaf', e, info)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleColorPiece('leaf')}
                className="cursor-grab active:cursor-grabbing touch-none select-none z-30"
                style={{ width: '85px', height: '48px' }}
                title="Click to color, or drag into outline!"
              >
                <svg
                  viewBox="195 20 150 110"
                  className="w-full h-full drop-shadow-md filter overflow-visible"
                >
                  <path
                    d={APPLE_LEAF_PATH}
                    fill={leafColor}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />
                </svg>
              </motion.div>
            ) : (
              <div className="text-white/80 text-[10px] sm:text-xs font-bold bg-black/40 px-2 py-0.5 rounded-full border border-white/20">
                ✓ Leaf Placed
              </div>
            )}
          </div>

          {/* Cutting Image 2: APPLE BODY */}
          <div className="w-full h-[62%] flex items-center justify-center relative">
            {!isBodyPlaced ? (
              <motion.div
                id="cutting-piece-body"
                drag
                dragSnapToOrigin={true}
                dragElastic={0.15}
                onDragEnd={(e, info) => handleDragEnd('body', e, info)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleColorPiece('body')}
                className="cursor-grab active:cursor-grabbing touch-none select-none z-30"
                style={{ width: '115px', height: '115px' }}
                title="Click to color, or drag into outline!"
              >
                <svg
                  viewBox="35 70 330 330"
                  className="w-full h-full drop-shadow-md filter overflow-visible"
                >
                  <path
                    d={APPLE_BODY_PATH}
                    fill={bodyColor}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />
                </svg>
              </motion.div>
            ) : (
              <div className="text-white/80 text-[10px] sm:text-xs font-bold bg-black/40 px-2 py-0.5 rounded-full border border-white/20">
                ✓ Apple Placed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Exactly 6 Color Buttons (RED, GREEN, BLUE, YELLOW, PINK, BLACK) - Scaled for mobile */}
      <div
        id="drawing-color-buttons-bar"
        className="w-full flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2.5 px-2 sm:px-4 pb-1.5 sm:pb-2.5 h-9 sm:h-11 z-30 shrink-0 max-w-2xl mx-auto"
      >
        {COLOR_OPTIONS.map((color) => {
          const isSelected = selectedColor.id === color.id;
          return (
            <motion.button
              key={color.id}
              id={`btn-color-${color.id.toLowerCase()}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSelectColor(color)}
              className={`cursor-pointer flex-1 max-w-[90px] py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-[#ffff00] border-2 sm:border-[3px] shadow-[0_2px_0_#b38f00] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center ${
                isSelected
                  ? 'ring-2 ring-white shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-105'
                  : 'opacity-95 hover:opacity-100'
              }`}
              style={{
                borderColor: color.borderColor,
              }}
            >
              <span
                className="text-[10px] xs:text-xs sm:text-sm font-black uppercase tracking-wide block whitespace-nowrap"
                style={{
                  color: color.textColor,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {color.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
