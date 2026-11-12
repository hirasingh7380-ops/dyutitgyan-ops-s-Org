import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

import drawingBgLandscape from '../assets/images/drawing_bg_landscape_1789921391908.jpg';
import brinjalOutlineImg from '../assets/images/brinjal_outline.png';
import jugOutlineImg from '../assets/images/jug_outline.png';
import butterflyOutlineImg from '../assets/images/butterfly_outline.png';
import ballOutlineImg from '../assets/images/ball_outline.png';
import hatOutlineImg from '../assets/images/hat_outline.png';
import umbrellaOutlineImg from '../assets/images/umbrella_outline.png';
import flowerOutlineImg from '../assets/images/flower_outline.png';
import duckOutlineImg from '../assets/images/duck_outline.png';
import {
  DUCK_BEAK_VIEWBOX,
  DUCK_BEAK_PATH,
  DUCK_WING_VIEWBOX,
  DUCK_WING_PATH,
  DUCK_LEFT_FOOT_VIEWBOX,
  DUCK_LEFT_FOOT_PATH,
  DUCK_RIGHT_FOOT_VIEWBOX,
  DUCK_RIGHT_FOOT_PATH,
  DUCK_BODY_VIEWBOX,
  DUCK_BODY_PATH,
  DUCK_PLACED_BEAK_PATH,
  DUCK_PLACED_WING_PATH,
  DUCK_PLACED_LEFT_FOOT_PATH,
  DUCK_PLACED_RIGHT_FOOT_PATH,
  DUCK_PLACED_BODY_PATH,
} from './duck_constants';
import {
  FLOWER_CENTER_VIEWBOX,
  FLOWER_CENTER_PATH,
  FLOWER_PETAL_TOP_VIEWBOX,
  FLOWER_PETAL_TOP_PATH,
  FLOWER_PETAL_TOP_RIGHT_VIEWBOX,
  FLOWER_PETAL_TOP_RIGHT_PATH,
  FLOWER_PETAL_BOTTOM_RIGHT_VIEWBOX,
  FLOWER_PETAL_BOTTOM_RIGHT_PATH,
  FLOWER_PETAL_BOTTOM_VIEWBOX,
  FLOWER_PETAL_BOTTOM_PATH,
  FLOWER_PETAL_BOTTOM_LEFT_VIEWBOX,
  FLOWER_PETAL_BOTTOM_LEFT_PATH,
  FLOWER_PETAL_TOP_LEFT_VIEWBOX,
  FLOWER_PETAL_TOP_LEFT_PATH,
  FLOWER_PLACED_CENTER_PATH,
  FLOWER_PLACED_PETAL_TOP_PATH,
  FLOWER_PLACED_PETAL_TOP_RIGHT_PATH,
  FLOWER_PLACED_PETAL_BOTTOM_RIGHT_PATH,
  FLOWER_PLACED_PETAL_BOTTOM_PATH,
  FLOWER_PLACED_PETAL_BOTTOM_LEFT_PATH,
  FLOWER_PLACED_PETAL_TOP_LEFT_PATH,
} from './flower_constants';
import {
  UMBRELLA_CANOPY_LEFT_VIEWBOX,
  UMBRELLA_CANOPY_LEFT_PATH,
  UMBRELLA_CANOPY_MID_VIEWBOX,
  UMBRELLA_CANOPY_MID_PATH,
  UMBRELLA_CANOPY_RIGHT_VIEWBOX,
  UMBRELLA_CANOPY_RIGHT_PATH,
  UMBRELLA_HANDLE_VIEWBOX,
  UMBRELLA_HANDLE_PATH,
  UMBRELLA_PLACED_CANOPY_LEFT_PATH,
  UMBRELLA_PLACED_CANOPY_MID_PATH,
  UMBRELLA_PLACED_CANOPY_RIGHT_PATH,
  UMBRELLA_PLACED_HANDLE_PATH,
} from './umbrella_constants';
import {
  HAT_CROWN_VIEWBOX,
  HAT_CROWN_PATH,
  HAT_BAND_VIEWBOX,
  HAT_BAND_PATH,
  HAT_BRIM_VIEWBOX,
  HAT_BRIM_PATH,
  HAT_PLACED_CROWN_PATH,
  HAT_PLACED_BAND_PATH,
  HAT_PLACED_BRIM_PATH,
} from './hat_constants';
import {
  BALL_CAP_VIEWBOX,
  BALL_CAP_PATH,
  BALL_TOP_MID_VIEWBOX,
  BALL_TOP_MID_PATH,
  BALL_TOP_RIGHT_VIEWBOX,
  BALL_TOP_RIGHT_PATH,
  BALL_TOP_LEFT_VIEWBOX,
  BALL_TOP_LEFT_PATH,
  BALL_BOTTOM_LEFT_VIEWBOX,
  BALL_BOTTOM_LEFT_PATH,
  BALL_BOTTOM_CENTER_VIEWBOX,
  BALL_BOTTOM_CENTER_PATH,
  BALL_BOTTOM_RIGHT_VIEWBOX,
  BALL_BOTTOM_RIGHT_PATH,
} from './ball_constants';
import {
  JUG_RIM_VIEWBOX,
  JUG_RIM_PATH,
  JUG_BASE_VIEWBOX,
  JUG_BASE_PATH,
  JUG_HANDLE_VIEWBOX,
  JUG_HANDLE_PATH,
  JUG_BODY_VIEWBOX,
  JUG_BODY_PATH,
  JUG_PLACED_RIM_PATH,
  JUG_PLACED_HANDLE_PATH,
  JUG_PLACED_BODY_PATH,
  JUG_PLACED_BASE_PATH,
} from './jug_constants';
import {
  BUTTERFLY_BODY_VIEWBOX,
  BUTTERFLY_BODY_PATH,
  BUTTERFLY_WING_TL_VIEWBOX,
  BUTTERFLY_WING_TL_PATH,
  BUTTERFLY_WING_BL_VIEWBOX,
  BUTTERFLY_WING_BL_PATH,
  BUTTERFLY_WING_TR_VIEWBOX,
  BUTTERFLY_WING_TR_PATH,
  BUTTERFLY_WING_BR_VIEWBOX,
  BUTTERFLY_WING_BR_PATH,
} from './butterfly_constants';

interface DrawingStageProps {
  onHome: () => void;
  soundEnabled: boolean;
}

// Exactly 6 Color Options as specified in reference screenshots (zq15.PNG / zq9.PNG / z25_2031642b.PNG)
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
// 1. CAPSICUM (SHIMLA MIRCH) GEOMETRY (Stage 1 - z33.PNG) - Coordinate space (0 0 533 606)
// ============================================================================
const CAPSICUM_BODY_PATH =
  'M 178 199 L 205 201 L 237 211 L 247 210 L 269 203 L 291 203 L 310 213 L 318 221 L 326 235 L 331 259 L 331 287 L 327 315 L 308 392 L 300 437 L 292 458 L 280 478 L 269 488 L 247 499 L 233 502 L 207 501 L 194 497 L 176 486 L 166 476 L 152 451 L 144 414 L 142 390 L 130 316 L 128 261 L 133 239 L 144 220 L 161 205 L 169 201 L 177 200 Z';
const CAPSICUM_BODY_VIEWBOX = '128 199 204 304';

const CAPSICUM_LEFT_LOBE_PATH =
  'M 103 174 L 125 175 L 143 180 L 155 186 L 168 196 L 167 201 L 153 208 L 137 226 L 129 245 L 125 268 L 126 302 L 135 352 L 144 429 L 151 455 L 163 474 L 163 478 L 149 478 L 135 474 L 123 468 L 109 457 L 99 444 L 90 427 L 75 375 L 68 327 L 56 276 L 54 221 L 60 203 L 72 188 L 88 178 L 102 175 Z';
const CAPSICUM_LEFT_LOBE_VIEWBOX = '54 174 115 305';

const CAPSICUM_RIGHT_LOBE_PATH =
  'M 334 185 L 363 186 L 377 190 L 391 199 L 405 216 L 410 227 L 413 243 L 411 277 L 388 353 L 380 389 L 366 431 L 351 455 L 333 471 L 318 478 L 302 482 L 286 482 L 282 480 L 297 453 L 302 438 L 310 392 L 330 312 L 333 284 L 333 258 L 329 237 L 316 216 L 300 205 L 299 201 L 321 188 L 333 186 Z';
const CAPSICUM_RIGHT_LOBE_VIEWBOX = '282 185 132 298';

const CAPSICUM_STEM_PATH =
  'M 300 75 L 318 75 L 323 78 L 327 85 L 325 98 L 320 103 L 299 101 L 282 109 L 267 127 L 261 141 L 257 160 L 256 178 L 259 187 L 283 196 L 284 201 L 263 202 L 247 208 L 229 208 L 204 199 L 184 197 L 184 194 L 206 186 L 215 178 L 221 166 L 231 128 L 243 107 L 258 93 L 271 85 L 287 78 L 299 76 Z';
const CAPSICUM_STEM_VIEWBOX = '184 75 144 134';

const CAPSICUM_TOP_LEFT_PATH =
  'M 141 151 L 159 151 L 179 159 L 194 174 L 199 182 L 199 187 L 187 190 L 175 196 L 170 196 L 160 187 L 143 178 L 130 174 L 103 173 L 103 167 L 112 161 L 135 152 L 140 152 Z';
const CAPSICUM_TOP_LEFT_VIEWBOX = '103 151 97 46';

const CAPSICUM_TOP_RIGHT_PATH =
  'M 309 157 L 332 157 L 347 161 L 365 171 L 374 180 L 376 187 L 372 188 L 357 183 L 336 183 L 314 189 L 297 201 L 293 201 L 287 196 L 269 189 L 268 185 L 288 166 L 304 158 L 308 158 Z';
const CAPSICUM_TOP_RIGHT_VIEWBOX = '268 157 109 45';

// ============================================================================
// 2. BRINJAL / BAINGAN GEOMETRY (Stage 2 - z25_2031642b.PNG) - Coordinate space (0 0 533 606)
// ============================================================================
const BRINJAL_CALYX_VIEWBOX = '225 37 185 164';
const BRINJAL_PLACED_CALYX_PATH =
  'M 392 37 L 399 37 L 406 40 L 409 43 L 409 46 L 390 67 L 381 80 L 374 92 L 371 100 L 371 106 L 369 108 L 377 116 L 385 131 L 387 146 L 386 176 L 393 197 L 389 199 L 375 187 L 368 175 L 365 158 L 363 167 L 355 183 L 340 200 L 337 198 L 335 176 L 329 154 L 329 126 L 315 140 L 298 152 L 278 159 L 265 160 L 262 156 L 271 148 L 290 117 L 288 116 L 281 120 L 269 123 L 247 124 L 238 122 L 230 118 L 225 113 L 227 108 L 231 110 L 243 110 L 258 105 L 276 92 L 298 82 L 315 81 L 341 88 L 351 82 L 391 38 Z';

const BRINJAL_BODY_VIEWBOX = '41 121 331 364';
const BRINJAL_PLACED_BODY_PATH =
  'M 280 121 L 282 121 L 284 125 L 271 145 L 262 154 L 256 157 L 258 160 L 288 158 L 303 151 L 325 134 L 327 136 L 329 159 L 335 183 L 335 202 L 340 202 L 351 192 L 363 172 L 370 181 L 371 189 L 347 263 L 316 339 L 293 383 L 260 427 L 226 458 L 200 473 L 180 480 L 158 484 L 142 484 L 119 480 L 87 465 L 65 445 L 57 434 L 45 407 L 41 385 L 41 364 L 44 346 L 52 324 L 62 305 L 79 283 L 111 255 L 140 236 L 186 200 L 253 128 L 279 122 Z';

// ============================================================================
// 3. KITE GEOMETRY (Stage 3 - zq15.PNG) - Coordinate space (0 0 500 650)
// ============================================================================
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

const KITE_QUAD_TOP_LEFT_PATH =
  'M 250 60 L 50 240 Q 150 210 250 210 Z';

const KITE_QUAD_TOP_RIGHT_PATH =
  'M 250 60 L 450 240 Q 350 210 250 210 Z';

const KITE_QUAD_BOTTOM_LEFT_PATH =
  'M 50 240 L 250 420 L 250 210 Q 150 210 50 240 Z';

