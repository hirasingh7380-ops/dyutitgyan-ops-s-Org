import { FillBlankLevel } from '../types';

export const FILL_BLANK_LEVELS: FillBlankLevel[] = [
  {
    levelNumber: 1,
    leftOptions: ['A', 'B', 'C', 'D'],
    rightOptions: ['E', 'B', 'E', 'D'],
    rows: [
      {
        id: 'l1-r1',
        slots: [
          { id: 'l1-r1-s1', targetLetter: 'A', filledLetter: 'A', isPreFilled: true },
          { id: 'l1-r1-s2', targetLetter: 'B', filledLetter: null, isPreFilled: false },
          { id: 'l1-r1-s3', targetLetter: 'C', filledLetter: 'C', isPreFilled: true },
          { id: 'l1-r1-s4', targetLetter: 'D', filledLetter: null, isPreFilled: false },
          { id: 'l1-r1-s5', targetLetter: 'E', filledLetter: 'E', isPreFilled: true },
        ],
      },
      {
        id: 'l1-r2',
        slots: [
          { id: 'l1-r2-s1', targetLetter: 'A', filledLetter: null, isPreFilled: false },
          { id: 'l1-r2-s2', targetLetter: 'B', filledLetter: 'B', isPreFilled: true },
          { id: 'l1-r2-s3', targetLetter: 'C', filledLetter: null, isPreFilled: false },
          { id: 'l1-r2-s4', targetLetter: 'D', filledLetter: 'D', isPreFilled: true },
          { id: 'l1-r2-s5', targetLetter: 'E', filledLetter: null, isPreFilled: false },
        ],
      },
      {
        id: 'l1-r3',
        slots: [
          { id: 'l1-r3-s1', targetLetter: 'A', filledLetter: 'A', isPreFilled: true },
          { id: 'l1-r3-s2', targetLetter: 'B', filledLetter: null, isPreFilled: false },
          { id: 'l1-r3-s3', targetLetter: 'C', filledLetter: 'C', isPreFilled: true },
          { id: 'l1-r3-s4', targetLetter: 'D', filledLetter: null, isPreFilled: false },
          { id: 'l1-r3-s5', targetLetter: 'E', filledLetter: null, isPreFilled: false },
        ],
      },
    ],
  },
  {
    levelNumber: 2,
    leftOptions: ['F', 'G', 'H', 'I'],
    rightOptions: ['J', 'G', 'I', 'J'],
    rows: [
      {
        id: 'l2-r1',
        slots: [
          { id: 'l2-r1-s1', targetLetter: 'F', filledLetter: 'F', isPreFilled: true },
          { id: 'l2-r1-s2', targetLetter: 'G', filledLetter: null, isPreFilled: false },
          { id: 'l2-r1-s3', targetLetter: 'H', filledLetter: 'H', isPreFilled: true },
          { id: 'l2-r1-s4', targetLetter: 'I', filledLetter: null, isPreFilled: false },
          { id: 'l2-r1-s5', targetLetter: 'J', filledLetter: 'J', isPreFilled: true },
        ],
      },
      {
        id: 'l2-r2',
        slots: [
          { id: 'l2-r2-s1', targetLetter: 'F', filledLetter: null, isPreFilled: false },
          { id: 'l2-r2-s2', targetLetter: 'G', filledLetter: 'G', isPreFilled: true },
          { id: 'l2-r2-s3', targetLetter: 'H', filledLetter: null, isPreFilled: false },
          { id: 'l2-r2-s4', targetLetter: 'I', filledLetter: 'I', isPreFilled: true },
          { id: 'l2-r2-s5', targetLetter: 'J', filledLetter: null, isPreFilled: false },
        ],
      },
      {
        id: 'l2-r3',
        slots: [
          { id: 'l2-r3-s1', targetLetter: 'F', filledLetter: 'F', isPreFilled: true },
          { id: 'l2-r3-s2', targetLetter: 'G', filledLetter: null, isPreFilled: false },
          { id: 'l2-r3-s3', targetLetter: 'H', filledLetter: 'H', isPreFilled: true },
          { id: 'l2-r3-s4', targetLetter: 'I', filledLetter: null, isPreFilled: false },
          { id: 'l2-r3-s5', targetLetter: 'J', filledLetter: null, isPreFilled: false },
        ],
      },
    ],
  },
  {
    levelNumber: 3,
    leftOptions: ['P', 'Q', 'R', 'S'],
    rightOptions: ['T', 'Q', 'S', 'T'],
    rows: [
      {
        id: 'l3-r1',
        slots: [
          { id: 'l3-r1-s1', targetLetter: 'P', filledLetter: 'P', isPreFilled: true },
          { id: 'l3-r1-s2', targetLetter: 'Q', filledLetter: null, isPreFilled: false },
          { id: 'l3-r1-s3', targetLetter: 'R', filledLetter: 'R', isPreFilled: true },
          { id: 'l3-r1-s4', targetLetter: 'S', filledLetter: null, isPreFilled: false },
          { id: 'l3-r1-s5', targetLetter: 'T', filledLetter: 'T', isPreFilled: true },
        ],
      },
      {
        id: 'l3-r2',
        slots: [
          { id: 'l3-r2-s1', targetLetter: 'P', filledLetter: null, isPreFilled: false },
          { id: 'l3-r2-s2', targetLetter: 'Q', filledLetter: 'Q', isPreFilled: true },
          { id: 'l3-r2-s3', targetLetter: 'R', filledLetter: null, isPreFilled: false },
          { id: 'l3-r2-s4', targetLetter: 'S', filledLetter: 'S', isPreFilled: true },
          { id: 'l3-r2-s5', targetLetter: 'T', filledLetter: null, isPreFilled: false },
        ],
      },
      {
        id: 'l3-r3',
        slots: [
          { id: 'l3-r3-s1', targetLetter: 'P', filledLetter: 'P', isPreFilled: true },
          { id: 'l3-r3-s2', targetLetter: 'Q', filledLetter: null, isPreFilled: false },
          { id: 'l3-r3-s3', targetLetter: 'R', filledLetter: 'R', isPreFilled: true },
          { id: 'l3-r3-s4', targetLetter: 'S', filledLetter: null, isPreFilled: false },
          { id: 'l3-r3-s5', targetLetter: 'T', filledLetter: null, isPreFilled: false },
        ],
      },
    ],
  },
];
