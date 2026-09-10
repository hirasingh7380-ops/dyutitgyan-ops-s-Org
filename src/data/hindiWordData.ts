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

// 9 progressive levels covering Swar (अ - अः) and Vyanjan (क - ज्ञ)
export const HINDI_MATCH_LEVELS: HindiMatchLevel[] = [
  {
    id: 'LEVEL_1',
    title: 'लेवल 1: स्वर (अ - उ)',
    subtitle: 'अ से उ तक अक्षर मिलाओ',
    items: [
      { id: 'अ', letter: 'अ', wordName: 'अनार', englishName: 'Pomegranate', svgType: 'anar' },
      { id: 'आ', letter: 'आ', wordName: 'आम', englishName: 'Mango', svgType: 'aam' },
      { id: 'इ', letter: 'इ', wordName: 'इमली', englishName: 'Tamarind', svgType: 'imli' },
      { id: 'ई', letter: 'ई', wordName: 'ईख', englishName: 'Sugarcane', svgType: 'eekh' },
      { id: 'उ', letter: 'उ', wordName: 'उल्लू', englishName: 'Owl', svgType: 'ullu' },
    ],
    defaultBottomOrder: ['इ', 'उ', 'अ', 'ई', 'आ'],
  },
  {
    id: 'LEVEL_2',
    title: 'लेवल 2: स्वर (ऊ - ओ)',
    subtitle: 'ऊ से ओ तक अक्षर मिलाओ',
    items: [
      { id: 'ऊ', letter: 'ऊ', wordName: 'ऊन', englishName: 'Wool', svgType: 'oon' },
      { id: 'ऋ', letter: 'ऋ', wordName: 'ऋषि', englishName: 'Sage', svgType: 'rishi' },
      { id: 'ए', letter: 'ए', wordName: 'एड़ी', englishName: 'Heel', svgType: 'edi' },
      { id: 'ऐ', letter: 'ऐ', wordName: 'ऐनक', englishName: 'Spectacles', svgType: 'ainak' },
      { id: 'ओ', letter: 'ओ', wordName: 'ओखली', englishName: 'Mortar', svgType: 'okhli' },
    ],
    defaultBottomOrder: ['ऋ', 'ओ', 'ऊ', 'ऐ', 'ए'],
  },
  {
    id: 'LEVEL_3',
    title: 'लेवल 3: स्वर व क-वर्ग (औ - ग)',
    subtitle: 'औ से ग तक अक्षर मिलाओ',
    items: [
      { id: 'औ', letter: 'औ', wordName: 'औरत', englishName: 'Woman', svgType: 'aurat' },
      { id: 'अं', letter: 'अं', wordName: 'अंगूर', englishName: 'Grapes', svgType: 'angoor' },
      { id: 'क', letter: 'क', wordName: 'कबूतर', englishName: 'Pigeon', svgType: 'kabootar' },
      { id: 'ख', letter: 'ख', wordName: 'खरगोश', englishName: 'Rabbit', svgType: 'khargosh' },
      { id: 'ग', letter: 'ग', wordName: 'गमला', englishName: 'Flowerpot', svgType: 'gamla' },
    ],
    defaultBottomOrder: ['क', 'अं', 'ग', 'औ', 'ख'],
  },
  {
    id: 'LEVEL_4',
    title: 'लेवल 4: क व च-वर्ग (घ - झ)',
    subtitle: 'घ से झ तक अक्षर मिलाओ',
    items: [
      { id: 'घ', letter: 'घ', wordName: 'घड़ी', englishName: 'Watch', svgType: 'ghadi' },
      { id: 'च', letter: 'च', wordName: 'चम्मच', englishName: 'Spoon', svgType: 'chammach' },
      { id: 'छ', letter: 'छ', wordName: 'छतरी', englishName: 'Umbrella', svgType: 'chhatri' },
      { id: 'ज', letter: 'ज', wordName: 'जहाज', englishName: 'Ship', svgType: 'jahaz' },
      { id: 'झ', letter: 'झ', wordName: 'झंडा', englishName: 'Flag', svgType: 'jhanda' },
    ],
    defaultBottomOrder: ['छ', 'ज', 'घ', 'झ', 'च'],
  },
  {
    id: 'LEVEL_5',
    title: 'लेवल 5: ट व त-वर्ग (ट - त)',
    subtitle: 'ट से त तक अक्षर मिलाओ',
    items: [
      { id: 'ट', letter: 'ट', wordName: 'टमाटर', englishName: 'Tomato', svgType: 'tamatar' },
      { id: 'ठ', letter: 'ठ', wordName: 'ठठेरा', englishName: 'Utensil Maker', svgType: 'thatthera' },
      { id: 'ड', letter: 'ड', wordName: 'डमरू', englishName: 'Pellet Drum', svgType: 'damru' },
      { id: 'ढ', letter: 'ढ', wordName: 'ढक्कन', englishName: 'Lid', svgType: 'dhakkan' },
      { id: 'त', letter: 'त', wordName: 'तरबूज', englishName: 'Watermelon', svgType: 'tarbooj' },
    ],
    defaultBottomOrder: ['ड', 'त', 'ठ', 'ट', 'ढ'],
  },
  {
    id: 'LEVEL_6',
    title: 'लेवल 6: त व प-वर्ग (थ - प)',
    subtitle: 'थ से प तक अक्षर मिलाओ',
    items: [
      { id: 'थ', letter: 'थ', wordName: 'थर्मस', englishName: 'Thermos', svgType: 'thermas' },
      { id: 'द', letter: 'द', wordName: 'दवात', englishName: 'Inkpot', svgType: 'dawat' },
      { id: 'ध', letter: 'ध', wordName: 'धनुष', englishName: 'Bow', svgType: 'dhanush' },
      { id: 'न', letter: 'न', wordName: 'नल', englishName: 'Water Tap', svgType: 'nal' },
      { id: 'प', letter: 'प', wordName: 'पतंग', englishName: 'Kite', svgType: 'patang' },
    ],
    defaultBottomOrder: ['ध', 'प', 'थ', 'न', 'द'],
  },
  {
    id: 'LEVEL_7',
    title: 'लेवल 7: प व य-वर्ग (फ - य)',
    subtitle: 'फ से य तक अक्षर मिलाओ',
    items: [
      { id: 'फ', letter: 'फ', wordName: 'फल', englishName: 'Fruits', svgType: 'phal' },
      { id: 'ब', letter: 'ब', wordName: 'बत्तख', englishName: 'Duck', svgType: 'battakh' },
      { id: 'भ', letter: 'भ', wordName: 'भालू', englishName: 'Bear', svgType: 'bhalu' },
      { id: 'म', letter: 'म', wordName: 'मछली', englishName: 'Fish', svgType: 'machhli' },
      { id: 'य', letter: 'य', wordName: 'यज्ञ', englishName: 'Sacred Fire', svgType: 'yagya' },
    ],
    defaultBottomOrder: ['म', 'य', 'ब', 'फ', 'भ'],
  },
  {
    id: 'LEVEL_8',
    title: 'लेवल 8: अंतःस्थ व ऊष्म (र - ह)',
    subtitle: 'र से ह तक अक्षर मिलाओ',
    items: [
      { id: 'र', letter: 'र', wordName: 'रथ', englishName: 'Chariot', svgType: 'rath' },
      { id: 'ल', letter: 'ल', wordName: 'लट्टू', englishName: 'Spinning Top', svgType: 'lattoo' },
      { id: 'व', letter: 'व', wordName: 'वक', englishName: 'Crane', svgType: 'vak' },
      { id: 'स', letter: 'स', wordName: 'सेब', englishName: 'Apple', svgType: 'seb' },
      { id: 'ह', letter: 'ह', wordName: 'हाथी', englishName: 'Elephant', svgType: 'haathi' },
    ],
    defaultBottomOrder: ['ह', 'र', 'स', 'ल', 'व'],
  },
  {
    id: 'LEVEL_9',
    title: 'लेवल 9: संयुक्त व्यंजन (क्ष - ज्ञ)',
    subtitle: 'क्ष, त्र, ज्ञ अक्षर मिलाओ',
    items: [
      { id: 'श', letter: 'श', wordName: 'शलजम', englishName: 'Turnip', svgType: 'shaljam' },
      { id: 'क्ष', letter: 'क्ष', wordName: 'क्षत्रिय', englishName: 'Warrior', svgType: 'kshatriya' },
      { id: 'त्र', letter: 'त्र', wordName: 'त्रिशूल', englishName: 'Trident', svgType: 'trishul' },
      { id: 'ज्ञ', letter: 'ज्ञ', wordName: 'ज्ञानी', englishName: 'Scholar', svgType: 'gyani' },
    ],
    defaultBottomOrder: ['त्र', 'ज्ञ', 'श', 'क्ष'],
  },
];
