import { FillBlankLevel } from '../types';

export const HINDI_FILL_BLANK_LEVELS: FillBlankLevel[] = [
  // लेवल 1: स्वर खाली स्थान (अ - अः)
  {
    levelNumber: 1,
    rows: [
      {
        id: 'h-row-1',
        slots: [
          { id: 'h-s1-1', targetLetter: 'अ', filledLetter: 'अ', isPreFilled: true },
          { id: 'h-s1-2', targetLetter: 'आ', filledLetter: null, isPreFilled: false },
          { id: 'h-s1-3', targetLetter: 'इ', filledLetter: 'इ', isPreFilled: true },
          { id: 'h-s1-4', targetLetter: 'ई', filledLetter: null, isPreFilled: false },
        ],
      },
      {
        id: 'h-row-2',
        slots: [
          { id: 'h-s2-1', targetLetter: 'उ', filledLetter: 'उ', isPreFilled: true },
          { id: 'h-s2-2', targetLetter: 'ऊ', filledLetter: null, isPreFilled: false },
          { id: 'h-s2-3', targetLetter: 'ऋ', filledLetter: 'ऋ', isPreFilled: true },
          { id: 'h-s2-4', targetLetter: 'ए', filledLetter: null, isPreFilled: false },
        ],
      },
      {
        id: 'h-row-3',
        slots: [
          { id: 'h-s3-1', targetLetter: 'ऐ', filledLetter: 'ऐ', isPreFilled: true },
          { id: 'h-s3-2', targetLetter: 'ओ', filledLetter: null, isPreFilled: false },
          { id: 'h-s3-3', targetLetter: 'औ', filledLetter: 'औ', isPreFilled: true },
          { id: 'h-s3-4', targetLetter: 'अं', filledLetter: null, isPreFilled: false },
        ],
      },
    ],
    leftOptions: ['आ', 'ई', 'ऊ'],
    rightOptions: ['ए', 'ओ', 'अं'],
  },

  // लेवल 2: क-वर्ग व च-वर्ग खाली स्थान
  {
    levelNumber: 2,
    rows: [
      {
        id: 'h-row-1',
        slots: [
          { id: 'h-s1-1', targetLetter: 'क', filledLetter: 'क', isPreFilled: true },
          { id: 'h-s1-2', targetLetter: 'ख', filledLetter: null, isPreFilled: false },
          { id: 'h-s1-3', targetLetter: 'ग', filledLetter: 'ग', isPreFilled: true },
          { id: 'h-s1-4', targetLetter: 'घ', filledLetter: null, isPreFilled: false },
          { id: 'h-s1-5', targetLetter: 'ङ', filledLetter: 'ङ', isPreFilled: true },
        ],
      },
      {
        id: 'h-row-2',
        slots: [
          { id: 'h-s2-1', targetLetter: 'च', filledLetter: 'च', isPreFilled: true },
          { id: 'h-s2-2', targetLetter: 'छ', filledLetter: null, isPreFilled: false },
          { id: 'h-s2-3', targetLetter: 'ज', filledLetter: 'ज', isPreFilled: true },
          { id: 'h-s2-4', targetLetter: 'झ', filledLetter: null, isPreFilled: false },
          { id: 'h-s2-5', targetLetter: 'ञ', filledLetter: 'ञ', isPreFilled: true },
        ],
      },
    ],
    leftOptions: ['ख', 'छ'],
    rightOptions: ['घ', 'झ'],
  },

  // लेवल 3: ट-वर्ग व त-वर्ग खाली स्थान
  {
    levelNumber: 3,
    rows: [
      {
        id: 'h-row-1',
        slots: [
          { id: 'h-s1-1', targetLetter: 'ट', filledLetter: 'ट', isPreFilled: true },
          { id: 'h-s1-2', targetLetter: 'ठ', filledLetter: null, isPreFilled: false },
          { id: 'h-s1-3', targetLetter: 'ड', filledLetter: 'ड', isPreFilled: true },
          { id: 'h-s1-4', targetLetter: 'ढ', filledLetter: null, isPreFilled: false },
          { id: 'h-s1-5', targetLetter: 'ण', filledLetter: 'ण', isPreFilled: true },
        ],
      },
      {
        id: 'h-row-2',
        slots: [
          { id: 'h-s2-1', targetLetter: 'त', filledLetter: 'त', isPreFilled: true },
          { id: 'h-s2-2', targetLetter: 'थ', filledLetter: null, isPreFilled: false },
          { id: 'h-s2-3', targetLetter: 'द', filledLetter: 'द', isPreFilled: true },
          { id: 'h-s2-4', targetLetter: 'ध', filledLetter: null, isPreFilled: false },
          { id: 'h-s2-5', targetLetter: 'न', filledLetter: 'न', isPreFilled: true },
        ],
      },
    ],
    leftOptions: ['ठ', 'थ'],
    rightOptions: ['ढ', 'ध'],
  },

  // लेवल 4: प-वर्ग व य-वर्ग खाली स्थान
  {
    levelNumber: 4,
    rows: [
      {
        id: 'h-row-1',
        slots: [
          { id: 'h-s1-1', targetLetter: 'प', filledLetter: 'प', isPreFilled: true },
          { id: 'h-s1-2', targetLetter: 'फ', filledLetter: null, isPreFilled: false },
          { id: 'h-s1-3', targetLetter: 'ब', filledLetter: 'ब', isPreFilled: true },
          { id: 'h-s1-4', targetLetter: 'भ', filledLetter: null, isPreFilled: false },
          { id: 'h-s1-5', targetLetter: 'म', filledLetter: 'म', isPreFilled: true },
        ],
      },
      {
        id: 'h-row-2',
        slots: [
          { id: 'h-s2-1', targetLetter: 'य', filledLetter: 'य', isPreFilled: true },
          { id: 'h-s2-2', targetLetter: 'र', filledLetter: null, isPreFilled: false },
          { id: 'h-s2-3', targetLetter: 'ल', filledLetter: 'ल', isPreFilled: true },
          { id: 'h-s2-4', targetLetter: 'व', filledLetter: null, isPreFilled: false },
        ],
      },
    ],
    leftOptions: ['फ', 'र'],
    rightOptions: ['भ', 'व'],
  },

  // लेवल 5: श से ज्ञ खाली स्थान
  {
    levelNumber: 5,
    rows: [
      {
        id: 'h-row-1',
        slots: [
          { id: 'h-s1-1', targetLetter: 'श', filledLetter: 'श', isPreFilled: true },
          { id: 'h-s1-2', targetLetter: 'ष', filledLetter: null, isPreFilled: false },
          { id: 'h-s1-3', targetLetter: 'स', filledLetter: 'स', isPreFilled: true },
          { id: 'h-s1-4', targetLetter: 'ह', filledLetter: null, isPreFilled: false },
        ],
      },
      {
        id: 'h-row-2',
        slots: [
          { id: 'h-s2-1', targetLetter: 'क्ष', filledLetter: null, isPreFilled: false },
          { id: 'h-s2-2', targetLetter: 'त्र', filledLetter: 'त्र', isPreFilled: true },
          { id: 'h-s2-3', targetLetter: 'ज्ञ', filledLetter: null, isPreFilled: false },
        ],
      },
    ],
    leftOptions: ['ष', 'क्ष'],
    rightOptions: ['ह', 'ज्ञ'],
  },
];