const KITE_QUAD_BOTTOM_RIGHT_PATH =
  'M 450 240 L 250 420 L 250 210 Q 350 210 450 240 Z';

const KITE_TAIL_TRIANGLE_PATH =
  'M 250 420 L 195 475 Q 250 485 305 475 Z';

// ============================================================================
// 4. MANGO GEOMETRY (Stage 4 - zq8.png & zq9.PNG) - Coordinate space (0 0 420 580)
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

const MANGO_SPLASH_1_PATH =
  'M 45 10 C 62 34, 70 62, 66 88 C 58 80, 52 56, 40 30 Z';

const MANGO_SPLASH_2_PATH =
  'M 12 55 C 50 36, 96 66, 134 140 C 88 106, 48 88, 12 55 Z';

const MANGO_SPLASH_3_PATH =
  'M 30 20 C 68 18, 106 50, 144 115 C 100 85, 65 64, 30 20 Z';

// ============================================================================
// 5. APPLE GEOMETRY (Stage 5 - Apple Screen) - Coordinate space (0 0 400 400)
// ============================================================================
const APPLE_BODY_PATH =
  'M 200 115 C 150 72, 60 92, 45 172 C 35 235, 52 315, 112 365 C 152 398, 185 378, 200 362 C 215 378, 248 398, 288 365 C 348 315, 365 235, 355 172 C 340 92, 250 72, 200 115 Z';

const APPLE_STEM_PATH =
  'M 194 118 C 190 70, 172 38, 142 22 C 150 20, 160 22, 164 26 C 190 48, 204 78, 206 118 Z';

const APPLE_LEAF_PATH =
  'M 205 110 C 220 52, 280 25, 335 38 C 305 85, 250 120, 205 110 Z';

type GameStage = 'DUCK' | 'FLOWER' | 'UMBRELLA' | 'HAT' | 'BALL' | 'BUTTERFLY' | 'JUG' | 'CAPSICUM' | 'BRINJAL' | 'KITE' | 'MANGO' | 'APPLE';

