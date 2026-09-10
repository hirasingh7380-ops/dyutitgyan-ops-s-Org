export interface HindiMatchItem {
  id: string;
  letter: string;
  wordName: string;
  englishName: string;
  svgType: string;
}

export interface HindiMatchLevel {
  id: string;
  title: string;
  subtitle: string;
  items: HindiMatchItem[];
  defaultBottomOrder: string[];
}

export const HINDI_SWAR = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'
];

export const HINDI_VYANJAN = [
  'क', 'ख', 'ग', 'घ', 'ङ',
  'च', 'छ', 'ज', 'झ', 'ञ',
  'ट', 'ठ', 'ड', 'ढ', 'ण',
  'त', 'थ', 'द', 'ध', 'न',
  'प', 'फ', 'ब', 'भ', 'म',
  'य', 'र', 'ल', 'व',
  'श', 'ष', 'स', 'ह',
  'क्ष', 'त्र', 'ज्ञ'
];

export const HINDI_ALL_LETTERS = [...HINDI_SWAR, ...HINDI_VYANJAN];

// 10 progressive levels: Swar (अ - अः) has 4-4 words per level, and Vyanjan (क से) has 5-5 words per level
export const HINDI_MATCH_LEVELS: HindiMatchLevel[] = [
  {
    id: 'LEVEL_1',
    title: 'लेवल 1: स्वर (अ - ई)',
    subtitle: 'अ से ई तक 4 अक्षर मिलाओ',
    items: [
      { id: 'अ', letter: 'अ', wordName: 'अनार', englishName: 'Pomegranate', svgType: 'anar' },
      { id: 'आ', letter: 'आ', wordName: 'आम', englishName: 'Mango', svgType: 'aam' },
      { id: 'इ', letter: 'इ', wordName: 'इमली', englishName: 'Tamarind', svgType: 'imli' },
      { id: 'ई', letter: 'ई', wordName: 'ईख', englishName: 'Sugarcane', svgType: 'eekh' },
    ],
    defaultBottomOrder: ['इ', 'अ', 'ई', 'आ'],
  },
  {
    id: 'LEVEL_2',
    title: 'लेवल 2: स्वर (उ - ए)',
    subtitle: 'उ से ए तक 4 अक्षर मिलाओ',
    items: [
      { id: 'उ', letter: 'उ', wordName: 'उल्लू', englishName: 'Owl', svgType: 'ullu' },
      { id: 'ऊ', letter: 'ऊ', wordName: 'ऊन', englishName: 'Wool', svgType: 'oon' },
      { id: 'ऋ', letter: 'ऋ', wordName: 'ऋषि मुनि', englishName: 'Sage', svgType: 'rishi' },
      { id: 'ए', letter: 'ए', wordName: 'एड़ी', englishName: 'Heel', svgType: 'edi' },
    ],
    defaultBottomOrder: ['ऋ', 'उ', 'ए', 'ऊ'],
  },
  {
    id: 'LEVEL_3',
    title: 'लेवल 3: स्वर (ऐ - अं)',
    subtitle: 'ऐ से अं तक 4 अक्षर मिलाओ',
    items: [
      { id: 'ऐ', letter: 'ऐ', wordName: 'ऐनक', englishName: 'Spectacles', svgType: 'ainak' },
      { id: 'ओ', letter: 'ओ', wordName: 'ओखली', englishName: 'Mortar', svgType: 'okhli' },
      { id: 'औ', letter: 'औ', wordName: 'औरत (माँ)', englishName: 'Mother', svgType: 'aurat' },
      { id: 'अं', letter: 'अं', wordName: 'अंगूर', englishName: 'Grapes', svgType: 'angoor' },
    ],
    defaultBottomOrder: ['ओ', 'अं', 'ऐ', 'औ'],
  },
  {
    id: 'LEVEL_4',
    title: 'लेवल 4: क व च-वर्ग (क - च)',
    subtitle: 'क से च तक 5 अक्षर मिलाओ',
    items: [
      { id: 'क', letter: 'क', wordName: 'कबूतर', englishName: 'Pigeon', svgType: 'kabootar' },
      { id: 'ख', letter: 'ख', wordName: 'खरगोश', englishName: 'Rabbit', svgType: 'khargosh' },
      { id: 'ग', letter: 'ग', wordName: 'गमला', englishName: 'Flowerpot', svgType: 'gamla' },
      { id: 'घ', letter: 'घ', wordName: 'घड़ी', englishName: 'Watch', svgType: 'ghadi' },
      { id: 'च', letter: 'च', wordName: 'चम्मच', englishName: 'Spoon', svgType: 'chammach' },
    ],
    defaultBottomOrder: ['ग', 'क', 'च', 'ख', 'घ'],
  },
  {
    id: 'LEVEL_5',
    title: 'लेवल 5: च व ट-वर्ग (छ - ठ)',
    subtitle: 'छ से ठ तक 5 अक्षर मिलाओ',
    items: [
      { id: 'छ', letter: 'छ', wordName: 'छतरी', englishName: 'Umbrella', svgType: 'chhatri' },
      { id: 'ज', letter: 'ज', wordName: 'जहाज', englishName: 'Ship', svgType: 'jahaz' },
      { id: 'झ', letter: 'झ', wordName: 'झंडा', englishName: 'Flag', svgType: 'jhanda' },
      { id: 'ट', letter: 'ट', wordName: 'टमाटर', englishName: 'Tomato', svgType: 'tamatar' },
      { id: 'ठ', letter: 'ठ', wordName: 'ठठेरा', englishName: 'Utensil Maker', svgType: 'thatthera' },
    ],
    defaultBottomOrder: ['झ', 'छ', 'ठ', 'ज', 'ट'],
  },
  {
    id: 'LEVEL_6',
    title: 'लेवल 6: ट व त-वर्ग (ड - द)',
    subtitle: 'ड से द तक 5 अक्षर मिलाओ',
    items: [
      { id: 'ड', letter: 'ड', wordName: 'डमरू', englishName: 'Pellet Drum', svgType: 'damru' },
      { id: 'ढ', letter: 'ढ', wordName: 'ढक्कन', englishName: 'Lid', svgType: 'dhakkan' },
      { id: 'त', letter: 'त', wordName: 'तरबूज', englishName: 'Watermelon', svgType: 'tarbooj' },
      { id: 'थ', letter: 'थ', wordName: 'थर्मस', englishName: 'Thermos', svgType: 'thermas' },
      { id: 'द', letter: 'द', wordName: 'दवात', englishName: 'Inkpot', svgType: 'dawat' },
    ],
    defaultBottomOrder: ['त', 'द', 'ड', 'थ', 'ढ'],
  },
  {
    id: 'LEVEL_7',
    title: 'लेवल 7: त व प-वर्ग (ध - ब)',
    subtitle: 'ध से ब तक 5 अक्षर मिलाओ',
    items: [
      { id: 'ध', letter: 'ध', wordName: 'धनुष', englishName: 'Bow', svgType: 'dhanush' },
      { id: 'न', letter: 'न', wordName: 'नल', englishName: 'Water Tap', svgType: 'nal' },
      { id: 'प', letter: 'प', wordName: 'पतंग', englishName: 'Kite', svgType: 'patang' },
      { id: 'फ', letter: 'फ', wordName: 'फल', englishName: 'Fruits', svgType: 'phal' },
      { id: 'ब', letter: 'ब', wordName: 'बत्तख', englishName: 'Duck', svgType: 'battakh' },
    ],
    defaultBottomOrder: ['प', 'ध', 'ब', 'न', 'फ'],
  },
  {
    id: 'LEVEL_8',
    title: 'लेवल 8: प व य-वर्ग (भ - ल)',
    subtitle: 'भ से ल तक 5 अक्षर मिलाओ',
    items: [
      { id: 'भ', letter: 'भ', wordName: 'भालू', englishName: 'Bear', svgType: 'bhalu' },
      { id: 'म', letter: 'म', wordName: 'मछली', englishName: 'Fish', svgType: 'machhli' },
      { id: 'य', letter: 'य', wordName: 'यज्ञ', englishName: 'Sacred Fire', svgType: 'yagya' },
      { id: 'र', letter: 'र', wordName: 'रथ', englishName: 'Chariot', svgType: 'rath' },
      { id: 'ल', letter: 'ल', wordName: 'लट्टू', englishName: 'Spinning Top', svgType: 'lattoo' },
    ],
    defaultBottomOrder: ['म', 'र', 'भ', 'ल', 'य'],
  },
  {
    id: 'LEVEL_9',
    title: 'लेवल 9: अंतःस्थ व ऊष्म (व - ह)',
    subtitle: 'व से ह तक 5 अक्षर मिलाओ',
    items: [
      { id: 'व', letter: 'व', wordName: 'वक', englishName: 'Crane', svgType: 'vak' },
      { id: 'श', letter: 'श', wordName: 'शलजम', englishName: 'Turnip', svgType: 'shaljam' },
      { id: 'ष', letter: 'ष', wordName: 'षट्कोण', englishName: 'Hexagon', svgType: 'shatkon' },
      { id: 'स', letter: 'स', wordName: 'सेब', englishName: 'Apple', svgType: 'seb' },
      { id: 'ह', letter: 'ह', wordName: 'हाथी', englishName: 'Elephant', svgType: 'haathi' },
    ],
    defaultBottomOrder: ['श', 'ह', 'व', 'ष', 'स'],
  },
  {
    id: 'LEVEL_10',
    title: 'लेवल 10: संयुक्त व्यंजन (क्ष - ज्ञ)',
    subtitle: 'क्ष, त्र, ज्ञ अक्षर मिलाओ',
    items: [
      { id: 'क्ष', letter: 'क्ष', wordName: 'क्षत्रिय', englishName: 'Warrior', svgType: 'kshatriya' },
      { id: 'त्र', letter: 'त्र', wordName: 'त्रिशूल', englishName: 'Trident', svgType: 'trishul' },
      { id: 'ज्ञ', letter: 'ज्ञ', wordName: 'ज्ञानी', englishName: 'Scholar', svgType: 'gyani' },
    ],
    defaultBottomOrder: ['त्र', 'ज्ञ', 'क्ष'],
  },
];
