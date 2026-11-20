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
import lollipopOutlineImg from '../assets/images/lollipop_outline.png';
import icecreamOutlineImg from '../assets/images/icecream_outline.png';
import henOutlineImg from '../assets/images/hen_outline.png';
import caterpillarOutlineImg from '../assets/images/caterpillar_outline.png';
import pinwheelOutlineImg from '../assets/images/pinwheel_outline.png';
import busOutlineImg from '../assets/images/bus_outline.png';
import boatOutlineImg from '../assets/images/boat_outline.png';
import houseOutlineImg from '../assets/images/house_outline.png';
import candleOutlineImg from '../assets/images/candle_outline.png';
import cakeOutlineImg from '../assets/images/cake_outline.png';
import tractorOutlineImg from '../assets/images/tractor_outline.png';
import glassesOutlineImg from '../assets/images/glasses_outline.png';
import purseOutlineImg from '../assets/images/purse_outline.png';
import scissorsOutlineImg from '../assets/images/scissors_outline.png';
import airplaneOutlineImg from '../assets/images/airplane_outline.png';
import elephantOutlineImg from '../assets/images/elephant_outline.png';
import bananaOutlineImg from '../assets/images/banana_outline.png';
import tulipOutlineImg from '../assets/images/tulip_outline.png';
import mangoOutlineImg from '../assets/images/mango_outline.png';
import {
  MANGO_STEM_VIEWBOX,
  MANGO_STEM_PATH,
  MANGO_LEAF_TOP_VIEWBOX,
  MANGO_LEAF_TOP_PATH,
  MANGO_LEAF_BOT_VIEWBOX,
  MANGO_LEAF_BOT_PATH,
  MANGO_BODY_VIEWBOX,
  MANGO_BODY_PATH,
  MANGO_PLACED_STEM_PATH,
  MANGO_PLACED_LEAF_TOP_PATH,
  MANGO_PLACED_LEAF_BOT_PATH,
  MANGO_PLACED_BODY_PATH,
} from './mango_constants';
import {
  TULIP_PETAL_TOP_VIEWBOX,
  TULIP_PETAL_TOP_PATH,
  TULIP_PETAL_LEFT_INNER_VIEWBOX,
  TULIP_PETAL_LEFT_INNER_PATH,
  TULIP_PETAL_RIGHT_INNER_VIEWBOX,
  TULIP_PETAL_RIGHT_INNER_PATH,
  TULIP_PETAL_LEFT_VIEWBOX,
  TULIP_PETAL_LEFT_PATH,
  TULIP_PETAL_CENTER_VIEWBOX,
  TULIP_PETAL_CENTER_PATH,
  TULIP_PETAL_RIGHT_VIEWBOX,
  TULIP_PETAL_RIGHT_PATH,
  TULIP_STEM_VIEWBOX,
  TULIP_STEM_PATH,
  TULIP_LEAF_LEFT_VIEWBOX,
  TULIP_LEAF_LEFT_PATH,
  TULIP_LEAF_RIGHT_VIEWBOX,
  TULIP_LEAF_RIGHT_PATH,
  TULIP_PLACED_PETAL_TOP_PATH,
  TULIP_PLACED_PETAL_LEFT_INNER_PATH,
  TULIP_PLACED_PETAL_RIGHT_INNER_PATH,
  TULIP_PLACED_PETAL_LEFT_PATH,
  TULIP_PLACED_PETAL_CENTER_PATH,
  TULIP_PLACED_PETAL_RIGHT_PATH,
  TULIP_PLACED_STEM_PATH,
  TULIP_PLACED_LEAF_LEFT_PATH,
  TULIP_PLACED_LEAF_RIGHT_PATH,
} from './tulip_constants';
import {
  AIRPLANE_BODY_VIEWBOX,
  AIRPLANE_BODY_PATH,
  AIRPLANE_COCKPIT_VIEWBOX,
  AIRPLANE_COCKPIT_PATH,
  AIRPLANE_WING_LEFT_VIEWBOX,
  AIRPLANE_WING_LEFT_PATH,
  AIRPLANE_ENGINE_L1_VIEWBOX,
  AIRPLANE_ENGINE_L1_PATH,
  AIRPLANE_ENGINE_L2_VIEWBOX,
  AIRPLANE_ENGINE_L2_PATH,
  AIRPLANE_WING_RIGHT_VIEWBOX,
  AIRPLANE_WING_RIGHT_PATH,
  AIRPLANE_ENGINE_R1_VIEWBOX,
  AIRPLANE_ENGINE_R1_PATH,
  AIRPLANE_ENGINE_R2_VIEWBOX,
  AIRPLANE_ENGINE_R2_PATH,
  AIRPLANE_TAIL_VIEWBOX,
  AIRPLANE_TAIL_PATH,
  AIRPLANE_PLACED_BODY_PATH,
  AIRPLANE_PLACED_COCKPIT_PATH,
  AIRPLANE_PLACED_WING_LEFT_PATH,
  AIRPLANE_PLACED_ENGINE_L1_PATH,
  AIRPLANE_PLACED_ENGINE_L2_PATH,
  AIRPLANE_PLACED_WING_RIGHT_PATH,
  AIRPLANE_PLACED_ENGINE_R1_PATH,
  AIRPLANE_PLACED_ENGINE_R2_PATH,
  AIRPLANE_PLACED_TAIL_PATH,
} from './airplane_constants';
import {
  ELEPHANT_HEAD_VIEWBOX,
  ELEPHANT_HEAD_PATH,
  ELEPHANT_BODY_VIEWBOX,
  ELEPHANT_BODY_PATH,
  ELEPHANT_TUSK_VIEWBOX,
  ELEPHANT_TUSK_PATH,
  ELEPHANT_LEG_BACK_VIEWBOX,
  ELEPHANT_LEG_BACK_PATH,
  ELEPHANT_LEG_FRONT_VIEWBOX,
  ELEPHANT_LEG_FRONT_PATH,
  ELEPHANT_PLACED_HEAD_PATH,
  ELEPHANT_PLACED_BODY_PATH,
  ELEPHANT_PLACED_TUSK_PATH,
  ELEPHANT_PLACED_LEG_BACK_PATH,
  ELEPHANT_PLACED_LEG_FRONT_PATH,
} from './elephant_constants';
import {
  BANANA_STEM_VIEWBOX,
  BANANA_STEM_PATH,
  BANANA_RIGHT_TOP_VIEWBOX,
  BANANA_RIGHT_TOP_PATH,
  BANANA_RIGHT_BOT_VIEWBOX,
  BANANA_RIGHT_BOT_PATH,
  BANANA_LEFT_TOP_VIEWBOX,
  BANANA_LEFT_TOP_PATH,
  BANANA_LEFT_BOT_VIEWBOX,
  BANANA_LEFT_BOT_PATH,
  BANANA_TIP_RIGHT_VIEWBOX,
  BANANA_TIP_RIGHT_PATH,
  BANANA_TIP_LEFT_VIEWBOX,
  BANANA_TIP_LEFT_PATH,
  BANANA_PLACED_STEM_PATH,
  BANANA_PLACED_RIGHT_TOP_PATH,
  BANANA_PLACED_RIGHT_BOT_PATH,
  BANANA_PLACED_LEFT_TOP_PATH,
  BANANA_PLACED_LEFT_BOT_PATH,
  BANANA_PLACED_TIP_RIGHT_PATH,
  BANANA_PLACED_TIP_LEFT_PATH,
} from './banana_constants';
import {
  SCISSORS_BLADE_LEFT_VIEWBOX,
  SCISSORS_BLADE_LEFT_PATH,
  SCISSORS_BLADE_RIGHT_VIEWBOX,
  SCISSORS_BLADE_RIGHT_PATH,
  SCISSORS_PIVOT_RING_VIEWBOX,
  SCISSORS_PIVOT_RING_PATH,
  SCISSORS_PIVOT_SCREW_VIEWBOX,
  SCISSORS_PIVOT_SCREW_PATH,
  SCISSORS_HANDLE_VIEWBOX,
  SCISSORS_HANDLE_PATH,
  SCISSORS_PLACED_BLADE_LEFT_PATH,
  SCISSORS_PLACED_BLADE_RIGHT_PATH,
  SCISSORS_PLACED_PIVOT_RING_PATH,
  SCISSORS_PLACED_PIVOT_SCREW_PATH,
  SCISSORS_PLACED_HANDLE_PATH,
} from './scissors_constants';
import {
  PURSE_HANDLE_VIEWBOX,
  PURSE_HANDLE_PATH,
  PURSE_RING_LEFT_VIEWBOX,
  PURSE_RING_LEFT_PATH,
  PURSE_RING_RIGHT_VIEWBOX,
  PURSE_RING_RIGHT_PATH,
  PURSE_FLAP_VIEWBOX,
  PURSE_FLAP_PATH,
  PURSE_BODY_VIEWBOX,
  PURSE_BODY_PATH,
  PURSE_LOCK_VIEWBOX,
  PURSE_LOCK_PATH,
  PURSE_PLACED_HANDLE_PATH,
  PURSE_PLACED_RING_LEFT_PATH,
  PURSE_PLACED_RING_RIGHT_PATH,
  PURSE_PLACED_FLAP_PATH,
  PURSE_PLACED_BODY_PATH,
  PURSE_PLACED_LOCK_PATH,
} from './purse_constants';
import {
  GLASSES_ARM_LEFT_VIEWBOX,
  GLASSES_ARM_LEFT_PATH,
  GLASSES_ARM_RIGHT_VIEWBOX,
  GLASSES_ARM_RIGHT_PATH,
  GLASSES_FRAME_VIEWBOX,
  GLASSES_FRAME_PATH,
  GLASSES_LENS_LEFT_VIEWBOX,
  GLASSES_LENS_LEFT_PATH,
  GLASSES_LENS_RIGHT_VIEWBOX,
  GLASSES_LENS_RIGHT_PATH,
  GLASSES_PLACED_ARM_LEFT_PATH,
  GLASSES_PLACED_ARM_RIGHT_PATH,
  GLASSES_PLACED_FRAME_PATH,
  GLASSES_PLACED_LENS_LEFT_PATH,
  GLASSES_PLACED_LENS_RIGHT_PATH,
} from './glasses_constants';
import {
  TRACTOR_BODY_VIEWBOX,
  TRACTOR_BODY_PATH,
  TRACTOR_WIN_LEFT_VIEWBOX,
  TRACTOR_WIN_LEFT_PATH,
  TRACTOR_WIN_RIGHT_VIEWBOX,
  TRACTOR_WIN_RIGHT_PATH,
  TRACTOR_EXHAUST_VIEWBOX,
  TRACTOR_EXHAUST_PATH,
  TRACTOR_FENDER_VIEWBOX,
  TRACTOR_FENDER_PATH,
  TRACTOR_TIRE_REAR_VIEWBOX,
  TRACTOR_TIRE_REAR_PATH,
  TRACTOR_HUB_REAR_VIEWBOX,
  TRACTOR_HUB_REAR_PATH,
  TRACTOR_TIRE_FRONT_VIEWBOX,
  TRACTOR_TIRE_FRONT_PATH,
  TRACTOR_HUB_FRONT_VIEWBOX,
  TRACTOR_HUB_FRONT_PATH,
  TRACTOR_PLACED_BODY_PATH,
  TRACTOR_PLACED_WIN_LEFT_PATH,
  TRACTOR_PLACED_WIN_RIGHT_PATH,
  TRACTOR_PLACED_EXHAUST_PATH,
  TRACTOR_PLACED_FENDER_PATH,
  TRACTOR_PLACED_TIRE_REAR_PATH,
  TRACTOR_PLACED_HUB_REAR_PATH,
  TRACTOR_PLACED_TIRE_FRONT_PATH,
  TRACTOR_PLACED_HUB_FRONT_PATH,
} from './tractor_constants';
import {
  CAKE_TOP_VIEWBOX,
  CAKE_TOP_PATH,
  CAKE_HEART_TOP_VIEWBOX,
  CAKE_HEART_TOP_PATH,
  CAKE_HEART_LEFT_VIEWBOX,
  CAKE_HEART_LEFT_PATH,
  CAKE_HEART_RIGHT_VIEWBOX,
  CAKE_HEART_RIGHT_PATH,
  CAKE_LAYER_TOP_VIEWBOX,
  CAKE_LAYER_TOP_PATH,
  CAKE_LAYER_BOT_VIEWBOX,
  CAKE_LAYER_BOT_PATH,
  CAKE_PLATE_VIEWBOX,
  CAKE_PLATE_PATH,
  CAKE_PLACED_TOP_PATH,
  CAKE_PLACED_HEART_TOP_PATH,
  CAKE_PLACED_HEART_LEFT_PATH,
  CAKE_PLACED_HEART_RIGHT_PATH,
  CAKE_PLACED_LAYER_TOP_PATH,
  CAKE_PLACED_LAYER_BOT_PATH,
  CAKE_PLACED_PLATE_PATH,
} from './cake_constants';
import {
  CANDLE_FLAME_VIEWBOX,
  CANDLE_FLAME_PATH,
  CANDLE_WICK_VIEWBOX,
  CANDLE_WICK_PATH,
  CANDLE_WAX_VIEWBOX,
  CANDLE_WAX_PATH,
  CANDLE_BODY_VIEWBOX,
  CANDLE_BODY_PATH,
  CANDLE_PLACED_FLAME_PATH,
  CANDLE_PLACED_WICK_PATH,
  CANDLE_PLACED_WAX_PATH,
  CANDLE_PLACED_BODY_PATH,
} from './candle_constants';
import {
  HOUSE_CHIMNEY_VIEWBOX,
  HOUSE_CHIMNEY_PATH,
  HOUSE_ROOF_VIEWBOX,
  HOUSE_ROOF_PATH,
  HOUSE_WIN_TOP_VIEWBOX,
  HOUSE_WIN_TOP_PATH,
  HOUSE_WALL_VIEWBOX,
  HOUSE_WALL_PATH,
  HOUSE_WIN_BOT_VIEWBOX,
  HOUSE_WIN_BOT_PATH,
  HOUSE_DOOR_VIEWBOX,
  HOUSE_DOOR_PATH,
  HOUSE_BASE_LEFT_VIEWBOX,
  HOUSE_BASE_LEFT_PATH,
  HOUSE_BASE_RIGHT_VIEWBOX,
  HOUSE_BASE_RIGHT_PATH,
  HOUSE_PLACED_CHIMNEY_PATH,
  HOUSE_PLACED_ROOF_PATH,
  HOUSE_PLACED_WIN_TOP_PATH,
  HOUSE_PLACED_WALL_PATH,
  HOUSE_PLACED_WIN_BOT_PATH,
  HOUSE_PLACED_DOOR_PATH,
  HOUSE_PLACED_BASE_LEFT_PATH,
  HOUSE_PLACED_BASE_RIGHT_PATH,
} from './house_constants';
import {
  BOAT_MAST_VIEWBOX,
  BOAT_MAST_PATH,
  BOAT_SAIL_LTOP_VIEWBOX,
  BOAT_SAIL_LTOP_PATH,
  BOAT_SAIL_LMID_VIEWBOX,
  BOAT_SAIL_LMID_PATH,
  BOAT_SAIL_LBOT_VIEWBOX,
  BOAT_SAIL_LBOT_PATH,
  BOAT_SAIL_RIGHT_VIEWBOX,
  BOAT_SAIL_RIGHT_PATH,
  BOAT_HULL_TOP_VIEWBOX,
  BOAT_HULL_TOP_PATH,
  BOAT_HULL_BOT_VIEWBOX,
  BOAT_HULL_BOT_PATH,
  BOAT_PLACED_MAST_PATH,
  BOAT_PLACED_SAIL_LTOP_PATH,
  BOAT_PLACED_SAIL_LMID_PATH,
  BOAT_PLACED_SAIL_LBOT_PATH,
  BOAT_PLACED_SAIL_RIGHT_PATH,
  BOAT_PLACED_HULL_TOP_PATH,
  BOAT_PLACED_HULL_BOT_PATH,
} from './boat_constants';
import {
  BUS_BODY_VIEWBOX,
  BUS_BODY_PATH,
  BUS_WIN1_VIEWBOX,
  BUS_WIN1_PATH,
  BUS_WIN2_VIEWBOX,
  BUS_WIN2_PATH,
  BUS_WIN3_VIEWBOX,
  BUS_WIN3_PATH,
  BUS_WIN4_VIEWBOX,
  BUS_WIN4_PATH,
  BUS_WHEEL1_VIEWBOX,
  BUS_WHEEL1_PATH,
  BUS_WHEEL2_VIEWBOX,
  BUS_WHEEL2_PATH,
  BUS_PLACED_BODY_PATH,
  BUS_PLACED_WIN1_PATH,
  BUS_PLACED_WIN2_PATH,
  BUS_PLACED_WIN3_PATH,
  BUS_PLACED_WIN4_PATH,
  BUS_PLACED_WHEEL1_PATH,
  BUS_PLACED_WHEEL2_PATH,
} from './bus_constants';
import {
  PINWHEEL_BLADE_TL_VIEWBOX,
  PINWHEEL_BLADE_TL_PATH,
  PINWHEEL_BLADE_TR_VIEWBOX,
  PINWHEEL_BLADE_TR_PATH,
  PINWHEEL_CENTER_VIEWBOX,
  PINWHEEL_CENTER_PATH,
  PINWHEEL_BLADE_BR_VIEWBOX,
  PINWHEEL_BLADE_BR_PATH,
  PINWHEEL_BLADE_BL_VIEWBOX,
  PINWHEEL_BLADE_BL_PATH,
  PINWHEEL_STICK_VIEWBOX,
  PINWHEEL_STICK_PATH,
  PINWHEEL_PLACED_BLADE_TL_PATH,
  PINWHEEL_PLACED_BLADE_TR_PATH,
  PINWHEEL_PLACED_CENTER_PATH,
  PINWHEEL_PLACED_BLADE_BR_PATH,
  PINWHEEL_PLACED_BLADE_BL_PATH,
  PINWHEEL_PLACED_STICK_PATH,
} from './pinwheel_constants';
import {
  CATERPILLAR_SEG1_VIEWBOX,
  CATERPILLAR_SEG1_PATH,
  CATERPILLAR_SEG2_VIEWBOX,
  CATERPILLAR_SEG2_PATH,
  CATERPILLAR_SEG3_VIEWBOX,
  CATERPILLAR_SEG3_PATH,
  CATERPILLAR_SEG4_VIEWBOX,
  CATERPILLAR_SEG4_PATH,
  CATERPILLAR_HEAD_VIEWBOX,
  CATERPILLAR_HEAD_PATH,
  CATERPILLAR_PLACED_SEG1_PATH,
  CATERPILLAR_PLACED_SEG2_PATH,
  CATERPILLAR_PLACED_SEG3_PATH,
  CATERPILLAR_PLACED_SEG4_PATH,
  CATERPILLAR_PLACED_HEAD_PATH,
} from './caterpillar_constants';
import {
  HEN_COMB_VIEWBOX,
  HEN_COMB_PATH,
  HEN_HEAD_VIEWBOX,
  HEN_HEAD_PATH,
  HEN_BEAK_VIEWBOX,
  HEN_BEAK_PATH,
  HEN_WATTLE_VIEWBOX,
  HEN_WATTLE_PATH,
  HEN_BODY_VIEWBOX,
  HEN_BODY_PATH,
  HEN_LEFT_FOOT_VIEWBOX,
  HEN_LEFT_FOOT_PATH,
  HEN_RIGHT_FOOT_VIEWBOX,
  HEN_RIGHT_FOOT_PATH,
  HEN_PLACED_COMB_PATH,
  HEN_PLACED_HEAD_PATH,
  HEN_PLACED_BEAK_PATH,
  HEN_PLACED_WATTLE_PATH,
  HEN_PLACED_BODY_PATH,
  HEN_PLACED_LEFT_FOOT_PATH,
  HEN_PLACED_RIGHT_FOOT_PATH,
} from './hen_constants';
import {
  ICECREAM_TOP_VIEWBOX,
  ICECREAM_TOP_PATH,
  ICECREAM_BODY_VIEWBOX,
  ICECREAM_BODY_PATH,
  ICECREAM_STICK_VIEWBOX,
  ICECREAM_STICK_PATH,
  ICECREAM_PLACED_TOP_PATH,
  ICECREAM_PLACED_BODY_PATH,
  ICECREAM_PLACED_STICK_PATH,
} from './icecream_constants';
import {
  LOLLIPOP_TOP_VIEWBOX,
  LOLLIPOP_TOP_PATH,
  LOLLIPOP_BAND_VIEWBOX,
  LOLLIPOP_BAND_PATH,
  LOLLIPOP_BOTTOM_VIEWBOX,
  LOLLIPOP_BOTTOM_PATH,
  LOLLIPOP_STICK_VIEWBOX,
  LOLLIPOP_STICK_PATH,
  LOLLIPOP_PLACED_TOP_PATH,
  LOLLIPOP_PLACED_BAND_PATH,
  LOLLIPOP_PLACED_BOTTOM_PATH,
  LOLLIPOP_PLACED_STICK_PATH,
} from './lollipop_constants';
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
// 5. APPLE GEOMETRY (Stage 5 - Apple Screen) - Coordinate space (0 0 400 400)
// ============================================================================
const APPLE_BODY_PATH =
  'M 200 115 C 150 72, 60 92, 45 172 C 35 235, 52 315, 112 365 C 152 398, 185 378, 200 362 C 215 378, 248 398, 288 365 C 348 315, 365 235, 355 172 C 340 92, 250 72, 200 115 Z';

const APPLE_STEM_PATH =
  'M 194 118 C 190 70, 172 38, 142 22 C 150 20, 160 22, 164 26 C 190 48, 204 78, 206 118 Z';

const APPLE_LEAF_PATH =
  'M 205 110 C 220 52, 280 25, 335 38 C 305 85, 250 120, 205 110 Z';

const STAGE_ORDER = [
  'APPLE',       // 1
  'MANGO',       // 2
  'PINWHEEL',    // 3 (फिरकी)
  'LOLLIPOP',    // 4
  'ICECREAM',    // 5
  'CANDLE',      // 6 (मोमबत्ती)
  'JUG',         // 7
  'HAT',         // 8
  'BRINJAL',     // 9
  'KITE',        // 10 (पतंग)
  'BALL',        // 11
  'UMBRELLA',    // 12 (छाता)
  'GLASSES',     // 13 (चश्मा)
  'DUCK',        // 14 (बतख)
  'BUTTERFLY',   // 15 (तितली)
  'TULIP',       // 16
  'AIRPLANE',    // 17
  'ELEPHANT',    // 18
  'BANANA',      // 19
  'SCISSORS',    // 20
  'PURSE',       // 21
  'TRACTOR',     // 22
  'CAKE',        // 23
  'HOUSE',       // 24
  'BOAT',        // 25
  'BUS',         // 26
  'CATERPILLAR', // 27
  'HEN',         // 28
  'FLOWER',      // 29
  'CAPSICUM',    // 30
] as const;

type GameStage = (typeof STAGE_ORDER)[number];

