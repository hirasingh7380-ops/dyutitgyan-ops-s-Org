import { SuffixGroup, LetterTile } from '../types';

export const HINDI_SUFFIX_GROUPS: SuffixGroup[] = [
  {
    id: 'ल',
    text: 'ल',
    prefixes: ['न', 'ह', 'क', 'च'],
    validWords: ['नल', 'हल', 'कल', 'चल'],
    color: 'from-red-600 to-red-700',
    borderColor: 'border-white',
    bgGradient: 'bg-gradient-to-br from-red-600 to-red-700',
  },
  {
    id: 'ग',
    text: 'ग',
    prefixes: ['ठ', 'ज', 'ख', 'प'],
    validWords: ['ठग', 'जग', 'खग', 'पग'],
    color: 'from-red-600 to-red-700',
    borderColor: 'border-white',
    bgGradient: 'bg-gradient-to-br from-red-600 to-red-700',
  },
  {
    id: 'न',
    text: 'न',
    prefixes: ['ध', 'म', 'ज', 'त'],
    validWords: ['धन', 'मन', 'जन', 'तन'],
    color: 'from-red-600 to-red-700',
    borderColor: 'border-white',
    bgGradient: 'bg-gradient-to-br from-red-600 to-red-700',
  },
  {
    id: 'ट',
    text: 'ट',
    prefixes: ['न', 'ख', 'त', 'व'],
    validWords: ['नट', 'खट', 'तट', 'वट'],
    color: 'from-red-600 to-red-700',
    borderColor: 'border-white',
    bgGradient: 'bg-gradient-to-br from-red-600 to-red-700',
  },
];

// Exact 4x4 grid matrix matching the Hindi Word Builder layout:
// Row 1: न (ल), ठ (ग), ध (न), न (ट)
// Row 2: ह (ल), ज (ग), म (न), ख (ट)
// Row 3: क (ल), ख (ग), ज (न), त (ट)
// Row 4: च (ल), प (ग), त (न), व (ट)
export const HINDI_GRID_TILES: { letter: string; groupId: string }[][] = [
  [
    { letter: 'न', groupId: 'ल' },
    { letter: 'ठ', groupId: 'ग' },
    { letter: 'ध', groupId: 'न' },
    { letter: 'न', groupId: 'ट' },
  ],
  [
    { letter: 'ह', groupId: 'ल' },
    { letter: 'ज', groupId: 'ग' },
    { letter: 'म', groupId: 'न' },
    { letter: 'ख', groupId: 'ट' },
  ],
  [
    { letter: 'क', groupId: 'ल' },
    { letter: 'ख', groupId: 'ग' },
    { letter: 'ज', groupId: 'न' },
    { letter: 'त', groupId: 'ट' },
  ],
  [
    { letter: 'च', groupId: 'ल' },
    { letter: 'प', groupId: 'ग' },
    { letter: 'त', groupId: 'न' },
    { letter: 'व', groupId: 'ट' },
  ],
];

export const HINDI_INITIAL_TILES: LetterTile[] = HINDI_GRID_TILES.flat().map((item) => ({
  id: `${item.groupId}-${item.letter}`,
  letter: item.letter,
  groupId: item.groupId,
  isCompleted: false,
}));

export interface HindiWordInfo {
  word: string;
  parts: [string, string];
  meaning: string;
  audioKey: string;
  speech: string;
}

export const HINDI_WORD_DETAILS: Record<string, HindiWordInfo> = {
  नल: {
    word: 'नल',
    parts: ['न', 'ल'],
    meaning: 'पानी का नल',
    audioKey: 'hindi_wb_nal',
    speech: 'न, ल, नल! नल से पानी आता है. शाबाश बच्चों!',
  },
  हल: {
    word: 'हल',
    parts: ['ह', 'ल'],
    meaning: 'खेत जोतने का हल',
    audioKey: 'hindi_wb_hal',
    speech: 'ह, ल, हल! किसान खेत में हल चलाता है. शाबाश बच्चों!',
  },
  कल: {
    word: 'कल',
    parts: ['क', 'ल'],
    meaning: 'आने वाला कल',
    audioKey: 'hindi_wb_kal',
    speech: 'क, ल, कल! शाबाश बच्चों!',
  },
  चल: {
    word: 'चल',
    parts: ['च', 'ल'],
    meaning: 'आगे चलना',
    audioKey: 'hindi_wb_chal',
    speech: 'च, ल, चल! चलो आगे बढ़ें. शाबाश बच्चों!',
  },
  ठग: {
    word: 'ठग',
    parts: ['ठ', 'ग'],
    meaning: 'धोखा देने वाला ठग',
    audioKey: 'hindi_wb_thag',
    speech: 'ठ, ग, ठग! शाबाश बच्चों!',
  },
  जग: {
    word: 'जग',
    parts: ['ज', 'ग'],
    meaning: 'पानी रखने का जग',
    audioKey: 'hindi_wb_jag',
    speech: 'ज, ग, जग! जग में पानी रखते हैं. शाबाश बच्चों!',
  },
  खग: {
    word: 'खग',
    parts: ['ख', 'ग'],
    meaning: 'चिड़िया / पक्षी',
    audioKey: 'hindi_wb_khag',
    speech: 'ख, ग, खग! खग मतलब चिड़िया. शाबाश बच्चों!',
  },
  पग: {
    word: 'पग',
    parts: ['प', 'ग'],
    meaning: 'कदम / पैर',
    audioKey: 'hindi_wb_pag',
    speech: 'प, ग, पग! पग मतलब कदम. शाबाश बच्चों!',
  },
  धन: {
    word: 'धन',
    parts: ['ध', 'न'],
    meaning: 'संपत्ति / दौलत',
    audioKey: 'hindi_wb_dhan',
    speech: 'ध, न, धन! शाबाश बच्चों!',
  },
  मन: {
    word: 'मन',
    parts: ['म', 'न'],
    meaning: 'दिल / मन',
    audioKey: 'hindi_wb_man',
    speech: 'म, न, मन! मन लगाकर पढ़ाई करो. शाबाश बच्चों!',
  },
  जन: {
    word: 'जन',
    parts: ['ज', 'न'],
    meaning: 'लोग / जनता',
    audioKey: 'hindi_wb_jan',
    speech: 'ज, न, जन! जन मतलब लोग. शाबाश बच्चों!',
  },
  तन: {
    word: 'तन',
    parts: ['त', 'न'],
    meaning: 'शरीर',
    audioKey: 'hindi_wb_tan',
    speech: 'त, न, तन! तन मतलब शरीर. शाबाश बच्चों!',
  },
  नट: {
    word: 'नट',
    parts: ['न', 'ट'],
    meaning: 'कलाबाज़ / नट',
    audioKey: 'hindi_wb_nat',
    speech: 'न, ट, नट! शाबाश बच्चों!',
  },
  खट: {
    word: 'खट',
    parts: ['ख', 'ट'],
    meaning: 'खट-खट की आवाज़',
    audioKey: 'hindi_wb_khat',
    speech: 'ख, ट, खट! शाबाश बच्चों!',
  },
  तट: {
    word: 'तट',
    parts: ['त', 'ट'],
    meaning: 'नदी का किनारा',
    audioKey: 'hindi_wb_tat',
    speech: 'त, ट, तट! तट मतलब नदी का किनारा. शाबाश बच्चों!',
  },
  वट: {
    word: 'वट',
    parts: ['व', 'ट'],
    meaning: 'बरगद का पेड़',
    audioKey: 'hindi_wb_vat',
    speech: 'व, ट, वट! वट मतलब बरगद का पेड़. शाबाश बच्चों!',
  },
};