export const DrawingStage: React.FC<DrawingStageProps> = ({ onHome, soundEnabled }) => {
  // Current game stage: starts on DUCK (user attachment 32_Free_Toddler_Coloring_Pages___Print_and_Color-removebg-preview_09847147.png)
  const [currentStage, setCurrentStage] = useState<GameStage>('DUCK');

  // Currently active selected color from bottom 6 buttons
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]); // Default RED

  // ---------------------------------------------------------
  // DUCK STAGE STATES (32_Free_Toddler_Coloring_Pages___Print_and_Color-removebg-preview_09847147.png)
  // ---------------------------------------------------------
  const [duckBodyColor, setDuckBodyColor] = useState<string>('#ffffff');
  const [isDuckBodyPlaced, setIsDuckBodyPlaced] = useState<boolean>(false);

  const [duckWingColor, setDuckWingColor] = useState<string>('#ffffff');
  const [isDuckWingPlaced, setIsDuckWingPlaced] = useState<boolean>(false);

  const [duckBeakColor, setDuckBeakColor] = useState<string>('#ffffff');
  const [isDuckBeakPlaced, setIsDuckBeakPlaced] = useState<boolean>(false);

  const [duckFootLeftColor, setDuckFootLeftColor] = useState<string>('#ffffff');
  const [isDuckFootLeftPlaced, setIsDuckFootLeftPlaced] = useState<boolean>(false);

  const [duckFootRightColor, setDuckFootRightColor] = useState<string>('#ffffff');
  const [isDuckFootRightPlaced, setIsDuckFootRightPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // FLOWER STAGE STATES (Inkeddownload__16__LI_82357b29.jpg)
  // ---------------------------------------------------------
  const [flowerCenterColor, setFlowerCenterColor] = useState<string>('#ffffff');
  const [isFlowerCenterPlaced, setIsFlowerCenterPlaced] = useState<boolean>(false);

  const [flowerPetalTopColor, setFlowerPetalTopColor] = useState<string>('#ffffff');
  const [isFlowerPetalTopPlaced, setIsFlowerPetalTopPlaced] = useState<boolean>(false);

  const [flowerPetalTopRightColor, setFlowerPetalTopRightColor] = useState<string>('#ffffff');
  const [isFlowerPetalTopRightPlaced, setIsFlowerPetalTopRightPlaced] = useState<boolean>(false);

  const [flowerPetalBottomRightColor, setFlowerPetalBottomRightColor] = useState<string>('#ffffff');
  const [isFlowerPetalBottomRightPlaced, setIsFlowerPetalBottomRightPlaced] = useState<boolean>(false);

  const [flowerPetalBottomColor, setFlowerPetalBottomColor] = useState<string>('#ffffff');
  const [isFlowerPetalBottomPlaced, setIsFlowerPetalBottomPlaced] = useState<boolean>(false);

  const [flowerPetalBottomLeftColor, setFlowerPetalBottomLeftColor] = useState<string>('#ffffff');
  const [isFlowerPetalBottomLeftPlaced, setIsFlowerPetalBottomLeftPlaced] = useState<boolean>(false);

  const [flowerPetalTopLeftColor, setFlowerPetalTopLeftColor] = useState<string>('#ffffff');
  const [isFlowerPetalTopLeftPlaced, setIsFlowerPetalTopLeftPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // UMBRELLA STAGE STATES (z67_a60b946b.PNG)
  // ---------------------------------------------------------
  const [umbrellaCanopyLeftColor, setUmbrellaCanopyLeftColor] = useState<string>('#ffffff');
  const [isUmbrellaCanopyLeftPlaced, setIsUmbrellaCanopyLeftPlaced] = useState<boolean>(false);

  const [umbrellaCanopyMidColor, setUmbrellaCanopyMidColor] = useState<string>('#ffffff');
  const [isUmbrellaCanopyMidPlaced, setIsUmbrellaCanopyMidPlaced] = useState<boolean>(false);

  const [umbrellaCanopyRightColor, setUmbrellaCanopyRightColor] = useState<string>('#ffffff');
  const [isUmbrellaCanopyRightPlaced, setIsUmbrellaCanopyRightPlaced] = useState<boolean>(false);

  const [umbrellaHandleColor, setUmbrellaHandleColor] = useState<string>('#ffffff');
  const [isUmbrellaHandlePlaced, setIsUmbrellaHandlePlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // HAT STAGE STATES (z66_690aba2c.PNG)
  // ---------------------------------------------------------
  const [hatCrownColor, setHatCrownColor] = useState<string>('#ffffff');
  const [isHatCrownPlaced, setIsHatCrownPlaced] = useState<boolean>(false);

  const [hatBandColor, setHatBandColor] = useState<string>('#ffffff');
  const [isHatBandPlaced, setIsHatBandPlaced] = useState<boolean>(false);

  const [hatBrimColor, setHatBrimColor] = useState<string>('#ffffff');
  const [isHatBrimPlaced, setIsHatBrimPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // BALL STAGE STATES (z65_209ca702.PNG)
  // ---------------------------------------------------------
  const [ballCapColor, setBallCapColor] = useState<string>('#ffffff');
  const [isBallCapPlaced, setIsBallCapPlaced] = useState<boolean>(false);

  const [ballTopMidColor, setBallTopMidColor] = useState<string>('#ffffff');
  const [isBallTopMidPlaced, setIsBallTopMidPlaced] = useState<boolean>(false);

  const [ballTopRightColor, setBallTopRightColor] = useState<string>('#ffffff');
  const [isBallTopRightPlaced, setIsBallTopRightPlaced] = useState<boolean>(false);

  const [ballTopLeftColor, setBallTopLeftColor] = useState<string>('#ffffff');
  const [isBallTopLeftPlaced, setIsBallTopLeftPlaced] = useState<boolean>(false);

  const [ballBottomLeftColor, setBallBottomLeftColor] = useState<string>('#ffffff');
  const [isBallBottomLeftPlaced, setIsBallBottomLeftPlaced] = useState<boolean>(false);

  const [ballBottomCenterColor, setBallBottomCenterColor] = useState<string>('#ffffff');
  const [isBallBottomCenterPlaced, setIsBallBottomCenterPlaced] = useState<boolean>(false);

  const [ballBottomRightColor, setBallBottomRightColor] = useState<string>('#ffffff');
  const [isBallBottomRightPlaced, setIsBallBottomRightPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // BUTTERFLY STAGE STATES (zaq4_dc7377b4.PNG)
  // ---------------------------------------------------------
  const [butterflyBodyColor, setButterflyBodyColor] = useState<string>('#ffffff');
  const [isButterflyBodyPlaced, setIsButterflyBodyPlaced] = useState<boolean>(false);

  const [butterflyWingTLColor, setButterflyWingTLColor] = useState<string>('#ffffff');
  const [isButterflyWingTLPlaced, setIsButterflyWingTLPlaced] = useState<boolean>(false);

  const [butterflyWingBLColor, setButterflyWingBLColor] = useState<string>('#ffffff');
  const [isButterflyWingBLPlaced, setIsButterflyWingBLPlaced] = useState<boolean>(false);

  const [butterflyWingTRColor, setButterflyWingTRColor] = useState<string>('#ffffff');
  const [isButterflyWingTRPlaced, setIsButterflyWingTRPlaced] = useState<boolean>(false);

  const [butterflyWingBRColor, setButterflyWingBRColor] = useState<string>('#ffffff');
  const [isButterflyWingBRPlaced, setIsButterflyWingBRPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // JUG STAGE STATES (z22.PNG / z22_e5a5244c.PNG)
  // ---------------------------------------------------------
  const [jugRimColor, setJugRimColor] = useState<string>('#ffffff');
  const [isJugRimPlaced, setIsJugRimPlaced] = useState<boolean>(false);

  const [jugHandleColor, setJugHandleColor] = useState<string>('#ffffff');
  const [isJugHandlePlaced, setIsJugHandlePlaced] = useState<boolean>(false);

  const [jugBodyColor, setJugBodyColor] = useState<string>('#ffffff');
  const [isJugBodyPlaced, setIsJugBodyPlaced] = useState<boolean>(false);

  const [jugBaseColor, setJugBaseColor] = useState<string>('#ffffff');
  const [isJugBasePlaced, setIsJugBasePlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // CAPSICUM STAGE STATES (z33.PNG)
  // ---------------------------------------------------------
  const [capsicumBodyColor, setCapsicumBodyColor] = useState<string>('#ffffff');
  const [isCapsicumBodyPlaced, setIsCapsicumBodyPlaced] = useState<boolean>(false);
  const [capsicumLeftLobeColor, setCapsicumLeftLobeColor] = useState<string>('#ffffff');
  const [isCapsicumLeftLobePlaced, setIsCapsicumLeftLobePlaced] = useState<boolean>(false);
  const [capsicumRightLobeColor, setCapsicumRightLobeColor] = useState<string>('#ffffff');
  const [isCapsicumRightLobePlaced, setIsCapsicumRightLobePlaced] = useState<boolean>(false);
  const [capsicumStemColor, setCapsicumStemColor] = useState<string>('#ffffff');
  const [isCapsicumStemPlaced, setIsCapsicumStemPlaced] = useState<boolean>(false);
  const [capsicumTopLeftColor, setCapsicumTopLeftColor] = useState<string>('#ffffff');
  const [isCapsicumTopLeftPlaced, setIsCapsicumTopLeftPlaced] = useState<boolean>(false);
  const [capsicumTopRightColor, setCapsicumTopRightColor] = useState<string>('#ffffff');
  const [isCapsicumTopRightPlaced, setIsCapsicumTopRightPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // BRINJAL STAGE STATES (z25_2031642b.PNG)
  // ---------------------------------------------------------
  const [brinjalCalyxColor, setBrinjalCalyxColor] = useState<string>('#ffffff');
  const [isBrinjalCalyxPlaced, setIsBrinjalCalyxPlaced] = useState<boolean>(false);

  const [brinjalBodyColor, setBrinjalBodyColor] = useState<string>('#ffffff');
  const [isBrinjalBodyPlaced, setIsBrinjalBodyPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // KITE STAGE STATES (zq15.PNG)
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

  // ---------------------------------------------------------
  // APPLE STAGE STATES
  // ---------------------------------------------------------
  const [appleBodyColor, setAppleBodyColor] = useState<string>('#ffffff');
  const [appleLeafColor, setAppleLeafColor] = useState<string>('#ffffff');
  const [isAppleBodyPlaced, setIsAppleBodyPlaced] = useState<boolean>(false);
  const [isAppleLeafPlaced, setIsAppleLeafPlaced] = useState<boolean>(false);

  const outlineAreaRef = useRef<HTMLDivElement>(null);

  // Shikshika (Teacher) Voice intro
  useEffect(() => {
    const timer = setTimeout(() => {
      let voiceKey: 'duck' | 'flower' | 'umbrella' | 'hat' | 'ball' | 'butterfly' | 'jug' | 'capsicum' | 'brinjal' | 'kite' | 'mango' | 'apple' = 'duck';
      if (currentStage === 'DUCK') voiceKey = 'duck';
      else if (currentStage === 'FLOWER') voiceKey = 'flower';
      else if (currentStage === 'UMBRELLA') voiceKey = 'umbrella';
      else if (currentStage === 'HAT') voiceKey = 'hat';
      else if (currentStage === 'BALL') voiceKey = 'ball';
      else if (currentStage === 'BUTTERFLY') voiceKey = 'butterfly';
      else if (currentStage === 'JUG') voiceKey = 'jug';
      else if (currentStage === 'CAPSICUM') voiceKey = 'capsicum';
      else if (currentStage === 'BRINJAL') voiceKey = 'brinjal';
      else if (currentStage === 'KITE') voiceKey = 'kite';
      else if (currentStage === 'MANGO') voiceKey = 'mango';
      else if (currentStage === 'APPLE') voiceKey = 'apple';
      sounds.speakDrawingIntro(soundEnabled, voiceKey);
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

  // Celebration
  const triggerVictory = (stage: 'duck' | 'flower' | 'ball' | 'butterfly' | 'jug' | 'capsicum' | 'brinjal' | 'kite' | 'mango' | 'apple' | 'hat' | 'umbrella') => {
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

  // Check if entire Duck is assembled (32_Free_Toddler_Coloring_Pages___Print_and_Color-removebg-preview_09847147.png)
  const checkDuckVictory = (
    body: boolean,
    wing: boolean,
    beak: boolean,
    footLeft: boolean,
    footRight: boolean
  ) => {
    if (body && wing && beak && footLeft && footRight) {
      triggerVictory('duck');
    }
  };

  // Drag handlers for Duck (5 pieces: Body, Wing, Beak, Left Foot, Right Foot)
  const handleDuckBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setDuckBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('duck_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsDuckBodyPlaced(true);
      sounds.speakDrawingPiecePlaced('duck_body', soundEnabled);
      checkDuckVictory(true, isDuckWingPlaced, isDuckBeakPlaced, isDuckFootLeftPlaced, isDuckFootRightPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleDuckWingDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setDuckWingColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('duck_wing', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsDuckWingPlaced(true);
      sounds.speakDrawingPiecePlaced('duck_wing', soundEnabled);
      checkDuckVictory(isDuckBodyPlaced, true, isDuckBeakPlaced, isDuckFootLeftPlaced, isDuckFootRightPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleDuckBeakDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setDuckBeakColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('duck_beak', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsDuckBeakPlaced(true);
      sounds.speakDrawingPiecePlaced('duck_beak', soundEnabled);
      checkDuckVictory(isDuckBodyPlaced, isDuckWingPlaced, true, isDuckFootLeftPlaced, isDuckFootRightPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleDuckFootLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setDuckFootLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('duck_foot_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsDuckFootLeftPlaced(true);
      sounds.speakDrawingPiecePlaced('duck_foot_left', soundEnabled);
      checkDuckVictory(isDuckBodyPlaced, isDuckWingPlaced, isDuckBeakPlaced, true, isDuckFootRightPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleDuckFootRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setDuckFootRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('duck_foot_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsDuckFootRightPlaced(true);
      sounds.speakDrawingPiecePlaced('duck_foot_right', soundEnabled);
      checkDuckVictory(isDuckBodyPlaced, isDuckWingPlaced, isDuckBeakPlaced, isDuckFootLeftPlaced, true);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Flower is assembled (Inkeddownload__16__LI_82357b29.jpg)
  const checkFlowerVictory = (
    c: boolean,
    pt: boolean,
    ptr: boolean,
    pbr: boolean,
    pb: boolean,
    pbl: boolean,
    ptl: boolean
  ) => {
    if (c && pt && ptr && pbr && pb && pbl && ptl) {
      triggerVictory('flower');
    }
  };

  // Drag handlers for Flower (7 pieces: 1 center + 6 petals)
  const handleFlowerCenterDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setFlowerCenterColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('flower_center', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsFlowerCenterPlaced(true);
      sounds.speakDrawingPiecePlaced('flower_center', soundEnabled);
      checkFlowerVictory(true, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleFlowerPetalTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setFlowerPetalTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('flower_petal_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsFlowerPetalTopPlaced(true);
      sounds.speakDrawingPiecePlaced('flower_petal_top', soundEnabled);
      checkFlowerVictory(isFlowerCenterPlaced, true, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleFlowerPetalTopRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setFlowerPetalTopRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('flower_petal_top_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsFlowerPetalTopRightPlaced(true);
      sounds.speakDrawingPiecePlaced('flower_petal_top_right', soundEnabled);
      checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, true, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleFlowerPetalBottomRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setFlowerPetalBottomRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('flower_petal_bottom_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsFlowerPetalBottomRightPlaced(true);
      sounds.speakDrawingPiecePlaced('flower_petal_bottom_right', soundEnabled);
      checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, true, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleFlowerPetalBottomDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setFlowerPetalBottomColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('flower_petal_bottom', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsFlowerPetalBottomPlaced(true);
      sounds.speakDrawingPiecePlaced('flower_petal_bottom', soundEnabled);
      checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, true, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleFlowerPetalBottomLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setFlowerPetalBottomLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('flower_petal_bottom_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsFlowerPetalBottomLeftPlaced(true);
      sounds.speakDrawingPiecePlaced('flower_petal_bottom_left', soundEnabled);
      checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, true, isFlowerPetalTopLeftPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleFlowerPetalTopLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setFlowerPetalTopLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('flower_petal_top_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsFlowerPetalTopLeftPlaced(true);
      sounds.speakDrawingPiecePlaced('flower_petal_top_left', soundEnabled);
      checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, true);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Umbrella is assembled (z67_a60b946b.PNG)
  const checkUmbrellaVictory = (
    nextLeft: boolean,
    nextMid: boolean,
    nextRight: boolean,
    nextHandle: boolean
  ) => {
    if (nextLeft && nextMid && nextRight && nextHandle) {
      triggerVictory('umbrella');
    }
  };

  // Drag handlers for Umbrella (z67_a60b946b.PNG)
  const handleUmbrellaCanopyLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setUmbrellaCanopyLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('umbrella_canopy_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsUmbrellaCanopyLeftPlaced(true);
      sounds.speakDrawingPiecePlaced('umbrella_canopy_left', soundEnabled);
      checkUmbrellaVictory(true, isUmbrellaCanopyMidPlaced, isUmbrellaCanopyRightPlaced, isUmbrellaHandlePlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleUmbrellaCanopyMidDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setUmbrellaCanopyMidColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('umbrella_canopy_mid', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsUmbrellaCanopyMidPlaced(true);
      sounds.speakDrawingPiecePlaced('umbrella_canopy_mid', soundEnabled);
      checkUmbrellaVictory(isUmbrellaCanopyLeftPlaced, true, isUmbrellaCanopyRightPlaced, isUmbrellaHandlePlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleUmbrellaCanopyRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setUmbrellaCanopyRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('umbrella_canopy_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsUmbrellaCanopyRightPlaced(true);
      sounds.speakDrawingPiecePlaced('umbrella_canopy_right', soundEnabled);
      checkUmbrellaVictory(isUmbrellaCanopyLeftPlaced, isUmbrellaCanopyMidPlaced, true, isUmbrellaHandlePlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleUmbrellaHandleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setUmbrellaHandleColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('umbrella_handle', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsUmbrellaHandlePlaced(true);
      sounds.speakDrawingPiecePlaced('umbrella_handle', soundEnabled);
      checkUmbrellaVictory(isUmbrellaCanopyLeftPlaced, isUmbrellaCanopyMidPlaced, isUmbrellaCanopyRightPlaced, true);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Hat is assembled (z66_690aba2c.PNG)
  const checkHatVictory = (
    nextCrown: boolean,
    nextBand: boolean,
    nextBrim: boolean
  ) => {
    if (nextCrown && nextBand && nextBrim) {
      triggerVictory('hat');
    }
  };

  // Drag handlers for Hat (z66_690aba2c.PNG)
  const handleHatCrownDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHatCrownColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hat_crown', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHatCrownPlaced(true);
      sounds.speakDrawingPiecePlaced('hat_crown', soundEnabled);
      checkHatVictory(true, isHatBandPlaced, isHatBrimPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHatBandDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHatBandColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hat_band', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHatBandPlaced(true);
      sounds.speakDrawingPiecePlaced('hat_band', soundEnabled);
      checkHatVictory(isHatCrownPlaced, true, isHatBrimPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHatBrimDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHatBrimColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hat_brim', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHatBrimPlaced(true);
      sounds.speakDrawingPiecePlaced('hat_brim', soundEnabled);
      checkHatVictory(isHatCrownPlaced, isHatBandPlaced, true);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Ball is assembled (z65_209ca702.PNG)
  const checkBallVictory = (
    nextCap: boolean,
    nextTopMid: boolean,
    nextTopRight: boolean,
    nextTopLeft: boolean,
    nextBottomLeft: boolean,
    nextBottomCenter: boolean,
    nextBottomRight: boolean
  ) => {
    if (
      nextCap &&
      nextTopMid &&
      nextTopRight &&
      nextTopLeft &&
      nextBottomLeft &&
      nextBottomCenter &&
      nextBottomRight
    ) {
      triggerVictory('ball');
    }
  };

  // Drag handlers for Ball (z65_209ca702.PNG)
  const handleBallCapDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBallCapColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('ball_cap', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBallCapPlaced(true);
      sounds.speakDrawingPiecePlaced('ball_cap', soundEnabled);
      checkBallVictory(
        true,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBallTopMidDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBallTopMidColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('ball_top_mid', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBallTopMidPlaced(true);
      sounds.speakDrawingPiecePlaced('ball_top_mid', soundEnabled);
      checkBallVictory(
        isBallCapPlaced,
        true,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBallTopRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBallTopRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('ball_top_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBallTopRightPlaced(true);
      sounds.speakDrawingPiecePlaced('ball_top_right', soundEnabled);
      checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        true,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBallTopLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBallTopLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('ball_top_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBallTopLeftPlaced(true);
      sounds.speakDrawingPiecePlaced('ball_top_left', soundEnabled);
      checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        true,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBallBottomLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBallBottomLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('ball_bottom_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBallBottomLeftPlaced(true);
      sounds.speakDrawingPiecePlaced('ball_bottom_left', soundEnabled);
      checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        true,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBallBottomCenterDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBallBottomCenterColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('ball_bottom_center', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBallBottomCenterPlaced(true);
      sounds.speakDrawingPiecePlaced('ball_bottom_center', soundEnabled);
      checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        true,
        isBallBottomRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBallBottomRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBallBottomRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('ball_bottom_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBallBottomRightPlaced(true);
      sounds.speakDrawingPiecePlaced('ball_bottom_right', soundEnabled);
      checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        true
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Butterfly is assembled
  const checkButterflyVictory = (
    nextBody: boolean,
    nextTL: boolean,
    nextBL: boolean,
    nextTR: boolean,
    nextBR: boolean
  ) => {
    if (nextBody && nextTL && nextBL && nextTR && nextBR) {
      triggerVictory('butterfly');
    }
  };

  // Drag handlers for Butterfly (zaq4_dc7377b4.PNG)
  const handleButterflyBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setButterflyBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('butterfly_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsButterflyBodyPlaced(true);
      sounds.speakDrawingPiecePlaced('butterfly_body', soundEnabled);
      checkButterflyVictory(true, isButterflyWingTLPlaced, isButterflyWingBLPlaced, isButterflyWingTRPlaced, isButterflyWingBRPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleButterflyWingTLDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setButterflyWingTLColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('butterfly_wing_tl', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsButterflyWingTLPlaced(true);
      sounds.speakDrawingPiecePlaced('butterfly_wing_tl', soundEnabled);
      checkButterflyVictory(isButterflyBodyPlaced, true, isButterflyWingBLPlaced, isButterflyWingTRPlaced, isButterflyWingBRPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleButterflyWingBLDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setButterflyWingBLColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('butterfly_wing_bl', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsButterflyWingBLPlaced(true);
      sounds.speakDrawingPiecePlaced('butterfly_wing_bl', soundEnabled);
      checkButterflyVictory(isButterflyBodyPlaced, isButterflyWingTLPlaced, true, isButterflyWingTRPlaced, isButterflyWingBRPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleButterflyWingTRDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setButterflyWingTRColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('butterfly_wing_tr', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsButterflyWingTRPlaced(true);
      sounds.speakDrawingPiecePlaced('butterfly_wing_tr', soundEnabled);
      checkButterflyVictory(isButterflyBodyPlaced, isButterflyWingTLPlaced, isButterflyWingBLPlaced, true, isButterflyWingBRPlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleButterflyWingBRDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setButterflyWingBRColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('butterfly_wing_br', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsButterflyWingBRPlaced(true);
      sounds.speakDrawingPiecePlaced('butterfly_wing_br', soundEnabled);
      checkButterflyVictory(isButterflyBodyPlaced, isButterflyWingTLPlaced, isButterflyWingBLPlaced, isButterflyWingTRPlaced, true);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Jug is assembled
  const checkJugVictory = (
    nextRim: boolean,
    nextHandle: boolean,
    nextBody: boolean,
    nextBase: boolean
  ) => {
    if (nextRim && nextHandle && nextBody && nextBase) {
      triggerVictory('jug');
    }
  };

  // Drag handlers for Jug (z22.PNG / z22_e5a5244c.PNG)
  const handleJugRimDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setJugRimColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('jug_rim', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsJugRimPlaced(true);
      sounds.speakDrawingPiecePlaced('jug_rim', soundEnabled);
      checkJugVictory(true, isJugHandlePlaced, isJugBodyPlaced, isJugBasePlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleJugHandleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setJugHandleColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('jug_handle', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsJugHandlePlaced(true);
      sounds.speakDrawingPiecePlaced('jug_handle', soundEnabled);
      checkJugVictory(isJugRimPlaced, true, isJugBodyPlaced, isJugBasePlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleJugBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setJugBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('jug_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsJugBodyPlaced(true);
      sounds.speakDrawingPiecePlaced('jug_body', soundEnabled);
      checkJugVictory(isJugRimPlaced, isJugHandlePlaced, true, isJugBasePlaced);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleJugBaseDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setJugBaseColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('jug_base', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsJugBasePlaced(true);
      sounds.speakDrawingPiecePlaced('jug_base', soundEnabled);
      checkJugVictory(isJugRimPlaced, isJugHandlePlaced, isJugBodyPlaced, true);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Capsicum is assembled
  const checkCapsicumVictory = (
    nextBody: boolean,
    nextLeft: boolean,
    nextRight: boolean,
    nextStem: boolean,
    nextTL: boolean,
    nextTR: boolean
  ) => {
    if (nextBody && nextLeft && nextRight && nextStem && nextTL && nextTR) {
      triggerVictory('capsicum');
    }
  };

  // Drag handlers for Capsicum (z33.PNG)
  const handleCapsicumBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCapsicumBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('capsicum_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCapsicumBodyPlaced(true);
      sounds.speakDrawingPiecePlaced('capsicum_body', soundEnabled);
      checkCapsicumVictory(
        true,
        isCapsicumLeftLobePlaced,
        isCapsicumRightLobePlaced,
        isCapsicumStemPlaced,
        isCapsicumTopLeftPlaced,
        isCapsicumTopRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCapsicumLeftLobeDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCapsicumLeftLobeColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCapsicumLeftLobePlaced(true);
      sounds.speakDrawingPiecePlaced('capsicum_lobe', soundEnabled);
      checkCapsicumVictory(
        isCapsicumBodyPlaced,
        true,
        isCapsicumRightLobePlaced,
        isCapsicumStemPlaced,
        isCapsicumTopLeftPlaced,
        isCapsicumTopRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCapsicumRightLobeDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCapsicumRightLobeColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCapsicumRightLobePlaced(true);
      sounds.speakDrawingPiecePlaced('capsicum_lobe', soundEnabled);
      checkCapsicumVictory(
        isCapsicumBodyPlaced,
        isCapsicumLeftLobePlaced,
        true,
        isCapsicumStemPlaced,
        isCapsicumTopLeftPlaced,
        isCapsicumTopRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCapsicumStemDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCapsicumStemColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('capsicum_stem', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCapsicumStemPlaced(true);
      sounds.speakDrawingPiecePlaced('capsicum_stem', soundEnabled);
      checkCapsicumVictory(
        isCapsicumBodyPlaced,
        isCapsicumLeftLobePlaced,
        isCapsicumRightLobePlaced,
        true,
        isCapsicumTopLeftPlaced,
        isCapsicumTopRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCapsicumTopLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCapsicumTopLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCapsicumTopLeftPlaced(true);
      sounds.speakDrawingPiecePlaced('capsicum_lobe', soundEnabled);
      checkCapsicumVictory(
        isCapsicumBodyPlaced,
        isCapsicumLeftLobePlaced,
        isCapsicumRightLobePlaced,
        isCapsicumStemPlaced,
        true,
        isCapsicumTopRightPlaced
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCapsicumTopRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCapsicumTopRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCapsicumTopRightPlaced(true);
      sounds.speakDrawingPiecePlaced('capsicum_lobe', soundEnabled);
      checkCapsicumVictory(
        isCapsicumBodyPlaced,
        isCapsicumLeftLobePlaced,
        isCapsicumRightLobePlaced,
        isCapsicumStemPlaced,
        isCapsicumTopLeftPlaced,
        true
      );
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Drag handlers for Brinjal (z25_2031642b.PNG)
  const handleBrinjalCalyxDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBrinjalCalyxColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('brinjal_calyx', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBrinjalCalyxPlaced(true);
      if (isBrinjalBodyPlaced) {
        triggerVictory('brinjal');
      } else {
        sounds.speakDrawingPiecePlaced('brinjal_calyx', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBrinjalBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBrinjalBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('brinjal_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBrinjalBodyPlaced(true);
      if (isBrinjalCalyxPlaced) {
        triggerVictory('brinjal');
      } else {
        sounds.speakDrawingPiecePlaced('brinjal_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
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

  // Drag handlers for Kite Pieces (zq15.PNG)
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

  // Apple drag handlers
  const handleAppleBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAppleBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAppleBodyPlaced(true);
      if (isAppleLeafPlaced) triggerVictory('apple');
      else sounds.speakDrawingPiecePlaced('body', soundEnabled);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAppleLeafDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAppleLeafColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('leaf', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAppleLeafPlaced(true);
      if (isAppleBodyPlaced) triggerVictory('apple');
      else sounds.speakDrawingPiecePlaced('leaf', soundEnabled);
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // NEXT Button Handler: cycles DUCK -> FLOWER -> UMBRELLA -> HAT -> BALL -> BUTTERFLY -> JUG -> CAPSICUM -> BRINJAL -> KITE -> MANGO -> APPLE -> DUCK
  const handleNext = () => {
    sounds.playPop(soundEnabled);
    if (currentStage === 'DUCK') {
      setCurrentStage('FLOWER');
      sounds.speakDrawingNext('flower', soundEnabled);
    } else if (currentStage === 'FLOWER') {
      setCurrentStage('UMBRELLA');
      sounds.speakDrawingNext('umbrella', soundEnabled);
    } else if (currentStage === 'UMBRELLA') {
      setCurrentStage('HAT');
      sounds.speakDrawingNext('hat', soundEnabled);
    } else if (currentStage === 'HAT') {
      setCurrentStage('BALL');
      sounds.speakDrawingNext('ball', soundEnabled);
    } else if (currentStage === 'BALL') {
      setCurrentStage('BUTTERFLY');
      sounds.speakDrawingNext('butterfly', soundEnabled);
    } else if (currentStage === 'BUTTERFLY') {
      setCurrentStage('JUG');
      sounds.speakDrawingNext('jug', soundEnabled);
    } else if (currentStage === 'JUG') {
      setCurrentStage('CAPSICUM');
      sounds.speakDrawingNext('capsicum', soundEnabled);
    } else if (currentStage === 'CAPSICUM') {
      setCurrentStage('BRINJAL');
      sounds.speakDrawingNext('brinjal', soundEnabled);
    } else if (currentStage === 'BRINJAL') {
      setCurrentStage('KITE');
      sounds.speakDrawingNext('kite', soundEnabled);
    } else if (currentStage === 'KITE') {
      setCurrentStage('MANGO');
      sounds.speakDrawingNext('mango', soundEnabled);
    } else if (currentStage === 'MANGO') {
      setCurrentStage('APPLE');
      sounds.speakDrawingNext('apple', soundEnabled);
    } else {
      setCurrentStage('DUCK');
      sounds.speakDrawingNext('duck', soundEnabled);
    }
  };

  // Reset Handlers
  const handleResetDuck = () => {
    setIsDuckBodyPlaced(false);
    setIsDuckWingPlaced(false);
    setIsDuckBeakPlaced(false);
    setIsDuckFootLeftPlaced(false);
    setIsDuckFootRightPlaced(false);
    setDuckBodyColor('#ffffff');
    setDuckWingColor('#ffffff');
    setDuckBeakColor('#ffffff');
    setDuckFootLeftColor('#ffffff');
    setDuckFootRightColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  // Reset Handlers
  const handleResetFlower = () => {
    setIsFlowerCenterPlaced(false);
    setIsFlowerPetalTopPlaced(false);
    setIsFlowerPetalTopRightPlaced(false);
    setIsFlowerPetalBottomRightPlaced(false);
    setIsFlowerPetalBottomPlaced(false);
    setIsFlowerPetalBottomLeftPlaced(false);
    setIsFlowerPetalTopLeftPlaced(false);
    setFlowerCenterColor('#ffffff');
    setFlowerPetalTopColor('#ffffff');
    setFlowerPetalTopRightColor('#ffffff');
    setFlowerPetalBottomRightColor('#ffffff');
    setFlowerPetalBottomColor('#ffffff');
    setFlowerPetalBottomLeftColor('#ffffff');
    setFlowerPetalTopLeftColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  // Reset Handlers
  const handleResetUmbrella = () => {
    setIsUmbrellaCanopyLeftPlaced(false);
    setIsUmbrellaCanopyMidPlaced(false);
    setIsUmbrellaCanopyRightPlaced(false);
    setIsUmbrellaHandlePlaced(false);
    setUmbrellaCanopyLeftColor('#ffffff');
    setUmbrellaCanopyMidColor('#ffffff');
    setUmbrellaCanopyRightColor('#ffffff');
    setUmbrellaHandleColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetHat = () => {
    setIsHatCrownPlaced(false);
    setIsHatBandPlaced(false);
    setIsHatBrimPlaced(false);
    setHatCrownColor('#ffffff');
    setHatBandColor('#ffffff');
    setHatBrimColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetBall = () => {
    setIsBallCapPlaced(false);
    setIsBallTopMidPlaced(false);
    setIsBallTopRightPlaced(false);
    setIsBallTopLeftPlaced(false);
    setIsBallBottomLeftPlaced(false);
    setIsBallBottomCenterPlaced(false);
    setIsBallBottomRightPlaced(false);
    setBallCapColor('#ffffff');
    setBallTopMidColor('#ffffff');
    setBallTopRightColor('#ffffff');
    setBallTopLeftColor('#ffffff');
    setBallBottomLeftColor('#ffffff');
    setBallBottomCenterColor('#ffffff');
    setBallBottomRightColor('#ffffff');
    sounds.playPop(soundEnabled);
  };
  const handleResetButterfly = () => {
    setIsButterflyBodyPlaced(false);
    setIsButterflyWingTLPlaced(false);
    setIsButterflyWingBLPlaced(false);
    setIsButterflyWingTRPlaced(false);
    setIsButterflyWingBRPlaced(false);
    setButterflyBodyColor('#ffffff');
    setButterflyWingTLColor('#ffffff');
    setButterflyWingBLColor('#ffffff');
    setButterflyWingTRColor('#ffffff');
    setButterflyWingBRColor('#ffffff');
    sounds.playPop(soundEnabled);
  };
  const handleResetJug = () => {
    setIsJugRimPlaced(false);
    setIsJugHandlePlaced(false);
    setIsJugBodyPlaced(false);
    setIsJugBasePlaced(false);
    setJugRimColor('#ffffff');
    setJugHandleColor('#ffffff');
    setJugBodyColor('#ffffff');
    setJugBaseColor('#ffffff');
    sounds.playPop(soundEnabled);
  };
  const handleResetCapsicum = () => {
    setIsCapsicumBodyPlaced(false);
    setIsCapsicumLeftLobePlaced(false);
    setIsCapsicumRightLobePlaced(false);
    setIsCapsicumStemPlaced(false);
    setIsCapsicumTopLeftPlaced(false);
    setIsCapsicumTopRightPlaced(false);
    setCapsicumBodyColor('#ffffff');
    setCapsicumLeftLobeColor('#ffffff');
    setCapsicumRightLobeColor('#ffffff');
    setCapsicumStemColor('#ffffff');
    setCapsicumTopLeftColor('#ffffff');
    setCapsicumTopRightColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetBrinjal = () => {
    setIsBrinjalCalyxPlaced(false);
    setIsBrinjalBodyPlaced(false);
    setBrinjalCalyxColor('#ffffff');
    setBrinjalBodyColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

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

  const handleResetApple = () => {
    setIsAppleBodyPlaced(false);
    setIsAppleLeafPlaced(false);
    setAppleBodyColor('#ffffff');
    setAppleLeafColor('#ffffff');
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
      {/* 2. MAIN GAME AREA                                                  */}
      {/* ================================================================== */}
      <main
        id="drawing-main-stage"
        className="w-full flex-1 flex flex-row items-center justify-between px-2 sm:px-6 md:px-10 py-1 max-w-6xl mx-auto min-h-0 z-20 gap-2 sm:gap-6"
      >
        {currentStage === 'DUCK' ? (
          // ================================================================
          // DUCK (बतख) GAME SCREEN (32_Free_Toddler_Coloring_Pages___Print_and_Color-removebg-preview_09847147.png)
          // ================================================================
          <>
            {/* LEFT SIDE: DUCK OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="duck-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[449/555] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 449 555"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Left Foot */}
                {isDuckFootLeftPlaced && (
                  <path
                    d={DUCK_PLACED_LEFT_FOOT_PATH}
                    fill={duckFootLeftColor}
                    onClick={() => {
                      setDuckFootLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_foot_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Right Foot */}
                {isDuckFootRightPlaced && (
                  <path
                    d={DUCK_PLACED_RIGHT_FOOT_PATH}
                    fill={duckFootRightColor}
                    onClick={() => {
                      setDuckFootRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_foot_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Body */}
                {isDuckBodyPlaced && (
                  <path
                    d={DUCK_PLACED_BODY_PATH}
                    fill={duckBodyColor}
                    onClick={() => {
                      setDuckBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Wing */}
                {isDuckWingPlaced && (
                  <path
                    d={DUCK_PLACED_WING_PATH}
                    fill={duckWingColor}
                    onClick={() => {
                      setDuckWingColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_wing', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Beak */}
                {isDuckBeakPlaced && (
                  <path
                    d={DUCK_PLACED_BEAK_PATH}
                    fill={duckBeakColor}
                    onClick={() => {
                      setDuckBeakColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_beak', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={duckOutlineImg}
                alt="Duck Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: DUCK CUTTING PIECES */}
            <div
              id="duck-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[449/555] flex items-center justify-center"
            >
              {isDuckBodyPlaced &&
                isDuckWingPlaced &&
                isDuckBeakPlaced &&
                isDuckFootLeftPlaced &&
                isDuckFootRightPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetDuck}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Beak (Top-Left) */}
                {!isDuckBeakPlaced && (
                  <motion.div
                    id="cutting-duck-beak"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleDuckBeakDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setDuckBeakColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_beak', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '4%',
                      top: '5%',
                      width: `${(92 / 449) * 100}%`,
                      height: `${(56 / 555) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={DUCK_BEAK_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={DUCK_BEAK_PATH}
                        fill={duckBeakColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Wing (Top-Right) */}
                {!isDuckWingPlaced && (
                  <motion.div
                    id="cutting-duck-wing"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleDuckWingDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setDuckWingColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_wing', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '46%',
                      top: '4%',
                      width: `${(227 / 449) * 100}%`,
                      height: `${(144 / 555) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={DUCK_WING_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={DUCK_WING_PATH}
                        fill={duckWingColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Duck Head & Body (Center) */}
                {!isDuckBodyPlaced && (
                  <motion.div
                    id="cutting-duck-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleDuckBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setDuckBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-20"
                    style={{
                      left: '8%',
                      top: '24%',
                      width: `${(393 / 449) * 90}%`,
                      height: `${(438 / 555) * 72}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={DUCK_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={DUCK_BODY_PATH}
                        fill={duckBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Left Foot (Bottom-Left) */}
                {!isDuckFootLeftPlaced && (
                  <motion.div
                    id="cutting-duck-foot-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleDuckFootLeftDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setDuckFootLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_foot_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '12%',
                      top: '82%',
                      width: `${(108 / 449) * 100}%`,
                      height: `${(80 / 555) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={DUCK_LEFT_FOOT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={DUCK_LEFT_FOOT_PATH}
                        fill={duckFootLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Right Foot (Bottom-Right) */}
                {!isDuckFootRightPlaced && (
                  <motion.div
                    id="cutting-duck-foot-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleDuckFootRightDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setDuckFootRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('duck_foot_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '56%',
                      top: '82%',
                      width: `${(118 / 449) * 100}%`,
                      height: `${(85 / 555) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={DUCK_RIGHT_FOOT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={DUCK_RIGHT_FOOT_PATH}
                        fill={duckFootRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 5 pieces are placed */}
                {isDuckBodyPlaced &&
                  isDuckWingPlaced &&
                  isDuckBeakPlaced &&
                  isDuckFootLeftPlaced &&
                  isDuckFootRightPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ बतख सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'FLOWER' ? (
          // ================================================================
          // FLOWER (फूल) GAME SCREEN (Inkeddownload__16__LI_82357b29.jpg)
          // ================================================================
          <>
            {/* LEFT SIDE: FLOWER OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="flower-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[734/750] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 734 750"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Petal Top */}
                {isFlowerPetalTopPlaced && (
                  <path
                    d={FLOWER_PLACED_PETAL_TOP_PATH}
                    fill={flowerPetalTopColor}
                    onClick={() => {
                      setFlowerPetalTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Petal Top-Right */}
                {isFlowerPetalTopRightPlaced && (
                  <path
                    d={FLOWER_PLACED_PETAL_TOP_RIGHT_PATH}
                    fill={flowerPetalTopRightColor}
                    onClick={() => {
                      setFlowerPetalTopRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_top_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Petal Bottom-Right */}
                {isFlowerPetalBottomRightPlaced && (
                  <path
                    d={FLOWER_PLACED_PETAL_BOTTOM_RIGHT_PATH}
                    fill={flowerPetalBottomRightColor}
                    onClick={() => {
                      setFlowerPetalBottomRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_bottom_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Petal Bottom */}
                {isFlowerPetalBottomPlaced && (
                  <path
                    d={FLOWER_PLACED_PETAL_BOTTOM_PATH}
                    fill={flowerPetalBottomColor}
                    onClick={() => {
                      setFlowerPetalBottomColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_bottom', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Petal Bottom-Left */}
                {isFlowerPetalBottomLeftPlaced && (
                  <path
                    d={FLOWER_PLACED_PETAL_BOTTOM_LEFT_PATH}
                    fill={flowerPetalBottomLeftColor}
                    onClick={() => {
                      setFlowerPetalBottomLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_bottom_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Petal Top-Left */}
                {isFlowerPetalTopLeftPlaced && (
                  <path
                    d={FLOWER_PLACED_PETAL_TOP_LEFT_PATH}
                    fill={flowerPetalTopLeftColor}
                    onClick={() => {
                      setFlowerPetalTopLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_top_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Center Disk */}
                {isFlowerCenterPlaced && (
                  <path
                    d={FLOWER_PLACED_CENTER_PATH}
                    fill={flowerCenterColor}
                    onClick={() => {
                      setFlowerCenterColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_center', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={flowerOutlineImg}
                alt="Flower Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: FLOWER CUTTING PIECES */}
            <div
              id="flower-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[734/750] flex items-center justify-center"
            >
              {isFlowerCenterPlaced &&
                isFlowerPetalTopPlaced &&
                isFlowerPetalTopRightPlaced &&
                isFlowerPetalBottomRightPlaced &&
                isFlowerPetalBottomPlaced &&
                isFlowerPetalBottomLeftPlaced &&
                isFlowerPetalTopLeftPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetFlower}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Petal Top */}
                {!isFlowerPetalTopPlaced && (
                  <motion.div
                    id="cutting-flower-petal-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleFlowerPetalTopDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setFlowerPetalTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '32.8%',
                      top: '2.4%',
                      width: `${(254 / 734) * 100}%`,
                      height: `${(263 / 750) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={FLOWER_PETAL_TOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={FLOWER_PETAL_TOP_PATH}
                        fill={flowerPetalTopColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Petal Top-Right */}
                {!isFlowerPetalTopRightPlaced && (
                  <motion.div
                    id="cutting-flower-petal-top-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleFlowerPetalTopRightDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setFlowerPetalTopRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_top_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '58.2%',
                      top: '14.9%',
                      width: `${(290 / 734) * 100}%`,
                      height: `${(257 / 750) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={FLOWER_PETAL_TOP_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={FLOWER_PETAL_TOP_RIGHT_PATH}
                        fill={flowerPetalTopRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Petal Bottom-Right */}
                {!isFlowerPetalBottomRightPlaced && (
                  <motion.div
                    id="cutting-flower-petal-bottom-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleFlowerPetalBottomRightDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setFlowerPetalBottomRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_bottom_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '58.2%',
                      top: '50.8%',
                      width: `${(290 / 734) * 100}%`,
                      height: `${(257 / 750) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={FLOWER_PETAL_BOTTOM_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={FLOWER_PETAL_BOTTOM_RIGHT_PATH}
                        fill={flowerPetalBottomRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Petal Bottom */}
                {!isFlowerPetalBottomPlaced && (
                  <motion.div
                    id="cutting-flower-petal-bottom"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleFlowerPetalBottomDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setFlowerPetalBottomColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_bottom', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '32.8%',
                      top: '62.5%',
                      width: `${(254 / 734) * 100}%`,
                      height: `${(263 / 750) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={FLOWER_PETAL_BOTTOM_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={FLOWER_PETAL_BOTTOM_PATH}
                        fill={flowerPetalBottomColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Petal Bottom-Left */}
                {!isFlowerPetalBottomLeftPlaced && (
                  <motion.div
                    id="cutting-flower-petal-bottom-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleFlowerPetalBottomLeftDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setFlowerPetalBottomLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_bottom_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2.6%',
                      top: '50.8%',
                      width: `${(290 / 734) * 100}%`,
                      height: `${(257 / 750) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={FLOWER_PETAL_BOTTOM_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={FLOWER_PETAL_BOTTOM_LEFT_PATH}
                        fill={flowerPetalBottomLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Petal Top-Left */}
                {!isFlowerPetalTopLeftPlaced && (
                  <motion.div
                    id="cutting-flower-petal-top-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleFlowerPetalTopLeftDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setFlowerPetalTopLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_petal_top_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2.6%',
                      top: '14.9%',
                      width: `${(290 / 734) * 100}%`,
                      height: `${(257 / 750) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={FLOWER_PETAL_TOP_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={FLOWER_PETAL_TOP_LEFT_PATH}
                        fill={flowerPetalTopLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Center Disk */}
                {!isFlowerCenterPlaced && (
                  <motion.div
                    id="cutting-flower-center"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleFlowerCenterDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setFlowerCenterColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('flower_center', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '37.3%',
                      top: '37.5%',
                      width: `${(189 / 734) * 100}%`,
                      height: `${(188 / 750) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={FLOWER_CENTER_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={FLOWER_CENTER_PATH}
                        fill={flowerCenterColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 7 pieces are placed */}
                {isFlowerCenterPlaced &&
                  isFlowerPetalTopPlaced &&
                  isFlowerPetalTopRightPlaced &&
                  isFlowerPetalBottomRightPlaced &&
                  isFlowerPetalBottomPlaced &&
                  isFlowerPetalBottomLeftPlaced &&
                  isFlowerPetalTopLeftPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ फूल सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'UMBRELLA' ? (
          // ================================================================
          // UMBRELLA (छाता / छतरी) GAME SCREEN (z67_a60b946b.PNG)
          // ================================================================
          <>
            {/* LEFT SIDE: UMBRELLA OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="umbrella-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[536/600] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 536 600"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Canopy Left */}
                {isUmbrellaCanopyLeftPlaced && (
                  <path
                    d={UMBRELLA_PLACED_CANOPY_LEFT_PATH}
                    fill={umbrellaCanopyLeftColor}
                    onClick={() => {
                      setUmbrellaCanopyLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('umbrella_canopy_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Canopy Mid */}
                {isUmbrellaCanopyMidPlaced && (
                  <path
                    d={UMBRELLA_PLACED_CANOPY_MID_PATH}
                    fill={umbrellaCanopyMidColor}
                    onClick={() => {
                      setUmbrellaCanopyMidColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('umbrella_canopy_mid', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Canopy Right */}
                {isUmbrellaCanopyRightPlaced && (
                  <path
                    d={UMBRELLA_PLACED_CANOPY_RIGHT_PATH}
                    fill={umbrellaCanopyRightColor}
                    onClick={() => {
                      setUmbrellaCanopyRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('umbrella_canopy_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Handle */}
                {isUmbrellaHandlePlaced && (
                  <path
                    d={UMBRELLA_PLACED_HANDLE_PATH}
                    fill={umbrellaHandleColor}
                    onClick={() => {
                      setUmbrellaHandleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('umbrella_handle', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Black Outline on top */}
              <img
                src={umbrellaOutlineImg}
                alt="Umbrella Outline"
                className="absolute inset-0 w-full h-full pointer-events-none select-none object-contain drop-shadow-sm"
              />
            </div>

            {/* RIGHT SIDE: UMBRELLA CUTTING IMAGES (z67_a60b946b.PNG) */}
            <div
              id="umbrella-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[536/600] flex items-center justify-center"
            >
              {isUmbrellaCanopyLeftPlaced &&
                isUmbrellaCanopyMidPlaced &&
                isUmbrellaCanopyRightPlaced &&
                isUmbrellaHandlePlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetUmbrella}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Canopy Left (top left of cutting area) */}
                {!isUmbrellaCanopyLeftPlaced && (
                  <motion.div
                    id="cutting-umbrella-canopy-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleUmbrellaCanopyLeftDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setUmbrellaCanopyLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('umbrella_canopy_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '0.0%',
                      top: '10.7%',
                      width: `${(138 / 536) * 100}%`,
                      height: `${(198 / 600) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={UMBRELLA_CANOPY_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={UMBRELLA_CANOPY_LEFT_PATH}
                        fill={umbrellaCanopyLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Canopy Right (top center of cutting area in z67_a60b946b.PNG) */}
                {!isUmbrellaCanopyRightPlaced && (
                  <motion.div
                    id="cutting-umbrella-canopy-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleUmbrellaCanopyRightDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setUmbrellaCanopyRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('umbrella_canopy_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '32.3%',
                      top: '13.8%',
                      width: `${(194 / 536) * 100}%`,
                      height: `${(165 / 600) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={UMBRELLA_CANOPY_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={UMBRELLA_CANOPY_RIGHT_PATH}
                        fill={umbrellaCanopyRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Canopy Mid (top right of cutting area in z67_a60b946b.PNG) */}
                {!isUmbrellaCanopyMidPlaced && (
                  <motion.div
                    id="cutting-umbrella-canopy-mid"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleUmbrellaCanopyMidDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setUmbrellaCanopyMidColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('umbrella_canopy_mid', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '71.3%',
                      top: '15.3%',
                      width: `${(154 / 536) * 100}%`,
                      height: `${(185 / 600) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={UMBRELLA_CANOPY_MID_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={UMBRELLA_CANOPY_MID_PATH}
                        fill={umbrellaCanopyMidColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Handle (lower middle of cutting area in z67_a60b946b.PNG) */}
                {!isUmbrellaHandlePlaced && (
                  <motion.div
                    id="cutting-umbrella-handle"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleUmbrellaHandleDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setUmbrellaHandleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('umbrella_handle', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '33.8%',
                      top: '45.3%',
                      width: `${(122 / 536) * 100}%`,
                      height: `${(199 / 600) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={UMBRELLA_HANDLE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={UMBRELLA_HANDLE_PATH}
                        fill={umbrellaHandleColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 4 pieces are placed */}
                {isUmbrellaCanopyLeftPlaced &&
                  isUmbrellaCanopyMidPlaced &&
                  isUmbrellaCanopyRightPlaced &&
                  isUmbrellaHandlePlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ छतरी सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'HAT' ? (
          // ================================================================
          // HAT (टोपी / Fedora) GAME SCREEN (z66_690aba2c.PNG)
          // ================================================================
          <>
            {/* LEFT SIDE: HAT OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="hat-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[534/603] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 534 603"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Crown Fill */}
                {isHatCrownPlaced && (
                  <path
                    d={HAT_PLACED_CROWN_PATH}
                    fill={hatCrownColor}
                    onClick={() => {
                      setHatCrownColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hat_crown', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Band Fill */}
                {isHatBandPlaced && (
                  <path
                    d={HAT_PLACED_BAND_PATH}
                    fill={hatBandColor}
                    onClick={() => {
                      setHatBandColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hat_band', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Brim Fill */}
                {isHatBrimPlaced && (
                  <path
                    d={HAT_PLACED_BRIM_PATH}
                    fill={hatBrimColor}
                    onClick={() => {
                      setHatBrimColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hat_brim', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Black Outline on top */}
              <img
                src={hatOutlineImg}
                alt="Hat Outline"
                className="absolute inset-0 w-full h-full pointer-events-none select-none object-contain drop-shadow-sm"
              />
            </div>

            {/* RIGHT SIDE: HAT CUTTING IMAGES (z66_690aba2c.PNG) */}
            <div
              id="hat-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[534/603] flex items-center justify-center"
            >
              {isHatCrownPlaced &&
                isHatBandPlaced &&
                isHatBrimPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetHat}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Band (horizontal ribbon near top) */}
                {!isHatBandPlaced && (
                  <motion.div
                    id="cutting-hat-band"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHatBandDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHatBandColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hat_band', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '22.8%',
                      top: '20.0%',
                      width: `${(291 / 534) * 100}%`,
                      height: `${(69 / 603) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HAT_BAND_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HAT_BAND_PATH}
                        fill={hatBandColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Crown (upper dome in middle) */}
                {!isHatCrownPlaced && (
                  <motion.div
                    id="cutting-hat-crown"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHatCrownDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHatCrownColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hat_crown', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '38.6%',
                      top: '42.9%',
                      width: `${(168 / 534) * 100}%`,
                      height: `${(88 / 603) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HAT_CROWN_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HAT_CROWN_PATH}
                        fill={hatCrownColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Brim (wide bottom brim) */}
                {!isHatBrimPlaced && (
                  <motion.div
                    id="cutting-hat-brim"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHatBrimDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHatBrimColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hat_brim', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '6.9%',
                      top: '64.8%',
                      width: `${(487 / 534) * 100}%`,
                      height: `${(103 / 603) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HAT_BRIM_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HAT_BRIM_PATH}
                        fill={hatBrimColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 3 pieces are placed */}
                {isHatCrownPlaced &&
                  isHatBandPlaced &&
                  isHatBrimPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ टोपी सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'BALL' ? (
          // ================================================================
          // BALL (गेंद / Beach Ball) GAME SCREEN (z65_209ca702.PNG)
          // ================================================================
          <>
            {/* LEFT SIDE: BALL OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="ball-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[530/605] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 530 605"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Cap Fill */}
                {isBallCapPlaced && (
                  <path
                    d={BALL_CAP_PATH}
                    fill={ballCapColor}
                    onClick={() => {
                      setBallCapColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_cap', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Top Mid Fill */}
                {isBallTopMidPlaced && (
                  <path
                    d={BALL_TOP_MID_PATH}
                    fill={ballTopMidColor}
                    onClick={() => {
                      setBallTopMidColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_top_mid', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Top Right Fill */}
                {isBallTopRightPlaced && (
                  <path
                    d={BALL_TOP_RIGHT_PATH}
                    fill={ballTopRightColor}
                    onClick={() => {
                      setBallTopRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_top_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Top Left Fill */}
                {isBallTopLeftPlaced && (
                  <path
                    d={BALL_TOP_LEFT_PATH}
                    fill={ballTopLeftColor}
                    onClick={() => {
                      setBallTopLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_top_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Bottom Left Fill */}
                {isBallBottomLeftPlaced && (
                  <path
                    d={BALL_BOTTOM_LEFT_PATH}
                    fill={ballBottomLeftColor}
                    onClick={() => {
                      setBallBottomLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_bottom_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Bottom Center Fill */}
                {isBallBottomCenterPlaced && (
                  <path
                    d={BALL_BOTTOM_CENTER_PATH}
                    fill={ballBottomCenterColor}
                    onClick={() => {
                      setBallBottomCenterColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_bottom_center', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Bottom Right Fill */}
                {isBallBottomRightPlaced && (
                  <path
                    d={BALL_BOTTOM_RIGHT_PATH}
                    fill={ballBottomRightColor}
                    onClick={() => {
                      setBallBottomRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_bottom_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Exact thick bold black outline image from z65_209ca702.PNG (dilated & clean) */}
              <img
                src={ballOutlineImg}
                alt="Ball Outline"
                className="absolute inset-0 w-full h-full pointer-events-none select-none object-contain drop-shadow-sm"
              />
            </div>

            {/* RIGHT SIDE: BALL CUTTING IMAGES (z65_209ca702.PNG) */}
            <div
              id="ball-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[530/605] flex items-center justify-center"
            >
              {isBallCapPlaced &&
                isBallTopMidPlaced &&
                isBallTopRightPlaced &&
                isBallTopLeftPlaced &&
                isBallBottomLeftPlaced &&
                isBallBottomCenterPlaced &&
                isBallBottomRightPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetBall}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Top-Mid Panel (top center) */}
                {!isBallTopMidPlaced && (
                  <motion.div
                    id="cutting-ball-top-mid"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBallTopMidDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBallTopMidColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_top_mid', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '43.0%',
                      top: '12.7%',
                      width: `${(91 / 530) * 100}%`,
                      height: `${(35 / 605) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BALL_TOP_MID_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BALL_TOP_MID_PATH}
                        fill={ballTopMidColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Top-Left Panel */}
                {!isBallTopLeftPlaced && (
                  <motion.div
                    id="cutting-ball-top-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBallTopLeftDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBallTopLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_top_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '7.7%',
                      top: '20.5%',
                      width: `${(89 / 530) * 100}%`,
                      height: `${(97 / 605) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BALL_TOP_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BALL_TOP_LEFT_PATH}
                        fill={ballTopLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Top-Right Panel */}
                {!isBallTopRightPlaced && (
                  <motion.div
                    id="cutting-ball-top-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBallTopRightDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBallTopRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_top_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '77.5%',
                      top: '20.0%',
                      width: `${(160 / 530) * 100}%`,
                      height: `${(98 / 605) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BALL_TOP_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BALL_TOP_RIGHT_PATH}
                        fill={ballTopRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Center Cap / Hub */}
                {!isBallCapPlaced && (
                  <motion.div
                    id="cutting-ball-cap"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBallCapDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBallCapColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_cap', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '57.4%',
                      top: '27.8%',
                      width: `${(92 / 530) * 100}%`,
                      height: `${(74 / 605) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BALL_CAP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BALL_CAP_PATH}
                        fill={ballCapColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Bottom-Left Panel */}
                {!isBallBottomLeftPlaced && (
                  <motion.div
                    id="cutting-ball-bottom-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBallBottomLeftDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBallBottomLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_bottom_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '0.0%',
                      top: '43.0%',
                      width: `${(105 / 530) * 100}%`,
                      height: `${(237 / 605) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BALL_BOTTOM_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BALL_BOTTOM_LEFT_PATH}
                        fill={ballBottomLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Bottom-Center Big Panel */}
                {!isBallBottomCenterPlaced && (
                  <motion.div
                    id="cutting-ball-bottom-center"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBallBottomCenterDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBallBottomCenterColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_bottom_center', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '34.5%',
                      top: '42.0%',
                      width: `${(184 / 530) * 100}%`,
                      height: `${(241 / 605) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BALL_BOTTOM_CENTER_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BALL_BOTTOM_CENTER_PATH}
                        fill={ballBottomCenterColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Bottom-Right Panel */}
                {!isBallBottomRightPlaced && (
                  <motion.div
                    id="cutting-ball-bottom-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBallBottomRightDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBallBottomRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('ball_bottom_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '73.6%',
                      top: '44.8%',
                      width: `${(182 / 530) * 100}%`,
                      height: `${(237 / 605) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BALL_BOTTOM_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BALL_BOTTOM_RIGHT_PATH}
                        fill={ballBottomRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Victory Banner when completely assembled */}
                {isBallCapPlaced &&
                  isBallTopMidPlaced &&
                  isBallTopRightPlaced &&
                  isBallTopLeftPlaced &&
                  isBallBottomLeftPlaced &&
                  isBallBottomCenterPlaced &&
                  isBallBottomRightPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ गेंद सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'BUTTERFLY' ? (
          // ================================================================
          // BUTTERFLY (तितली) GAME SCREEN (zaq4_dc7377b4.PNG)
          // ================================================================
          <>
            {/* LEFT SIDE: BUTTERFLY OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="butterfly-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[535/606] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 535 606"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Wings Fills */}
                {isButterflyWingTLPlaced && (
                  <path
                    d={BUTTERFLY_WING_TL_PATH}
                    fill={butterflyWingTLColor}
                    onClick={() => {
                      setButterflyWingTLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_wing_tl', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {isButterflyWingBLPlaced && (
                  <path
                    d={BUTTERFLY_WING_BL_PATH}
                    fill={butterflyWingBLColor}
                    onClick={() => {
                      setButterflyWingBLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_wing_bl', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {isButterflyWingTRPlaced && (
                  <path
                    d={BUTTERFLY_WING_TR_PATH}
                    fill={butterflyWingTRColor}
                    onClick={() => {
                      setButterflyWingTRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_wing_tr', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {isButterflyWingBRPlaced && (
                  <path
                    d={BUTTERFLY_WING_BR_PATH}
                    fill={butterflyWingBRColor}
                    onClick={() => {
                      setButterflyWingBRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_wing_br', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}

                {/* 2. Placed Body Fill */}
                {isButterflyBodyPlaced && (
                  <path
                    d={BUTTERFLY_BODY_PATH}
                    fill={butterflyBodyColor}
                    onClick={() => {
                      setButterflyBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Exact black outline image from zaq4_dc7377b4.PNG (thickened bold strokes) */}
              <img
                src={butterflyOutlineImg}
                alt="Butterfly Outline"
                className="absolute inset-0 w-full h-full pointer-events-none select-none object-contain drop-shadow-sm"
              />
            </div>

            {/* RIGHT SIDE: BUTTERFLY CUTTING IMAGES (zaq4_dc7377b4.PNG) */}
            <div
              id="butterfly-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[535/606] flex items-center justify-center"
            >
              {isButterflyBodyPlaced &&
                isButterflyWingTLPlaced &&
                isButterflyWingBLPlaced &&
                isButterflyWingTRPlaced &&
                isButterflyWingBRPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetButterfly}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Top-Left Wing */}
                {!isButterflyWingTLPlaced && (
                  <motion.div
                    id="cutting-butterfly-wing-tl"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleButterflyWingTLDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setButterflyWingTLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_wing_tl', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '8%',
                      top: '18%',
                      width: `${(196 / 535) * 100}%`,
                      height: `${(194 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUTTERFLY_WING_TL_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUTTERFLY_WING_TL_PATH}
                        fill={butterflyWingTLColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Bottom-Left Wing */}
                {!isButterflyWingBLPlaced && (
                  <motion.div
                    id="cutting-butterfly-wing-bl"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleButterflyWingBLDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setButterflyWingBLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_wing_bl', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '12%',
                      top: '52%',
                      width: `${(141 / 535) * 100}%`,
                      height: `${(154 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUTTERFLY_WING_BL_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUTTERFLY_WING_BL_PATH}
                        fill={butterflyWingBLColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Center Body */}
                {!isButterflyBodyPlaced && (
                  <motion.div
                    id="cutting-butterfly-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleButterflyBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setButterflyBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '46%',
                      top: '28%',
                      width: `${(43 / 535) * 100}%`,
                      height: `${(216 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUTTERFLY_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUTTERFLY_BODY_PATH}
                        fill={butterflyBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Top-Right Wing */}
                {!isButterflyWingTRPlaced && (
                  <motion.div
                    id="cutting-butterfly-wing-tr"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleButterflyWingTRDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setButterflyWingTRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_wing_tr', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '56%',
                      top: '18%',
                      width: `${(196 / 535) * 100}%`,
                      height: `${(195 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUTTERFLY_WING_TR_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUTTERFLY_WING_TR_PATH}
                        fill={butterflyWingTRColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Bottom-Right Wing */}
                {!isButterflyWingBRPlaced && (
                  <motion.div
                    id="cutting-butterfly-wing-br"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleButterflyWingBRDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setButterflyWingBRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('butterfly_wing_br', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '60%',
                      top: '52%',
                      width: `${(141 / 535) * 100}%`,
                      height: `${(154 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUTTERFLY_WING_BR_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUTTERFLY_WING_BR_PATH}
                        fill={butterflyWingBRColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Victory Banner when completely assembled */}
                {isButterflyBodyPlaced &&
                  isButterflyWingTLPlaced &&
                  isButterflyWingBLPlaced &&
                  isButterflyWingTRPlaced &&
                  isButterflyWingBRPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ तितली सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'JUG' ? (
          // ================================================================
          // JUG / SURAHI GAME SCREEN (z22.PNG / z22_e5a5244c.PNG)
          // ================================================================
          <>
            {/* LEFT SIDE: JUG OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="jug-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[534/601] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 534 601"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Body Fill */}
                {isJugBodyPlaced && (
                  <path
                    d={JUG_PLACED_BODY_PATH}
                    fill={jugBodyColor}
                    onClick={() => {
                      setJugBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('jug_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}

                {/* 2. Placed Base Fill */}
                {isJugBasePlaced && (
                  <path
                    d={JUG_PLACED_BASE_PATH}
                    fill={jugBaseColor}
                    onClick={() => {
                      setJugBaseColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('jug_base', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}

                {/* 3. Placed Rim / Lip Fill */}
                {isJugRimPlaced && (
                  <path
                    d={JUG_PLACED_RIM_PATH}
                    fill={jugRimColor}
                    onClick={() => {
                      setJugRimColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('jug_rim', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}

                {/* 4. Placed Handle Fill */}
                {isJugHandlePlaced && (
                  <path
                    d={JUG_PLACED_HANDLE_PATH}
                    fill={jugHandleColor}
                    onClick={() => {
                      setJugHandleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('jug_handle', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Exact black outline image from z22.PNG */}
              <img
                src={jugOutlineImg}
                alt="Jug Outline"
                className="absolute inset-0 w-full h-full pointer-events-none select-none object-contain drop-shadow-sm"
              />
            </div>

            {/* RIGHT SIDE: JUG CUTTING IMAGES (z22.PNG) */}
            <div
              id="jug-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[534/601] flex items-center justify-center"
            >
              {isJugRimPlaced && isJugHandlePlaced && isJugBodyPlaced && isJugBasePlaced && (
                <div className="absolute top-0 right-2 z-40">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetJug}
                    className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                  >
                    ↺ फिर से बनाएँ
                  </motion.button>
                </div>
              )}

              <div className="relative w-full h-full">
                {/* 1. Top Rim / Lip (Top Center) */}
                {!isJugRimPlaced && (
                  <motion.div
                    id="cutting-jug-rim"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleJugRimDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setJugRimColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('jug_rim', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '27.3%',
                      top: '11.8%',
                      width: `${(201 / 534) * 100}%`,
                      height: `${(49 / 601) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={JUG_RIM_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={JUG_RIM_PATH}
                        fill={jugRimColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Handle (Middle-Left) */}
                {!isJugHandlePlaced && (
                  <motion.div
                    id="cutting-jug-handle"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleJugHandleDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setJugHandleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('jug_handle', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '29.2%',
                      top: '25.5%',
                      width: `${(103 / 534) * 100}%`,
                      height: `${(196 / 601) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={JUG_HANDLE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={JUG_HANDLE_PATH}
                        fill={jugHandleColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Jug Body (Right Side) */}
                {!isJugBodyPlaced && (
                  <motion.div
                    id="cutting-jug-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleJugBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setJugBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('jug_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '50.5%',
                      top: '22.0%',
                      width: `${(254 / 534) * 100}%`,
                      height: `${(305 / 601) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={JUG_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={JUG_BODY_PATH}
                        fill={jugBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Bottom Base (Bottom Left-Center) */}
                {!isJugBasePlaced && (
                  <motion.div
                    id="cutting-jug-base"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleJugBaseDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setJugBaseColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('jug_base', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '27.3%',
                      top: '72.9%',
                      width: `${(150 / 534) * 100}%`,
                      height: `${(31 / 601) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={JUG_BASE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={JUG_BASE_PATH}
                        fill={jugBaseColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Victory Banner when completely assembled */}
                {isJugRimPlaced && isJugHandlePlaced && isJugBodyPlaced && isJugBasePlaced && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center gap-3"
                  >
                    <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                      ⭐ जग सही जगह लग गया! शाबाश! ⭐
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </>
        ) : currentStage === 'CAPSICUM' ? (
          // ================================================================
          // CAPSICUM (SHIMLA MIRCH) GAME SCREEN (z33.PNG)
          // ================================================================
          <>
            {/* LEFT SIDE: CAPSICUM OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="capsicum-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[533/606] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 533 606"
                className="w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Back Lobes (rendered behind front body) */}
                {isCapsicumTopLeftPlaced && (
                  <path
                    d={CAPSICUM_TOP_LEFT_PATH}
                    fill={capsicumTopLeftColor}
                    onClick={() => {
                      setCapsicumTopLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}
                {isCapsicumTopRightPlaced && (
                  <path
                    d={CAPSICUM_TOP_RIGHT_PATH}
                    fill={capsicumTopRightColor}
                    onClick={() => {
                      setCapsicumTopRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}

                {/* 2. Placed Outer Side Lobes */}
                {isCapsicumLeftLobePlaced && (
                  <path
                    d={CAPSICUM_LEFT_LOBE_PATH}
                    fill={capsicumLeftLobeColor}
                    onClick={() => {
                      setCapsicumLeftLobeColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}
                {isCapsicumRightLobePlaced && (
                  <path
                    d={CAPSICUM_RIGHT_LOBE_PATH}
                    fill={capsicumRightLobeColor}
                    onClick={() => {
                      setCapsicumRightLobeColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}

                {/* 3. Placed Center Front Body */}
                {isCapsicumBodyPlaced && (
                  <path
                    d={CAPSICUM_BODY_PATH}
                    fill={capsicumBodyColor}
                    onClick={() => {
                      setCapsicumBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}

                {/* 4. Placed Stem */}
                {isCapsicumStemPlaced && (
                  <path
                    d={CAPSICUM_STEM_PATH}
                    fill={capsicumStemColor}
                    onClick={() => {
                      setCapsicumStemColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_stem', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors"
                  />
                )}

                {/* Clean crisp black outline strokes matching z33.PNG */}
                <path
                  d={CAPSICUM_TOP_LEFT_PATH}
                  fill="none"
                  stroke="#111111"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="pointer-events-none"
                />
                <path
                  d={CAPSICUM_TOP_RIGHT_PATH}
                  fill="none"
                  stroke="#111111"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="pointer-events-none"
                />
                <path
                  d={CAPSICUM_LEFT_LOBE_PATH}
                  fill="none"
                  stroke="#111111"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="pointer-events-none"
                />
                <path
                  d={CAPSICUM_RIGHT_LOBE_PATH}
                  fill="none"
                  stroke="#111111"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="pointer-events-none"
                />
                <path
                  d={CAPSICUM_BODY_PATH}
                  fill="none"
                  stroke="#111111"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="pointer-events-none"
                />
                <path
                  d={CAPSICUM_STEM_PATH}
                  fill="none"
                  stroke="#111111"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="pointer-events-none"
                />
              </svg>
            </div>

            {/* RIGHT SIDE: CAPSICUM CUTTING IMAGES (z33.PNG) */}
            <div
              id="capsicum-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[533/606] flex items-center justify-center"
            >
              {isCapsicumBodyPlaced &&
                isCapsicumLeftLobePlaced &&
                isCapsicumRightLobePlaced &&
                isCapsicumStemPlaced &&
                isCapsicumTopLeftPlaced &&
                isCapsicumTopRightPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetCapsicum}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Left Outer Lobe (Far Left) */}
                {!isCapsicumLeftLobePlaced && (
                  <motion.div
                    id="cutting-capsicum-left-lobe"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCapsicumLeftLobeDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCapsicumLeftLobeColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '5%',
                      top: '22%',
                      width: `${(115 / 533) * 100}%`,
                      height: `${(305 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAPSICUM_LEFT_LOBE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAPSICUM_LEFT_LOBE_PATH}
                        fill={capsicumLeftLobeColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Top-Left Back Lobe (Middle Column, Top) */}
                {!isCapsicumTopLeftPlaced && (
                  <motion.div
                    id="cutting-capsicum-top-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCapsicumTopLeftDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCapsicumTopLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '28%',
                      top: '22%',
                      width: `${(97 / 533) * 100}%`,
                      height: `${(46 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAPSICUM_TOP_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAPSICUM_TOP_LEFT_PATH}
                        fill={capsicumTopLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Top-Right Back Lobe (Middle Column, Middle) */}
                {!isCapsicumTopRightPlaced && (
                  <motion.div
                    id="cutting-capsicum-top-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCapsicumTopRightDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCapsicumTopRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '30%',
                      top: '38%',
                      width: `${(109 / 533) * 100}%`,
                      height: `${(45 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAPSICUM_TOP_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAPSICUM_TOP_RIGHT_PATH}
                        fill={capsicumTopRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Stem (Middle Column, Bottom) */}
                {!isCapsicumStemPlaced && (
                  <motion.div
                    id="cutting-capsicum-stem"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCapsicumStemDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCapsicumStemColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_stem', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '29%',
                      top: '55%',
                      width: `${(144 / 533) * 100}%`,
                      height: `${(134 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAPSICUM_STEM_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAPSICUM_STEM_PATH}
                        fill={capsicumStemColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Right Outer Lobe (Middle Right) */}
                {!isCapsicumRightLobePlaced && (
                  <motion.div
                    id="cutting-capsicum-right-lobe"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCapsicumRightLobeDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCapsicumRightLobeColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_lobe', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '54%',
                      top: '20%',
                      width: `${(132 / 533) * 100}%`,
                      height: `${(298 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAPSICUM_RIGHT_LOBE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAPSICUM_RIGHT_LOBE_PATH}
                        fill={capsicumRightLobeColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Center Front Body (Far Right) */}
                {!isCapsicumBodyPlaced && (
                  <motion.div
                    id="cutting-capsicum-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCapsicumBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCapsicumBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('capsicum_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '68%',
                      top: '23%',
                      width: `${(204 / 533) * 100}%`,
                      height: `${(304 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAPSICUM_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAPSICUM_BODY_PATH}
                        fill={capsicumBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Victory Banner when completely assembled */}
                {isCapsicumBodyPlaced &&
                  isCapsicumLeftLobePlaced &&
                  isCapsicumRightLobePlaced &&
                  isCapsicumStemPlaced &&
                  isCapsicumTopLeftPlaced &&
                  isCapsicumTopRightPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ शिमला मिर्च सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'BRINJAL' ? (
          // ================================================================
          // BRINJAL / BAINGAN GAME SCREEN (z25_2031642b.PNG)
          // ================================================================
          <>
            {/* LEFT SIDE: BRINJAL OUTLINE IMAGE */}
            <div
              ref={outlineAreaRef}
              id="brinjal-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[533/606] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 533 606"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* Placed Body Fill */}
                {isBrinjalBodyPlaced && (
                  <path
                    d={BRINJAL_PLACED_BODY_PATH}
                    fill={brinjalBodyColor}
                    onClick={() => {
                      setBrinjalBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('brinjal_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}

                {/* Placed Calyx/Crown Fill */}
                {isBrinjalCalyxPlaced && (
                  <path
                    d={BRINJAL_PLACED_CALYX_PATH}
                    fill={brinjalCalyxColor}
                    onClick={() => {
                      setBrinjalCalyxColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('brinjal_calyx', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Exact black outline image from z25_2031642b.PNG */}
              <img
                src={brinjalOutlineImg}
                alt="Brinjal Outline"
                className="absolute inset-0 w-full h-full pointer-events-none select-none object-contain drop-shadow-sm"
              />
            </div>

            {/* RIGHT SIDE: BRINJAL CUTTING IMAGES (z25_2031642b.PNG) */}
            <div
              id="brinjal-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[533/606] flex items-center justify-center"
            >
              {isBrinjalBodyPlaced && isBrinjalCalyxPlaced && (
                <div className="absolute top-0 right-2 z-40">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetBrinjal}
                    className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                  >
                    ↺ फिर से बनाएँ
                  </motion.button>
                </div>
              )}

              <div className="relative w-full h-full">
                {/* 1. Calyx / Crown Cutting Piece (Top-Left of right side) */}
                {!isBrinjalCalyxPlaced && (
                  <motion.div
                    id="cutting-brinjal-calyx"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBrinjalCalyxDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBrinjalCalyxColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('brinjal_calyx', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '6%',
                      top: '10%',
                      width: `${(185 / 533) * 100}%`,
                      height: `${(164 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BRINJAL_CALYX_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BRINJAL_PLACED_CALYX_PATH}
                        fill={brinjalCalyxColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Brinjal Body Cutting Piece (Bottom-Right of right side) */}
                {!isBrinjalBodyPlaced && (
                  <motion.div
                    id="cutting-brinjal-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBrinjalBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBrinjalBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('brinjal_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '36%',
                      top: '18%',
                      width: `${(331 / 533) * 100}%`,
                      height: `${(364 / 606) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BRINJAL_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BRINJAL_PLACED_BODY_PATH}
                        fill={brinjalBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Victory Banner when completely assembled */}
                {isBrinjalBodyPlaced && isBrinjalCalyxPlaced && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center gap-3"
                  >
                    <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                      ⭐ बैंगन सही जगह लग गया! शाबाश! ⭐
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </>
        ) : currentStage === 'KITE' ? (
          // ================================================================
          // KITE GAME SCREEN (zq15.PNG) - EXACT OUTLINE & CUTTING IMAGE
          // ================================================================
          <>
            {/* LEFT SIDE: KITE OUTLINE IMAGE */}
            <div
              ref={outlineAreaRef}
              id="kite-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[500/650] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 500 650"
                className="w-full h-full drop-shadow-md overflow-visible"
              >
                {/* Placed Pieces */}
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

                {/* Outer Diamond Perimeter Outline */}
                <path
                  d={KITE_PERIMETER_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Curved Horizontal Cross Spar */}
                <path
                  d={KITE_CURVED_SPAR_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Central Vertical Spine */}
                <path
                  d={KITE_VERTICAL_SPINE_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Tail Triangle Bow */}
                <path
                  d={KITE_TAIL_BOW_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />

                {/* Wavy Tail String */}
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

            {/* RIGHT SIDE: KITE CUTTING IMAGES (zq15.PNG) */}
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

              <div className="relative w-full h-full">
                {/* 1. Top-Left Quad Cutting Piece */}
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
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2%',
                      top: '4.9%',
                      width: '40%',
                      height: '27.7%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="50 60 200 180"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <path
                        d={KITE_QUAD_TOP_LEFT_PATH}
                        fill={kiteTLColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Top-Right Quad Cutting Piece */}
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
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '58%',
                      top: '4.9%',
                      width: '40%',
                      height: '27.7%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="250 60 200 180"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <path
                        d={KITE_QUAD_TOP_RIGHT_PATH}
                        fill={kiteTRColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Small Center Tail Triangle Cutting Piece */}
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
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '39%',
                      top: '39.2%',
                      width: '22%',
                      height: '10%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="195 420 110 65"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <path
                        d={KITE_TAIL_TRIANGLE_PATH}
                        fill={kiteTailColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Bottom-Left Quad Cutting Piece */}
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
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2%',
                      top: '38.5%',
                      width: '40%',
                      height: '32.3%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="50 210 200 210"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <path
                        d={KITE_QUAD_BOTTOM_LEFT_PATH}
                        fill={kiteBLColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Bottom-Right Quad Cutting Piece */}
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
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '58%',
                      top: '38.5%',
                      width: '40%',
                      height: '32.3%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox="250 210 200 210"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
                    >
                      <path
                        d={KITE_QUAD_BOTTOM_RIGHT_PATH}
                        fill={kiteBRColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
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
        ) : currentStage === 'MANGO' ? (
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
                {/* 1. Splash 1 (Top Left) */}
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
                    style={{ left: '16%', top: '16%', width: '22%', height: '20%' }}
                  >
                    <svg viewBox="0 0 90 110" className="w-full h-full drop-shadow-md">
                      <path d={MANGO_SPLASH_1_PATH} fill={splash1Color} stroke="#e2e8f0" strokeWidth="1" />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Splash 2 (Middle Left) */}
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
                    style={{ left: '4%', top: '38%', width: '34%', height: '26%' }}
                  >
                    <svg viewBox="0 0 150 160" className="w-full h-full drop-shadow-md">
                      <path d={MANGO_SPLASH_2_PATH} fill={splash2Color} stroke="#e2e8f0" strokeWidth="1" />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Splash 3 (Bottom Left) */}
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
                    style={{ left: '16%', top: '66%', width: '32%', height: '22%' }}
                  >
                    <svg viewBox="0 0 160 130" className="w-full h-full drop-shadow-md">
                      <path d={MANGO_SPLASH_3_PATH} fill={splash3Color} stroke="#e2e8f0" strokeWidth="1" />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Mango Fruit Body */}
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
                    style={{ left: '40%', top: '12%', width: '58%', height: '82%' }}
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
        ) : (
          // ================================================================
          // APPLE GAME SCREEN (Stage 4 - Apple)
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
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
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
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* Stem */}
                <path d={APPLE_STEM_PATH} fill="#111111" />
                {/* Leaf Outline */}
                <path
                  d={APPLE_LEAF_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
                {/* Apple Body Outline */}
                <path
                  d={APPLE_BODY_PATH}
                  fill="transparent"
                  stroke="#111111"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
              </svg>
            </div>

            {/* RIGHT: Apple Cutting Images */}
            <div
              id="apple-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-square flex flex-col items-center justify-between py-2"
            >
              {isAppleBodyPlaced && isAppleLeafPlaced && (
                <div className="absolute top-0 right-2 z-40">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetApple}
                    className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                  >
                    ↺ फिर से बनाएँ
                  </motion.button>
                </div>
              )}

              {/* Cutting Piece 1: Leaf */}
              <div className="w-full h-[36%] flex items-center justify-center relative">
                {!isAppleLeafPlaced ? (
                  <motion.div
                    id="cutting-piece-apple-leaf"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAppleLeafDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAppleLeafColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('leaf', soundEnabled);
                    }}
                    className="cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ width: '110px', height: '65px' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
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

              {/* Cutting Piece 2: Apple Body */}
              <div className="w-full h-[62%] flex items-center justify-center relative">
                {!isAppleBodyPlaced ? (
                  <motion.div
                    id="cutting-piece-apple-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAppleBodyDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAppleBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('body', soundEnabled);
                    }}
                    className="cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ width: '160px', height: '160px' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
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