export const DrawingStage: React.FC<DrawingStageProps> = ({ onHome, soundEnabled }) => {
  // Current game stage: starts on APPLE (1st in sequence)
  const [currentStage, setCurrentStage] = useState<GameStage>('APPLE');

  // Currently active selected color from bottom 6 buttons
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]); // Default RED

  // ---------------------------------------------------------
  // MANGO STAGE STATES (Fruits_Coloring_Pages_for_Kids___Fun_Printable_Learning_Activity_b8c6aa74.jfif)
  // ---------------------------------------------------------
  const [mangoStemColor, setMangoStemColor] = useState<string>('#ffffff');
  const [isMangoStemPlaced, setIsMangoStemPlaced] = useState<boolean>(false);

  const [mangoLeafTopColor, setMangoLeafTopColor] = useState<string>('#ffffff');
  const [isMangoLeafTopPlaced, setIsMangoLeafTopPlaced] = useState<boolean>(false);

  const [mangoLeafBotColor, setMangoLeafBotColor] = useState<string>('#ffffff');
  const [isMangoLeafBotPlaced, setIsMangoLeafBotPlaced] = useState<boolean>(false);

  const [mangoBodyColor, setMangoBodyColor] = useState<string>('#ffffff');
  const [isMangoBodyPlaced, setIsMangoBodyPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // TULIP STAGE STATES (794674296795607881_4d711042.jfif)
  // ---------------------------------------------------------
  const [tulipPetalTopColor, setTulipPetalTopColor] = useState<string>('#ffffff');
  const [isTulipPetalTopPlaced, setIsTulipPetalTopPlaced] = useState<boolean>(false);

  const [tulipPetalLeftInnerColor, setTulipPetalLeftInnerColor] = useState<string>('#ffffff');
  const [isTulipPetalLeftInnerPlaced, setIsTulipPetalLeftInnerPlaced] = useState<boolean>(false);

  const [tulipPetalRightInnerColor, setTulipPetalRightInnerColor] = useState<string>('#ffffff');
  const [isTulipPetalRightInnerPlaced, setIsTulipPetalRightInnerPlaced] = useState<boolean>(false);

  const [tulipPetalLeftColor, setTulipPetalLeftColor] = useState<string>('#ffffff');
  const [isTulipPetalLeftPlaced, setIsTulipPetalLeftPlaced] = useState<boolean>(false);

  const [tulipPetalCenterColor, setTulipPetalCenterColor] = useState<string>('#ffffff');
  const [isTulipPetalCenterPlaced, setIsTulipPetalCenterPlaced] = useState<boolean>(false);

  const [tulipPetalRightColor, setTulipPetalRightColor] = useState<string>('#ffffff');
  const [isTulipPetalRightPlaced, setIsTulipPetalRightPlaced] = useState<boolean>(false);

  const [tulipStemColor, setTulipStemColor] = useState<string>('#ffffff');
  const [isTulipStemPlaced, setIsTulipStemPlaced] = useState<boolean>(false);

  const [tulipLeafLeftColor, setTulipLeafLeftColor] = useState<string>('#ffffff');
  const [isTulipLeafLeftPlaced, setIsTulipLeafLeftPlaced] = useState<boolean>(false);

  const [tulipLeafRightColor, setTulipLeafRightColor] = useState<string>('#ffffff');
  const [isTulipLeafRightPlaced, setIsTulipLeafRightPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // AIRPLANE STAGE STATES (Download_Airplane_Outline_Icon_for_free_423f2f1c.jfif)
  // ---------------------------------------------------------
  const [airplaneBodyColor, setAirplaneBodyColor] = useState<string>('#ffffff');
  const [isAirplaneBodyPlaced, setIsAirplaneBodyPlaced] = useState<boolean>(false);

  const [airplaneCockpitColor, setAirplaneCockpitColor] = useState<string>('#ffffff');
  const [isAirplaneCockpitPlaced, setIsAirplaneCockpitPlaced] = useState<boolean>(false);

  const [airplaneWingLeftColor, setAirplaneWingLeftColor] = useState<string>('#ffffff');
  const [isAirplaneWingLeftPlaced, setIsAirplaneWingLeftPlaced] = useState<boolean>(false);

  const [airplaneEngineL1Color, setAirplaneEngineL1Color] = useState<string>('#ffffff');
  const [isAirplaneEngineL1Placed, setIsAirplaneEngineL1Placed] = useState<boolean>(false);

  const [airplaneEngineL2Color, setAirplaneEngineL2Color] = useState<string>('#ffffff');
  const [isAirplaneEngineL2Placed, setIsAirplaneEngineL2Placed] = useState<boolean>(false);

  const [airplaneWingRightColor, setAirplaneWingRightColor] = useState<string>('#ffffff');
  const [isAirplaneWingRightPlaced, setIsAirplaneWingRightPlaced] = useState<boolean>(false);

  const [airplaneEngineR1Color, setAirplaneEngineR1Color] = useState<string>('#ffffff');
  const [isAirplaneEngineR1Placed, setIsAirplaneEngineR1Placed] = useState<boolean>(false);

  const [airplaneEngineR2Color, setAirplaneEngineR2Color] = useState<string>('#ffffff');
  const [isAirplaneEngineR2Placed, setIsAirplaneEngineR2Placed] = useState<boolean>(false);

  const [airplaneTailColor, setAirplaneTailColor] = useState<string>('#ffffff');
  const [isAirplaneTailPlaced, setIsAirplaneTailPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // ELEPHANT STAGE STATES (Elephant_Simple_Art_Kids_SVG___PNG___JPG_Clipart_-_Free_Commercial_Use_fa9fb73f.jfif)
  // ---------------------------------------------------------
  const [elephantHeadColor, setElephantHeadColor] = useState<string>('#ffffff');
  const [isElephantHeadPlaced, setIsElephantHeadPlaced] = useState<boolean>(false);

  const [elephantBodyColor, setElephantBodyColor] = useState<string>('#ffffff');
  const [isElephantBodyPlaced, setIsElephantBodyPlaced] = useState<boolean>(false);

  const [elephantTuskColor, setElephantTuskColor] = useState<string>('#ffffff');
  const [isElephantTuskPlaced, setIsElephantTuskPlaced] = useState<boolean>(false);

  const [elephantLegBackColor, setElephantLegBackColor] = useState<string>('#ffffff');
  const [isElephantLegBackPlaced, setIsElephantLegBackPlaced] = useState<boolean>(false);

  const [elephantLegFrontColor, setElephantLegFrontColor] = useState<string>('#ffffff');
  const [isElephantLegFrontPlaced, setIsElephantLegFrontPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // BANANA STAGE STATES (download__25__6eb93c33.jfif)
  // ---------------------------------------------------------
  const [bananaStemColor, setBananaStemColor] = useState<string>('#ffffff');
  const [isBananaStemPlaced, setIsBananaStemPlaced] = useState<boolean>(false);

  const [bananaRightTopColor, setBananaRightTopColor] = useState<string>('#ffffff');
  const [isBananaRightTopPlaced, setIsBananaRightTopPlaced] = useState<boolean>(false);

  const [bananaRightBotColor, setBananaRightBotColor] = useState<string>('#ffffff');
  const [isBananaRightBotPlaced, setIsBananaRightBotPlaced] = useState<boolean>(false);

  const [bananaLeftTopColor, setBananaLeftTopColor] = useState<string>('#ffffff');
  const [isBananaLeftTopPlaced, setIsBananaLeftTopPlaced] = useState<boolean>(false);

  const [bananaLeftBotColor, setBananaLeftBotColor] = useState<string>('#ffffff');
  const [isBananaLeftBotPlaced, setIsBananaLeftBotPlaced] = useState<boolean>(false);

  const [bananaTipRightColor, setBananaTipRightColor] = useState<string>('#ffffff');
  const [isBananaTipRightPlaced, setIsBananaTipRightPlaced] = useState<boolean>(false);

  const [bananaTipLeftColor, setBananaTipLeftColor] = useState<string>('#ffffff');
  const [isBananaTipLeftPlaced, setIsBananaTipLeftPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // SCISSORS STAGE STATES (download__24__970e0629.jfif)
  // ---------------------------------------------------------
  const [scissorsBladeLeftColor, setScissorsBladeLeftColor] = useState<string>('#ffffff');
  const [isScissorsBladeLeftPlaced, setIsScissorsBladeLeftPlaced] = useState<boolean>(false);

  const [scissorsBladeRightColor, setScissorsBladeRightColor] = useState<string>('#ffffff');
  const [isScissorsBladeRightPlaced, setIsScissorsBladeRightPlaced] = useState<boolean>(false);

  const [scissorsPivotRingColor, setScissorsPivotRingColor] = useState<string>('#ffffff');
  const [isScissorsPivotRingPlaced, setIsScissorsPivotRingPlaced] = useState<boolean>(false);

  const [scissorsPivotScrewColor, setScissorsPivotScrewColor] = useState<string>('#ffffff');
  const [isScissorsPivotScrewPlaced, setIsScissorsPivotScrewPlaced] = useState<boolean>(false);

  const [scissorsHandleColor, setScissorsHandleColor] = useState<string>('#ffffff');
  const [isScissorsHandlePlaced, setIsScissorsHandlePlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // PURSE STAGE STATES (download__23__4d55ddc4.jfif)
  // ---------------------------------------------------------
  const [purseHandleColor, setPurseHandleColor] = useState<string>('#ffffff');
  const [isPurseHandlePlaced, setIsPurseHandlePlaced] = useState<boolean>(false);

  const [purseRingLeftColor, setPurseRingLeftColor] = useState<string>('#ffffff');
  const [isPurseRingLeftPlaced, setIsPurseRingLeftPlaced] = useState<boolean>(false);

  const [purseRingRightColor, setPurseRingRightColor] = useState<string>('#ffffff');
  const [isPurseRingRightPlaced, setIsPurseRingRightPlaced] = useState<boolean>(false);

  const [purseFlapColor, setPurseFlapColor] = useState<string>('#ffffff');
  const [isPurseFlapPlaced, setIsPurseFlapPlaced] = useState<boolean>(false);

  const [purseBodyColor, setPurseBodyColor] = useState<string>('#ffffff');
  const [isPurseBodyPlaced, setIsPurseBodyPlaced] = useState<boolean>(false);

  const [purseLockColor, setPurseLockColor] = useState<string>('#ffffff');
  const [isPurseLockPlaced, setIsPurseLockPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // GLASSES STAGE STATES (Vision_eyeglasses_icon_outline_vector__Eye_test_3c390372.jfif)
  // ---------------------------------------------------------
  const [glassesArmLeftColor, setGlassesArmLeftColor] = useState<string>('#ffffff');
  const [isGlassesArmLeftPlaced, setIsGlassesArmLeftPlaced] = useState<boolean>(false);

  const [glassesArmRightColor, setGlassesArmRightColor] = useState<string>('#ffffff');
  const [isGlassesArmRightPlaced, setIsGlassesArmRightPlaced] = useState<boolean>(false);

  const [glassesFrameColor, setGlassesFrameColor] = useState<string>('#ffffff');
  const [isGlassesFramePlaced, setIsGlassesFramePlaced] = useState<boolean>(false);

  const [glassesLensLeftColor, setGlassesLensLeftColor] = useState<string>('#ffffff');
  const [isGlassesLensLeftPlaced, setIsGlassesLensLeftPlaced] = useState<boolean>(false);

  const [glassesLensRightColor, setGlassesLensRightColor] = useState<string>('#ffffff');
  const [isGlassesLensRightPlaced, setIsGlassesLensRightPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // TRACTOR STAGE STATES (Tractor_-_Graphics_by_Canva_c2293e43.jfif)
  // ---------------------------------------------------------
  const [tractorBodyColor, setTractorBodyColor] = useState<string>('#ffffff');
  const [isTractorBodyPlaced, setIsTractorBodyPlaced] = useState<boolean>(false);

  const [tractorWinLeftColor, setTractorWinLeftColor] = useState<string>('#ffffff');
  const [isTractorWinLeftPlaced, setIsTractorWinLeftPlaced] = useState<boolean>(false);

  const [tractorWinRightColor, setTractorWinRightColor] = useState<string>('#ffffff');
  const [isTractorWinRightPlaced, setIsTractorWinRightPlaced] = useState<boolean>(false);

  const [tractorExhaustColor, setTractorExhaustColor] = useState<string>('#ffffff');
  const [isTractorExhaustPlaced, setIsTractorExhaustPlaced] = useState<boolean>(false);

  const [tractorFenderColor, setTractorFenderColor] = useState<string>('#ffffff');
  const [isTractorFenderPlaced, setIsTractorFenderPlaced] = useState<boolean>(false);

  const [tractorTireRearColor, setTractorTireRearColor] = useState<string>('#ffffff');
  const [isTractorTireRearPlaced, setIsTractorTireRearPlaced] = useState<boolean>(false);

  const [tractorHubRearColor, setTractorHubRearColor] = useState<string>('#ffffff');
  const [isTractorHubRearPlaced, setIsTractorHubRearPlaced] = useState<boolean>(false);

  const [tractorTireFrontColor, setTractorTireFrontColor] = useState<string>('#ffffff');
  const [isTractorTireFrontPlaced, setIsTractorTireFrontPlaced] = useState<boolean>(false);

  const [tractorHubFrontColor, setTractorHubFrontColor] = useState<string>('#ffffff');
  const [isTractorHubFrontPlaced, setIsTractorHubFrontPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // CAKE STAGE STATES (Coloring_page_10ce63ff.jfif)
  // ---------------------------------------------------------
  const [cakeTopColor, setCakeTopColor] = useState<string>('#ffffff');
  const [isCakeTopPlaced, setIsCakeTopPlaced] = useState<boolean>(false);

  const [cakeHeartTopColor, setCakeHeartTopColor] = useState<string>('#ffffff');
  const [isCakeHeartTopPlaced, setIsCakeHeartTopPlaced] = useState<boolean>(false);

  const [cakeHeartLeftColor, setCakeHeartLeftColor] = useState<string>('#ffffff');
  const [isCakeHeartLeftPlaced, setIsCakeHeartLeftPlaced] = useState<boolean>(false);

  const [cakeHeartRightColor, setCakeHeartRightColor] = useState<string>('#ffffff');
  const [isCakeHeartRightPlaced, setIsCakeHeartRightPlaced] = useState<boolean>(false);

  const [cakeLayerTopColor, setCakeLayerTopColor] = useState<string>('#ffffff');
  const [isCakeLayerTopPlaced, setIsCakeLayerTopPlaced] = useState<boolean>(false);

  const [cakeLayerBotColor, setCakeLayerBotColor] = useState<string>('#ffffff');
  const [isCakeLayerBotPlaced, setIsCakeLayerBotPlaced] = useState<boolean>(false);

  const [cakePlateColor, setCakePlateColor] = useState<string>('#ffffff');
  const [isCakePlatePlaced, setIsCakePlatePlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // CANDLE STAGE STATES (dibujos-de-vela-para-colorear-11_png__1137_1517__ea93299f.jfif)
  // ---------------------------------------------------------
  const [candleFlameColor, setCandleFlameColor] = useState<string>('#ffffff');
  const [isCandleFlamePlaced, setIsCandleFlamePlaced] = useState<boolean>(false);

  const [candleWickColor, setCandleWickColor] = useState<string>('#ffffff');
  const [isCandleWickPlaced, setIsCandleWickPlaced] = useState<boolean>(false);

  const [candleWaxColor, setCandleWaxColor] = useState<string>('#ffffff');
  const [isCandleWaxPlaced, setIsCandleWaxPlaced] = useState<boolean>(false);

  const [candleBodyColor, setCandleBodyColor] = useState<string>('#ffffff');
  const [isCandleBodyPlaced, setIsCandleBodyPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // HOUSE STAGE STATES (Kinderd_Canvas___Digital_Store_66dece07.jfif)
  // ---------------------------------------------------------
  const [houseChimneyColor, setHouseChimneyColor] = useState<string>('#ffffff');
  const [isHouseChimneyPlaced, setIsHouseChimneyPlaced] = useState<boolean>(false);

  const [houseRoofColor, setHouseRoofColor] = useState<string>('#ffffff');
  const [isHouseRoofPlaced, setIsHouseRoofPlaced] = useState<boolean>(false);

  const [houseWinTopColor, setHouseWinTopColor] = useState<string>('#ffffff');
  const [isHouseWinTopPlaced, setIsHouseWinTopPlaced] = useState<boolean>(false);

  const [houseWallColor, setHouseWallColor] = useState<string>('#ffffff');
  const [isHouseWallPlaced, setIsHouseWallPlaced] = useState<boolean>(false);

  const [houseWinBotColor, setHouseWinBotColor] = useState<string>('#ffffff');
  const [isHouseWinBotPlaced, setIsHouseWinBotPlaced] = useState<boolean>(false);

  const [houseDoorColor, setHouseDoorColor] = useState<string>('#ffffff');
  const [isHouseDoorPlaced, setIsHouseDoorPlaced] = useState<boolean>(false);

  const [houseBaseLeftColor, setHouseBaseLeftColor] = useState<string>('#ffffff');
  const [isHouseBaseLeftPlaced, setIsHouseBaseLeftPlaced] = useState<boolean>(false);

  const [houseBaseRightColor, setHouseBaseRightColor] = useState<string>('#ffffff');
  const [isHouseBaseRightPlaced, setIsHouseBaseRightPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // BOAT STAGE STATES (540361655284408540_334b6940.jfif)
  // ---------------------------------------------------------
  const [boatMastColor, setBoatMastColor] = useState<string>('#ffffff');
  const [isBoatMastPlaced, setIsBoatMastPlaced] = useState<boolean>(false);

  const [boatSailLTopColor, setBoatSailLTopColor] = useState<string>('#ffffff');
  const [isBoatSailLTopPlaced, setIsBoatSailLTopPlaced] = useState<boolean>(false);

  const [boatSailLMidColor, setBoatSailLMidColor] = useState<string>('#ffffff');
  const [isBoatSailLMidPlaced, setIsBoatSailLMidPlaced] = useState<boolean>(false);

  const [boatSailLBotColor, setBoatSailLBotColor] = useState<string>('#ffffff');
  const [isBoatSailLBotPlaced, setIsBoatSailLBotPlaced] = useState<boolean>(false);

  const [boatSailRightColor, setBoatSailRightColor] = useState<string>('#ffffff');
  const [isBoatSailRightPlaced, setIsBoatSailRightPlaced] = useState<boolean>(false);

  const [boatHullTopColor, setBoatHullTopColor] = useState<string>('#ffffff');
  const [isBoatHullTopPlaced, setIsBoatHullTopPlaced] = useState<boolean>(false);

  const [boatHullBotColor, setBoatHullBotColor] = useState<string>('#ffffff');
  const [isBoatHullBotPlaced, setIsBoatHullBotPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // BUS STAGE STATES (download__26__92570187.jfif)
  // ---------------------------------------------------------
  const [busBodyColor, setBusBodyColor] = useState<string>('#ffffff');
  const [isBusBodyPlaced, setIsBusBodyPlaced] = useState<boolean>(false);

  const [busWin1Color, setBusWin1Color] = useState<string>('#ffffff');
  const [isBusWin1Placed, setIsBusWin1Placed] = useState<boolean>(false);

  const [busWin2Color, setBusWin2Color] = useState<string>('#ffffff');
  const [isBusWin2Placed, setIsBusWin2Placed] = useState<boolean>(false);

  const [busWin3Color, setBusWin3Color] = useState<string>('#ffffff');
  const [isBusWin3Placed, setIsBusWin3Placed] = useState<boolean>(false);

  const [busWin4Color, setBusWin4Color] = useState<string>('#ffffff');
  const [isBusWin4Placed, setIsBusWin4Placed] = useState<boolean>(false);

  const [busWheel1Color, setBusWheel1Color] = useState<string>('#ffffff');
  const [isBusWheel1Placed, setIsBusWheel1Placed] = useState<boolean>(false);

  const [busWheel2Color, setBusWheel2Color] = useState<string>('#ffffff');
  const [isBusWheel2Placed, setIsBusWheel2Placed] = useState<boolean>(false);

  // ---------------------------------------------------------
  // PINWHEEL STAGE STATES (download__22__a51dd624.jfif)
  // ---------------------------------------------------------
  const [pinwheelBladeTLColor, setPinwheelBladeTLColor] = useState<string>('#ffffff');
  const [isPinwheelBladeTLPlaced, setIsPinwheelBladeTLPlaced] = useState<boolean>(false);

  const [pinwheelBladeTRColor, setPinwheelBladeTRColor] = useState<string>('#ffffff');
  const [isPinwheelBladeTRPlaced, setIsPinwheelBladeTRPlaced] = useState<boolean>(false);

  const [pinwheelCenterColor, setPinwheelCenterColor] = useState<string>('#ffffff');
  const [isPinwheelCenterPlaced, setIsPinwheelCenterPlaced] = useState<boolean>(false);

  const [pinwheelBladeBRColor, setPinwheelBladeBRColor] = useState<string>('#ffffff');
  const [isPinwheelBladeBRPlaced, setIsPinwheelBladeBRPlaced] = useState<boolean>(false);

  const [pinwheelBladeBLColor, setPinwheelBladeBLColor] = useState<string>('#ffffff');
  const [isPinwheelBladeBLPlaced, setIsPinwheelBladeBLPlaced] = useState<boolean>(false);

  const [pinwheelStickColor, setPinwheelStickColor] = useState<string>('#ffffff');
  const [isPinwheelStickPlaced, setIsPinwheelStickPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // CATERPILLAR STAGE STATES (download__21__043dfdca.jfif)
  // ---------------------------------------------------------
  const [catHeadColor, setCatHeadColor] = useState<string>('#ffffff');
  const [isCatHeadPlaced, setIsCatHeadPlaced] = useState<boolean>(false);

  const [catSeg1Color, setCatSeg1Color] = useState<string>('#ffffff');
  const [isCatSeg1Placed, setIsCatSeg1Placed] = useState<boolean>(false);

  const [catSeg2Color, setCatSeg2Color] = useState<string>('#ffffff');
  const [isCatSeg2Placed, setIsCatSeg2Placed] = useState<boolean>(false);

  const [catSeg3Color, setCatSeg3Color] = useState<string>('#ffffff');
  const [isCatSeg3Placed, setIsCatSeg3Placed] = useState<boolean>(false);

  const [catSeg4Color, setCatSeg4Color] = useState<string>('#ffffff');
  const [isCatSeg4Placed, setIsCatSeg4Placed] = useState<boolean>(false);

  // ---------------------------------------------------------
  // HEN STAGE STATES (download__19__215567f7.jfif)
  // ---------------------------------------------------------
  const [henCombColor, setHenCombColor] = useState<string>('#ffffff');
  const [isHenCombPlaced, setIsHenCombPlaced] = useState<boolean>(false);

  const [henHeadColor, setHenHeadColor] = useState<string>('#ffffff');
  const [isHenHeadPlaced, setIsHenHeadPlaced] = useState<boolean>(false);

  const [henBeakColor, setHenBeakColor] = useState<string>('#ffffff');
  const [isHenBeakPlaced, setIsHenBeakPlaced] = useState<boolean>(false);

  const [henWattleColor, setHenWattleColor] = useState<string>('#ffffff');
  const [isHenWattlePlaced, setIsHenWattlePlaced] = useState<boolean>(false);

  const [henBodyColor, setHenBodyColor] = useState<string>('#ffffff');
  const [isHenBodyPlaced, setIsHenBodyPlaced] = useState<boolean>(false);

  const [henFootLeftColor, setHenFootLeftColor] = useState<string>('#ffffff');
  const [isHenFootLeftPlaced, setIsHenFootLeftPlaced] = useState<boolean>(false);

  const [henFootRightColor, setHenFootRightColor] = useState<string>('#ffffff');
  const [isHenFootRightPlaced, setIsHenFootRightPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // ICECREAM STAGE STATES (Free_Ice_Cream_Coloring_Pages___Sweet___Fun_Printables_for_Kids_-removebg-preview_76a2a690.png)
  // ---------------------------------------------------------
  const [icecreamTopColor, setIcecreamTopColor] = useState<string>('#ffffff');
  const [isIcecreamTopPlaced, setIsIcecreamTopPlaced] = useState<boolean>(false);

  const [icecreamBodyColor, setIcecreamBodyColor] = useState<string>('#ffffff');
  const [isIcecreamBodyPlaced, setIsIcecreamBodyPlaced] = useState<boolean>(false);

  const [icecreamStickColor, setIcecreamStickColor] = useState<string>('#ffffff');
  const [isIcecreamStickPlaced, setIsIcecreamStickPlaced] = useState<boolean>(false);

  // ---------------------------------------------------------
  // LOLLIPOP STAGE STATES (download__17_-removebg-preview__1__cfaaed68.png)
  // ---------------------------------------------------------
  const [lollipopTopColor, setLollipopTopColor] = useState<string>('#ffffff');
  const [isLollipopTopPlaced, setIsLollipopTopPlaced] = useState<boolean>(false);

  const [lollipopBandColor, setLollipopBandColor] = useState<string>('#ffffff');
  const [isLollipopBandPlaced, setIsLollipopBandPlaced] = useState<boolean>(false);

  const [lollipopBottomColor, setLollipopBottomColor] = useState<string>('#ffffff');
  const [isLollipopBottomPlaced, setIsLollipopBottomPlaced] = useState<boolean>(false);

  const [lollipopStickColor, setLollipopStickColor] = useState<string>('#ffffff');
  const [isLollipopStickPlaced, setIsLollipopStickPlaced] = useState<boolean>(false);

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
      let voiceKey: 'mango' | 'tulip' | 'airplane' | 'elephant' | 'banana' | 'scissors' | 'purse' | 'glasses' | 'tractor' | 'cake' | 'candle' | 'house' | 'boat' | 'bus' | 'pinwheel' | 'caterpillar' | 'hen' | 'icecream' | 'lollipop' | 'duck' | 'flower' | 'umbrella' | 'hat' | 'ball' | 'butterfly' | 'jug' | 'capsicum' | 'brinjal' | 'kite' | 'apple' = 'mango';
      if (currentStage === 'MANGO') voiceKey = 'mango';
      else if (currentStage === 'TULIP') voiceKey = 'tulip';
      else if (currentStage === 'AIRPLANE') voiceKey = 'airplane';
      else if (currentStage === 'ELEPHANT') voiceKey = 'elephant';
      else if (currentStage === 'BANANA') voiceKey = 'banana';
      else if (currentStage === 'SCISSORS') voiceKey = 'scissors';
      else if (currentStage === 'PURSE') voiceKey = 'purse';
      else if (currentStage === 'GLASSES') voiceKey = 'glasses';
      else if (currentStage === 'TRACTOR') voiceKey = 'tractor';
      else if (currentStage === 'CAKE') voiceKey = 'cake';
      else if (currentStage === 'CANDLE') voiceKey = 'candle';
      else if (currentStage === 'HOUSE') voiceKey = 'house';
      else if (currentStage === 'BOAT') voiceKey = 'boat';
      else if (currentStage === 'BUS') voiceKey = 'bus';
      else if (currentStage === 'PINWHEEL') voiceKey = 'pinwheel';
      else if (currentStage === 'CATERPILLAR') voiceKey = 'caterpillar';
      else if (currentStage === 'HEN') voiceKey = 'hen';
      else if (currentStage === 'ICECREAM') voiceKey = 'icecream';
      else if (currentStage === 'LOLLIPOP') voiceKey = 'lollipop';
      else if (currentStage === 'DUCK') voiceKey = 'duck';
      else if (currentStage === 'FLOWER') voiceKey = 'flower';
      else if (currentStage === 'UMBRELLA') voiceKey = 'umbrella';
      else if (currentStage === 'HAT') voiceKey = 'hat';
      else if (currentStage === 'BALL') voiceKey = 'ball';
      else if (currentStage === 'BUTTERFLY') voiceKey = 'butterfly';
      else if (currentStage === 'JUG') voiceKey = 'jug';
      else if (currentStage === 'CAPSICUM') voiceKey = 'capsicum';
      else if (currentStage === 'BRINJAL') voiceKey = 'brinjal';
      else if (currentStage === 'KITE') voiceKey = 'kite';
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
  const triggerVictory = (stage: 'mango' | 'tulip' | 'airplane' | 'elephant' | 'banana' | 'scissors' | 'purse' | 'glasses' | 'tractor' | 'cake' | 'candle' | 'house' | 'boat' | 'bus' | 'pinwheel' | 'caterpillar' | 'hen' | 'icecream' | 'lollipop' | 'duck' | 'flower' | 'ball' | 'butterfly' | 'jug' | 'capsicum' | 'brinjal' | 'kite' | 'apple' | 'hat' | 'umbrella') => {
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

  // Check if entire Mango is assembled
  const checkMangoVictory = (stem: boolean, leafTop: boolean, leafBot: boolean, body: boolean) => {
    if (stem && leafTop && leafBot && body) {
      triggerVictory('mango');
      return true;
    }
    return false;
  };

  // Drag handlers for Mango (4 pieces)
  const handleMangoStemDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setMangoStemColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('mango_stem', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsMangoStemPlaced(true);
      if (!checkMangoVictory(true, isMangoLeafTopPlaced, isMangoLeafBotPlaced, isMangoBodyPlaced)) {
        sounds.speakDrawingPiecePlaced('mango_stem', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleMangoLeafTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setMangoLeafTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('mango_leaf_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsMangoLeafTopPlaced(true);
      if (!checkMangoVictory(isMangoStemPlaced, true, isMangoLeafBotPlaced, isMangoBodyPlaced)) {
        sounds.speakDrawingPiecePlaced('mango_leaf_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleMangoLeafBotDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setMangoLeafBotColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('mango_leaf_bot', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsMangoLeafBotPlaced(true);
      if (!checkMangoVictory(isMangoStemPlaced, isMangoLeafTopPlaced, true, isMangoBodyPlaced)) {
        sounds.speakDrawingPiecePlaced('mango_leaf_bot', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleMangoBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setMangoBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('mango_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsMangoBodyPlaced(true);
      if (!checkMangoVictory(isMangoStemPlaced, isMangoLeafTopPlaced, isMangoLeafBotPlaced, true)) {
        sounds.speakDrawingPiecePlaced('mango_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Tulip is assembled
  const checkTulipVictory = (
    pTop: boolean,
    pLeftInner: boolean,
    pRightInner: boolean,
    pLeft: boolean,
    pCenter: boolean,
    pRight: boolean,
    stem: boolean,
    lLeft: boolean,
    lRight: boolean
  ) => {
    if (pTop && pLeftInner && pRightInner && pLeft && pCenter && pRight && stem && lLeft && lRight) {
      triggerVictory('tulip');
      return true;
    }
    return false;
  };

  // Drag handlers for Tulip (9 pieces)
  const handleTulipPetalTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipPetalTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_petal_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipPetalTopPlaced(true);
      if (!checkTulipVictory(true, isTulipPetalLeftInnerPlaced, isTulipPetalRightInnerPlaced, isTulipPetalLeftPlaced, isTulipPetalCenterPlaced, isTulipPetalRightPlaced, isTulipStemPlaced, isTulipLeafLeftPlaced, isTulipLeafRightPlaced)) {
        sounds.speakDrawingPiecePlaced('tulip_petal_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTulipPetalLeftInnerDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipPetalLeftInnerColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_petal_left_inner', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipPetalLeftInnerPlaced(true);
      if (!checkTulipVictory(isTulipPetalTopPlaced, true, isTulipPetalRightInnerPlaced, isTulipPetalLeftPlaced, isTulipPetalCenterPlaced, isTulipPetalRightPlaced, isTulipStemPlaced, isTulipLeafLeftPlaced, isTulipLeafRightPlaced)) {
        sounds.speakDrawingPiecePlaced('tulip_petal_left_inner', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTulipPetalRightInnerDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipPetalRightInnerColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_petal_right_inner', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipPetalRightInnerPlaced(true);
      if (!checkTulipVictory(isTulipPetalTopPlaced, isTulipPetalLeftInnerPlaced, true, isTulipPetalLeftPlaced, isTulipPetalCenterPlaced, isTulipPetalRightPlaced, isTulipStemPlaced, isTulipLeafLeftPlaced, isTulipLeafRightPlaced)) {
        sounds.speakDrawingPiecePlaced('tulip_petal_right_inner', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTulipPetalLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipPetalLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_petal_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipPetalLeftPlaced(true);
      if (!checkTulipVictory(isTulipPetalTopPlaced, isTulipPetalLeftInnerPlaced, isTulipPetalRightInnerPlaced, true, isTulipPetalCenterPlaced, isTulipPetalRightPlaced, isTulipStemPlaced, isTulipLeafLeftPlaced, isTulipLeafRightPlaced)) {
        sounds.speakDrawingPiecePlaced('tulip_petal_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTulipPetalCenterDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipPetalCenterColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_petal_center', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipPetalCenterPlaced(true);
      if (!checkTulipVictory(isTulipPetalTopPlaced, isTulipPetalLeftInnerPlaced, isTulipPetalRightInnerPlaced, isTulipPetalLeftPlaced, true, isTulipPetalRightPlaced, isTulipStemPlaced, isTulipLeafLeftPlaced, isTulipLeafRightPlaced)) {
        sounds.speakDrawingPiecePlaced('tulip_petal_center', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTulipPetalRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipPetalRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_petal_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipPetalRightPlaced(true);
      if (!checkTulipVictory(isTulipPetalTopPlaced, isTulipPetalLeftInnerPlaced, isTulipPetalRightInnerPlaced, isTulipPetalLeftPlaced, isTulipPetalCenterPlaced, true, isTulipStemPlaced, isTulipLeafLeftPlaced, isTulipLeafRightPlaced)) {
        sounds.speakDrawingPiecePlaced('tulip_petal_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTulipStemDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipStemColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_stem', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipStemPlaced(true);
      if (!checkTulipVictory(isTulipPetalTopPlaced, isTulipPetalLeftInnerPlaced, isTulipPetalRightInnerPlaced, isTulipPetalLeftPlaced, isTulipPetalCenterPlaced, isTulipPetalRightPlaced, true, isTulipLeafLeftPlaced, isTulipLeafRightPlaced)) {
        sounds.speakDrawingPiecePlaced('tulip_stem', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTulipLeafLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipLeafLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_leaf_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipLeafLeftPlaced(true);
      if (!checkTulipVictory(isTulipPetalTopPlaced, isTulipPetalLeftInnerPlaced, isTulipPetalRightInnerPlaced, isTulipPetalLeftPlaced, isTulipPetalCenterPlaced, isTulipPetalRightPlaced, isTulipStemPlaced, true, isTulipLeafRightPlaced)) {
        sounds.speakDrawingPiecePlaced('tulip_leaf_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTulipLeafRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTulipLeafRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tulip_leaf_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTulipLeafRightPlaced(true);
      if (!checkTulipVictory(isTulipPetalTopPlaced, isTulipPetalLeftInnerPlaced, isTulipPetalRightInnerPlaced, isTulipPetalLeftPlaced, isTulipPetalCenterPlaced, isTulipPetalRightPlaced, isTulipStemPlaced, isTulipLeafLeftPlaced, true)) {
        sounds.speakDrawingPiecePlaced('tulip_leaf_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Airplane is assembled
  const checkAirplaneVictory = (
    body: boolean,
    cockpit: boolean,
    wingLeft: boolean,
    engL1: boolean,
    engL2: boolean,
    wingRight: boolean,
    engR1: boolean,
    engR2: boolean,
    tail: boolean
  ) => {
    if (body && cockpit && wingLeft && engL1 && engL2 && wingRight && engR1 && engR2 && tail) {
      triggerVictory('airplane');
      return true;
    }
    return false;
  };

  // Drag handlers for Airplane (9 pieces)
  const handleAirplaneBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneBodyPlaced(true);
      if (!checkAirplaneVictory(true, isAirplaneCockpitPlaced, isAirplaneWingLeftPlaced, isAirplaneEngineL1Placed, isAirplaneEngineL2Placed, isAirplaneWingRightPlaced, isAirplaneEngineR1Placed, isAirplaneEngineR2Placed, isAirplaneTailPlaced)) {
        sounds.speakDrawingPiecePlaced('airplane_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAirplaneCockpitDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneCockpitColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_cockpit', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneCockpitPlaced(true);
      if (!checkAirplaneVictory(isAirplaneBodyPlaced, true, isAirplaneWingLeftPlaced, isAirplaneEngineL1Placed, isAirplaneEngineL2Placed, isAirplaneWingRightPlaced, isAirplaneEngineR1Placed, isAirplaneEngineR2Placed, isAirplaneTailPlaced)) {
        sounds.speakDrawingPiecePlaced('airplane_cockpit', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAirplaneWingLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneWingLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_wing_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneWingLeftPlaced(true);
      if (!checkAirplaneVictory(isAirplaneBodyPlaced, isAirplaneCockpitPlaced, true, isAirplaneEngineL1Placed, isAirplaneEngineL2Placed, isAirplaneWingRightPlaced, isAirplaneEngineR1Placed, isAirplaneEngineR2Placed, isAirplaneTailPlaced)) {
        sounds.speakDrawingPiecePlaced('airplane_wing_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAirplaneEngineL1DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneEngineL1Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_engine_l1', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneEngineL1Placed(true);
      if (!checkAirplaneVictory(isAirplaneBodyPlaced, isAirplaneCockpitPlaced, isAirplaneWingLeftPlaced, true, isAirplaneEngineL2Placed, isAirplaneWingRightPlaced, isAirplaneEngineR1Placed, isAirplaneEngineR2Placed, isAirplaneTailPlaced)) {
        sounds.speakDrawingPiecePlaced('airplane_engine_l1', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAirplaneEngineL2DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneEngineL2Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_engine_l2', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneEngineL2Placed(true);
      if (!checkAirplaneVictory(isAirplaneBodyPlaced, isAirplaneCockpitPlaced, isAirplaneWingLeftPlaced, isAirplaneEngineL1Placed, true, isAirplaneWingRightPlaced, isAirplaneEngineR1Placed, isAirplaneEngineR2Placed, isAirplaneTailPlaced)) {
        sounds.speakDrawingPiecePlaced('airplane_engine_l2', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAirplaneWingRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneWingRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_wing_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneWingRightPlaced(true);
      if (!checkAirplaneVictory(isAirplaneBodyPlaced, isAirplaneCockpitPlaced, isAirplaneWingLeftPlaced, isAirplaneEngineL1Placed, isAirplaneEngineL2Placed, true, isAirplaneEngineR1Placed, isAirplaneEngineR2Placed, isAirplaneTailPlaced)) {
        sounds.speakDrawingPiecePlaced('airplane_wing_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAirplaneEngineR1DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneEngineR1Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_engine_r1', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneEngineR1Placed(true);
      if (!checkAirplaneVictory(isAirplaneBodyPlaced, isAirplaneCockpitPlaced, isAirplaneWingLeftPlaced, isAirplaneEngineL1Placed, isAirplaneEngineL2Placed, isAirplaneWingRightPlaced, true, isAirplaneEngineR2Placed, isAirplaneTailPlaced)) {
        sounds.speakDrawingPiecePlaced('airplane_engine_r1', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAirplaneEngineR2DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneEngineR2Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_engine_r2', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneEngineR2Placed(true);
      if (!checkAirplaneVictory(isAirplaneBodyPlaced, isAirplaneCockpitPlaced, isAirplaneWingLeftPlaced, isAirplaneEngineL1Placed, isAirplaneEngineL2Placed, isAirplaneWingRightPlaced, isAirplaneEngineR1Placed, true, isAirplaneTailPlaced)) {
        sounds.speakDrawingPiecePlaced('airplane_engine_r2', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleAirplaneTailDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setAirplaneTailColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('airplane_tail', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsAirplaneTailPlaced(true);
      if (!checkAirplaneVictory(isAirplaneBodyPlaced, isAirplaneCockpitPlaced, isAirplaneWingLeftPlaced, isAirplaneEngineL1Placed, isAirplaneEngineL2Placed, isAirplaneWingRightPlaced, isAirplaneEngineR1Placed, isAirplaneEngineR2Placed, true)) {
        sounds.speakDrawingPiecePlaced('airplane_tail', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Elephant is assembled
  const checkElephantVictory = (
    head: boolean,
    body: boolean,
    tusk: boolean,
    legBack: boolean,
    legFront: boolean
  ) => {
    if (head && body && tusk && legBack && legFront) {
      triggerVictory('elephant');
      return true;
    }
    return false;
  };

  // Drag handlers for Elephant (5 pieces)
  const handleElephantHeadDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setElephantHeadColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('elephant_head', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsElephantHeadPlaced(true);
      if (!checkElephantVictory(true, isElephantBodyPlaced, isElephantTuskPlaced, isElephantLegBackPlaced, isElephantLegFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('elephant_head', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleElephantBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setElephantBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('elephant_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsElephantBodyPlaced(true);
      if (!checkElephantVictory(isElephantHeadPlaced, true, isElephantTuskPlaced, isElephantLegBackPlaced, isElephantLegFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('elephant_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleElephantTuskDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setElephantTuskColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('elephant_tusk', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsElephantTuskPlaced(true);
      if (!checkElephantVictory(isElephantHeadPlaced, isElephantBodyPlaced, true, isElephantLegBackPlaced, isElephantLegFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('elephant_tusk', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleElephantLegBackDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setElephantLegBackColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('elephant_leg_back', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsElephantLegBackPlaced(true);
      if (!checkElephantVictory(isElephantHeadPlaced, isElephantBodyPlaced, isElephantTuskPlaced, true, isElephantLegFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('elephant_leg_back', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleElephantLegFrontDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setElephantLegFrontColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('elephant_leg_front', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsElephantLegFrontPlaced(true);
      if (!checkElephantVictory(isElephantHeadPlaced, isElephantBodyPlaced, isElephantTuskPlaced, isElephantLegBackPlaced, true)) {
        sounds.speakDrawingPiecePlaced('elephant_leg_front', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Banana is assembled
  const checkBananaVictory = (
    stem: boolean,
    rTop: boolean,
    rBot: boolean,
    lTop: boolean,
    lBot: boolean,
    tipR: boolean,
    tipL: boolean
  ) => {
    if (stem && rTop && rBot && lTop && lBot && tipR && tipL) {
      triggerVictory('banana');
      return true;
    }
    return false;
  };

  // Drag handlers for Banana (7 pieces)
  const handleBananaStemDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBananaStemColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('banana_stem', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBananaStemPlaced(true);
      if (!checkBananaVictory(true, isBananaRightTopPlaced, isBananaRightBotPlaced, isBananaLeftTopPlaced, isBananaLeftBotPlaced, isBananaTipRightPlaced, isBananaTipLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('banana_stem', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBananaRightTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBananaRightTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('banana_right_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBananaRightTopPlaced(true);
      if (!checkBananaVictory(isBananaStemPlaced, true, isBananaRightBotPlaced, isBananaLeftTopPlaced, isBananaLeftBotPlaced, isBananaTipRightPlaced, isBananaTipLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('banana_right_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBananaRightBotDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBananaRightBotColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('banana_right_bot', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBananaRightBotPlaced(true);
      if (!checkBananaVictory(isBananaStemPlaced, isBananaRightTopPlaced, true, isBananaLeftTopPlaced, isBananaLeftBotPlaced, isBananaTipRightPlaced, isBananaTipLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('banana_right_bot', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBananaLeftTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBananaLeftTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('banana_left_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBananaLeftTopPlaced(true);
      if (!checkBananaVictory(isBananaStemPlaced, isBananaRightTopPlaced, isBananaRightBotPlaced, true, isBananaLeftBotPlaced, isBananaTipRightPlaced, isBananaTipLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('banana_left_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBananaLeftBotDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBananaLeftBotColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('banana_left_bot', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBananaLeftBotPlaced(true);
      if (!checkBananaVictory(isBananaStemPlaced, isBananaRightTopPlaced, isBananaRightBotPlaced, isBananaLeftTopPlaced, true, isBananaTipRightPlaced, isBananaTipLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('banana_left_bot', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBananaTipRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBananaTipRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('banana_tip_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBananaTipRightPlaced(true);
      if (!checkBananaVictory(isBananaStemPlaced, isBananaRightTopPlaced, isBananaRightBotPlaced, isBananaLeftTopPlaced, isBananaLeftBotPlaced, true, isBananaTipLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('banana_tip_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBananaTipLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBananaTipLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('banana_tip_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBananaTipLeftPlaced(true);
      if (!checkBananaVictory(isBananaStemPlaced, isBananaRightTopPlaced, isBananaRightBotPlaced, isBananaLeftTopPlaced, isBananaLeftBotPlaced, isBananaTipRightPlaced, true)) {
        sounds.speakDrawingPiecePlaced('banana_tip_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Scissors is assembled
  const checkScissorsVictory = (
    bladeLeft: boolean,
    bladeRight: boolean,
    pivotRing: boolean,
    pivotScrew: boolean,
    handle: boolean
  ) => {
    if (bladeLeft && bladeRight && pivotRing && pivotScrew && handle) {
      triggerVictory('scissors');
      return true;
    }
    return false;
  };

  // Drag handlers for Scissors (5 pieces: Left Blade, Right Blade, Pivot Ring, Pivot Screw, Handle)
  const handleScissorsBladeLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setScissorsBladeLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('scissors_blade_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsScissorsBladeLeftPlaced(true);
      if (!checkScissorsVictory(true, isScissorsBladeRightPlaced, isScissorsPivotRingPlaced, isScissorsPivotScrewPlaced, isScissorsHandlePlaced)) {
        sounds.speakDrawingPiecePlaced('scissors_blade_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleScissorsBladeRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setScissorsBladeRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('scissors_blade_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsScissorsBladeRightPlaced(true);
      if (!checkScissorsVictory(isScissorsBladeLeftPlaced, true, isScissorsPivotRingPlaced, isScissorsPivotScrewPlaced, isScissorsHandlePlaced)) {
        sounds.speakDrawingPiecePlaced('scissors_blade_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleScissorsPivotRingDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setScissorsPivotRingColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('scissors_pivot_ring', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsScissorsPivotRingPlaced(true);
      if (!checkScissorsVictory(isScissorsBladeLeftPlaced, isScissorsBladeRightPlaced, true, isScissorsPivotScrewPlaced, isScissorsHandlePlaced)) {
        sounds.speakDrawingPiecePlaced('scissors_pivot_ring', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleScissorsPivotScrewDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setScissorsPivotScrewColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('scissors_pivot_screw', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsScissorsPivotScrewPlaced(true);
      if (!checkScissorsVictory(isScissorsBladeLeftPlaced, isScissorsBladeRightPlaced, isScissorsPivotRingPlaced, true, isScissorsHandlePlaced)) {
        sounds.speakDrawingPiecePlaced('scissors_pivot_screw', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleScissorsHandleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setScissorsHandleColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('scissors_handle', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsScissorsHandlePlaced(true);
      if (!checkScissorsVictory(isScissorsBladeLeftPlaced, isScissorsBladeRightPlaced, isScissorsPivotRingPlaced, isScissorsPivotScrewPlaced, true)) {
        sounds.speakDrawingPiecePlaced('scissors_handle', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Purse is assembled
  const checkPurseVictory = (
    handle: boolean,
    ringLeft: boolean,
    ringRight: boolean,
    flap: boolean,
    body: boolean,
    lock: boolean
  ) => {
    if (handle && ringLeft && ringRight && flap && body && lock) {
      triggerVictory('purse');
      return true;
    }
    return false;
  };

  // Drag handlers for Purse (6 pieces: Handle, Ring Left, Ring Right, Flap, Body, Lock)
  const handlePurseHandleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPurseHandleColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('purse_handle', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPurseHandlePlaced(true);
      if (!checkPurseVictory(true, isPurseRingLeftPlaced, isPurseRingRightPlaced, isPurseFlapPlaced, isPurseBodyPlaced, isPurseLockPlaced)) {
        sounds.speakDrawingPiecePlaced('purse_handle', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePurseRingLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPurseRingLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('purse_ring_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPurseRingLeftPlaced(true);
      if (!checkPurseVictory(isPurseHandlePlaced, true, isPurseRingRightPlaced, isPurseFlapPlaced, isPurseBodyPlaced, isPurseLockPlaced)) {
        sounds.speakDrawingPiecePlaced('purse_ring_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePurseRingRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPurseRingRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('purse_ring_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPurseRingRightPlaced(true);
      if (!checkPurseVictory(isPurseHandlePlaced, isPurseRingLeftPlaced, true, isPurseFlapPlaced, isPurseBodyPlaced, isPurseLockPlaced)) {
        sounds.speakDrawingPiecePlaced('purse_ring_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePurseFlapDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPurseFlapColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('purse_flap', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPurseFlapPlaced(true);
      if (!checkPurseVictory(isPurseHandlePlaced, isPurseRingLeftPlaced, isPurseRingRightPlaced, true, isPurseBodyPlaced, isPurseLockPlaced)) {
        sounds.speakDrawingPiecePlaced('purse_flap', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePurseBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPurseBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('purse_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPurseBodyPlaced(true);
      if (!checkPurseVictory(isPurseHandlePlaced, isPurseRingLeftPlaced, isPurseRingRightPlaced, isPurseFlapPlaced, true, isPurseLockPlaced)) {
        sounds.speakDrawingPiecePlaced('purse_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePurseLockDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPurseLockColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('purse_lock', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPurseLockPlaced(true);
      if (!checkPurseVictory(isPurseHandlePlaced, isPurseRingLeftPlaced, isPurseRingRightPlaced, isPurseFlapPlaced, isPurseBodyPlaced, true)) {
        sounds.speakDrawingPiecePlaced('purse_lock', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Glasses is assembled
  const checkGlassesVictory = (
    armLeft: boolean,
    armRight: boolean,
    frame: boolean,
    lensLeft: boolean,
    lensRight: boolean
  ) => {
    if (armLeft && armRight && frame && lensLeft && lensRight) {
      triggerVictory('glasses');
      return true;
    }
    return false;
  };

  // Drag handlers for Glasses (5 pieces: Left Arm, Right Arm, Frame, Left Lens, Right Lens)
  const handleGlassesArmLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setGlassesArmLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('glasses_arm_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsGlassesArmLeftPlaced(true);
      if (!checkGlassesVictory(true, isGlassesArmRightPlaced, isGlassesFramePlaced, isGlassesLensLeftPlaced, isGlassesLensRightPlaced)) {
        sounds.speakDrawingPiecePlaced('glasses_arm_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleGlassesArmRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setGlassesArmRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('glasses_arm_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsGlassesArmRightPlaced(true);
      if (!checkGlassesVictory(isGlassesArmLeftPlaced, true, isGlassesFramePlaced, isGlassesLensLeftPlaced, isGlassesLensRightPlaced)) {
        sounds.speakDrawingPiecePlaced('glasses_arm_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleGlassesFrameDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setGlassesFrameColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('glasses_frame', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsGlassesFramePlaced(true);
      if (!checkGlassesVictory(isGlassesArmLeftPlaced, isGlassesArmRightPlaced, true, isGlassesLensLeftPlaced, isGlassesLensRightPlaced)) {
        sounds.speakDrawingPiecePlaced('glasses_frame', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleGlassesLensLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setGlassesLensLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('glasses_lens_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsGlassesLensLeftPlaced(true);
      if (!checkGlassesVictory(isGlassesArmLeftPlaced, isGlassesArmRightPlaced, isGlassesFramePlaced, true, isGlassesLensRightPlaced)) {
        sounds.speakDrawingPiecePlaced('glasses_lens_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleGlassesLensRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setGlassesLensRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('glasses_lens_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsGlassesLensRightPlaced(true);
      if (!checkGlassesVictory(isGlassesArmLeftPlaced, isGlassesArmRightPlaced, isGlassesFramePlaced, isGlassesLensLeftPlaced, true)) {
        sounds.speakDrawingPiecePlaced('glasses_lens_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Tractor is assembled
  const checkTractorVictory = (
    body: boolean,
    wLeft: boolean,
    wRight: boolean,
    exhaust: boolean,
    fender: boolean,
    tRear: boolean,
    hRear: boolean,
    tFront: boolean,
    hFront: boolean
  ) => {
    if (body && wLeft && wRight && exhaust && fender && tRear && hRear && tFront && hFront) {
      triggerVictory('tractor');
      return true;
    }
    return false;
  };

  // Drag handlers for Tractor (9 pieces)
  const handleTractorBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorBodyPlaced(true);
      if (!checkTractorVictory(true, isTractorWinLeftPlaced, isTractorWinRightPlaced, isTractorExhaustPlaced, isTractorFenderPlaced, isTractorTireRearPlaced, isTractorHubRearPlaced, isTractorTireFrontPlaced, isTractorHubFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('tractor_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTractorWinLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorWinLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_win_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorWinLeftPlaced(true);
      if (!checkTractorVictory(isTractorBodyPlaced, true, isTractorWinRightPlaced, isTractorExhaustPlaced, isTractorFenderPlaced, isTractorTireRearPlaced, isTractorHubRearPlaced, isTractorTireFrontPlaced, isTractorHubFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('tractor_win_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTractorWinRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorWinRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_win_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorWinRightPlaced(true);
      if (!checkTractorVictory(isTractorBodyPlaced, isTractorWinLeftPlaced, true, isTractorExhaustPlaced, isTractorFenderPlaced, isTractorTireRearPlaced, isTractorHubRearPlaced, isTractorTireFrontPlaced, isTractorHubFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('tractor_win_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTractorExhaustDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorExhaustColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_exhaust', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorExhaustPlaced(true);
      if (!checkTractorVictory(isTractorBodyPlaced, isTractorWinLeftPlaced, isTractorWinRightPlaced, true, isTractorFenderPlaced, isTractorTireRearPlaced, isTractorHubRearPlaced, isTractorTireFrontPlaced, isTractorHubFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('tractor_exhaust', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTractorFenderDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorFenderColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_fender', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorFenderPlaced(true);
      if (!checkTractorVictory(isTractorBodyPlaced, isTractorWinLeftPlaced, isTractorWinRightPlaced, isTractorExhaustPlaced, true, isTractorTireRearPlaced, isTractorHubRearPlaced, isTractorTireFrontPlaced, isTractorHubFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('tractor_fender', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTractorTireRearDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorTireRearColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_tire_rear', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorTireRearPlaced(true);
      if (!checkTractorVictory(isTractorBodyPlaced, isTractorWinLeftPlaced, isTractorWinRightPlaced, isTractorExhaustPlaced, isTractorFenderPlaced, true, isTractorHubRearPlaced, isTractorTireFrontPlaced, isTractorHubFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('tractor_tire_rear', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTractorHubRearDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorHubRearColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_hub_rear', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorHubRearPlaced(true);
      if (!checkTractorVictory(isTractorBodyPlaced, isTractorWinLeftPlaced, isTractorWinRightPlaced, isTractorExhaustPlaced, isTractorFenderPlaced, isTractorTireRearPlaced, true, isTractorTireFrontPlaced, isTractorHubFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('tractor_hub_rear', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTractorTireFrontDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorTireFrontColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_tire_front', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorTireFrontPlaced(true);
      if (!checkTractorVictory(isTractorBodyPlaced, isTractorWinLeftPlaced, isTractorWinRightPlaced, isTractorExhaustPlaced, isTractorFenderPlaced, isTractorTireRearPlaced, isTractorHubRearPlaced, true, isTractorHubFrontPlaced)) {
        sounds.speakDrawingPiecePlaced('tractor_tire_front', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleTractorHubFrontDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setTractorHubFrontColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('tractor_hub_front', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsTractorHubFrontPlaced(true);
      if (!checkTractorVictory(isTractorBodyPlaced, isTractorWinLeftPlaced, isTractorWinRightPlaced, isTractorExhaustPlaced, isTractorFenderPlaced, isTractorTireRearPlaced, isTractorHubRearPlaced, isTractorTireFrontPlaced, true)) {
        sounds.speakDrawingPiecePlaced('tractor_hub_front', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Cake is assembled
  const checkCakeVictory = (
    top: boolean,
    hTop: boolean,
    hLeft: boolean,
    hRight: boolean,
    lTop: boolean,
    lBot: boolean,
    plate: boolean
  ) => {
    if (top && hTop && hLeft && hRight && lTop && lBot && plate) {
      triggerVictory('cake');
      return true;
    }
    return false;
  };

  // Drag handlers for Cake (7 pieces: Top, 3 Hearts, Frosting Layer, Base Layer, Plate)
  const handleCakeTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCakeTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('cake_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCakeTopPlaced(true);
      if (!checkCakeVictory(true, isCakeHeartTopPlaced, isCakeHeartLeftPlaced, isCakeHeartRightPlaced, isCakeLayerTopPlaced, isCakeLayerBotPlaced, isCakePlatePlaced)) {
        sounds.speakDrawingPiecePlaced('cake_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCakeHeartTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCakeHeartTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('cake_heart_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCakeHeartTopPlaced(true);
      if (!checkCakeVictory(isCakeTopPlaced, true, isCakeHeartLeftPlaced, isCakeHeartRightPlaced, isCakeLayerTopPlaced, isCakeLayerBotPlaced, isCakePlatePlaced)) {
        sounds.speakDrawingPiecePlaced('cake_heart_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCakeHeartLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCakeHeartLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('cake_heart_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCakeHeartLeftPlaced(true);
      if (!checkCakeVictory(isCakeTopPlaced, isCakeHeartTopPlaced, true, isCakeHeartRightPlaced, isCakeLayerTopPlaced, isCakeLayerBotPlaced, isCakePlatePlaced)) {
        sounds.speakDrawingPiecePlaced('cake_heart_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCakeHeartRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCakeHeartRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('cake_heart_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCakeHeartRightPlaced(true);
      if (!checkCakeVictory(isCakeTopPlaced, isCakeHeartTopPlaced, isCakeHeartLeftPlaced, true, isCakeLayerTopPlaced, isCakeLayerBotPlaced, isCakePlatePlaced)) {
        sounds.speakDrawingPiecePlaced('cake_heart_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCakeLayerTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCakeLayerTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('cake_layer_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCakeLayerTopPlaced(true);
      if (!checkCakeVictory(isCakeTopPlaced, isCakeHeartTopPlaced, isCakeHeartLeftPlaced, isCakeHeartRightPlaced, true, isCakeLayerBotPlaced, isCakePlatePlaced)) {
        sounds.speakDrawingPiecePlaced('cake_layer_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCakeLayerBotDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCakeLayerBotColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('cake_layer_bot', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCakeLayerBotPlaced(true);
      if (!checkCakeVictory(isCakeTopPlaced, isCakeHeartTopPlaced, isCakeHeartLeftPlaced, isCakeHeartRightPlaced, isCakeLayerTopPlaced, true, isCakePlatePlaced)) {
        sounds.speakDrawingPiecePlaced('cake_layer_bot', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCakePlateDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCakePlateColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('cake_plate', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCakePlatePlaced(true);
      if (!checkCakeVictory(isCakeTopPlaced, isCakeHeartTopPlaced, isCakeHeartLeftPlaced, isCakeHeartRightPlaced, isCakeLayerTopPlaced, isCakeLayerBotPlaced, true)) {
        sounds.speakDrawingPiecePlaced('cake_plate', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Candle is assembled
  const checkCandleVictory = (
    flame: boolean,
    wick: boolean,
    wax: boolean,
    body: boolean
  ) => {
    if (flame && wick && wax && body) {
      triggerVictory('candle');
      return true;
    }
    return false;
  };

  // Drag handlers for Candle (4 pieces: Flame, Wick, Melted Wax, Body)
  const handleCandleFlameDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCandleFlameColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('candle_flame', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCandleFlamePlaced(true);
      if (!checkCandleVictory(true, isCandleWickPlaced, isCandleWaxPlaced, isCandleBodyPlaced)) {
        sounds.speakDrawingPiecePlaced('candle_flame', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCandleWickDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCandleWickColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('candle_wick', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCandleWickPlaced(true);
      if (!checkCandleVictory(isCandleFlamePlaced, true, isCandleWaxPlaced, isCandleBodyPlaced)) {
        sounds.speakDrawingPiecePlaced('candle_wick', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCandleWaxDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCandleWaxColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('candle_wax', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCandleWaxPlaced(true);
      if (!checkCandleVictory(isCandleFlamePlaced, isCandleWickPlaced, true, isCandleBodyPlaced)) {
        sounds.speakDrawingPiecePlaced('candle_wax', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCandleBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCandleBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('candle_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCandleBodyPlaced(true);
      if (!checkCandleVictory(isCandleFlamePlaced, isCandleWickPlaced, isCandleWaxPlaced, true)) {
        sounds.speakDrawingPiecePlaced('candle_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire House is assembled
  const checkHouseVictory = (
    chimney: boolean,
    roof: boolean,
    winTop: boolean,
    wall: boolean,
    winBot: boolean,
    door: boolean,
    baseLeft: boolean,
    baseRight: boolean
  ) => {
    if (chimney && roof && winTop && wall && winBot && door && baseLeft && baseRight) {
      triggerVictory('house');
      return true;
    }
    return false;
  };

  // Drag handlers for House (8 pieces: Chimney, Roof, Top Window, Wall, Bottom Window, Door, Base Left, Base Right)
  const handleHouseChimneyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHouseChimneyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('house_chimney', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHouseChimneyPlaced(true);
      if (!checkHouseVictory(true, isHouseRoofPlaced, isHouseWinTopPlaced, isHouseWallPlaced, isHouseWinBotPlaced, isHouseDoorPlaced, isHouseBaseLeftPlaced, isHouseBaseRightPlaced)) {
        sounds.speakDrawingPiecePlaced('house_chimney', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHouseRoofDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHouseRoofColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('house_roof', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHouseRoofPlaced(true);
      if (!checkHouseVictory(isHouseChimneyPlaced, true, isHouseWinTopPlaced, isHouseWallPlaced, isHouseWinBotPlaced, isHouseDoorPlaced, isHouseBaseLeftPlaced, isHouseBaseRightPlaced)) {
        sounds.speakDrawingPiecePlaced('house_roof', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHouseWinTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHouseWinTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('house_win_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHouseWinTopPlaced(true);
      if (!checkHouseVictory(isHouseChimneyPlaced, isHouseRoofPlaced, true, isHouseWallPlaced, isHouseWinBotPlaced, isHouseDoorPlaced, isHouseBaseLeftPlaced, isHouseBaseRightPlaced)) {
        sounds.speakDrawingPiecePlaced('house_win_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHouseWallDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHouseWallColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('house_wall', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHouseWallPlaced(true);
      if (!checkHouseVictory(isHouseChimneyPlaced, isHouseRoofPlaced, isHouseWinTopPlaced, true, isHouseWinBotPlaced, isHouseDoorPlaced, isHouseBaseLeftPlaced, isHouseBaseRightPlaced)) {
        sounds.speakDrawingPiecePlaced('house_wall', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHouseWinBotDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHouseWinBotColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('house_win_bot', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHouseWinBotPlaced(true);
      if (!checkHouseVictory(isHouseChimneyPlaced, isHouseRoofPlaced, isHouseWinTopPlaced, isHouseWallPlaced, true, isHouseDoorPlaced, isHouseBaseLeftPlaced, isHouseBaseRightPlaced)) {
        sounds.speakDrawingPiecePlaced('house_win_bot', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHouseDoorDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHouseDoorColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('house_door', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHouseDoorPlaced(true);
      if (!checkHouseVictory(isHouseChimneyPlaced, isHouseRoofPlaced, isHouseWinTopPlaced, isHouseWallPlaced, isHouseWinBotPlaced, true, isHouseBaseLeftPlaced, isHouseBaseRightPlaced)) {
        sounds.speakDrawingPiecePlaced('house_door', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHouseBaseLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHouseBaseLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('house_base_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHouseBaseLeftPlaced(true);
      if (!checkHouseVictory(isHouseChimneyPlaced, isHouseRoofPlaced, isHouseWinTopPlaced, isHouseWallPlaced, isHouseWinBotPlaced, isHouseDoorPlaced, true, isHouseBaseRightPlaced)) {
        sounds.speakDrawingPiecePlaced('house_base_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHouseBaseRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHouseBaseRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('house_base_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHouseBaseRightPlaced(true);
      if (!checkHouseVictory(isHouseChimneyPlaced, isHouseRoofPlaced, isHouseWinTopPlaced, isHouseWallPlaced, isHouseWinBotPlaced, isHouseDoorPlaced, isHouseBaseLeftPlaced, true)) {
        sounds.speakDrawingPiecePlaced('house_base_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Boat is assembled
  const checkBoatVictory = (
    mast: boolean,
    ltop: boolean,
    lmid: boolean,
    lbot: boolean,
    right: boolean,
    htop: boolean,
    hbot: boolean
  ) => {
    if (mast && ltop && lmid && lbot && right && htop && hbot) {
      triggerVictory('boat');
      return true;
    }
    return false;
  };

  // Drag handlers for Boat (7 pieces: Mast, Sail LTop/LMid/LBot, Sail Right, Hull Top/Bot)
  const handleBoatMastDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBoatMastColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('boat_mast', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBoatMastPlaced(true);
      if (!checkBoatVictory(true, isBoatSailLTopPlaced, isBoatSailLMidPlaced, isBoatSailLBotPlaced, isBoatSailRightPlaced, isBoatHullTopPlaced, isBoatHullBotPlaced)) {
        sounds.speakDrawingPiecePlaced('boat_mast', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBoatSailLTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBoatSailLTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('boat_sail_ltop', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBoatSailLTopPlaced(true);
      if (!checkBoatVictory(isBoatMastPlaced, true, isBoatSailLMidPlaced, isBoatSailLBotPlaced, isBoatSailRightPlaced, isBoatHullTopPlaced, isBoatHullBotPlaced)) {
        sounds.speakDrawingPiecePlaced('boat_sail_ltop', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBoatSailLMidDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBoatSailLMidColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('boat_sail_lmid', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBoatSailLMidPlaced(true);
      if (!checkBoatVictory(isBoatMastPlaced, isBoatSailLTopPlaced, true, isBoatSailLBotPlaced, isBoatSailRightPlaced, isBoatHullTopPlaced, isBoatHullBotPlaced)) {
        sounds.speakDrawingPiecePlaced('boat_sail_lmid', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBoatSailLBotDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBoatSailLBotColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('boat_sail_lbot', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBoatSailLBotPlaced(true);
      if (!checkBoatVictory(isBoatMastPlaced, isBoatSailLTopPlaced, isBoatSailLMidPlaced, true, isBoatSailRightPlaced, isBoatHullTopPlaced, isBoatHullBotPlaced)) {
        sounds.speakDrawingPiecePlaced('boat_sail_lbot', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBoatSailRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBoatSailRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('boat_sail_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBoatSailRightPlaced(true);
      if (!checkBoatVictory(isBoatMastPlaced, isBoatSailLTopPlaced, isBoatSailLMidPlaced, isBoatSailLBotPlaced, true, isBoatHullTopPlaced, isBoatHullBotPlaced)) {
        sounds.speakDrawingPiecePlaced('boat_sail_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBoatHullTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBoatHullTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('boat_hull_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBoatHullTopPlaced(true);
      if (!checkBoatVictory(isBoatMastPlaced, isBoatSailLTopPlaced, isBoatSailLMidPlaced, isBoatSailLBotPlaced, isBoatSailRightPlaced, true, isBoatHullBotPlaced)) {
        sounds.speakDrawingPiecePlaced('boat_hull_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBoatHullBotDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBoatHullBotColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('boat_hull_bot', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBoatHullBotPlaced(true);
      if (!checkBoatVictory(isBoatMastPlaced, isBoatSailLTopPlaced, isBoatSailLMidPlaced, isBoatSailLBotPlaced, isBoatSailRightPlaced, isBoatHullTopPlaced, true)) {
        sounds.speakDrawingPiecePlaced('boat_hull_bot', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Bus is assembled
  const checkBusVictory = (
    body: boolean,
    w1: boolean,
    w2: boolean,
    w3: boolean,
    w4: boolean,
    wh1: boolean,
    wh2: boolean
  ) => {
    if (body && w1 && w2 && w3 && w4 && wh1 && wh2) {
      triggerVictory('bus');
      return true;
    }
    return false;
  };

  // Drag handlers for Bus (7 pieces: Body, 4 Windows, 2 Wheel Hubs)
  const handleBusBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBusBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('bus_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBusBodyPlaced(true);
      if (!checkBusVictory(true, isBusWin1Placed, isBusWin2Placed, isBusWin3Placed, isBusWin4Placed, isBusWheel1Placed, isBusWheel2Placed)) {
        sounds.speakDrawingPiecePlaced('bus_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBusWin1DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBusWin1Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('bus_win1', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBusWin1Placed(true);
      if (!checkBusVictory(isBusBodyPlaced, true, isBusWin2Placed, isBusWin3Placed, isBusWin4Placed, isBusWheel1Placed, isBusWheel2Placed)) {
        sounds.speakDrawingPiecePlaced('bus_win1', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBusWin2DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBusWin2Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('bus_win2', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBusWin2Placed(true);
      if (!checkBusVictory(isBusBodyPlaced, isBusWin1Placed, true, isBusWin3Placed, isBusWin4Placed, isBusWheel1Placed, isBusWheel2Placed)) {
        sounds.speakDrawingPiecePlaced('bus_win2', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBusWin3DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBusWin3Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('bus_win3', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBusWin3Placed(true);
      if (!checkBusVictory(isBusBodyPlaced, isBusWin1Placed, isBusWin2Placed, true, isBusWin4Placed, isBusWheel1Placed, isBusWheel2Placed)) {
        sounds.speakDrawingPiecePlaced('bus_win3', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBusWin4DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBusWin4Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('bus_win4', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBusWin4Placed(true);
      if (!checkBusVictory(isBusBodyPlaced, isBusWin1Placed, isBusWin2Placed, isBusWin3Placed, true, isBusWheel1Placed, isBusWheel2Placed)) {
        sounds.speakDrawingPiecePlaced('bus_win4', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBusWheel1DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBusWheel1Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('bus_wheel1', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBusWheel1Placed(true);
      if (!checkBusVictory(isBusBodyPlaced, isBusWin1Placed, isBusWin2Placed, isBusWin3Placed, isBusWin4Placed, true, isBusWheel2Placed)) {
        sounds.speakDrawingPiecePlaced('bus_wheel1', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleBusWheel2DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setBusWheel2Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('bus_wheel2', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsBusWheel2Placed(true);
      if (!checkBusVictory(isBusBodyPlaced, isBusWin1Placed, isBusWin2Placed, isBusWin3Placed, isBusWin4Placed, isBusWheel1Placed, true)) {
        sounds.speakDrawingPiecePlaced('bus_wheel2', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Pinwheel is assembled
  const checkPinwheelVictory = (
    tl: boolean,
    tr: boolean,
    center: boolean,
    br: boolean,
    bl: boolean,
    stick: boolean
  ) => {
    if (tl && tr && center && br && bl && stick) {
      triggerVictory('pinwheel');
      return true;
    }
    return false;
  };

  // Drag handlers for Pinwheel (6 pieces: Blade TL, Blade TR, Center, Blade BR, Blade BL, Stick)
  const handlePinwheelBladeTLDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPinwheelBladeTLColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('pinwheel_blade_tl', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPinwheelBladeTLPlaced(true);
      if (!checkPinwheelVictory(true, isPinwheelBladeTRPlaced, isPinwheelCenterPlaced, isPinwheelBladeBRPlaced, isPinwheelBladeBLPlaced, isPinwheelStickPlaced)) {
        sounds.speakDrawingPiecePlaced('pinwheel_blade_tl', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePinwheelBladeTRDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPinwheelBladeTRColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('pinwheel_blade_tr', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPinwheelBladeTRPlaced(true);
      if (!checkPinwheelVictory(isPinwheelBladeTLPlaced, true, isPinwheelCenterPlaced, isPinwheelBladeBRPlaced, isPinwheelBladeBLPlaced, isPinwheelStickPlaced)) {
        sounds.speakDrawingPiecePlaced('pinwheel_blade_tr', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePinwheelCenterDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPinwheelCenterColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('pinwheel_center', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPinwheelCenterPlaced(true);
      if (!checkPinwheelVictory(isPinwheelBladeTLPlaced, isPinwheelBladeTRPlaced, true, isPinwheelBladeBRPlaced, isPinwheelBladeBLPlaced, isPinwheelStickPlaced)) {
        sounds.speakDrawingPiecePlaced('pinwheel_center', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePinwheelBladeBRDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPinwheelBladeBRColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('pinwheel_blade_br', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPinwheelBladeBRPlaced(true);
      if (!checkPinwheelVictory(isPinwheelBladeTLPlaced, isPinwheelBladeTRPlaced, isPinwheelCenterPlaced, true, isPinwheelBladeBLPlaced, isPinwheelStickPlaced)) {
        sounds.speakDrawingPiecePlaced('pinwheel_blade_br', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePinwheelBladeBLDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPinwheelBladeBLColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('pinwheel_blade_bl', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPinwheelBladeBLPlaced(true);
      if (!checkPinwheelVictory(isPinwheelBladeTLPlaced, isPinwheelBladeTRPlaced, isPinwheelCenterPlaced, isPinwheelBladeBRPlaced, true, isPinwheelStickPlaced)) {
        sounds.speakDrawingPiecePlaced('pinwheel_blade_bl', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handlePinwheelStickDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setPinwheelStickColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('pinwheel_stick', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsPinwheelStickPlaced(true);
      if (!checkPinwheelVictory(isPinwheelBladeTLPlaced, isPinwheelBladeTRPlaced, isPinwheelCenterPlaced, isPinwheelBladeBRPlaced, isPinwheelBladeBLPlaced, true)) {
        sounds.speakDrawingPiecePlaced('pinwheel_stick', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Caterpillar is assembled
  const checkCaterpillarVictory = (
    head: boolean,
    seg1: boolean,
    seg2: boolean,
    seg3: boolean,
    seg4: boolean
  ) => {
    if (head && seg1 && seg2 && seg3 && seg4) {
      triggerVictory('caterpillar');
      return true;
    }
    return false;
  };

  // Drag handlers for Caterpillar (5 pieces: Head + 4 segments)
  const handleCatHeadDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCatHeadColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('caterpillar_head', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCatHeadPlaced(true);
      if (!checkCaterpillarVictory(true, isCatSeg1Placed, isCatSeg2Placed, isCatSeg3Placed, isCatSeg4Placed)) {
        sounds.speakDrawingPiecePlaced('caterpillar_head', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCatSeg1DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCatSeg1Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('caterpillar_seg1', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCatSeg1Placed(true);
      if (!checkCaterpillarVictory(isCatHeadPlaced, true, isCatSeg2Placed, isCatSeg3Placed, isCatSeg4Placed)) {
        sounds.speakDrawingPiecePlaced('caterpillar_seg1', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCatSeg2DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCatSeg2Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('caterpillar_seg2', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCatSeg2Placed(true);
      if (!checkCaterpillarVictory(isCatHeadPlaced, isCatSeg1Placed, true, isCatSeg3Placed, isCatSeg4Placed)) {
        sounds.speakDrawingPiecePlaced('caterpillar_seg2', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCatSeg3DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCatSeg3Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('caterpillar_seg3', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCatSeg3Placed(true);
      if (!checkCaterpillarVictory(isCatHeadPlaced, isCatSeg1Placed, isCatSeg2Placed, true, isCatSeg4Placed)) {
        sounds.speakDrawingPiecePlaced('caterpillar_seg3', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleCatSeg4DragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setCatSeg4Color(selectedColor.hex);
      sounds.speakDrawingPieceColored('caterpillar_seg4', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsCatSeg4Placed(true);
      if (!checkCaterpillarVictory(isCatHeadPlaced, isCatSeg1Placed, isCatSeg2Placed, isCatSeg3Placed, true)) {
        sounds.speakDrawingPiecePlaced('caterpillar_seg4', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Hen is assembled
  const checkHenVictory = (
    comb: boolean,
    head: boolean,
    beak: boolean,
    wattle: boolean,
    body: boolean,
    footLeft: boolean,
    footRight: boolean
  ) => {
    if (comb && head && beak && wattle && body && footLeft && footRight) {
      triggerVictory('hen');
      return true;
    }
    return false;
  };

  // Drag handlers for Hen (7 pieces: Comb, Head, Beak, Wattle, Body, Left Foot, Right Foot)
  const handleHenCombDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHenCombColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hen_comb', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHenCombPlaced(true);
      if (!checkHenVictory(true, isHenHeadPlaced, isHenBeakPlaced, isHenWattlePlaced, isHenBodyPlaced, isHenFootLeftPlaced, isHenFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('hen_comb', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHenHeadDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHenHeadColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hen_head', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHenHeadPlaced(true);
      if (!checkHenVictory(isHenCombPlaced, true, isHenBeakPlaced, isHenWattlePlaced, isHenBodyPlaced, isHenFootLeftPlaced, isHenFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('hen_head', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHenBeakDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHenBeakColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hen_beak', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHenBeakPlaced(true);
      if (!checkHenVictory(isHenCombPlaced, isHenHeadPlaced, true, isHenWattlePlaced, isHenBodyPlaced, isHenFootLeftPlaced, isHenFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('hen_beak', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHenWattleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHenWattleColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hen_wattle', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHenWattlePlaced(true);
      if (!checkHenVictory(isHenCombPlaced, isHenHeadPlaced, isHenBeakPlaced, true, isHenBodyPlaced, isHenFootLeftPlaced, isHenFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('hen_wattle', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHenBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHenBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hen_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHenBodyPlaced(true);
      if (!checkHenVictory(isHenCombPlaced, isHenHeadPlaced, isHenBeakPlaced, isHenWattlePlaced, true, isHenFootLeftPlaced, isHenFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('hen_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHenFootLeftDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHenFootLeftColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hen_foot_left', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHenFootLeftPlaced(true);
      if (!checkHenVictory(isHenCombPlaced, isHenHeadPlaced, isHenBeakPlaced, isHenWattlePlaced, isHenBodyPlaced, true, isHenFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('hen_foot_left', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleHenFootRightDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setHenFootRightColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('hen_foot_right', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsHenFootRightPlaced(true);
      if (!checkHenVictory(isHenCombPlaced, isHenHeadPlaced, isHenBeakPlaced, isHenWattlePlaced, isHenBodyPlaced, isHenFootLeftPlaced, true)) {
        sounds.speakDrawingPiecePlaced('hen_foot_right', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Ice Cream is assembled
  const checkIcecreamVictory = (top: boolean, body: boolean, stick: boolean) => {
    if (top && body && stick) {
      triggerVictory('icecream');
      return true;
    }
    return false;
  };

  // Drag handlers for Ice Cream (3 pieces: Top Icing, Body, Stick)
  const handleIcecreamTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setIcecreamTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('icecream_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsIcecreamTopPlaced(true);
      if (!checkIcecreamVictory(true, isIcecreamBodyPlaced, isIcecreamStickPlaced)) {
        sounds.speakDrawingPiecePlaced('icecream_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleIcecreamBodyDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setIcecreamBodyColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('icecream_body', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsIcecreamBodyPlaced(true);
      if (!checkIcecreamVictory(isIcecreamTopPlaced, true, isIcecreamStickPlaced)) {
        sounds.speakDrawingPiecePlaced('icecream_body', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleIcecreamStickDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setIcecreamStickColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('icecream_stick', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsIcecreamStickPlaced(true);
      if (!checkIcecreamVictory(isIcecreamTopPlaced, isIcecreamBodyPlaced, true)) {
        sounds.speakDrawingPiecePlaced('icecream_stick', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  // Check if entire Lollipop is assembled (download__17_-removebg-preview__1__cfaaed68.png)
  const checkLollipopVictory = (
    top: boolean,
    band: boolean,
    bottom: boolean,
    stick: boolean
  ) => {
    if (top && band && bottom && stick) {
      triggerVictory('lollipop');
      return true;
    }
    return false;
  };

  // Drag handlers for Lollipop (4 pieces: Top Dome, Band, Bottom Dome, Stick)
  const handleLollipopTopDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setLollipopTopColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('lollipop_top', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsLollipopTopPlaced(true);
      if (!checkLollipopVictory(true, isLollipopBandPlaced, isLollipopBottomPlaced, isLollipopStickPlaced)) {
        sounds.speakDrawingPiecePlaced('lollipop_top', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleLollipopBandDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setLollipopBandColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('lollipop_band', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsLollipopBandPlaced(true);
      if (!checkLollipopVictory(isLollipopTopPlaced, true, isLollipopBottomPlaced, isLollipopStickPlaced)) {
        sounds.speakDrawingPiecePlaced('lollipop_band', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleLollipopBottomDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setLollipopBottomColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('lollipop_bottom', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsLollipopBottomPlaced(true);
      if (!checkLollipopVictory(isLollipopTopPlaced, isLollipopBandPlaced, true, isLollipopStickPlaced)) {
        sounds.speakDrawingPiecePlaced('lollipop_bottom', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
    }
  };

  const handleLollipopStickDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 12) {
      setLollipopStickColor(selectedColor.hex);
      sounds.speakDrawingPieceColored('lollipop_stick', soundEnabled);
      return;
    }
    if (checkDroppedInOutline(info.point.x, info.point.y)) {
      setIsLollipopStickPlaced(true);
      if (!checkLollipopVictory(isLollipopTopPlaced, isLollipopBandPlaced, isLollipopBottomPlaced, true)) {
        sounds.speakDrawingPiecePlaced('lollipop_stick', soundEnabled);
      }
    } else {
      sounds.speakDrawingWrongDrop(soundEnabled);
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
      return true;
    }
    return false;
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
      if (!checkDuckVictory(true, isDuckWingPlaced, isDuckBeakPlaced, isDuckFootLeftPlaced, isDuckFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('duck_body', soundEnabled);
      }
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
      if (!checkDuckVictory(isDuckBodyPlaced, true, isDuckBeakPlaced, isDuckFootLeftPlaced, isDuckFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('duck_wing', soundEnabled);
      }
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
      if (!checkDuckVictory(isDuckBodyPlaced, isDuckWingPlaced, true, isDuckFootLeftPlaced, isDuckFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('duck_beak', soundEnabled);
      }
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
      if (!checkDuckVictory(isDuckBodyPlaced, isDuckWingPlaced, isDuckBeakPlaced, true, isDuckFootRightPlaced)) {
        sounds.speakDrawingPiecePlaced('duck_foot_left', soundEnabled);
      }
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
      if (!checkDuckVictory(isDuckBodyPlaced, isDuckWingPlaced, isDuckBeakPlaced, isDuckFootLeftPlaced, true)) {
        sounds.speakDrawingPiecePlaced('duck_foot_right', soundEnabled);
      }
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
      return true;
    }
    return false;
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
      if (!checkFlowerVictory(true, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('flower_center', soundEnabled);
      }
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
      if (!checkFlowerVictory(isFlowerCenterPlaced, true, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('flower_petal_top', soundEnabled);
      }
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
      if (!checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, true, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('flower_petal_top_right', soundEnabled);
      }
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
      if (!checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, true, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('flower_petal_bottom_right', soundEnabled);
      }
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
      if (!checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, true, isFlowerPetalBottomLeftPlaced, isFlowerPetalTopLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('flower_petal_bottom', soundEnabled);
      }
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
      if (!checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, true, isFlowerPetalTopLeftPlaced)) {
        sounds.speakDrawingPiecePlaced('flower_petal_bottom_left', soundEnabled);
      }
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
      if (!checkFlowerVictory(isFlowerCenterPlaced, isFlowerPetalTopPlaced, isFlowerPetalTopRightPlaced, isFlowerPetalBottomRightPlaced, isFlowerPetalBottomPlaced, isFlowerPetalBottomLeftPlaced, true)) {
        sounds.speakDrawingPiecePlaced('flower_petal_top_left', soundEnabled);
      }
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
      return true;
    }
    return false;
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
      if (!checkUmbrellaVictory(true, isUmbrellaCanopyMidPlaced, isUmbrellaCanopyRightPlaced, isUmbrellaHandlePlaced)) {
        sounds.speakDrawingPiecePlaced('umbrella_canopy_left', soundEnabled);
      }
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
      if (!checkUmbrellaVictory(isUmbrellaCanopyLeftPlaced, true, isUmbrellaCanopyRightPlaced, isUmbrellaHandlePlaced)) {
        sounds.speakDrawingPiecePlaced('umbrella_canopy_mid', soundEnabled);
      }
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
      if (!checkUmbrellaVictory(isUmbrellaCanopyLeftPlaced, isUmbrellaCanopyMidPlaced, true, isUmbrellaHandlePlaced)) {
        sounds.speakDrawingPiecePlaced('umbrella_canopy_right', soundEnabled);
      }
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
      if (!checkUmbrellaVictory(isUmbrellaCanopyLeftPlaced, isUmbrellaCanopyMidPlaced, isUmbrellaCanopyRightPlaced, true)) {
        sounds.speakDrawingPiecePlaced('umbrella_handle', soundEnabled);
      }
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
      return true;
    }
    return false;
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
      if (!checkHatVictory(true, isHatBandPlaced, isHatBrimPlaced)) {
        sounds.speakDrawingPiecePlaced('hat_crown', soundEnabled);
      }
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
      if (!checkHatVictory(isHatCrownPlaced, true, isHatBrimPlaced)) {
        sounds.speakDrawingPiecePlaced('hat_band', soundEnabled);
      }
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
      if (!checkHatVictory(isHatCrownPlaced, isHatBandPlaced, true)) {
        sounds.speakDrawingPiecePlaced('hat_brim', soundEnabled);
      }
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
      return true;
    }
    return false;
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
      if (!checkBallVictory(
        true,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('ball_cap', soundEnabled);
      }
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
      if (!checkBallVictory(
        isBallCapPlaced,
        true,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('ball_top_mid', soundEnabled);
      }
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
      if (!checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        true,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('ball_top_right', soundEnabled);
      }
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
      if (!checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        true,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('ball_top_left', soundEnabled);
      }
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
      if (!checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        true,
        isBallBottomCenterPlaced,
        isBallBottomRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('ball_bottom_left', soundEnabled);
      }
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
      if (!checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        true,
        isBallBottomRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('ball_bottom_center', soundEnabled);
      }
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
      if (!checkBallVictory(
        isBallCapPlaced,
        isBallTopMidPlaced,
        isBallTopRightPlaced,
        isBallTopLeftPlaced,
        isBallBottomLeftPlaced,
        isBallBottomCenterPlaced,
        true
      )) {
        sounds.speakDrawingPiecePlaced('ball_bottom_right', soundEnabled);
      }
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
      return true;
    }
    return false;
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
      if (!checkButterflyVictory(true, isButterflyWingTLPlaced, isButterflyWingBLPlaced, isButterflyWingTRPlaced, isButterflyWingBRPlaced)) {
        sounds.speakDrawingPiecePlaced('butterfly_body', soundEnabled);
      }
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
      if (!checkButterflyVictory(isButterflyBodyPlaced, true, isButterflyWingBLPlaced, isButterflyWingTRPlaced, isButterflyWingBRPlaced)) {
        sounds.speakDrawingPiecePlaced('butterfly_wing_tl', soundEnabled);
      }
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
      if (!checkButterflyVictory(isButterflyBodyPlaced, isButterflyWingTLPlaced, true, isButterflyWingTRPlaced, isButterflyWingBRPlaced)) {
        sounds.speakDrawingPiecePlaced('butterfly_wing_bl', soundEnabled);
      }
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
      if (!checkButterflyVictory(isButterflyBodyPlaced, isButterflyWingTLPlaced, isButterflyWingBLPlaced, true, isButterflyWingBRPlaced)) {
        sounds.speakDrawingPiecePlaced('butterfly_wing_tr', soundEnabled);
      }
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
      if (!checkButterflyVictory(isButterflyBodyPlaced, isButterflyWingTLPlaced, isButterflyWingBLPlaced, isButterflyWingTRPlaced, true)) {
        sounds.speakDrawingPiecePlaced('butterfly_wing_br', soundEnabled);
      }
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
      return true;
    }
    return false;
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
      if (!checkJugVictory(true, isJugHandlePlaced, isJugBodyPlaced, isJugBasePlaced)) {
        sounds.speakDrawingPiecePlaced('jug_rim', soundEnabled);
      }
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
      if (!checkJugVictory(isJugRimPlaced, true, isJugBodyPlaced, isJugBasePlaced)) {
        sounds.speakDrawingPiecePlaced('jug_handle', soundEnabled);
      }
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
      if (!checkJugVictory(isJugRimPlaced, isJugHandlePlaced, true, isJugBasePlaced)) {
        sounds.speakDrawingPiecePlaced('jug_body', soundEnabled);
      }
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
      if (!checkJugVictory(isJugRimPlaced, isJugHandlePlaced, isJugBodyPlaced, true)) {
        sounds.speakDrawingPiecePlaced('jug_base', soundEnabled);
      }
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
      return true;
    }
    return false;
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
      if (!checkCapsicumVictory(
        true,
        isCapsicumLeftLobePlaced,
        isCapsicumRightLobePlaced,
        isCapsicumStemPlaced,
        isCapsicumTopLeftPlaced,
        isCapsicumTopRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('capsicum_body', soundEnabled);
      }
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
      if (!checkCapsicumVictory(
        isCapsicumBodyPlaced,
        true,
        isCapsicumRightLobePlaced,
        isCapsicumStemPlaced,
        isCapsicumTopLeftPlaced,
        isCapsicumTopRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('capsicum_lobe', soundEnabled);
      }
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
      if (!checkCapsicumVictory(
        isCapsicumBodyPlaced,
        isCapsicumLeftLobePlaced,
        true,
        isCapsicumStemPlaced,
        isCapsicumTopLeftPlaced,
        isCapsicumTopRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('capsicum_lobe', soundEnabled);
      }
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
      if (!checkCapsicumVictory(
        isCapsicumBodyPlaced,
        isCapsicumLeftLobePlaced,
        isCapsicumRightLobePlaced,
        true,
        isCapsicumTopLeftPlaced,
        isCapsicumTopRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('capsicum_stem', soundEnabled);
      }
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
      if (!checkCapsicumVictory(
        isCapsicumBodyPlaced,
        isCapsicumLeftLobePlaced,
        isCapsicumRightLobePlaced,
        isCapsicumStemPlaced,
        true,
        isCapsicumTopRightPlaced
      )) {
        sounds.speakDrawingPiecePlaced('capsicum_lobe', soundEnabled);
      }
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
      if (!checkCapsicumVictory(
        isCapsicumBodyPlaced,
        isCapsicumLeftLobePlaced,
        isCapsicumRightLobePlaced,
        isCapsicumStemPlaced,
        isCapsicumTopLeftPlaced,
        true
      )) {
        sounds.speakDrawingPiecePlaced('capsicum_lobe', soundEnabled);
      }
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
      return true;
    }
    return false;
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
      if (!checkKiteVictory(true, isKiteTRPlaced, isKiteBLPlaced, isKiteBRPlaced, isKiteTailPlaced)) {
        sounds.speakDrawingPiecePlaced('kite_quad', soundEnabled);
      }
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
      if (!checkKiteVictory(isKiteTLPlaced, true, isKiteBLPlaced, isKiteBRPlaced, isKiteTailPlaced)) {
        sounds.speakDrawingPiecePlaced('kite_quad', soundEnabled);
      }
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
      if (!checkKiteVictory(isKiteTLPlaced, isKiteTRPlaced, true, isKiteBRPlaced, isKiteTailPlaced)) {
        sounds.speakDrawingPiecePlaced('kite_quad', soundEnabled);
      }
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
      if (!checkKiteVictory(isKiteTLPlaced, isKiteTRPlaced, isKiteBLPlaced, true, isKiteTailPlaced)) {
        sounds.speakDrawingPiecePlaced('kite_quad', soundEnabled);
      }
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
      if (!checkKiteVictory(isKiteTLPlaced, isKiteTRPlaced, isKiteBLPlaced, isKiteBRPlaced, true)) {
        sounds.speakDrawingPiecePlaced('kite_tail', soundEnabled);
      }
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

  // NEXT Button Handler: cycles 1..15 (APPLE -> MANGO -> PINWHEEL -> LOLLIPOP -> ICECREAM -> CANDLE -> JUG -> HAT -> BRINJAL -> KITE -> BALL -> UMBRELLA -> GLASSES -> DUCK -> BUTTERFLY) then 16..30 -> APPLE
  const handleNext = () => {
    sounds.playPop(soundEnabled);
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    const nextStage = STAGE_ORDER[(currentIndex + 1) % STAGE_ORDER.length];
    setCurrentStage(nextStage);
    sounds.speakDrawingNext(nextStage.toLowerCase() as Lowercase<GameStage>, soundEnabled);
  };

  // Reset Handlers
  const handleResetMango = () => {
    setIsMangoStemPlaced(false);
    setIsMangoLeafTopPlaced(false);
    setIsMangoLeafBotPlaced(false);
    setIsMangoBodyPlaced(false);
    setMangoStemColor('#ffffff');
    setMangoLeafTopColor('#ffffff');
    setMangoLeafBotColor('#ffffff');
    setMangoBodyColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetTulip = () => {
    setIsTulipPetalTopPlaced(false);
    setIsTulipPetalLeftInnerPlaced(false);
    setIsTulipPetalRightInnerPlaced(false);
    setIsTulipPetalLeftPlaced(false);
    setIsTulipPetalCenterPlaced(false);
    setIsTulipPetalRightPlaced(false);
    setIsTulipStemPlaced(false);
    setIsTulipLeafLeftPlaced(false);
    setIsTulipLeafRightPlaced(false);
    setTulipPetalTopColor('#ffffff');
    setTulipPetalLeftInnerColor('#ffffff');
    setTulipPetalRightInnerColor('#ffffff');
    setTulipPetalLeftColor('#ffffff');
    setTulipPetalCenterColor('#ffffff');
    setTulipPetalRightColor('#ffffff');
    setTulipStemColor('#ffffff');
    setTulipLeafLeftColor('#ffffff');
    setTulipLeafRightColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetAirplane = () => {
    setIsAirplaneBodyPlaced(false);
    setIsAirplaneCockpitPlaced(false);
    setIsAirplaneWingLeftPlaced(false);
    setIsAirplaneEngineL1Placed(false);
    setIsAirplaneEngineL2Placed(false);
    setIsAirplaneWingRightPlaced(false);
    setIsAirplaneEngineR1Placed(false);
    setIsAirplaneEngineR2Placed(false);
    setIsAirplaneTailPlaced(false);
    setAirplaneBodyColor('#ffffff');
    setAirplaneCockpitColor('#ffffff');
    setAirplaneWingLeftColor('#ffffff');
    setAirplaneEngineL1Color('#ffffff');
    setAirplaneEngineL2Color('#ffffff');
    setAirplaneWingRightColor('#ffffff');
    setAirplaneEngineR1Color('#ffffff');
    setAirplaneEngineR2Color('#ffffff');
    setAirplaneTailColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetElephant = () => {
    setIsElephantHeadPlaced(false);
    setIsElephantBodyPlaced(false);
    setIsElephantTuskPlaced(false);
    setIsElephantLegBackPlaced(false);
    setIsElephantLegFrontPlaced(false);
    setElephantHeadColor('#ffffff');
    setElephantBodyColor('#ffffff');
    setElephantTuskColor('#ffffff');
    setElephantLegBackColor('#ffffff');
    setElephantLegFrontColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetBanana = () => {
    setIsBananaStemPlaced(false);
    setIsBananaRightTopPlaced(false);
    setIsBananaRightBotPlaced(false);
    setIsBananaLeftTopPlaced(false);
    setIsBananaLeftBotPlaced(false);
    setIsBananaTipRightPlaced(false);
    setIsBananaTipLeftPlaced(false);
    setBananaStemColor('#ffffff');
    setBananaRightTopColor('#ffffff');
    setBananaRightBotColor('#ffffff');
    setBananaLeftTopColor('#ffffff');
    setBananaLeftBotColor('#ffffff');
    setBananaTipRightColor('#ffffff');
    setBananaTipLeftColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetScissors = () => {
    setIsScissorsBladeLeftPlaced(false);
    setIsScissorsBladeRightPlaced(false);
    setIsScissorsPivotRingPlaced(false);
    setIsScissorsPivotScrewPlaced(false);
    setIsScissorsHandlePlaced(false);
    setScissorsBladeLeftColor('#ffffff');
    setScissorsBladeRightColor('#ffffff');
    setScissorsPivotRingColor('#ffffff');
    setScissorsPivotScrewColor('#ffffff');
    setScissorsHandleColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetPurse = () => {
    setIsPurseHandlePlaced(false);
    setIsPurseRingLeftPlaced(false);
    setIsPurseRingRightPlaced(false);
    setIsPurseFlapPlaced(false);
    setIsPurseBodyPlaced(false);
    setIsPurseLockPlaced(false);
    setPurseHandleColor('#ffffff');
    setPurseRingLeftColor('#ffffff');
    setPurseRingRightColor('#ffffff');
    setPurseFlapColor('#ffffff');
    setPurseBodyColor('#ffffff');
    setPurseLockColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetGlasses = () => {
    setIsGlassesArmLeftPlaced(false);
    setIsGlassesArmRightPlaced(false);
    setIsGlassesFramePlaced(false);
    setIsGlassesLensLeftPlaced(false);
    setIsGlassesLensRightPlaced(false);
    setGlassesArmLeftColor('#ffffff');
    setGlassesArmRightColor('#ffffff');
    setGlassesFrameColor('#ffffff');
    setGlassesLensLeftColor('#ffffff');
    setGlassesLensRightColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetTractor = () => {
    setIsTractorBodyPlaced(false);
    setIsTractorWinLeftPlaced(false);
    setIsTractorWinRightPlaced(false);
    setIsTractorExhaustPlaced(false);
    setIsTractorFenderPlaced(false);
    setIsTractorTireRearPlaced(false);
    setIsTractorHubRearPlaced(false);
    setIsTractorTireFrontPlaced(false);
    setIsTractorHubFrontPlaced(false);
    setTractorBodyColor('#ffffff');
    setTractorWinLeftColor('#ffffff');
    setTractorWinRightColor('#ffffff');
    setTractorExhaustColor('#ffffff');
    setTractorFenderColor('#ffffff');
    setTractorTireRearColor('#ffffff');
    setTractorHubRearColor('#ffffff');
    setTractorTireFrontColor('#ffffff');
    setTractorHubFrontColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetCake = () => {
    setIsCakeTopPlaced(false);
    setIsCakeHeartTopPlaced(false);
    setIsCakeHeartLeftPlaced(false);
    setIsCakeHeartRightPlaced(false);
    setIsCakeLayerTopPlaced(false);
    setIsCakeLayerBotPlaced(false);
    setIsCakePlatePlaced(false);
    setCakeTopColor('#ffffff');
    setCakeHeartTopColor('#ffffff');
    setCakeHeartLeftColor('#ffffff');
    setCakeHeartRightColor('#ffffff');
    setCakeLayerTopColor('#ffffff');
    setCakeLayerBotColor('#ffffff');
    setCakePlateColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetCandle = () => {
    setIsCandleFlamePlaced(false);
    setIsCandleWickPlaced(false);
    setIsCandleWaxPlaced(false);
    setIsCandleBodyPlaced(false);
    setCandleFlameColor('#ffffff');
    setCandleWickColor('#ffffff');
    setCandleWaxColor('#ffffff');
    setCandleBodyColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetHouse = () => {
    setIsHouseChimneyPlaced(false);
    setIsHouseRoofPlaced(false);
    setIsHouseWinTopPlaced(false);
    setIsHouseWallPlaced(false);
    setIsHouseWinBotPlaced(false);
    setIsHouseDoorPlaced(false);
    setIsHouseBaseLeftPlaced(false);
    setIsHouseBaseRightPlaced(false);
    setHouseChimneyColor('#ffffff');
    setHouseRoofColor('#ffffff');
    setHouseWinTopColor('#ffffff');
    setHouseWallColor('#ffffff');
    setHouseWinBotColor('#ffffff');
    setHouseDoorColor('#ffffff');
    setHouseBaseLeftColor('#ffffff');
    setHouseBaseRightColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetBoat = () => {
    setIsBoatMastPlaced(false);
    setIsBoatSailLTopPlaced(false);
    setIsBoatSailLMidPlaced(false);
    setIsBoatSailLBotPlaced(false);
    setIsBoatSailRightPlaced(false);
    setIsBoatHullTopPlaced(false);
    setIsBoatHullBotPlaced(false);
    setBoatMastColor('#ffffff');
    setBoatSailLTopColor('#ffffff');
    setBoatSailLMidColor('#ffffff');
    setBoatSailLBotColor('#ffffff');
    setBoatSailRightColor('#ffffff');
    setBoatHullTopColor('#ffffff');
    setBoatHullBotColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetBus = () => {
    setIsBusBodyPlaced(false);
    setIsBusWin1Placed(false);
    setIsBusWin2Placed(false);
    setIsBusWin3Placed(false);
    setIsBusWin4Placed(false);
    setIsBusWheel1Placed(false);
    setIsBusWheel2Placed(false);
    setBusBodyColor('#ffffff');
    setBusWin1Color('#ffffff');
    setBusWin2Color('#ffffff');
    setBusWin3Color('#ffffff');
    setBusWin4Color('#ffffff');
    setBusWheel1Color('#ffffff');
    setBusWheel2Color('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetPinwheel = () => {
    setIsPinwheelBladeTLPlaced(false);
    setIsPinwheelBladeTRPlaced(false);
    setIsPinwheelCenterPlaced(false);
    setIsPinwheelBladeBRPlaced(false);
    setIsPinwheelBladeBLPlaced(false);
    setIsPinwheelStickPlaced(false);
    setPinwheelBladeTLColor('#ffffff');
    setPinwheelBladeTRColor('#ffffff');
    setPinwheelCenterColor('#ffffff');
    setPinwheelBladeBRColor('#ffffff');
    setPinwheelBladeBLColor('#ffffff');
    setPinwheelStickColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetCaterpillar = () => {
    setIsCatHeadPlaced(false);
    setIsCatSeg1Placed(false);
    setIsCatSeg2Placed(false);
    setIsCatSeg3Placed(false);
    setIsCatSeg4Placed(false);
    setCatHeadColor('#ffffff');
    setCatSeg1Color('#ffffff');
    setCatSeg2Color('#ffffff');
    setCatSeg3Color('#ffffff');
    setCatSeg4Color('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetHen = () => {
    setIsHenCombPlaced(false);
    setIsHenHeadPlaced(false);
    setIsHenBeakPlaced(false);
    setIsHenWattlePlaced(false);
    setIsHenBodyPlaced(false);
    setIsHenFootLeftPlaced(false);
    setIsHenFootRightPlaced(false);
    setHenCombColor('#ffffff');
    setHenHeadColor('#ffffff');
    setHenBeakColor('#ffffff');
    setHenWattleColor('#ffffff');
    setHenBodyColor('#ffffff');
    setHenFootLeftColor('#ffffff');
    setHenFootRightColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetIcecream = () => {
    setIsIcecreamTopPlaced(false);
    setIsIcecreamBodyPlaced(false);
    setIsIcecreamStickPlaced(false);
    setIcecreamTopColor('#ffffff');
    setIcecreamBodyColor('#ffffff');
    setIcecreamStickColor('#ffffff');
    sounds.playPop(soundEnabled);
  };

  const handleResetLollipop = () => {
    setIsLollipopTopPlaced(false);
    setIsLollipopBandPlaced(false);
    setIsLollipopBottomPlaced(false);
    setIsLollipopStickPlaced(false);
    setLollipopTopColor('#ffffff');
    setLollipopBandColor('#ffffff');
    setLollipopBottomColor('#ffffff');
    setLollipopStickColor('#ffffff');
    sounds.playPop(soundEnabled);
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
        {currentStage === 'MANGO' ? (
          // ================================================================
          // MANGO (आम) GAME SCREEN (Fruits_Coloring_Pages_for_Kids___Fun_Printable_Learning_Activity_b8c6aa74.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: MANGO OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="mango-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[576/782] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 576 782"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Mango Body */}
                {isMangoBodyPlaced && (
                  <path
                    d={MANGO_PLACED_BODY_PATH}
                    fill={mangoBodyColor}
                    onClick={() => {
                      setMangoBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Stem */}
                {isMangoStemPlaced && (
                  <path
                    d={MANGO_PLACED_STEM_PATH}
                    fill={mangoStemColor}
                    onClick={() => {
                      setMangoStemColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango_stem', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Leaf Top */}
                {isMangoLeafTopPlaced && (
                  <path
                    d={MANGO_PLACED_LEAF_TOP_PATH}
                    fill={mangoLeafTopColor}
                    onClick={() => {
                      setMangoLeafTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango_leaf_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Leaf Bottom */}
                {isMangoLeafBotPlaced && (
                  <path
                    d={MANGO_PLACED_LEAF_BOT_PATH}
                    fill={mangoLeafBotColor}
                    onClick={() => {
                      setMangoLeafBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango_leaf_bot', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={mangoOutlineImg}
                alt="Mango Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: MANGO CUTTING PIECES */}
            <div
              id="mango-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] flex items-center justify-center"
            >
              {isMangoStemPlaced &&
                isMangoLeafTopPlaced &&
                isMangoLeafBotPlaced &&
                isMangoBodyPlaced && (
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

              <div className="relative w-full max-w-[460px] h-full">
                {/* 1. Mango Body */}
                {!isMangoBodyPlaced && (
                  <motion.div
                    id="cutting-mango-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleMangoBodyDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setMangoBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '4%', top: '10%', width: '54%', height: '80%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={MANGO_BODY_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={MANGO_BODY_PATH} fill={mangoBodyColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Leaf Top Blade */}
                {!isMangoLeafTopPlaced && (
                  <motion.div
                    id="cutting-mango-leaf-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleMangoLeafTopDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setMangoLeafTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango_leaf_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '61%', top: '8%', width: '36%', height: '26%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={MANGO_LEAF_TOP_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-12" y="-12" width="297" height="208" fill="transparent" />
                      <path d={MANGO_LEAF_TOP_PATH} fill={mangoLeafTopColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Leaf Bottom Blade */}
                {!isMangoLeafBotPlaced && (
                  <motion.div
                    id="cutting-mango-leaf-bot"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleMangoLeafBotDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setMangoLeafBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango_leaf_bot', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '61%', top: '38%', width: '35%', height: '21%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={MANGO_LEAF_BOT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-12" y="-12" width="288" height="148" fill="transparent" />
                      <path d={MANGO_LEAF_BOT_PATH} fill={mangoLeafBotColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Stem */}
                {!isMangoStemPlaced && (
                  <motion.div
                    id="cutting-mango-stem"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleMangoStemDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setMangoStemColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('mango_stem', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '69%', top: '63%', width: '20%', height: '29%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={MANGO_STEM_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-25" y="-12" width="118" height="154" fill="transparent" />
                      <path d={MANGO_STEM_PATH} fill={mangoStemColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </div>
          </>
        ) : currentStage === 'TULIP' ? (
          // ================================================================
          // TULIP (ट्यूलिप फूल) GAME SCREEN (794674296795607881_4d711042.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: TULIP OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="tulip-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[548/988] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 548 988"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Top Petal */}
                {isTulipPetalTopPlaced && (
                  <path
                    d={TULIP_PLACED_PETAL_TOP_PATH}
                    fill={tulipPetalTopColor}
                    onClick={() => {
                      setTulipPetalTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Left Inner Petal */}
                {isTulipPetalLeftInnerPlaced && (
                  <path
                    d={TULIP_PLACED_PETAL_LEFT_INNER_PATH}
                    fill={tulipPetalLeftInnerColor}
                    onClick={() => {
                      setTulipPetalLeftInnerColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_left_inner', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Right Inner Petal */}
                {isTulipPetalRightInnerPlaced && (
                  <path
                    d={TULIP_PLACED_PETAL_RIGHT_INNER_PATH}
                    fill={tulipPetalRightInnerColor}
                    onClick={() => {
                      setTulipPetalRightInnerColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_right_inner', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Left Outer Petal */}
                {isTulipPetalLeftPlaced && (
                  <path
                    d={TULIP_PLACED_PETAL_LEFT_PATH}
                    fill={tulipPetalLeftColor}
                    onClick={() => {
                      setTulipPetalLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Center Petal */}
                {isTulipPetalCenterPlaced && (
                  <path
                    d={TULIP_PLACED_PETAL_CENTER_PATH}
                    fill={tulipPetalCenterColor}
                    onClick={() => {
                      setTulipPetalCenterColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_center', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Right Outer Petal */}
                {isTulipPetalRightPlaced && (
                  <path
                    d={TULIP_PLACED_PETAL_RIGHT_PATH}
                    fill={tulipPetalRightColor}
                    onClick={() => {
                      setTulipPetalRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Stem */}
                {isTulipStemPlaced && (
                  <path
                    d={TULIP_PLACED_STEM_PATH}
                    fill={tulipStemColor}
                    onClick={() => {
                      setTulipStemColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_stem', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 8. Placed Left Leaf */}
                {isTulipLeafLeftPlaced && (
                  <path
                    d={TULIP_PLACED_LEAF_LEFT_PATH}
                    fill={tulipLeafLeftColor}
                    onClick={() => {
                      setTulipLeafLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_leaf_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 9. Placed Right Leaf */}
                {isTulipLeafRightPlaced && (
                  <path
                    d={TULIP_PLACED_LEAF_RIGHT_PATH}
                    fill={tulipLeafRightColor}
                    onClick={() => {
                      setTulipLeafRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_leaf_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={tulipOutlineImg}
                alt="Tulip Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: TULIP CUTTING PIECES */}
            <div
              id="tulip-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] flex items-center justify-center"
            >
              {isTulipPetalTopPlaced &&
                isTulipPetalLeftInnerPlaced &&
                isTulipPetalRightInnerPlaced &&
                isTulipPetalLeftPlaced &&
                isTulipPetalCenterPlaced &&
                isTulipPetalRightPlaced &&
                isTulipStemPlaced &&
                isTulipLeafLeftPlaced &&
                isTulipLeafRightPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetTulip}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full max-w-[460px] h-full">
                {/* 1. Left Inner Petal */}
                {!isTulipPetalLeftInnerPlaced && (
                  <motion.div
                    id="cutting-tulip-petal-left-inner"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipPetalLeftInnerDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipPetalLeftInnerColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_left_inner', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '2%', top: '2%', width: '19%', height: '24%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_PETAL_LEFT_INNER_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={TULIP_PETAL_LEFT_INNER_PATH} fill={tulipPetalLeftInnerColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Top Back Petal */}
                {!isTulipPetalTopPlaced && (
                  <motion.div
                    id="cutting-tulip-petal-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipPetalTopDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipPetalTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '25%', top: '2%', width: '24%', height: '24%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_PETAL_TOP_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={TULIP_PETAL_TOP_PATH} fill={tulipPetalTopColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Right Inner Petal */}
                {!isTulipPetalRightInnerPlaced && (
                  <motion.div
                    id="cutting-tulip-petal-right-inner"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipPetalRightInnerDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipPetalRightInnerColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_right_inner', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '53%', top: '2%', width: '22%', height: '27%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_PETAL_RIGHT_INNER_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={TULIP_PETAL_RIGHT_INNER_PATH} fill={tulipPetalRightInnerColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Center Petal */}
                {!isTulipPetalCenterPlaced && (
                  <motion.div
                    id="cutting-tulip-petal-center"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipPetalCenterDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipPetalCenterColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_center', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '2%', top: '30%', width: '30%', height: '38%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_PETAL_CENTER_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={TULIP_PETAL_CENTER_PATH} fill={tulipPetalCenterColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Left Outer Petal */}
                {!isTulipPetalLeftPlaced && (
                  <motion.div
                    id="cutting-tulip-petal-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipPetalLeftDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipPetalLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '35%', top: '29%', width: '19%', height: '37%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_PETAL_LEFT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={TULIP_PETAL_LEFT_PATH} fill={tulipPetalLeftColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Right Outer Petal */}
                {!isTulipPetalRightPlaced && (
                  <motion.div
                    id="cutting-tulip-petal-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipPetalRightDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipPetalRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_petal_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '57%', top: '31%', width: '21%', height: '37%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_PETAL_RIGHT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={TULIP_PETAL_RIGHT_PATH} fill={tulipPetalRightColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Stem */}
                {!isTulipStemPlaced && (
                  <motion.div
                    id="cutting-tulip-stem"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipStemDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipStemColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_stem', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '82%', top: '4%', width: '16%', height: '54%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_STEM_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-30" y="-12" width="113" height="538" fill="transparent" />
                      <path d={TULIP_STEM_PATH} fill={tulipStemColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 8. Left Leaf */}
                {!isTulipLeafLeftPlaced && (
                  <motion.div
                    id="cutting-tulip-leaf-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipLeafLeftDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipLeafLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_leaf_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '6%', top: '71%', width: '36%', height: '27%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_LEAF_LEFT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={TULIP_LEAF_LEFT_PATH} fill={tulipLeafLeftColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 9. Right Leaf */}
                {!isTulipLeafRightPlaced && (
                  <motion.div
                    id="cutting-tulip-leaf-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTulipLeafRightDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTulipLeafRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tulip_leaf_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '52%', top: '71%', width: '40%', height: '27%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={TULIP_LEAF_RIGHT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={TULIP_LEAF_RIGHT_PATH} fill={tulipLeafRightColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 9 pieces are placed */}
                {isTulipPetalTopPlaced &&
                  isTulipPetalLeftInnerPlaced &&
                  isTulipPetalRightInnerPlaced &&
                  isTulipPetalLeftPlaced &&
                  isTulipPetalCenterPlaced &&
                  isTulipPetalRightPlaced &&
                  isTulipStemPlaced &&
                  isTulipLeafLeftPlaced &&
                  isTulipLeafRightPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ ट्यूलिप फूल सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'AIRPLANE' ? (
          // ================================================================
          // AIRPLANE (हवाई जहाज़) GAME SCREEN (Download_Airplane_Outline_Icon_for_free_423f2f1c.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: AIRPLANE OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="airplane-outline-container"
              className="relative flex-1 w-full max-w-[480px] max-h-[480px] aspect-square flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 768 768"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Fuselage / Body (evenodd with cockpit cutout) */}
                {isAirplaneBodyPlaced && (
                  <path
                    d={AIRPLANE_PLACED_BODY_PATH}
                    fill={airplaneBodyColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setAirplaneBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Cockpit Window */}
                {isAirplaneCockpitPlaced && (
                  <path
                    d={AIRPLANE_PLACED_COCKPIT_PATH}
                    fill={airplaneCockpitColor}
                    onClick={() => {
                      setAirplaneCockpitColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_cockpit', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Left Wing */}
                {isAirplaneWingLeftPlaced && (
                  <path
                    d={AIRPLANE_PLACED_WING_LEFT_PATH}
                    fill={airplaneWingLeftColor}
                    onClick={() => {
                      setAirplaneWingLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_wing_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Left Outer Engine */}
                {isAirplaneEngineL1Placed && (
                  <path
                    d={AIRPLANE_PLACED_ENGINE_L1_PATH}
                    fill={airplaneEngineL1Color}
                    onClick={() => {
                      setAirplaneEngineL1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_engine_l1', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Left Inner Engine */}
                {isAirplaneEngineL2Placed && (
                  <path
                    d={AIRPLANE_PLACED_ENGINE_L2_PATH}
                    fill={airplaneEngineL2Color}
                    onClick={() => {
                      setAirplaneEngineL2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_engine_l2', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Right Wing */}
                {isAirplaneWingRightPlaced && (
                  <path
                    d={AIRPLANE_PLACED_WING_RIGHT_PATH}
                    fill={airplaneWingRightColor}
                    onClick={() => {
                      setAirplaneWingRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_wing_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Right Inner Engine */}
                {isAirplaneEngineR1Placed && (
                  <path
                    d={AIRPLANE_PLACED_ENGINE_R1_PATH}
                    fill={airplaneEngineR1Color}
                    onClick={() => {
                      setAirplaneEngineR1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_engine_r1', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 8. Placed Right Outer Engine */}
                {isAirplaneEngineR2Placed && (
                  <path
                    d={AIRPLANE_PLACED_ENGINE_R2_PATH}
                    fill={airplaneEngineR2Color}
                    onClick={() => {
                      setAirplaneEngineR2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_engine_r2', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 9. Placed Tail */}
                {isAirplaneTailPlaced && (
                  <path
                    d={AIRPLANE_PLACED_TAIL_PATH}
                    fill={airplaneTailColor}
                    onClick={() => {
                      setAirplaneTailColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_tail', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={airplaneOutlineImg}
                alt="Airplane Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: AIRPLANE CUTTING PIECES */}
            <div
              id="airplane-cutting-container"
              className="relative flex-1 w-full max-w-[480px] max-h-[480px] aspect-square flex items-center justify-center"
            >
              {isAirplaneBodyPlaced &&
                isAirplaneCockpitPlaced &&
                isAirplaneWingLeftPlaced &&
                isAirplaneEngineL1Placed &&
                isAirplaneEngineL2Placed &&
                isAirplaneWingRightPlaced &&
                isAirplaneEngineR1Placed &&
                isAirplaneEngineR2Placed &&
                isAirplaneTailPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetAirplane}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Left Wing */}
                {!isAirplaneWingLeftPlaced && (
                  <motion.div
                    id="cutting-airplane-wing-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneWingLeftDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneWingLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_wing_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '2%', top: '2%', width: '44%', height: '24%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_WING_LEFT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={AIRPLANE_WING_LEFT_PATH} fill={airplaneWingLeftColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Cockpit Window */}
                {!isAirplaneCockpitPlaced && (
                  <motion.div
                    id="cutting-airplane-cockpit"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneCockpitDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneCockpitColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_cockpit', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '49%', top: '5%', width: '14%', height: '14%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_COCKPIT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-14" width="94" height="94" fill="transparent" />
                      <path d={AIRPLANE_COCKPIT_PATH} fill={airplaneCockpitColor} stroke="#e2e8f0" strokeWidth="1.4" />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Tail */}
                {!isAirplaneTailPlaced && (
                  <motion.div
                    id="cutting-airplane-tail"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneTailDragEnd}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneTailColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_tail', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '67%', top: '2%', width: '30%', height: '30%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_TAIL_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={AIRPLANE_TAIL_PATH} fill={airplaneTailColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Fuselage / Body (evenodd with cockpit cutout) */}
                {!isAirplaneBodyPlaced && (
                  <motion.div
                    id="cutting-airplane-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '2%', top: '30%', width: '46%', height: '46%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_BODY_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={AIRPLANE_BODY_PATH} fill={airplaneBodyColor} fillRule="evenodd" stroke="#e2e8f0" strokeWidth="1.6" />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Right Wing */}
                {!isAirplaneWingRightPlaced && (
                  <motion.div
                    id="cutting-airplane-wing-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneWingRightDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneWingRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_wing_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '50%', top: '34%', width: '26%', height: '48%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_WING_RIGHT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={AIRPLANE_WING_RIGHT_PATH} fill={airplaneWingRightColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Left Outer Engine */}
                {!isAirplaneEngineL1Placed && (
                  <motion.div
                    id="cutting-airplane-engine-l1"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneEngineL1DragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneEngineL1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_engine_l1', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '79%', top: '36%', width: '17%', height: '11%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_ENGINE_L1_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-14" width="104" height="77" fill="transparent" />
                      <path d={AIRPLANE_ENGINE_L1_PATH} fill={airplaneEngineL1Color} stroke="#e2e8f0" strokeWidth="1.4" />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Left Inner Engine */}
                {!isAirplaneEngineL2Placed && (
                  <motion.div
                    id="cutting-airplane-engine-l2"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneEngineL2DragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneEngineL2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_engine_l2', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '79%', top: '52%', width: '17%', height: '11%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_ENGINE_L2_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-14" width="103" height="77" fill="transparent" />
                      <path d={AIRPLANE_ENGINE_L2_PATH} fill={airplaneEngineL2Color} stroke="#e2e8f0" strokeWidth="1.4" />
                    </svg>
                  </motion.div>
                )}

                {/* 8. Right Inner Engine */}
                {!isAirplaneEngineR1Placed && (
                  <motion.div
                    id="cutting-airplane-engine-r1"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneEngineR1DragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneEngineR1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_engine_r1', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '14%', top: '79%', width: '12%', height: '17%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_ENGINE_R1_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-14" width="77" height="103" fill="transparent" />
                      <path d={AIRPLANE_ENGINE_R1_PATH} fill={airplaneEngineR1Color} stroke="#e2e8f0" strokeWidth="1.4" />
                    </svg>
                  </motion.div>
                )}

                {/* 9. Right Outer Engine */}
                {!isAirplaneEngineR2Placed && (
                  <motion.div
                    id="cutting-airplane-engine-r2"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleAirplaneEngineR2DragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setAirplaneEngineR2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('airplane_engine_r2', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '34%', top: '79%', width: '12%', height: '17%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={AIRPLANE_ENGINE_R2_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-14" width="77" height="104" fill="transparent" />
                      <path d={AIRPLANE_ENGINE_R2_PATH} fill={airplaneEngineR2Color} stroke="#e2e8f0" strokeWidth="1.4" />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 9 pieces are placed */}
                {isAirplaneBodyPlaced &&
                  isAirplaneCockpitPlaced &&
                  isAirplaneWingLeftPlaced &&
                  isAirplaneEngineL1Placed &&
                  isAirplaneEngineL2Placed &&
                  isAirplaneWingRightPlaced &&
                  isAirplaneEngineR1Placed &&
                  isAirplaneEngineR2Placed &&
                  isAirplaneTailPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ हवाई जहाज़ सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'ELEPHANT' ? (
          // ================================================================
          // ELEPHANT (हाथी) GAME SCREEN (Elephant_Simple_Art_Kids_SVG___PNG___JPG_Clipart_-_Free_Commercial_Use_fa9fb73f.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: ELEPHANT OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="elephant-outline-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[691/528] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 691 528"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Head + Ear + Trunk (evenodd excludes solid eye dot) */}
                {isElephantHeadPlaced && (
                  <path
                    d={ELEPHANT_PLACED_HEAD_PATH}
                    fill={elephantHeadColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setElephantHeadColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_head', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Body */}
                {isElephantBodyPlaced && (
                  <path
                    d={ELEPHANT_PLACED_BODY_PATH}
                    fill={elephantBodyColor}
                    onClick={() => {
                      setElephantBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Tusk */}
                {isElephantTuskPlaced && (
                  <path
                    d={ELEPHANT_PLACED_TUSK_PATH}
                    fill={elephantTuskColor}
                    onClick={() => {
                      setElephantTuskColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_tusk', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Back Leg */}
                {isElephantLegBackPlaced && (
                  <path
                    d={ELEPHANT_PLACED_LEG_BACK_PATH}
                    fill={elephantLegBackColor}
                    onClick={() => {
                      setElephantLegBackColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_leg_back', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Front Leg */}
                {isElephantLegFrontPlaced && (
                  <path
                    d={ELEPHANT_PLACED_LEG_FRONT_PATH}
                    fill={elephantLegFrontColor}
                    onClick={() => {
                      setElephantLegFrontColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_leg_front', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={elephantOutlineImg}
                alt="Elephant Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: ELEPHANT CUTTING PIECES */}
            <div
              id="elephant-cutting-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[691/528] flex items-center justify-center"
            >
              {isElephantHeadPlaced &&
                isElephantBodyPlaced &&
                isElephantTuskPlaced &&
                isElephantLegBackPlaced &&
                isElephantLegFrontPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetElephant}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Head + Ear + Trunk */}
                {!isElephantHeadPlaced && (
                  <motion.div
                    id="cutting-elephant-head"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleElephantHeadDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setElephantHeadColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_head', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '2%', top: '4%', width: '40%', height: '58%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={ELEPHANT_HEAD_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={ELEPHANT_HEAD_PATH} fill={elephantHeadColor} fillRule="evenodd" stroke="#e2e8f0" strokeWidth="1.6" />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Body */}
                {!isElephantBodyPlaced && (
                  <motion.div
                    id="cutting-elephant-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleElephantBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setElephantBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '44%', top: '4%', width: '52%', height: '58%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={ELEPHANT_BODY_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={ELEPHANT_BODY_PATH} fill={elephantBodyColor} stroke="#e2e8f0" strokeWidth="1.6" />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Tusk */}
                {!isElephantTuskPlaced && (
                  <motion.div
                    id="cutting-elephant-tusk"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleElephantTuskDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setElephantTuskColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_tusk', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '8%', top: '67%', width: '20%', height: '26%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={ELEPHANT_TUSK_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-12" y="-12" width="96" height="105" fill="transparent" />
                      <path d={ELEPHANT_TUSK_PATH} fill={elephantTuskColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Back Leg */}
                {!isElephantLegBackPlaced && (
                  <motion.div
                    id="cutting-elephant-leg-back"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleElephantLegBackDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setElephantLegBackColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_leg_back', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '42%', top: '65%', width: '16%', height: '32%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={ELEPHANT_LEG_BACK_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-12" width="79" height="155" fill="transparent" />
                      <path d={ELEPHANT_LEG_BACK_PATH} fill={elephantLegBackColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Front Leg */}
                {!isElephantLegFrontPlaced && (
                  <motion.div
                    id="cutting-elephant-leg-front"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleElephantLegFrontDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setElephantLegFrontColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('elephant_leg_front', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '72%', top: '66%', width: '18%', height: '30%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={ELEPHANT_LEG_FRONT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-12" width="88" height="132" fill="transparent" />
                      <path d={ELEPHANT_LEG_FRONT_PATH} fill={elephantLegFrontColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 5 pieces are placed */}
                {isElephantHeadPlaced &&
                  isElephantBodyPlaced &&
                  isElephantTuskPlaced &&
                  isElephantLegBackPlaced &&
                  isElephantLegFrontPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ हाथी सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'BANANA' ? (
          // ================================================================
          // BANANA (केला) GAME SCREEN (download__25__6eb93c33.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: BANANA OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="banana-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[750/833] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 750 833"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Stem */}
                {isBananaStemPlaced && (
                  <path
                    d={BANANA_PLACED_STEM_PATH}
                    fill={bananaStemColor}
                    onClick={() => {
                      setBananaStemColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_stem', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Right Banana Top Ridge */}
                {isBananaRightTopPlaced && (
                  <path
                    d={BANANA_PLACED_RIGHT_TOP_PATH}
                    fill={bananaRightTopColor}
                    onClick={() => {
                      setBananaRightTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_right_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Right Banana Lower Belly */}
                {isBananaRightBotPlaced && (
                  <path
                    d={BANANA_PLACED_RIGHT_BOT_PATH}
                    fill={bananaRightBotColor}
                    onClick={() => {
                      setBananaRightBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_right_bot', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Left Banana Top Ridge */}
                {isBananaLeftTopPlaced && (
                  <path
                    d={BANANA_PLACED_LEFT_TOP_PATH}
                    fill={bananaLeftTopColor}
                    onClick={() => {
                      setBananaLeftTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_left_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Left Banana Lower Belly */}
                {isBananaLeftBotPlaced && (
                  <path
                    d={BANANA_PLACED_LEFT_BOT_PATH}
                    fill={bananaLeftBotColor}
                    onClick={() => {
                      setBananaLeftBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_left_bot', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Right Tip */}
                {isBananaTipRightPlaced && (
                  <path
                    d={BANANA_PLACED_TIP_RIGHT_PATH}
                    fill={bananaTipRightColor}
                    onClick={() => {
                      setBananaTipRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_tip_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Left Tip */}
                {isBananaTipLeftPlaced && (
                  <path
                    d={BANANA_PLACED_TIP_LEFT_PATH}
                    fill={bananaTipLeftColor}
                    onClick={() => {
                      setBananaTipLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_tip_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={bananaOutlineImg}
                alt="Banana Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: BANANA CUTTING PIECES */}
            <div
              id="banana-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] flex items-center justify-center"
            >
              {isBananaStemPlaced &&
                isBananaRightTopPlaced &&
                isBananaRightBotPlaced &&
                isBananaLeftTopPlaced &&
                isBananaLeftBotPlaced &&
                isBananaTipRightPlaced &&
                isBananaTipLeftPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetBanana}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full max-w-[440px] h-full">
                {/* 1. Left Banana Lower Belly */}
                {!isBananaLeftBotPlaced && (
                  <motion.div
                    id="cutting-banana-left-bot"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBananaLeftBotDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBananaLeftBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_left_bot', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '2%', top: '4%', width: '38%', height: '44%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={BANANA_LEFT_BOT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={BANANA_LEFT_BOT_PATH} fill={bananaLeftBotColor} stroke="#e2e8f0" strokeWidth="1.6" />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Left Banana Top Ridge */}
                {!isBananaLeftTopPlaced && (
                  <motion.div
                    id="cutting-banana-left-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBananaLeftTopDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBananaLeftTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_left_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '42%', top: '4%', width: '34%', height: '42%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={BANANA_LEFT_TOP_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={BANANA_LEFT_TOP_PATH} fill={bananaLeftTopColor} stroke="#e2e8f0" strokeWidth="1.6" />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Stem Crown */}
                {!isBananaStemPlaced && (
                  <motion.div
                    id="cutting-banana-stem"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBananaStemDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBananaStemColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_stem', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '78%', top: '8%', width: '20%', height: '16%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={BANANA_STEM_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-12" y="-12" width="187" height="128" fill="transparent" />
                      <path d={BANANA_STEM_PATH} fill={bananaStemColor} stroke="#e2e8f0" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Left Banana Tip */}
                {!isBananaTipLeftPlaced && (
                  <motion.div
                    id="cutting-banana-tip-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBananaTipLeftDragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBananaTipLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_tip_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '81%', top: '29%', width: '15%', height: '16%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={BANANA_TIP_LEFT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-14" width="75" height="103" fill="transparent" />
                      <path d={BANANA_TIP_LEFT_PATH} fill={bananaTipLeftColor} stroke="#e2e8f0" strokeWidth="1.4" />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Right Banana Top Ridge */}
                {!isBananaRightTopPlaced && (
                  <motion.div
                    id="cutting-banana-right-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBananaRightTopDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBananaRightTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_right_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '2%', top: '52%', width: '36%', height: '40%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={BANANA_RIGHT_TOP_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={BANANA_RIGHT_TOP_PATH} fill={bananaRightTopColor} stroke="#e2e8f0" strokeWidth="1.6" />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Right Banana Lower Belly */}
                {!isBananaRightBotPlaced && (
                  <motion.div
                    id="cutting-banana-right-bot"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBananaRightBotDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBananaRightBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_right_bot', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '41%', top: '52%', width: '38%', height: '42%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={BANANA_RIGHT_BOT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <path d={BANANA_RIGHT_BOT_PATH} fill={bananaRightBotColor} stroke="#e2e8f0" strokeWidth="1.6" />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Right Banana Tip */}
                {!isBananaTipRightPlaced && (
                  <motion.div
                    id="cutting-banana-tip-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBananaTipRightDragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBananaTipRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('banana_tip_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{ left: '81%', top: '62%', width: '15%', height: '16%' }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg viewBox={BANANA_TIP_RIGHT_VIEWBOX} className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible">
                      <rect x="-14" y="-14" width="70" height="97" fill="transparent" />
                      <path d={BANANA_TIP_RIGHT_PATH} fill={bananaTipRightColor} stroke="#e2e8f0" strokeWidth="1.4" />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 7 pieces are placed */}
                {isBananaStemPlaced &&
                  isBananaRightTopPlaced &&
                  isBananaRightBotPlaced &&
                  isBananaLeftTopPlaced &&
                  isBananaLeftBotPlaced &&
                  isBananaTipRightPlaced &&
                  isBananaTipLeftPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ केले सही जगह लग गए! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'SCISSORS' ? (
          // ================================================================
          // SCISSORS (कैंची) GAME SCREEN (download__24__970e0629.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: SCISSORS OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="scissors-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[623/1128] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 623 1128"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Left Blade */}
                {isScissorsBladeLeftPlaced && (
                  <path
                    d={SCISSORS_PLACED_BLADE_LEFT_PATH}
                    fill={scissorsBladeLeftColor}
                    onClick={() => {
                      setScissorsBladeLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_blade_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Right Blade */}
                {isScissorsBladeRightPlaced && (
                  <path
                    d={SCISSORS_PLACED_BLADE_RIGHT_PATH}
                    fill={scissorsBladeRightColor}
                    onClick={() => {
                      setScissorsBladeRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_blade_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Center Pivot Ring (evenodd with center screw cutout) */}
                {isScissorsPivotRingPlaced && (
                  <path
                    d={SCISSORS_PLACED_PIVOT_RING_PATH}
                    fill={scissorsPivotRingColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setScissorsPivotRingColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_pivot_ring', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Center Pivot Screw */}
                {isScissorsPivotScrewPlaced && (
                  <path
                    d={SCISSORS_PLACED_PIVOT_SCREW_PATH}
                    fill={scissorsPivotScrewColor}
                    onClick={() => {
                      setScissorsPivotScrewColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_pivot_screw', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Handle (evenodd with 2 finger holes) */}
                {isScissorsHandlePlaced && (
                  <path
                    d={SCISSORS_PLACED_HANDLE_PATH}
                    fill={scissorsHandleColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setScissorsHandleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_handle', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={scissorsOutlineImg}
                alt="Scissors Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: SCISSORS CUTTING PIECES */}
            <div
              id="scissors-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] flex items-center justify-center"
            >
              {isScissorsBladeLeftPlaced &&
                isScissorsBladeRightPlaced &&
                isScissorsPivotRingPlaced &&
                isScissorsPivotScrewPlaced &&
                isScissorsHandlePlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetScissors}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full max-w-[440px] h-full">
                {/* 1. Left Blade */}
                {!isScissorsBladeLeftPlaced && (
                  <motion.div
                    id="cutting-scissors-blade-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleScissorsBladeLeftDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setScissorsBladeLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_blade_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '4%',
                      top: '3%',
                      width: '30%',
                      height: '45%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={SCISSORS_BLADE_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={SCISSORS_BLADE_LEFT_PATH}
                        fill={scissorsBladeLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Right Blade */}
                {!isScissorsBladeRightPlaced && (
                  <motion.div
                    id="cutting-scissors-blade-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleScissorsBladeRightDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setScissorsBladeRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_blade_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '38%',
                      top: '3%',
                      width: '22%',
                      height: '45%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={SCISSORS_BLADE_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={SCISSORS_BLADE_RIGHT_PATH}
                        fill={scissorsBladeRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Center Pivot Ring (evenodd with center screw hole) */}
                {!isScissorsPivotRingPlaced && (
                  <motion.div
                    id="cutting-scissors-pivot-ring"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleScissorsPivotRingDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setScissorsPivotRingColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_pivot_ring', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '64%',
                      top: '10%',
                      width: '32%',
                      height: '18%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={SCISSORS_PIVOT_RING_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={SCISSORS_PIVOT_RING_PATH}
                        fill={scissorsPivotRingColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Center Pivot Screw */}
                {!isScissorsPivotScrewPlaced && (
                  <motion.div
                    id="cutting-scissors-pivot-screw"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleScissorsPivotScrewDragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setScissorsPivotScrewColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_pivot_screw', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '70%',
                      top: '33%',
                      width: '20%',
                      height: '16%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={SCISSORS_PIVOT_SCREW_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-18" y="-18" width="67" height="67" fill="transparent" />
                      <path
                        d={SCISSORS_PIVOT_SCREW_PATH}
                        fill={scissorsPivotScrewColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Handle (evenodd with 2 finger holes) */}
                {!isScissorsHandlePlaced && (
                  <motion.div
                    id="cutting-scissors-handle"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleScissorsHandleDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setScissorsHandleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('scissors_handle', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '14%',
                      top: '53%',
                      width: '72%',
                      height: '44%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={SCISSORS_HANDLE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={SCISSORS_HANDLE_PATH}
                        fill={scissorsHandleColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 5 pieces are placed */}
                {isScissorsBladeLeftPlaced &&
                  isScissorsBladeRightPlaced &&
                  isScissorsPivotRingPlaced &&
                  isScissorsPivotScrewPlaced &&
                  isScissorsHandlePlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ कैंची सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'PURSE' ? (
          // ================================================================
          // PURSE (पर्स) GAME SCREEN (download__23__4d55ddc4.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: PURSE OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="purse-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[629/731] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 629 731"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Handle */}
                {isPurseHandlePlaced && (
                  <path
                    d={PURSE_PLACED_HANDLE_PATH}
                    fill={purseHandleColor}
                    onClick={() => {
                      setPurseHandleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_handle', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Left Ring */}
                {isPurseRingLeftPlaced && (
                  <path
                    d={PURSE_PLACED_RING_LEFT_PATH}
                    fill={purseRingLeftColor}
                    onClick={() => {
                      setPurseRingLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_ring_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Right Ring */}
                {isPurseRingRightPlaced && (
                  <path
                    d={PURSE_PLACED_RING_RIGHT_PATH}
                    fill={purseRingRightColor}
                    onClick={() => {
                      setPurseRingRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_ring_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Flap */}
                {isPurseFlapPlaced && (
                  <path
                    d={PURSE_PLACED_FLAP_PATH}
                    fill={purseFlapColor}
                    onClick={() => {
                      setPurseFlapColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_flap', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Body */}
                {isPurseBodyPlaced && (
                  <path
                    d={PURSE_PLACED_BODY_PATH}
                    fill={purseBodyColor}
                    onClick={() => {
                      setPurseBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Lock */}
                {isPurseLockPlaced && (
                  <path
                    d={PURSE_PLACED_LOCK_PATH}
                    fill={purseLockColor}
                    onClick={() => {
                      setPurseLockColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_lock', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={purseOutlineImg}
                alt="Purse Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: PURSE CUTTING PIECES */}
            <div
              id="purse-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] flex items-center justify-center"
            >
              {isPurseHandlePlaced &&
                isPurseRingLeftPlaced &&
                isPurseRingRightPlaced &&
                isPurseFlapPlaced &&
                isPurseBodyPlaced &&
                isPurseLockPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetPurse}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full max-w-[440px] h-full aspect-[629/731]">
                {/* 1. Handle */}
                {!isPurseHandlePlaced && (
                  <motion.div
                    id="cutting-purse-handle"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePurseHandleDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPurseHandleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_handle', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2%',
                      top: '3%',
                      width: `${(361 / 629) * 85}%`,
                      height: `${(181 / 731) * 85}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PURSE_HANDLE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={PURSE_HANDLE_PATH}
                        fill={purseHandleColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Left Ring */}
                {!isPurseRingLeftPlaced && (
                  <motion.div
                    id="cutting-purse-ring-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePurseRingLeftDragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPurseRingLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_ring_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '56%',
                      top: '7%',
                      width: `${(48 / 629) * 220}%`,
                      height: `${(36 / 731) * 220}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PURSE_RING_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-14" y="-14" width="76" height="64" fill="transparent" />
                      <path
                        d={PURSE_RING_LEFT_PATH}
                        fill={purseRingLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Right Ring */}
                {!isPurseRingRightPlaced && (
                  <motion.div
                    id="cutting-purse-ring-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePurseRingRightDragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPurseRingRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_ring_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '78%',
                      top: '7%',
                      width: `${(48 / 629) * 220}%`,
                      height: `${(36 / 731) * 220}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PURSE_RING_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-14" y="-14" width="76" height="64" fill="transparent" />
                      <path
                        d={PURSE_RING_RIGHT_PATH}
                        fill={purseRingRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Top Flap */}
                {!isPurseFlapPlaced && (
                  <motion.div
                    id="cutting-purse-flap"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePurseFlapDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPurseFlapColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_flap', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2%',
                      top: '29%',
                      width: `${(504 / 629) * 82}%`,
                      height: `${(212 / 731) * 82}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PURSE_FLAP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={PURSE_FLAP_PATH}
                        fill={purseFlapColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Center Lock */}
                {!isPurseLockPlaced && (
                  <motion.div
                    id="cutting-purse-lock"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePurseLockDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPurseLockColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_lock', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '74%',
                      top: '34%',
                      width: `${(73 / 629) * 180}%`,
                      height: `${(48 / 731) * 180}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PURSE_LOCK_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-12" y="-12" width="97" height="72" fill="transparent" />
                      <path
                        d={PURSE_LOCK_PATH}
                        fill={purseLockColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Lower Body */}
                {!isPurseBodyPlaced && (
                  <motion.div
                    id="cutting-purse-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePurseBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPurseBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('purse_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '16%',
                      top: '58%',
                      width: `${(547 / 629) * 78}%`,
                      height: `${(313 / 731) * 78}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PURSE_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={PURSE_BODY_PATH}
                        fill={purseBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 6 pieces are placed */}
                {isPurseHandlePlaced &&
                  isPurseRingLeftPlaced &&
                  isPurseRingRightPlaced &&
                  isPurseFlapPlaced &&
                  isPurseBodyPlaced &&
                  isPurseLockPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ पर्स सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'GLASSES' ? (
          // ================================================================
          // GLASSES (चश्मा) GAME SCREEN (Vision_eyeglasses_icon_outline_vector__Eye_test_3c390372.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: GLASSES OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="glasses-outline-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[694/454] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 694 454"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Left Temple Arm */}
                {isGlassesArmLeftPlaced && (
                  <path
                    d={GLASSES_PLACED_ARM_LEFT_PATH}
                    fill={glassesArmLeftColor}
                    onClick={() => {
                      setGlassesArmLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_arm_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Right Temple Arm */}
                {isGlassesArmRightPlaced && (
                  <path
                    d={GLASSES_PLACED_ARM_RIGHT_PATH}
                    fill={glassesArmRightColor}
                    onClick={() => {
                      setGlassesArmRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_arm_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Frame Rim (evenodd with 2 lens holes) */}
                {isGlassesFramePlaced && (
                  <path
                    d={GLASSES_PLACED_FRAME_PATH}
                    fill={glassesFrameColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setGlassesFrameColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_frame', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Left Lens */}
                {isGlassesLensLeftPlaced && (
                  <path
                    d={GLASSES_PLACED_LENS_LEFT_PATH}
                    fill={glassesLensLeftColor}
                    onClick={() => {
                      setGlassesLensLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_lens_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Right Lens */}
                {isGlassesLensRightPlaced && (
                  <path
                    d={GLASSES_PLACED_LENS_RIGHT_PATH}
                    fill={glassesLensRightColor}
                    onClick={() => {
                      setGlassesLensRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_lens_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={glassesOutlineImg}
                alt="Glasses Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: GLASSES CUTTING PIECES */}
            <div
              id="glasses-cutting-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[694/454] flex items-center justify-center"
            >
              {isGlassesArmLeftPlaced &&
                isGlassesArmRightPlaced &&
                isGlassesFramePlaced &&
                isGlassesLensLeftPlaced &&
                isGlassesLensRightPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetGlasses}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Left Temple Arm */}
                {!isGlassesArmLeftPlaced && (
                  <motion.div
                    id="cutting-glasses-arm-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleGlassesArmLeftDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setGlassesArmLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_arm_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '8%',
                      top: '4%',
                      width: `${(145 / 694) * 90}%`,
                      height: `${(206 / 454) * 90}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={GLASSES_ARM_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-12" y="-10" width="169" height="226" fill="transparent" />
                      <path
                        d={GLASSES_ARM_LEFT_PATH}
                        fill={glassesArmLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Right Temple Arm */}
                {!isGlassesArmRightPlaced && (
                  <motion.div
                    id="cutting-glasses-arm-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleGlassesArmRightDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setGlassesArmRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_arm_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '34%',
                      top: '4%',
                      width: `${(145 / 694) * 90}%`,
                      height: `${(206 / 454) * 90}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={GLASSES_ARM_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-12" y="-10" width="169" height="226" fill="transparent" />
                      <path
                        d={GLASSES_ARM_RIGHT_PATH}
                        fill={glassesArmRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Left Lens */}
                {!isGlassesLensLeftPlaced && (
                  <motion.div
                    id="cutting-glasses-lens-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleGlassesLensLeftDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setGlassesLensLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_lens_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '60%',
                      top: '6%',
                      width: `${(208 / 694) * 110}%`,
                      height: `${(150 / 454) * 110}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={GLASSES_LENS_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={GLASSES_LENS_LEFT_PATH}
                        fill={glassesLensLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Eyeglass Frame (evenodd with 2 lens holes) */}
                {!isGlassesFramePlaced && (
                  <motion.div
                    id="cutting-glasses-frame"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleGlassesFrameDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setGlassesFrameColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_frame', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '3%',
                      top: '56%',
                      width: `${(634 / 694) * 62}%`,
                      height: `${(195 / 454) * 62}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={GLASSES_FRAME_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={GLASSES_FRAME_PATH}
                        fill={glassesFrameColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Right Lens */}
                {!isGlassesLensRightPlaced && (
                  <motion.div
                    id="cutting-glasses-lens-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleGlassesLensRightDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setGlassesLensRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('glasses_lens_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '63%',
                      top: '52%',
                      width: `${(208 / 694) * 110}%`,
                      height: `${(150 / 454) * 110}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={GLASSES_LENS_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={GLASSES_LENS_RIGHT_PATH}
                        fill={glassesLensRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 5 pieces are placed */}
                {isGlassesArmLeftPlaced &&
                  isGlassesArmRightPlaced &&
                  isGlassesFramePlaced &&
                  isGlassesLensLeftPlaced &&
                  isGlassesLensRightPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ चश्मा सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'TRACTOR' ? (
          // ================================================================
          // TRACTOR (ट्रैक्टर) GAME SCREEN (Tractor_-_Graphics_by_Canva_c2293e43.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: TRACTOR OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="tractor-outline-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[547/460] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 547 460"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Tractor Body & Cab (with evenodd holes for windows and grille bars) */}
                {isTractorBodyPlaced && (
                  <path
                    d={TRACTOR_PLACED_BODY_PATH}
                    fill={tractorBodyColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setTractorBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Left Window */}
                {isTractorWinLeftPlaced && (
                  <path
                    d={TRACTOR_PLACED_WIN_LEFT_PATH}
                    fill={tractorWinLeftColor}
                    onClick={() => {
                      setTractorWinLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_win_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Right Window */}
                {isTractorWinRightPlaced && (
                  <path
                    d={TRACTOR_PLACED_WIN_RIGHT_PATH}
                    fill={tractorWinRightColor}
                    onClick={() => {
                      setTractorWinRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_win_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Exhaust Pipe */}
                {isTractorExhaustPlaced && (
                  <path
                    d={TRACTOR_PLACED_EXHAUST_PATH}
                    fill={tractorExhaustColor}
                    onClick={() => {
                      setTractorExhaustColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_exhaust', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Rear Fender */}
                {isTractorFenderPlaced && (
                  <path
                    d={TRACTOR_PLACED_FENDER_PATH}
                    fill={tractorFenderColor}
                    onClick={() => {
                      setTractorFenderColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_fender', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Rear Big Tire (evenodd doughnut) */}
                {isTractorTireRearPlaced && (
                  <path
                    d={TRACTOR_PLACED_TIRE_REAR_PATH}
                    fill={tractorTireRearColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setTractorTireRearColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_tire_rear', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Rear Wheel Hub */}
                {isTractorHubRearPlaced && (
                  <path
                    d={TRACTOR_PLACED_HUB_REAR_PATH}
                    fill={tractorHubRearColor}
                    onClick={() => {
                      setTractorHubRearColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_hub_rear', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 8. Placed Front Small Tire (evenodd doughnut) */}
                {isTractorTireFrontPlaced && (
                  <path
                    d={TRACTOR_PLACED_TIRE_FRONT_PATH}
                    fill={tractorTireFrontColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setTractorTireFrontColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_tire_front', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 9. Placed Front Wheel Hub */}
                {isTractorHubFrontPlaced && (
                  <path
                    d={TRACTOR_PLACED_HUB_FRONT_PATH}
                    fill={tractorHubFrontColor}
                    onClick={() => {
                      setTractorHubFrontColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_hub_front', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={tractorOutlineImg}
                alt="Tractor Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: TRACTOR CUTTING PIECES */}
            <div
              id="tractor-cutting-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[547/460] flex items-center justify-center"
            >
              {isTractorBodyPlaced &&
                isTractorWinLeftPlaced &&
                isTractorWinRightPlaced &&
                isTractorExhaustPlaced &&
                isTractorFenderPlaced &&
                isTractorTireRearPlaced &&
                isTractorHubRearPlaced &&
                isTractorTireFrontPlaced &&
                isTractorHubFrontPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetTractor}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Tractor Body (with evenodd holes) */}
                {!isTractorBodyPlaced && (
                  <motion.div
                    id="cutting-tractor-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2%',
                      top: '3%',
                      width: `${(392 / 547) * 52}%`,
                      height: `${(312 / 460) * 52}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={TRACTOR_BODY_PATH}
                        fill={tractorBodyColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Left Window */}
                {!isTractorWinLeftPlaced && (
                  <motion.div
                    id="cutting-tractor-win-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorWinLeftDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorWinLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_win_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '43%',
                      top: '5%',
                      width: `${(61 / 547) * 90}%`,
                      height: `${(110 / 460) * 90}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_WIN_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={TRACTOR_WIN_LEFT_PATH}
                        fill={tractorWinLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Right Window */}
                {!isTractorWinRightPlaced && (
                  <motion.div
                    id="cutting-tractor-win-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorWinRightDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorWinRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_win_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '56%',
                      top: '4%',
                      width: `${(90 / 547) * 75}%`,
                      height: `${(169 / 460) * 75}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_WIN_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={TRACTOR_WIN_RIGHT_PATH}
                        fill={tractorWinRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Exhaust Pipe (with generous transparent hitbox) */}
                {!isTractorExhaustPlaced && (
                  <motion.div
                    id="cutting-tractor-exhaust"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorExhaustDragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorExhaustColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_exhaust', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '72%',
                      top: '7%',
                      width: `${(17 / 547) * 160}%`,
                      height: `${(55 / 460) * 160}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_EXHAUST_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-20" y="-12" width="57" height="79" fill="transparent" />
                      <path
                        d={TRACTOR_EXHAUST_PATH}
                        fill={tractorExhaustColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Rear Hub */}
                {!isTractorHubRearPlaced && (
                  <motion.div
                    id="cutting-tractor-hub-rear"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorHubRearDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorHubRearColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_hub_rear', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '81%',
                      top: '6%',
                      width: `${(100 / 547) * 85}%`,
                      height: `${(100 / 460) * 85}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_HUB_REAR_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={TRACTOR_HUB_REAR_PATH}
                        fill={tractorHubRearColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Rear Fender */}
                {!isTractorFenderPlaced && (
                  <motion.div
                    id="cutting-tractor-fender"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorFenderDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorFenderColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_fender', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '3%',
                      top: '42%',
                      width: `${(220 / 547) * 85}%`,
                      height: `${(70 / 460) * 85}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_FENDER_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={TRACTOR_FENDER_PATH}
                        fill={tractorFenderColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Front Hub */}
                {!isTractorHubFrontPlaced && (
                  <motion.div
                    id="cutting-tractor-hub-front"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorHubFrontDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorHubFrontColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_hub_front', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '14%',
                      top: '62%',
                      width: `${(65 / 547) * 105}%`,
                      height: `${(65 / 460) * 105}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_HUB_FRONT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-12" y="-12" width="89" height="89" fill="transparent" />
                      <path
                        d={TRACTOR_HUB_FRONT_PATH}
                        fill={tractorHubFrontColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 8. Rear Big Tire (evenodd doughnut) */}
                {!isTractorTireRearPlaced && (
                  <motion.div
                    id="cutting-tractor-tire-rear"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorTireRearDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorTireRearColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_tire_rear', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '40%',
                      top: '42%',
                      width: `${(217 / 547) * 72}%`,
                      height: `${(218 / 460) * 72}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_TIRE_REAR_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={TRACTOR_TIRE_REAR_PATH}
                        fill={tractorTireRearColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 9. Front Small Tire (evenodd doughnut) */}
                {!isTractorTireFrontPlaced && (
                  <motion.div
                    id="cutting-tractor-tire-front"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleTractorTireFrontDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTractorTireFrontColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('tractor_tire_front', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '72%',
                      top: '44%',
                      width: `${(153 / 547) * 85}%`,
                      height: `${(153 / 460) * 85}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={TRACTOR_TIRE_FRONT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={TRACTOR_TIRE_FRONT_PATH}
                        fill={tractorTireFrontColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 9 pieces are placed */}
                {isTractorBodyPlaced &&
                  isTractorWinLeftPlaced &&
                  isTractorWinRightPlaced &&
                  isTractorExhaustPlaced &&
                  isTractorFenderPlaced &&
                  isTractorTireRearPlaced &&
                  isTractorHubRearPlaced &&
                  isTractorTireFrontPlaced &&
                  isTractorHubFrontPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ ट्रैक्टर सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'CAKE' ? (
          // ================================================================
          // CAKE (केक) GAME SCREEN (Coloring_page_10ce63ff.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: CAKE OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="cake-outline-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[673/484] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 673 484"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Top Surface (with evenodd 3 heart holes) */}
                {isCakeTopPlaced && (
                  <path
                    d={CAKE_PLACED_TOP_PATH}
                    fill={cakeTopColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setCakeTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Top Small Heart */}
                {isCakeHeartTopPlaced && (
                  <path
                    d={CAKE_PLACED_HEART_TOP_PATH}
                    fill={cakeHeartTopColor}
                    onClick={() => {
                      setCakeHeartTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_heart_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Left Big Heart */}
                {isCakeHeartLeftPlaced && (
                  <path
                    d={CAKE_PLACED_HEART_LEFT_PATH}
                    fill={cakeHeartLeftColor}
                    onClick={() => {
                      setCakeHeartLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_heart_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Right Heart */}
                {isCakeHeartRightPlaced && (
                  <path
                    d={CAKE_PLACED_HEART_RIGHT_PATH}
                    fill={cakeHeartRightColor}
                    onClick={() => {
                      setCakeHeartRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_heart_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Upper Frosting Layer */}
                {isCakeLayerTopPlaced && (
                  <path
                    d={CAKE_PLACED_LAYER_TOP_PATH}
                    fill={cakeLayerTopColor}
                    onClick={() => {
                      setCakeLayerTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_layer_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Lower Cake Layer */}
                {isCakeLayerBotPlaced && (
                  <path
                    d={CAKE_PLACED_LAYER_BOT_PATH}
                    fill={cakeLayerBotColor}
                    onClick={() => {
                      setCakeLayerBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_layer_bot', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Plate */}
                {isCakePlatePlaced && (
                  <path
                    d={CAKE_PLACED_PLATE_PATH}
                    fill={cakePlateColor}
                    onClick={() => {
                      setCakePlateColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_plate', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={cakeOutlineImg}
                alt="Cake Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: CAKE CUTTING PIECES */}
            <div
              id="cake-cutting-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[673/484] flex items-center justify-center"
            >
              {isCakeTopPlaced &&
                isCakeHeartTopPlaced &&
                isCakeHeartLeftPlaced &&
                isCakeHeartRightPlaced &&
                isCakeLayerTopPlaced &&
                isCakeLayerBotPlaced &&
                isCakePlatePlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetCake}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Cake Top Surface (with evenodd heart holes) */}
                {!isCakeTopPlaced && (
                  <motion.div
                    id="cutting-cake-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCakeTopDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCakeTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2%',
                      top: '4%',
                      width: `${(489 / 673) * 65}%`,
                      height: `${(183 / 484) * 65}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAKE_TOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAKE_TOP_PATH}
                        fill={cakeTopColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Left Big Heart */}
                {!isCakeHeartLeftPlaced && (
                  <motion.div
                    id="cutting-cake-heart-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCakeHeartLeftDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCakeHeartLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_heart_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '54%',
                      top: '10%',
                      width: `${(74 / 673) * 125}%`,
                      height: `${(64 / 484) * 125}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAKE_HEART_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-12" y="-12" width="98" height="88" fill="transparent" />
                      <path
                        d={CAKE_HEART_LEFT_PATH}
                        fill={cakeHeartLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Top Small Heart */}
                {!isCakeHeartTopPlaced && (
                  <motion.div
                    id="cutting-cake-heart-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCakeHeartTopDragEnd}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCakeHeartTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_heart_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '71%',
                      top: '13%',
                      width: `${(37 / 673) * 150}%`,
                      height: `${(30 / 484) * 150}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAKE_HEART_TOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-14" y="-14" width="65" height="58" fill="transparent" />
                      <path
                        d={CAKE_HEART_TOP_PATH}
                        fill={cakeHeartTopColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Right Heart */}
                {!isCakeHeartRightPlaced && (
                  <motion.div
                    id="cutting-cake-heart-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCakeHeartRightDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCakeHeartRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_heart_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '84%',
                      top: '12%',
                      width: `${(47 / 673) * 140}%`,
                      height: `${(42 / 484) * 140}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAKE_HEART_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-12" y="-12" width="71" height="66" fill="transparent" />
                      <path
                        d={CAKE_HEART_RIGHT_PATH}
                        fill={cakeHeartRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Upper Frosting Layer */}
                {!isCakeLayerTopPlaced && (
                  <motion.div
                    id="cutting-cake-layer-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCakeLayerTopDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCakeLayerTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_layer_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2%',
                      top: '34%',
                      width: `${(489 / 673) * 65}%`,
                      height: `${(182 / 484) * 65}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAKE_LAYER_TOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAKE_LAYER_TOP_PATH}
                        fill={cakeLayerTopColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Plate */}
                {!isCakePlatePlaced && (
                  <motion.div
                    id="cutting-cake-plate"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCakePlateDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCakePlateColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_plate', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '51%',
                      top: '52%',
                      width: `${(620 / 673) * 52}%`,
                      height: `${(157 / 484) * 52}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAKE_PLATE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAKE_PLATE_PATH}
                        fill={cakePlateColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Lower Cake Body Layer */}
                {!isCakeLayerBotPlaced && (
                  <motion.div
                    id="cutting-cake-layer-bot"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCakeLayerBotDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCakeLayerBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('cake_layer_bot', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '2%',
                      top: '66%',
                      width: `${(489 / 673) * 65}%`,
                      height: `${(155 / 484) * 65}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CAKE_LAYER_BOT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CAKE_LAYER_BOT_PATH}
                        fill={cakeLayerBotColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 7 pieces are placed */}
                {isCakeTopPlaced &&
                  isCakeHeartTopPlaced &&
                  isCakeHeartLeftPlaced &&
                  isCakeHeartRightPlaced &&
                  isCakeLayerTopPlaced &&
                  isCakeLayerBotPlaced &&
                  isCakePlatePlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ केक सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'CANDLE' ? (
          // ================================================================
          // CANDLE (मोमबत्ती) GAME SCREEN (dibujos-de-vela-para-colorear-11_png__1137_1517__ea93299f.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: CANDLE OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="candle-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[393/952] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 393 952"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Flame */}
                {isCandleFlamePlaced && (
                  <path
                    d={CANDLE_PLACED_FLAME_PATH}
                    fill={candleFlameColor}
                    onClick={() => {
                      setCandleFlameColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('candle_flame', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Wick */}
                {isCandleWickPlaced && (
                  <path
                    d={CANDLE_PLACED_WICK_PATH}
                    fill={candleWickColor}
                    onClick={() => {
                      setCandleWickColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('candle_wick', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Melted Wax */}
                {isCandleWaxPlaced && (
                  <path
                    d={CANDLE_PLACED_WAX_PATH}
                    fill={candleWaxColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setCandleWaxColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('candle_wax', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Candle Body */}
                {isCandleBodyPlaced && (
                  <path
                    d={CANDLE_PLACED_BODY_PATH}
                    fill={candleBodyColor}
                    onClick={() => {
                      setCandleBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('candle_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={candleOutlineImg}
                alt="Candle Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: CANDLE CUTTING PIECES */}
            <div
              id="candle-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] flex items-center justify-center"
            >
              {isCandleFlamePlaced &&
                isCandleWickPlaced &&
                isCandleWaxPlaced &&
                isCandleBodyPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetCandle}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full max-w-[420px] h-full">
                {/* 1. Flame */}
                {!isCandleFlamePlaced && (
                  <motion.div
                    id="cutting-candle-flame"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCandleFlameDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCandleFlameColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('candle_flame', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '8%',
                      top: '4%',
                      width: '28%',
                      height: '44%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CANDLE_FLAME_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CANDLE_FLAME_PATH}
                        fill={candleFlameColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Wick */}
                {!isCandleWickPlaced && (
                  <motion.div
                    id="cutting-candle-wick"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCandleWickDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCandleWickColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('candle_wick', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '44%',
                      top: '14%',
                      width: '12%',
                      height: '24%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CANDLE_WICK_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-25" y="-15" width="73" height="93" fill="transparent" />
                      <path
                        d={CANDLE_WICK_PATH}
                        fill={candleWickColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Melted Wax */}
                {!isCandleWaxPlaced && (
                  <motion.div
                    id="cutting-candle-wax"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCandleWaxDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCandleWaxColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('candle_wax', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '58%',
                      top: '4%',
                      width: '38%',
                      height: '44%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CANDLE_WAX_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CANDLE_WAX_PATH}
                        fill={candleWaxColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Candle Body */}
                {!isCandleBodyPlaced && (
                  <motion.div
                    id="cutting-candle-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCandleBodyDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCandleBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('candle_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '28%',
                      top: '51%',
                      width: '44%',
                      height: '46%',
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CANDLE_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CANDLE_BODY_PATH}
                        fill={candleBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 4 pieces are placed */}
                {isCandleFlamePlaced &&
                  isCandleWickPlaced &&
                  isCandleWaxPlaced &&
                  isCandleBodyPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ मोमबत्ती सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'HOUSE' ? (
          // ================================================================
          // HOUSE (घर) GAME SCREEN (Kinderd_Canvas___Digital_Store_66dece07.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: HOUSE OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="house-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[715/790] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 715 790"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Chimney */}
                {isHouseChimneyPlaced && (
                  <path
                    d={HOUSE_PLACED_CHIMNEY_PATH}
                    fill={houseChimneyColor}
                    onClick={() => {
                      setHouseChimneyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_chimney', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Roof (with evenodd top window hole) */}
                {isHouseRoofPlaced && (
                  <path
                    d={HOUSE_PLACED_ROOF_PATH}
                    fill={houseRoofColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setHouseRoofColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_roof', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Top Window */}
                {isHouseWinTopPlaced && (
                  <path
                    d={HOUSE_PLACED_WIN_TOP_PATH}
                    fill={houseWinTopColor}
                    onClick={() => {
                      setHouseWinTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_win_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Wall (with evenodd bottom window hole) */}
                {isHouseWallPlaced && (
                  <path
                    d={HOUSE_PLACED_WALL_PATH}
                    fill={houseWallColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setHouseWallColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_wall', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Bottom Window */}
                {isHouseWinBotPlaced && (
                  <path
                    d={HOUSE_PLACED_WIN_BOT_PATH}
                    fill={houseWinBotColor}
                    onClick={() => {
                      setHouseWinBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_win_bot', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Door */}
                {isHouseDoorPlaced && (
                  <path
                    d={HOUSE_PLACED_DOOR_PATH}
                    fill={houseDoorColor}
                    onClick={() => {
                      setHouseDoorColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_door', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Foundation Left */}
                {isHouseBaseLeftPlaced && (
                  <path
                    d={HOUSE_PLACED_BASE_LEFT_PATH}
                    fill={houseBaseLeftColor}
                    onClick={() => {
                      setHouseBaseLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_base_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 8. Placed Foundation Right */}
                {isHouseBaseRightPlaced && (
                  <path
                    d={HOUSE_PLACED_BASE_RIGHT_PATH}
                    fill={houseBaseRightColor}
                    onClick={() => {
                      setHouseBaseRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_base_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={houseOutlineImg}
                alt="House Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: HOUSE CUTTING PIECES */}
            <div
              id="house-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[715/790] flex items-center justify-center"
            >
              {isHouseChimneyPlaced &&
                isHouseRoofPlaced &&
                isHouseWinTopPlaced &&
                isHouseWallPlaced &&
                isHouseWinBotPlaced &&
                isHouseDoorPlaced &&
                isHouseBaseLeftPlaced &&
                isHouseBaseRightPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetHouse}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Roof */}
                {!isHouseRoofPlaced && (
                  <motion.div
                    id="cutting-house-roof"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHouseRoofDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHouseRoofColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_roof', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '4%',
                      top: '3%',
                      width: `${(659 / 715) * 60}%`,
                      height: `${(338 / 790) * 60}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HOUSE_ROOF_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HOUSE_ROOF_PATH}
                        fill={houseRoofColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Chimney */}
                {!isHouseChimneyPlaced && (
                  <motion.div
                    id="cutting-house-chimney"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHouseChimneyDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHouseChimneyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_chimney', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '64%',
                      top: '4%',
                      width: `${(84 / 715) * 75}%`,
                      height: `${(170 / 790) * 75}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HOUSE_CHIMNEY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-10" y="-10" width="104" height="190" fill="transparent" />
                      <path
                        d={HOUSE_CHIMNEY_PATH}
                        fill={houseChimneyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Top Window */}
                {!isHouseWinTopPlaced && (
                  <motion.div
                    id="cutting-house-win-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHouseWinTopDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHouseWinTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_win_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '79%',
                      top: '5%',
                      width: `${(105 / 715) * 75}%`,
                      height: `${(110 / 790) * 75}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HOUSE_WIN_TOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-10" y="-10" width="125" height="130" fill="transparent" />
                      <path
                        d={HOUSE_WIN_TOP_PATH}
                        fill={houseWinTopColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Wall */}
                {!isHouseWallPlaced && (
                  <motion.div
                    id="cutting-house-wall"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHouseWallDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHouseWallColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_wall', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '4%',
                      top: '32%',
                      width: `${(589 / 715) * 56}%`,
                      height: `${(327 / 790) * 56}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HOUSE_WALL_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HOUSE_WALL_PATH}
                        fill={houseWallColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Bottom Window */}
                {!isHouseWinBotPlaced && (
                  <motion.div
                    id="cutting-house-win-bot"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHouseWinBotDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHouseWinBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_win_bot', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '54%',
                      top: '34%',
                      width: `${(136 / 715) * 72}%`,
                      height: `${(144 / 790) * 72}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HOUSE_WIN_BOT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-10" y="-10" width="156" height="164" fill="transparent" />
                      <path
                        d={HOUSE_WIN_BOT_PATH}
                        fill={houseWinBotColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Door */}
                {!isHouseDoorPlaced && (
                  <motion.div
                    id="cutting-house-door"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHouseDoorDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHouseDoorColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_door', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '73%',
                      top: '30%',
                      width: `${(187 / 715) * 70}%`,
                      height: `${(286 / 790) * 70}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HOUSE_DOOR_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HOUSE_DOOR_PATH}
                        fill={houseDoorColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Foundation Left */}
                {!isHouseBaseLeftPlaced && (
                  <motion.div
                    id="cutting-house-base-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHouseBaseLeftDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHouseBaseLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_base_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '8%',
                      top: '65%',
                      width: `${(322 / 715) * 85}%`,
                      height: `${(50 / 790) * 85}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HOUSE_BASE_LEFT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-10" y="-14" width="342" height="78" fill="transparent" />
                      <path
                        d={HOUSE_BASE_LEFT_PATH}
                        fill={houseBaseLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 8. Foundation Right */}
                {!isHouseBaseRightPlaced && (
                  <motion.div
                    id="cutting-house-base-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHouseBaseRightDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHouseBaseRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('house_base_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '58%',
                      top: '65%',
                      width: `${(77 / 715) * 95}%`,
                      height: `${(49 / 790) * 95}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HOUSE_BASE_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-14" y="-14" width="105" height="77" fill="transparent" />
                      <path
                        d={HOUSE_BASE_RIGHT_PATH}
                        fill={houseBaseRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 8 pieces are placed */}
                {isHouseChimneyPlaced &&
                  isHouseRoofPlaced &&
                  isHouseWinTopPlaced &&
                  isHouseWallPlaced &&
                  isHouseWinBotPlaced &&
                  isHouseDoorPlaced &&
                  isHouseBaseLeftPlaced &&
                  isHouseBaseRightPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ घर सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'BOAT' ? (
          // ================================================================
          // BOAT (नाव) GAME SCREEN (540361655284408540_334b6940.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: BOAT OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="boat-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[625/844] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 625 844"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Mast */}
                {isBoatMastPlaced && (
                  <path
                    d={BOAT_PLACED_MAST_PATH}
                    fill={boatMastColor}
                    onClick={() => {
                      setBoatMastColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_mast', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Left Sail Top */}
                {isBoatSailLTopPlaced && (
                  <path
                    d={BOAT_PLACED_SAIL_LTOP_PATH}
                    fill={boatSailLTopColor}
                    onClick={() => {
                      setBoatSailLTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_sail_ltop', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Left Sail Middle */}
                {isBoatSailLMidPlaced && (
                  <path
                    d={BOAT_PLACED_SAIL_LMID_PATH}
                    fill={boatSailLMidColor}
                    onClick={() => {
                      setBoatSailLMidColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_sail_lmid', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Left Sail Bottom */}
                {isBoatSailLBotPlaced && (
                  <path
                    d={BOAT_PLACED_SAIL_LBOT_PATH}
                    fill={boatSailLBotColor}
                    onClick={() => {
                      setBoatSailLBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_sail_lbot', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Right Sail */}
                {isBoatSailRightPlaced && (
                  <path
                    d={BOAT_PLACED_SAIL_RIGHT_PATH}
                    fill={boatSailRightColor}
                    onClick={() => {
                      setBoatSailRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_sail_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Hull Top Band */}
                {isBoatHullTopPlaced && (
                  <path
                    d={BOAT_PLACED_HULL_TOP_PATH}
                    fill={boatHullTopColor}
                    onClick={() => {
                      setBoatHullTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_hull_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Hull Bottom Base */}
                {isBoatHullBotPlaced && (
                  <path
                    d={BOAT_PLACED_HULL_BOT_PATH}
                    fill={boatHullBotColor}
                    onClick={() => {
                      setBoatHullBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_hull_bot', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={boatOutlineImg}
                alt="Boat Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: BOAT CUTTING PIECES */}
            <div
              id="boat-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[625/844] flex items-center justify-center"
            >
              {isBoatMastPlaced &&
                isBoatSailLTopPlaced &&
                isBoatSailLMidPlaced &&
                isBoatSailLBotPlaced &&
                isBoatSailRightPlaced &&
                isBoatHullTopPlaced &&
                isBoatHullBotPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetBoat}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Left Sail Top */}
                {!isBoatSailLTopPlaced && (
                  <motion.div
                    id="cutting-boat-sail-ltop"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBoatSailLTopDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBoatSailLTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_sail_ltop', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '4%',
                      top: '4%',
                      width: `${(126 / 625) * 80}%`,
                      height: `${(235 / 844) * 80}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BOAT_SAIL_LTOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BOAT_SAIL_LTOP_PATH}
                        fill={boatSailLTopColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Left Sail Middle */}
                {!isBoatSailLMidPlaced && (
                  <motion.div
                    id="cutting-boat-sail-lmid"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBoatSailLMidDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBoatSailLMidColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_sail_lmid', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '25%',
                      top: '4%',
                      width: `${(143 / 625) * 80}%`,
                      height: `${(229 / 844) * 80}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BOAT_SAIL_LMID_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BOAT_SAIL_LMID_PATH}
                        fill={boatSailLMidColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Mast */}
                {!isBoatMastPlaced && (
                  <motion.div
                    id="cutting-boat-mast"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBoatMastDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBoatMastColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_mast', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '49%',
                      top: '4%',
                      width: `${(62 / 625) * 68}%`,
                      height: `${(578 / 844) * 68}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BOAT_MAST_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-14" y="-8" width="90" height="594" fill="transparent" />
                      <path
                        d={BOAT_MAST_PATH}
                        fill={boatMastColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Right Sail */}
                {!isBoatSailRightPlaced && (
                  <motion.div
                    id="cutting-boat-sail-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBoatSailRightDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBoatSailRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_sail_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '64%',
                      top: '4%',
                      width: `${(228 / 625) * 70}%`,
                      height: `${(539 / 844) * 70}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BOAT_SAIL_RIGHT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BOAT_SAIL_RIGHT_PATH}
                        fill={boatSailRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Left Sail Bottom */}
                {!isBoatSailLBotPlaced && (
                  <motion.div
                    id="cutting-boat-sail-lbot"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBoatSailLBotDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBoatSailLBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_sail_lbot', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '10%',
                      top: '31%',
                      width: `${(195 / 625) * 78}%`,
                      height: `${(232 / 844) * 78}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BOAT_SAIL_LBOT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BOAT_SAIL_LBOT_PATH}
                        fill={boatSailLBotColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Hull Top Band */}
                {!isBoatHullTopPlaced && (
                  <motion.div
                    id="cutting-boat-hull-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBoatHullTopDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBoatHullTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_hull_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '13%',
                      top: '59%',
                      width: `${(573 / 625) * 80}%`,
                      height: `${(74 / 844) * 80}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BOAT_HULL_TOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-8" y="-12" width="589" height="98" fill="transparent" />
                      <path
                        d={BOAT_HULL_TOP_PATH}
                        fill={boatHullTopColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Hull Bottom Base */}
                {!isBoatHullBotPlaced && (
                  <motion.div
                    id="cutting-boat-hull-bot"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBoatHullBotDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBoatHullBotColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('boat_hull_bot', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '17%',
                      top: '72%',
                      width: `${(519 / 625) * 80}%`,
                      height: `${(134 / 844) * 80}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BOAT_HULL_BOT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BOAT_HULL_BOT_PATH}
                        fill={boatHullBotColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 7 pieces are placed */}
                {isBoatMastPlaced &&
                  isBoatSailLTopPlaced &&
                  isBoatSailLMidPlaced &&
                  isBoatSailLBotPlaced &&
                  isBoatSailRightPlaced &&
                  isBoatHullTopPlaced &&
                  isBoatHullBotPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ नाव सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'BUS' ? (
          // ================================================================
          // BUS (बस) GAME SCREEN (download__26__92570187.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: BUS OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="bus-outline-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[729/391] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 729 391"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Bus Body (with evenodd window holes) */}
                {isBusBodyPlaced && (
                  <path
                    d={BUS_PLACED_BODY_PATH}
                    fill={busBodyColor}
                    fillRule="evenodd"
                    onClick={() => {
                      setBusBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Window 1 */}
                {isBusWin1Placed && (
                  <path
                    d={BUS_PLACED_WIN1_PATH}
                    fill={busWin1Color}
                    onClick={() => {
                      setBusWin1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_win1', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Window 2 */}
                {isBusWin2Placed && (
                  <path
                    d={BUS_PLACED_WIN2_PATH}
                    fill={busWin2Color}
                    onClick={() => {
                      setBusWin2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_win2', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Window 3 */}
                {isBusWin3Placed && (
                  <path
                    d={BUS_PLACED_WIN3_PATH}
                    fill={busWin3Color}
                    onClick={() => {
                      setBusWin3Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_win3', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Window 4 */}
                {isBusWin4Placed && (
                  <path
                    d={BUS_PLACED_WIN4_PATH}
                    fill={busWin4Color}
                    onClick={() => {
                      setBusWin4Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_win4', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Wheel 1 (Rear Hub) */}
                {isBusWheel1Placed && (
                  <path
                    d={BUS_PLACED_WHEEL1_PATH}
                    fill={busWheel1Color}
                    onClick={() => {
                      setBusWheel1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_wheel1', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Wheel 2 (Front Hub) */}
                {isBusWheel2Placed && (
                  <path
                    d={BUS_PLACED_WHEEL2_PATH}
                    fill={busWheel2Color}
                    onClick={() => {
                      setBusWheel2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_wheel2', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={busOutlineImg}
                alt="Bus Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: BUS CUTTING PIECES */}
            <div
              id="bus-cutting-container"
              className="relative flex-1 w-full max-w-[540px] max-h-[480px] aspect-[729/391] flex items-center justify-center"
            >
              {isBusBodyPlaced &&
                isBusWin1Placed &&
                isBusWin2Placed &&
                isBusWin3Placed &&
                isBusWin4Placed &&
                isBusWheel1Placed &&
                isBusWheel2Placed && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetBus}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Bus Body (Top Center) */}
                {!isBusBodyPlaced && (
                  <motion.div
                    id="cutting-bus-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBusBodyDragEnd}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setBusBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '18%',
                      top: '4%',
                      width: `${(683 / 729) * 68}%`,
                      height: `${(279 / 391) * 68}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUS_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUS_BODY_PATH}
                        fill={busBodyColor}
                        fillRule="evenodd"
                        stroke="#e2e8f0"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Window 1 (Bottom Row Left) */}
                {!isBusWin1Placed && (
                  <motion.div
                    id="cutting-bus-win1"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBusWin1DragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBusWin1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_win1', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '4%',
                      top: '60%',
                      width: `${(101 / 729) * 80}%`,
                      height: `${(93 / 391) * 80}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUS_WIN1_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUS_WIN1_PATH}
                        fill={busWin1Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Window 2 */}
                {!isBusWin2Placed && (
                  <motion.div
                    id="cutting-bus-win2"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBusWin2DragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBusWin2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_win2', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '19%',
                      top: '60%',
                      width: `${(95 / 729) * 80}%`,
                      height: `${(93 / 391) * 80}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUS_WIN2_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUS_WIN2_PATH}
                        fill={busWin2Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Window 3 */}
                {!isBusWin3Placed && (
                  <motion.div
                    id="cutting-bus-win3"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBusWin3DragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBusWin3Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_win3', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '34%',
                      top: '60%',
                      width: `${(91 / 729) * 80}%`,
                      height: `${(93 / 391) * 80}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUS_WIN3_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUS_WIN3_PATH}
                        fill={busWin3Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Window 4 */}
                {!isBusWin4Placed && (
                  <motion.div
                    id="cutting-bus-win4"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBusWin4DragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBusWin4Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_win4', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '48%',
                      top: '60%',
                      width: `${(88 / 729) * 80}%`,
                      height: `${(92 / 391) * 80}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUS_WIN4_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={BUS_WIN4_PATH}
                        fill={busWin4Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Wheel 1 (Rear Hub) */}
                {!isBusWheel1Placed && (
                  <motion.div
                    id="cutting-bus-wheel1"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBusWheel1DragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      setBusWheel1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_wheel1', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '64%',
                      top: '63%',
                      width: `${(55 / 729) * 100}%`,
                      height: `${(55 / 391) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUS_WHEEL1_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-10" y="-10" width="75" height="75" fill="transparent" />
                      <path
                        d={BUS_WHEEL1_PATH}
                        fill={busWheel1Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Wheel 2 (Front Hub) */}
                {!isBusWheel2Placed && (
                  <motion.div
                    id="cutting-bus-wheel2"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleBusWheel2DragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      setBusWheel2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('bus_wheel2', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '79%',
                      top: '63%',
                      width: `${(55 / 729) * 100}%`,
                      height: `${(55 / 391) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={BUS_WHEEL2_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-10" y="-10" width="75" height="75" fill="transparent" />
                      <path
                        d={BUS_WHEEL2_PATH}
                        fill={busWheel2Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 7 pieces are placed */}
                {isBusBodyPlaced &&
                  isBusWin1Placed &&
                  isBusWin2Placed &&
                  isBusWin3Placed &&
                  isBusWin4Placed &&
                  isBusWheel1Placed &&
                  isBusWheel2Placed && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ बस सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'PINWHEEL' ? (
          // ================================================================
          // PINWHEEL (फिरकी) GAME SCREEN (download__22__a51dd624.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: PINWHEEL OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="pinwheel-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[748/1012] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 748 1012"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Stick (Bottom) */}
                {isPinwheelStickPlaced && (
                  <path
                    d={PINWHEEL_PLACED_STICK_PATH}
                    fill={pinwheelStickColor}
                    onClick={() => {
                      setPinwheelStickColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_stick', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Top-Left Blade */}
                {isPinwheelBladeTLPlaced && (
                  <path
                    d={PINWHEEL_PLACED_BLADE_TL_PATH}
                    fill={pinwheelBladeTLColor}
                    onClick={() => {
                      setPinwheelBladeTLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_blade_tl', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Top-Right Blade */}
                {isPinwheelBladeTRPlaced && (
                  <path
                    d={PINWHEEL_PLACED_BLADE_TR_PATH}
                    fill={pinwheelBladeTRColor}
                    onClick={() => {
                      setPinwheelBladeTRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_blade_tr', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Bottom-Right Blade */}
                {isPinwheelBladeBRPlaced && (
                  <path
                    d={PINWHEEL_PLACED_BLADE_BR_PATH}
                    fill={pinwheelBladeBRColor}
                    onClick={() => {
                      setPinwheelBladeBRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_blade_br', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Bottom-Left Blade */}
                {isPinwheelBladeBLPlaced && (
                  <path
                    d={PINWHEEL_PLACED_BLADE_BL_PATH}
                    fill={pinwheelBladeBLColor}
                    onClick={() => {
                      setPinwheelBladeBLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_blade_bl', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Center Circle */}
                {isPinwheelCenterPlaced && (
                  <path
                    d={PINWHEEL_PLACED_CENTER_PATH}
                    fill={pinwheelCenterColor}
                    onClick={() => {
                      setPinwheelCenterColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_center', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={pinwheelOutlineImg}
                alt="Pinwheel Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: PINWHEEL CUTTING PIECES */}
            <div
              id="pinwheel-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[748/1012] flex items-center justify-center"
            >
              {isPinwheelBladeTLPlaced &&
                isPinwheelBladeTRPlaced &&
                isPinwheelCenterPlaced &&
                isPinwheelBladeBRPlaced &&
                isPinwheelBladeBLPlaced &&
                isPinwheelStickPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetPinwheel}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Blade Top-Left */}
                {!isPinwheelBladeTLPlaced && (
                  <motion.div
                    id="cutting-pinwheel-blade-tl"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePinwheelBladeTLDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPinwheelBladeTLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_blade_tl', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '8%',
                      top: '5%',
                      width: `${(212 / 748) * 75}%`,
                      height: `${(354 / 1012) * 75}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PINWHEEL_BLADE_TL_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={PINWHEEL_BLADE_TL_PATH}
                        fill={pinwheelBladeTLColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Center Circle */}
                {!isPinwheelCenterPlaced && (
                  <motion.div
                    id="cutting-pinwheel-center"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePinwheelCenterDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setPinwheelCenterColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_center', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '40%',
                      top: '8%',
                      width: `${(114 / 748) * 90}%`,
                      height: `${(113 / 1012) * 90}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PINWHEEL_CENTER_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={PINWHEEL_CENTER_PATH}
                        fill={pinwheelCenterColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Blade Top-Right */}
                {!isPinwheelBladeTRPlaced && (
                  <motion.div
                    id="cutting-pinwheel-blade-tr"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePinwheelBladeTRDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPinwheelBladeTRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_blade_tr', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '58%',
                      top: '12%',
                      width: `${(352 / 748) * 78}%`,
                      height: `${(220 / 1012) * 78}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PINWHEEL_BLADE_TR_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={PINWHEEL_BLADE_TR_PATH}
                        fill={pinwheelBladeTRColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Blade Bottom-Left */}
                {!isPinwheelBladeBLPlaced && (
                  <motion.div
                    id="cutting-pinwheel-blade-bl"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePinwheelBladeBLDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPinwheelBladeBLColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_blade_bl', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '6%',
                      top: '44%',
                      width: `${(355 / 748) * 78}%`,
                      height: `${(229 / 1012) * 78}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PINWHEEL_BLADE_BL_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={PINWHEEL_BLADE_BL_PATH}
                        fill={pinwheelBladeBLColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Blade Bottom-Right */}
                {!isPinwheelBladeBRPlaced && (
                  <motion.div
                    id="cutting-pinwheel-blade-br"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePinwheelBladeBRDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPinwheelBladeBRColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_blade_br', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '48%',
                      top: '44%',
                      width: `${(217 / 748) * 75}%`,
                      height: `${(359 / 1012) * 75}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PINWHEEL_BLADE_BR_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={PINWHEEL_BLADE_BR_PATH}
                        fill={pinwheelBladeBRColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Stick */}
                {!isPinwheelStickPlaced && (
                  <motion.div
                    id="cutting-pinwheel-stick"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handlePinwheelStickDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPinwheelStickColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('pinwheel_stick', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '80%',
                      top: '42%',
                      width: `${(50 / 748) * 85}%`,
                      height: `${(403 / 1012) * 85}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={PINWHEEL_STICK_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-16" y="-8" width="82" height="419" fill="transparent" />
                      <path
                        d={PINWHEEL_STICK_PATH}
                        fill={pinwheelStickColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 6 pieces are placed */}
                {isPinwheelBladeTLPlaced &&
                  isPinwheelBladeTRPlaced &&
                  isPinwheelCenterPlaced &&
                  isPinwheelBladeBRPlaced &&
                  isPinwheelBladeBLPlaced &&
                  isPinwheelStickPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ फिरकी सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'CATERPILLAR' ? (
          // ================================================================
          // CATERPILLAR (कैटरपिलर / इल्ली) GAME SCREEN (download__21__043dfdca.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: CATERPILLAR OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="caterpillar-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[736/649] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline (back-to-front segment overlap order) */}
              <svg
                viewBox="0 0 736 649"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Segment 1 (Leftmost Tail) */}
                {isCatSeg1Placed && (
                  <path
                    d={CATERPILLAR_PLACED_SEG1_PATH}
                    fill={catSeg1Color}
                    onClick={() => {
                      setCatSeg1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_seg1', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Segment 2 */}
                {isCatSeg2Placed && (
                  <path
                    d={CATERPILLAR_PLACED_SEG2_PATH}
                    fill={catSeg2Color}
                    onClick={() => {
                      setCatSeg2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_seg2', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Segment 3 */}
                {isCatSeg3Placed && (
                  <path
                    d={CATERPILLAR_PLACED_SEG3_PATH}
                    fill={catSeg3Color}
                    onClick={() => {
                      setCatSeg3Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_seg3', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Segment 4 (Neck Circle) */}
                {isCatSeg4Placed && (
                  <path
                    d={CATERPILLAR_PLACED_SEG4_PATH}
                    fill={catSeg4Color}
                    onClick={() => {
                      setCatSeg4Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_seg4', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Head */}
                {isCatHeadPlaced && (
                  <path
                    d={CATERPILLAR_PLACED_HEAD_PATH}
                    fill={catHeadColor}
                    onClick={() => {
                      setCatHeadColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_head', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={caterpillarOutlineImg}
                alt="Caterpillar Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: CATERPILLAR CUTTING PIECES */}
            <div
              id="caterpillar-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[736/649] flex items-center justify-center"
            >
              {isCatHeadPlaced &&
                isCatSeg1Placed &&
                isCatSeg2Placed &&
                isCatSeg3Placed &&
                isCatSeg4Placed && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetCaterpillar}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Head (Top-Center) */}
                {!isCatHeadPlaced && (
                  <motion.div
                    id="cutting-caterpillar-head"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCatHeadDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCatHeadColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_head', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '34%',
                      top: '4%',
                      width: `${(263 / 736) * 85}%`,
                      height: `${(262 / 649) * 85}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CATERPILLAR_HEAD_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CATERPILLAR_HEAD_PATH}
                        fill={catHeadColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Segment 1 (Middle-Left) */}
                {!isCatSeg1Placed && (
                  <motion.div
                    id="cutting-caterpillar-seg1"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCatSeg1DragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCatSeg1Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_seg1', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '6%',
                      top: '34%',
                      width: `${(175 / 736) * 90}%`,
                      height: `${(202 / 649) * 90}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CATERPILLAR_SEG1_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CATERPILLAR_SEG1_PATH}
                        fill={catSeg1Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Segment 2 (Middle-Right) */}
                {!isCatSeg2Placed && (
                  <motion.div
                    id="cutting-caterpillar-seg2"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCatSeg2DragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCatSeg2Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_seg2', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '70%',
                      top: '34%',
                      width: `${(169 / 736) * 90}%`,
                      height: `${(203 / 649) * 90}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CATERPILLAR_SEG2_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CATERPILLAR_SEG2_PATH}
                        fill={catSeg2Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Segment 3 (Bottom-Left) */}
                {!isCatSeg3Placed && (
                  <motion.div
                    id="cutting-caterpillar-seg3"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCatSeg3DragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCatSeg3Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_seg3', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '22%',
                      top: '66%',
                      width: `${(164 / 736) * 90}%`,
                      height: `${(203 / 649) * 90}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CATERPILLAR_SEG3_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CATERPILLAR_SEG3_PATH}
                        fill={catSeg3Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Segment 4 (Bottom-Right) */}
                {!isCatSeg4Placed && (
                  <motion.div
                    id="cutting-caterpillar-seg4"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleCatSeg4DragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCatSeg4Color(selectedColor.hex);
                      sounds.speakDrawingPieceColored('caterpillar_seg4', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '54%',
                      top: '68%',
                      width: `${(204 / 736) * 90}%`,
                      height: `${(175 / 649) * 90}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={CATERPILLAR_SEG4_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={CATERPILLAR_SEG4_PATH}
                        fill={catSeg4Color}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 5 pieces are placed */}
                {isCatHeadPlaced &&
                  isCatSeg1Placed &&
                  isCatSeg2Placed &&
                  isCatSeg3Placed &&
                  isCatSeg4Placed && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ कैटरपिलर सही जगह लग गया! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'HEN' ? (
          // ================================================================
          // HEN (मुर्गी) GAME SCREEN (download__19__215567f7.jfif)
          // ================================================================
          <>
            {/* LEFT SIDE: HEN OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="hen-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[640/752] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 640 752"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Left Foot */}
                {isHenFootLeftPlaced && (
                  <path
                    d={HEN_PLACED_LEFT_FOOT_PATH}
                    fill={henFootLeftColor}
                    onClick={() => {
                      setHenFootLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_foot_left', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Right Foot */}
                {isHenFootRightPlaced && (
                  <path
                    d={HEN_PLACED_RIGHT_FOOT_PATH}
                    fill={henFootRightColor}
                    onClick={() => {
                      setHenFootRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_foot_right', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Body */}
                {isHenBodyPlaced && (
                  <path
                    d={HEN_PLACED_BODY_PATH}
                    fill={henBodyColor}
                    onClick={() => {
                      setHenBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Head & Neck */}
                {isHenHeadPlaced && (
                  <path
                    d={HEN_PLACED_HEAD_PATH}
                    fill={henHeadColor}
                    onClick={() => {
                      setHenHeadColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_head', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 5. Placed Comb */}
                {isHenCombPlaced && (
                  <path
                    d={HEN_PLACED_COMB_PATH}
                    fill={henCombColor}
                    onClick={() => {
                      setHenCombColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_comb', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 6. Placed Beak */}
                {isHenBeakPlaced && (
                  <path
                    d={HEN_PLACED_BEAK_PATH}
                    fill={henBeakColor}
                    onClick={() => {
                      setHenBeakColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_beak', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 7. Placed Wattle */}
                {isHenWattlePlaced && (
                  <path
                    d={HEN_PLACED_WATTLE_PATH}
                    fill={henWattleColor}
                    onClick={() => {
                      setHenWattleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_wattle', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={henOutlineImg}
                alt="Hen Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: HEN CUTTING PIECES */}
            <div
              id="hen-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[640/752] flex items-center justify-center"
            >
              {isHenCombPlaced &&
                isHenHeadPlaced &&
                isHenBeakPlaced &&
                isHenWattlePlaced &&
                isHenBodyPlaced &&
                isHenFootLeftPlaced &&
                isHenFootRightPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetHen}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Comb (Top-Left) */}
                {!isHenCombPlaced && (
                  <motion.div
                    id="cutting-hen-comb"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHenCombDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHenCombColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_comb', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '8%',
                      top: '4%',
                      width: `${(128 / 640) * 100}%`,
                      height: `${(74 / 752) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HEN_COMB_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HEN_COMB_PATH}
                        fill={henCombColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Beak (Top-Middle, enlarged touch area) */}
                {!isHenBeakPlaced && (
                  <motion.div
                    id="cutting-hen-beak"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHenBeakDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHenBeakColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_beak', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '38%',
                      top: '5%',
                      width: `${(33 / 640) * 180}%`,
                      height: `${(18 / 752) * 180}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HEN_BEAK_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-15" y="-15" width="63" height="48" fill="transparent" />
                      <path
                        d={HEN_BEAK_PATH}
                        fill={henBeakColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.0"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Wattle (Top-Right, enlarged touch area) */}
                {!isHenWattlePlaced && (
                  <motion.div
                    id="cutting-hen-wattle"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHenWattleDragEnd}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHenWattleColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_wattle', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '58%',
                      top: '4%',
                      width: `${(28 / 640) * 150}%`,
                      height: `${(52 / 752) * 150}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HEN_WATTLE_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-15" y="-10" width="58" height="72" fill="transparent" />
                      <path
                        d={HEN_WATTLE_PATH}
                        fill={henWattleColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.0"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Body & Wing (Center-Left) */}
                {!isHenBodyPlaced && (
                  <motion.div
                    id="cutting-hen-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHenBodyDragEnd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHenBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-20"
                    style={{
                      left: '4%',
                      top: '22%',
                      width: `${(526 / 640) * 74}%`,
                      height: `${(483 / 752) * 74}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HEN_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HEN_BODY_PATH}
                        fill={henBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 5. Head & Neck (Middle-Right) */}
                {!isHenHeadPlaced && (
                  <motion.div
                    id="cutting-hen-head"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHenHeadDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHenHeadColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_head', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '68%',
                      top: '18%',
                      width: `${(207 / 640) * 88}%`,
                      height: `${(240 / 752) * 88}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HEN_HEAD_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HEN_HEAD_PATH}
                        fill={henHeadColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 6. Left Foot (Bottom-Left) */}
                {!isHenFootLeftPlaced && (
                  <motion.div
                    id="cutting-hen-foot-left"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHenFootLeftDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHenFootLeftColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_foot_left', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '16%',
                      top: '76%',
                      width: `${(99 / 640) * 110}%`,
                      height: `${(90 / 752) * 110}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HEN_LEFT_FOOT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HEN_LEFT_FOOT_PATH}
                        fill={henFootLeftColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 7. Right Foot (Bottom-Right) */}
                {!isHenFootRightPlaced && (
                  <motion.div
                    id="cutting-hen-foot-right"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleHenFootRightDragEnd}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setHenFootRightColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('hen_foot_right', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '56%',
                      top: '76%',
                      width: `${(97 / 640) * 110}%`,
                      height: `${(79 / 752) * 110}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={HEN_RIGHT_FOOT_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={HEN_RIGHT_FOOT_PATH}
                        fill={henFootRightColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 7 pieces are placed */}
                {isHenCombPlaced &&
                  isHenHeadPlaced &&
                  isHenBeakPlaced &&
                  isHenWattlePlaced &&
                  isHenBodyPlaced &&
                  isHenFootLeftPlaced &&
                  isHenFootRightPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ मुर्गी सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'ICECREAM' ? (
          // ================================================================
          // ICECREAM (आइसक्रीम) GAME SCREEN (Free_Ice_Cream_Coloring_Pages___Sweet___Fun_Printables_for_Kids_-removebg-preview_76a2a690.png)
          // ================================================================
          <>
            {/* LEFT SIDE: ICECREAM OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="icecream-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[408/612] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 408 612"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Stick */}
                {isIcecreamStickPlaced && (
                  <path
                    d={ICECREAM_PLACED_STICK_PATH}
                    fill={icecreamStickColor}
                    onClick={() => {
                      setIcecreamStickColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('icecream_stick', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Lower Popsicle Body */}
                {isIcecreamBodyPlaced && (
                  <path
                    d={ICECREAM_PLACED_BODY_PATH}
                    fill={icecreamBodyColor}
                    onClick={() => {
                      setIcecreamBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('icecream_body', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Top Icing */}
                {isIcecreamTopPlaced && (
                  <path
                    d={ICECREAM_PLACED_TOP_PATH}
                    fill={icecreamTopColor}
                    onClick={() => {
                      setIcecreamTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('icecream_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={icecreamOutlineImg}
                alt="Ice Cream Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: ICECREAM CUTTING PIECES */}
            <div
              id="icecream-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[408/612] flex items-center justify-center"
            >
              {isIcecreamTopPlaced &&
                isIcecreamBodyPlaced &&
                isIcecreamStickPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetIcecream}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Top Icing (Top-Left) */}
                {!isIcecreamTopPlaced && (
                  <motion.div
                    id="cutting-icecream-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleIcecreamTopDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setIcecreamTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('icecream_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '6%',
                      top: '6%',
                      width: `${(224 / 408) * 100}%`,
                      height: `${(227 / 612) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={ICECREAM_TOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={ICECREAM_TOP_PATH}
                        fill={icecreamTopColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Lower Popsicle Body (Bottom-Right) */}
                {!isIcecreamBodyPlaced && (
                  <motion.div
                    id="cutting-icecream-body"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleIcecreamBodyDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setIcecreamBodyColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('icecream_body', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '38%',
                      top: '46%',
                      width: `${(224 / 408) * 100}%`,
                      height: `${(229 / 612) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={ICECREAM_BODY_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={ICECREAM_BODY_PATH}
                        fill={icecreamBodyColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Popsicle Stick (Bottom-Left, with generous touch hit area) */}
                {!isIcecreamStickPlaced && (
                  <motion.div
                    id="cutting-icecream-stick"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleIcecreamStickDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setIcecreamStickColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('icecream_stick', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '14%',
                      top: '64%',
                      width: `${(54 / 408) * 100}%`,
                      height: `${(94 / 612) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={ICECREAM_STICK_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <rect x="-12" y="-8" width="78" height="110" fill="transparent" />
                      <path
                        d={ICECREAM_STICK_PATH}
                        fill={icecreamStickColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 3 pieces are placed */}
                {isIcecreamTopPlaced &&
                  isIcecreamBodyPlaced &&
                  isIcecreamStickPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ आइसक्रीम सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'LOLLIPOP' ? (
          // ================================================================
          // LOLLIPOP (लॉलीपॉप) GAME SCREEN (download__17_-removebg-preview__1__cfaaed68.png)
          // ================================================================
          <>
            {/* LEFT SIDE: LOLLIPOP OUTLINE */}
            <div
              ref={outlineAreaRef}
              id="lollipop-outline-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[449/556] flex items-center justify-center"
            >
              {/* Placed Pieces fills under the outline */}
              <svg
                viewBox="0 0 449 556"
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible"
              >
                {/* 1. Placed Stick */}
                {isLollipopStickPlaced && (
                  <path
                    d={LOLLIPOP_PLACED_STICK_PATH}
                    fill={lollipopStickColor}
                    onClick={() => {
                      setLollipopStickColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('lollipop_stick', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 2. Placed Bottom Candy */}
                {isLollipopBottomPlaced && (
                  <path
                    d={LOLLIPOP_PLACED_BOTTOM_PATH}
                    fill={lollipopBottomColor}
                    onClick={() => {
                      setLollipopBottomColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('lollipop_bottom', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 3. Placed Middle Band */}
                {isLollipopBandPlaced && (
                  <path
                    d={LOLLIPOP_PLACED_BAND_PATH}
                    fill={lollipopBandColor}
                    onClick={() => {
                      setLollipopBandColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('lollipop_band', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
                {/* 4. Placed Top Candy */}
                {isLollipopTopPlaced && (
                  <path
                    d={LOLLIPOP_PLACED_TOP_PATH}
                    fill={lollipopTopColor}
                    onClick={() => {
                      setLollipopTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('lollipop_top', soundEnabled);
                    }}
                    className="cursor-pointer hover:opacity-95 transition-colors duration-150"
                  />
                )}
              </svg>

              {/* Bold Thick Outline Image (transparent) */}
              <img
                src={lollipopOutlineImg}
                alt="Lollipop Outline"
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* RIGHT SIDE: LOLLIPOP CUTTING PIECES */}
            <div
              id="lollipop-cutting-container"
              className="relative flex-1 h-[70vh] max-h-[480px] min-h-[220px] aspect-[449/556] flex items-center justify-center"
            >
              {isLollipopTopPlaced &&
                isLollipopBandPlaced &&
                isLollipopBottomPlaced &&
                isLollipopStickPlaced && (
                  <div className="absolute top-0 right-2 z-40">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetLollipop}
                      className="px-3 py-1 rounded-full bg-black/60 text-yellow-300 border border-yellow-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      ↺ फिर से बनाएँ
                    </motion.button>
                  </div>
                )}

              <div className="relative w-full h-full">
                {/* 1. Top Candy Dome (Top-Left) */}
                {!isLollipopTopPlaced && (
                  <motion.div
                    id="cutting-lollipop-top"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleLollipopTopDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setLollipopTopColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('lollipop_top', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '14%',
                      top: '12%',
                      width: `${(173 / 449) * 100}%`,
                      height: `${(69 / 556) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={LOLLIPOP_TOP_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={LOLLIPOP_TOP_PATH}
                        fill={lollipopTopColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 2. Middle Band (Upper-Right) */}
                {!isLollipopBandPlaced && (
                  <motion.div
                    id="cutting-lollipop-band"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleLollipopBandDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setLollipopBandColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('lollipop_band', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '48%',
                      top: '29%',
                      width: `${(191 / 449) * 100}%`,
                      height: `${(45 / 556) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={LOLLIPOP_BAND_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={LOLLIPOP_BAND_PATH}
                        fill={lollipopBandColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 3. Bottom Candy Dome (Middle-Left) */}
                {!isLollipopBottomPlaced && (
                  <motion.div
                    id="cutting-lollipop-bottom"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleLollipopBottomDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setLollipopBottomColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('lollipop_bottom', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '16%',
                      top: '48%',
                      width: `${(173 / 449) * 100}%`,
                      height: `${(63 / 556) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={LOLLIPOP_BOTTOM_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      <path
                        d={LOLLIPOP_BOTTOM_PATH}
                        fill={lollipopBottomColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* 4. Stick (Right-Vertical, with wider transparent touch target) */}
                {!isLollipopStickPlaced && (
                  <motion.div
                    id="cutting-lollipop-stick"
                    drag
                    dragSnapToOrigin={true}
                    dragElastic={0.15}
                    onDragEnd={handleLollipopStickDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setLollipopStickColor(selectedColor.hex);
                      sounds.speakDrawingPieceColored('lollipop_stick', soundEnabled);
                    }}
                    className="absolute cursor-grab active:cursor-grabbing touch-none select-none z-30"
                    style={{
                      left: '72%',
                      top: '44%',
                      width: `${(19 / 449) * 100}%`,
                      height: `${(242 / 556) * 100}%`,
                    }}
                    title="रंग भरें या खींचकर आउटलाइन में लगाएं!"
                  >
                    <svg
                      viewBox={LOLLIPOP_STICK_VIEWBOX}
                      className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
                    >
                      {/* Invisible generous touch hit area */}
                      <rect x="-14" y="-8" width="47" height="258" fill="transparent" />
                      <path
                        d={LOLLIPOP_STICK_PATH}
                        fill={lollipopStickColor}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Success Banner when all 4 pieces are placed */}
                {isLollipopTopPlaced &&
                  isLollipopBandPlaced &&
                  isLollipopBottomPlaced &&
                  isLollipopStickPlaced && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                    >
                      <div className="text-white text-sm sm:text-base md:text-lg font-black bg-black/60 px-5 py-2.5 rounded-full border-2 border-yellow-400 shadow-xl text-center">
                        ⭐ लॉलीपॉप सही जगह लग गई! शाबाश! ⭐
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
          </>
        ) : currentStage === 'DUCK' ? (
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
