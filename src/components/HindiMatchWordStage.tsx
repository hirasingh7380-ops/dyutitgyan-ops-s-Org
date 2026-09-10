import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, ArrowLeft, Trophy, Play } from 'lucide-react';
import { sounds } from '../utils/audio';
import { HINDI_MATCH_LEVELS, HindiMatchItem, HindiMatchLevel } from '../data/hindiWordData';

import appleImg from '../assets/images/shiny_red_apple_1785687700388.jpg';
import mangoImg from '../assets/images/fresh_mango_3d_1785735420713.jpg';
import grapesImg from '../assets/images/purple_grapes_3d_1785735388218.jpg';
import umbrellaImg from '../assets/images/purple_umbrella_3d_1785735563346.jpg';
import kiteImg from '../assets/images/flying_kite_3d_1785735532364.jpg';
import fishImg from '../assets/images/cute_fish_3d_1785735375470.jpg';
import elephantImg from '../assets/images/cute_baby_elephant_1785687685978.jpg';
import watchImg from '../assets/images/wrist_watch_3d_1785735498414.jpg';
import orangeImg from '../assets/images/fresh_orange_3d_1785735432711.jpg';

import pomegranateImg from '../assets/images/realistic_pomegranate_1789054374654.jpg';
import tamarindImg from '../assets/images/realistic_tamarind_1789054397397.jpg';
import sugarcaneImg from '../assets/images/realistic_sugarcane_1789054411266.jpg';
import owlImg from '../assets/images/realistic_owl_1789054429817.jpg';
import pigeonImg from '../assets/images/realistic_pigeon_1789054446463.jpg';
import rabbitImg from '../assets/images/realistic_rabbit_1789054461510.jpg';
import tomatoImg from '../assets/images/realistic_tomato_1789054476656.jpg';

import rishiMuniImg from '../assets/images/rishi_muni_real_1789055215136.jpg';
import okhliImg from '../assets/images/okhli_real_1789055232844.jpg';
import ediImg from '../assets/images/edi_heel_real_1789055248369.jpg';
import auratMaaImg from '../assets/images/aurat_maa_real_1789055263893.jpg';
import shatkonImg from '../assets/images/shatkon_hexagon_1789055297870.jpg';

interface HindiMatchWordStageProps {
  soundEnabled: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

// 100% Realistic image illustrations for all Hindi objects
const HindiIllustration: React.FC<{ type: string; wordName: string }> = ({ type, wordName }) => {
  const photoMap: Record<string, string> = {
    // स्वर (Swar) - Realistic Photos
    anar: pomegranateImg,
    aam: mangoImg,
    imli: tamarindImg,
    eekh: sugarcaneImg,
    ullu: owlImg,
    oon: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&auto=format&fit=crop&q=80',
    rishi: rishiMuniImg,
    edi: ediImg,
    aidi: ediImg,
    ainak: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=80',
    okhli: okhliImg,
    aurat: auratMaaImg,
    angoor: grapesImg,

    // व्यंजन (Vyanjan) - Realistic Photos
    kabootar: pigeonImg,
    khargosh: rabbitImg,
    gamla: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80',
    ghadi: watchImg,
    chammach: 'https://images.unsplash.com/photo-1619472348577-4b7ebec8ee5a?w=400&auto=format&fit=crop&q=80',
    chhatri: umbrellaImg,
    jahaz: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&auto=format&fit=crop&q=80',
    jhanda: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&auto=format&fit=crop&q=80',
    tamatar: tomatoImg,
    thatthera: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?w=400&auto=format&fit=crop&q=80',
    damru: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&auto=format&fit=crop&q=80',
    dhakkan: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&auto=format&fit=crop&q=80',
    tarbooj: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
    thermas: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80',
    dawat: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=80',
    dhanush: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&auto=format&fit=crop&q=80',
    nal: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
    patang: kiteImg,
    phal: orangeImg,
    battakh: 'https://images.unsplash.com/photo-1555857385-802f1b0a0f73?w=400&auto=format&fit=crop&q=80',
    bhalu: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&auto=format&fit=crop&q=80',
    machhli: fishImg,
    yagya: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&auto=format&fit=crop&q=80',
    rath: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&auto=format&fit=crop&q=80',
    lattoo: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&auto=format&fit=crop&q=80',
    vak: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80',
    seb: appleImg,
    shatkon: shatkonImg,
    haathi: elephantImg,
    shaljam: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80',
    kshatriya: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    trishul: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&auto=format&fit=crop&q=80',
    gyani: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&auto=format&fit=crop&q=80',
  };

  if (photoMap[type]) {
    return (
      <img
        src={photoMap[type]}
        alt={wordName}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-xl pointer-events-none drop-shadow-md"
      />
    );
  }

  // Custom vector graphics for classic Hindi Varnamala items
  switch (type) {
    case 'anar':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <circle cx="50" cy="54" r="36" fill="#dc2626" />
          <circle cx="50" cy="54" r="32" fill="#ef4444" />
          {/* Pomegranate Crown */}
          <polygon points="40,22 45,12 50,18 55,12 60,22 50,26" fill="#b91c1c" />
          {/* Shiny Seeds Inside */}
          <circle cx="42" cy="48" r="5" fill="#fef2f2" opacity="0.85" />
          <circle cx="55" cy="46" r="4.5" fill="#fef2f2" opacity="0.85" />
          <circle cx="48" cy="62" r="4" fill="#fef2f2" opacity="0.8" />
        </svg>
      );

    case 'imli':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Curved Tamarind Pod */}
          <path d="M 25 75 C 30 50, 45 35, 75 25 C 80 40, 50 65, 30 85 Z" fill="#854d0e" />
          <circle cx="38" cy="62" r="9" fill="#a16207" />
          <circle cx="52" cy="48" r="9" fill="#a16207" />
          <circle cx="66" cy="35" r="8" fill="#a16207" />
          <path d="M 75 25 Q 85 20, 88 15" stroke="#4d7c0f" strokeWidth="4" fill="none" />
        </svg>
      );

    case 'eekh':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Sugarcane stalks */}
          <rect x="42" y="15" width="16" height="72" rx="4" fill="#15803d" />
          <line x1="42" y1="32" x2="58" y2="32" stroke="#facc15" strokeWidth="3" />
          <line x1="42" y1="52" x2="58" y2="52" stroke="#facc15" strokeWidth="3" />
          <line x1="42" y1="70" x2="58" y2="70" stroke="#facc15" strokeWidth="3" />
          {/* Leaves */}
          <path d="M 50 15 C 30 5, 20 15, 10 20" stroke="#22c55e" strokeWidth="4" fill="none" />
          <path d="M 50 15 C 70 5, 80 15, 90 20" stroke="#22c55e" strokeWidth="4" fill="none" />
        </svg>
      );

    case 'ullu':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Owl body */}
          <ellipse cx="50" cy="55" rx="30" ry="36" fill="#854d0e" />
          <ellipse cx="50" cy="60" rx="20" ry="24" fill="#fef08a" />
          {/* Big Owl Eyes */}
          <circle cx="38" cy="42" r="14" fill="#fff" stroke="#451a03" strokeWidth="2" />
          <circle cx="62" cy="42" r="14" fill="#fff" stroke="#451a03" strokeWidth="2" />
          <circle cx="38" cy="42" r="6" fill="#000" />
          <circle cx="62" cy="42" r="6" fill="#000" />
          <circle cx="36" cy="40" r="2.5" fill="#fff" />
          <circle cx="60" cy="40" r="2.5" fill="#fff" />
          {/* Beak & Ears */}
          <polygon points="46,49 54,49 50,58" fill="#ea580c" />
          <polygon points="26,30 35,20 40,32" fill="#78350f" />
          <polygon points="74,30 65,20 60,32" fill="#78350f" />
        </svg>
      );

    case 'oon':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Ball of Wool */}
          <circle cx="50" cy="52" r="32" fill="#db2777" />
          <path d="M 28 40 Q 50 30, 72 40" stroke="#fbcfe8" strokeWidth="4" fill="none" />
          <path d="M 22 55 Q 50 70, 78 55" stroke="#fbcfe8" strokeWidth="4" fill="none" />
          <path d="M 38 25 Q 65 52, 40 80" stroke="#fbcfe8" strokeWidth="4" fill="none" />
          {/* Needles */}
          <line x1="18" y1="18" x2="78" y2="82" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          <circle cx="18" cy="18" r="5" fill="#f59e0b" />
        </svg>
      );

    case 'rishi':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <circle cx="50" cy="48" r="38" fill="#fef3c7" />
          {/* Sage Head & Saffron Robe */}
          <circle cx="50" cy="40" r="16" fill="#fed7aa" />
          <path d="M 30 85 Q 50 60, 70 85" fill="#ea580c" />
          {/* Sage Long Beard */}
          <path d="M 40 46 Q 50 75, 60 46 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          {/* Top knot bun */}
          <circle cx="50" cy="22" r="8" fill="#7c2d12" />
          <ellipse cx="50" cy="38" rx="2" ry="4" fill="#ea580c" />
        </svg>
      );

    case 'edi':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <path d="M 30 20 L 30 65 Q 30 85, 55 85 Q 85 85, 85 70 Q 85 58, 65 58 L 52 58 L 52 20 Z" fill="#fbcfe8" stroke="#db2777" strokeWidth="3" />
          <circle cx="42" cy="74" r="7" fill="#f43f5e" />
        </svg>
      );

    case 'ainak':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Spectacles / Glasses */}
          <circle cx="34" cy="50" r="18" fill="#e0f2fe" stroke="#0284c7" strokeWidth="5" />
          <circle cx="66" cy="50" r="18" fill="#e0f2fe" stroke="#0284c7" strokeWidth="5" />
          <path d="M 48 50 Q 50 44, 52 50" stroke="#0284c7" strokeWidth="5" fill="none" />
          <line x1="16" y1="46" x2="6" y2="40" stroke="#0284c7" strokeWidth="4" />
          <line x1="84" y1="46" x2="94" y2="40" stroke="#0284c7" strokeWidth="4" />
        </svg>
      );

    case 'okhli':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Mortar */}
          <path d="M 28 35 L 72 35 L 64 80 L 36 80 Z" fill="#78350f" stroke="#fef08a" strokeWidth="2" />
          <ellipse cx="50" cy="35" rx="22" ry="8" fill="#92400e" />
          {/* Pestle */}
          <line x1="50" y1="18" x2="50" y2="60" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    case 'aurat':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Indian Woman in Sari */}
          <circle cx="50" cy="50" r="38" fill="#fdf2f8" />
          <circle cx="50" cy="38" r="16" fill="#fed7aa" />
          <circle cx="50" cy="35" r="3" fill="#dc2626" />
          <path d="M 25 85 Q 50 55, 75 85" fill="#db2777" />
          <path d="M 36 26 Q 50 16, 64 26" fill="#1e1b4b" />
        </svg>
      );

    case 'kabootar':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <ellipse cx="52" cy="58" rx="28" ry="22" fill="#64748b" />
          <circle cx="32" cy="40" r="14" fill="#94a3b8" />
          <polygon points="18,42 26,38 26,46" fill="#f97316" />
          <circle cx="30" cy="38" r="3" fill="#000" />
          <circle cx="31" cy="37" r="1" fill="#fff" />
          <path d="M 45 55 Q 65 50, 78 72" fill="#475569" />
        </svg>
      );

    case 'khargosh':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Rabbit */}
          <circle cx="50" cy="62" r="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="50" cy="45" r="18" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          {/* Long Ears */}
          <ellipse cx="42" cy="20" rx="6" ry="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <ellipse cx="42" cy="20" rx="3.5" ry="11" fill="#fbcfe8" />
          <ellipse cx="58" cy="20" rx="6" ry="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <ellipse cx="58" cy="20" rx="3.5" ry="11" fill="#fbcfe8" />
          <circle cx="44" cy="43" r="3" fill="#db2777" />
          <circle cx="56" cy="43" r="3" fill="#db2777" />
          <polygon points="48,50 52,50 50,53" fill="#f43f5e" />
        </svg>
      );

    case 'gamla':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Pot */}
          <polygon points="30,55 70,55 64,88 36,88" fill="#ea580c" />
          <rect x="26" y="48" width="48" height="8" rx="2" fill="#c2410c" />
          {/* Flower */}
          <circle cx="50" cy="30" r="10" fill="#facc15" />
          <circle cx="50" cy="18" r="8" fill="#ec4899" />
          <circle cx="62" cy="30" r="8" fill="#ec4899" />
          <circle cx="50" cy="42" r="8" fill="#ec4899" />
          <circle cx="38" cy="30" r="8" fill="#ec4899" />
        </svg>
      );

    case 'chammach':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <ellipse cx="32" cy="32" rx="16" ry="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" transform="rotate(-30 32 32)" />
          <line x1="42" y1="42" x2="82" y2="82" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
          <line x1="42" y1="42" x2="82" y2="82" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'jahaz':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Water */}
          <path d="M 10 75 Q 30 70, 50 75 T 90 75" stroke="#0284c7" strokeWidth="5" fill="none" />
          {/* Ship */}
          <polygon points="20,60 80,60 70,75 30,75" fill="#b91c1c" />
          <rect x="35" y="40" width="30" height="20" fill="#ffffff" />
          <rect x="42" y="24" width="10" height="16" fill="#f59e0b" />
          <circle cx="42" cy="50" r="3" fill="#0284c7" />
          <circle cx="58" cy="50" r="3" fill="#0284c7" />
        </svg>
      );

    case 'jhanda':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Pole */}
          <line x1="28" y1="15" x2="28" y2="88" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
          {/* Indian Tiranga Flag */}
          <rect x="29" y="20" width="48" height="12" fill="#ea580c" />
          <rect x="29" y="32" width="48" height="12" fill="#ffffff" />
          <rect x="29" y="44" width="48" height="12" fill="#16a34a" />
          <circle cx="53" cy="38" r="4.5" fill="none" stroke="#1e3a8a" strokeWidth="1.5" />
        </svg>
      );

    case 'tamatar':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <circle cx="50" cy="55" r="34" fill="#dc2626" />
          <circle cx="42" cy="45" r="7" fill="#fca5a5" opacity="0.6" />
          <polygon points="50,22 45,30 35,26 42,35 34,42 45,40 50,48 55,40 66,42 58,35 65,26 55,30" fill="#15803d" />
          <line x1="50" y1="22" x2="50" y2="14" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'thatthera':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Metal Utensil */}
          <ellipse cx="50" cy="62" rx="30" ry="24" fill="#d97706" />
          <ellipse cx="50" cy="44" rx="18" ry="6" fill="#b45309" />
          {/* Hammer */}
          <line x1="20" y1="25" x2="55" y2="45" stroke="#78350f" strokeWidth="5" />
          <rect x="14" y="20" width="16" height="10" fill="#64748b" transform="rotate(30 22 25)" />
        </svg>
      );

    case 'damru':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Shiva's Damru */}
          <polygon points="25,25 75,25 50,52" fill="#b91c1c" stroke="#fef08a" strokeWidth="2" />
          <polygon points="25,80 75,80 50,52" fill="#b91c1c" stroke="#fef08a" strokeWidth="2" />
          <ellipse cx="50" cy="25" rx="25" ry="7" fill="#fef08a" />
          <ellipse cx="50" cy="80" rx="25" ry="7" fill="#fef08a" />
          <circle cx="50" cy="52" r="6" fill="#f59e0b" />
        </svg>
      );

    case 'dhakkan':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <ellipse cx="50" cy="58" rx="38" ry="18" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          <ellipse cx="50" cy="54" rx="28" ry="12" fill="#cbd5e1" />
          <circle cx="50" cy="38" r="8" fill="#ef4444" />
          <line x1="50" y1="38" x2="50" y2="50" stroke="#475569" strokeWidth="4" />
        </svg>
      );

    case 'tarbooj':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Watermelon slice */}
          <path d="M 15 45 Q 50 90, 85 45 Z" fill="#15803d" />
          <path d="M 20 45 Q 50 82, 80 45 Z" fill="#fef08a" />
          <path d="M 23 45 Q 50 76, 77 45 Z" fill="#ef4444" />
          {/* Seeds */}
          <circle cx="42" cy="54" r="2.5" fill="#000" />
          <circle cx="58" cy="54" r="2.5" fill="#000" />
          <circle cx="50" cy="62" r="2.5" fill="#000" />
        </svg>
      );

    case 'thermas':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <rect x="36" y="28" width="28" height="54" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <rect x="42" y="16" width="16" height="12" rx="3" fill="#f59e0b" />
          <path d="M 36 42 Q 22 55, 36 68" stroke="#f59e0b" strokeWidth="4" fill="none" />
        </svg>
      );

    case 'dawat':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <polygon points="32,45 68,45 62,82 38,82" fill="#1e3a8a" />
          <rect x="38" y="34" width="24" height="11" rx="2" fill="#f59e0b" />
          {/* Feather Quill */}
          <path d="M 72 20 Q 55 45, 52 50" stroke="#f8fafc" strokeWidth="4" fill="none" />
        </svg>
      );

    case 'dhanush':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Bow */}
          <path d="M 25 20 Q 65 50, 25 80" stroke="#d97706" strokeWidth="6" fill="none" />
          <line x1="25" y1="20" x2="25" y2="80" stroke="#f8fafc" strokeWidth="2" />
          {/* Arrow */}
          <line x1="20" y1="50" x2="80" y2="50" stroke="#ef4444" strokeWidth="3" />
          <polygon points="80,50 70,44 72,50 70,56" fill="#ef4444" />
        </svg>
      );

    case 'nal':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <path d="M 25 45 L 60 45 L 60 62" stroke="#64748b" strokeWidth="10" fill="none" strokeLinecap="round" />
          <line x1="60" y1="32" x2="60" y2="45" stroke="#ef4444" strokeWidth="6" />
          <circle cx="60" cy="30" r="7" fill="#ef4444" />
          {/* Water Drop */}
          <circle cx="60" cy="74" r="4.5" fill="#38bdf8" />
        </svg>
      );

    case 'battakh':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <ellipse cx="56" cy="62" rx="26" ry="18" fill="#facc15" />
          <circle cx="36" cy="44" r="14" fill="#facc15" />
          <polygon points="22,46 32,41 32,51" fill="#f97316" />
          <circle cx="34" cy="42" r="2.5" fill="#000" />
          <path d="M 15 78 Q 50 72, 85 78" stroke="#38bdf8" strokeWidth="4" fill="none" />
        </svg>
      );

    case 'bhalu':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <circle cx="50" cy="52" r="30" fill="#78350f" />
          <circle cx="30" cy="28" r="10" fill="#78350f" />
          <circle cx="70" cy="28" r="10" fill="#78350f" />
          <circle cx="50" cy="60" r="14" fill="#fed7aa" />
          <ellipse cx="50" cy="56" rx="6" ry="4" fill="#000" />
          <circle cx="40" cy="46" r="3" fill="#000" />
          <circle cx="60" cy="46" r="3" fill="#000" />
        </svg>
      );

    case 'yagya':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          {/* Havan Kund */}
          <polygon points="20,62 80,62 68,85 32,85" fill="#b45309" />
          <rect x="15" y="58" width="70" height="6" rx="2" fill="#d97706" />
          {/* Holy Flame */}
          <polygon points="50,20 62,45 38,45" fill="#ea580c" />
          <polygon points="50,26 58,45 42,45" fill="#facc15" />
        </svg>
      );

    case 'rath':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <rect x="25" y="45" width="46" height="25" rx="3" fill="#b91c1c" />
          <polygon points="25,45 48,22 71,45" fill="#facc15" />
          {/* Chariot Wheel */}
          <circle cx="48" cy="74" r="14" fill="#d97706" stroke="#fef08a" strokeWidth="3" />
        </svg>
      );

    case 'lattoo':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <ellipse cx="50" cy="40" rx="30" ry="12" fill="#ef4444" />
          <polygon points="20,40 80,40 50,82" fill="#3b82f6" />
          <line x1="50" y1="82" x2="50" y2="88" stroke="#475569" strokeWidth="4" />
          <line x1="50" y1="26" x2="50" y2="34" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'vak':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <ellipse cx="52" cy="55" rx="22" ry="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M 38 52 Q 30 40, 32 30" stroke="#ffffff" strokeWidth="5" fill="none" />
          <circle cx="32" cy="28" r="8" fill="#ffffff" />
          <polygon points="20,28 28,26 28,30" fill="#f97316" />
          <line x1="46" y1="69" x2="46" y2="86" stroke="#ea580c" strokeWidth="3" />
          <line x1="56" y1="69" x2="56" y2="86" stroke="#ea580c" strokeWidth="3" />
        </svg>
      );

    case 'shaljam':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <circle cx="50" cy="60" r="28" fill="#fdf4ff" />
          <path d="M 22 55 Q 50 35, 78 55 Z" fill="#9333ea" />
          <path d="M 50 38 Q 42 16, 32 18" stroke="#16a34a" strokeWidth="4" fill="none" />
          <path d="M 50 38 Q 58 16, 68 18" stroke="#16a34a" strokeWidth="4" fill="none" />
        </svg>
      );

    case 'shatkon':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <polygon points="50,18 80,34 80,66 50,82 20,66 20,34" fill="#06b6d4" stroke="#facc15" strokeWidth="4" />
        </svg>
      );

    case 'kshatriya':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <circle cx="50" cy="38" r="16" fill="#fed7aa" />
          <polygon points="40,24 50,14 60,24" fill="#f59e0b" />
          {/* Shield */}
          <ellipse cx="68" cy="62" rx="14" ry="18" fill="#b91c1c" stroke="#fef08a" strokeWidth="3" />
          {/* Sword */}
          <line x1="28" y1="78" x2="42" y2="46" stroke="#cbd5e1" strokeWidth="4" />
        </svg>
      );

    case 'trishul':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <line x1="50" y1="20" x2="50" y2="86" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
          <polygon points="50,14 46,26 54,26" fill="#ea580c" />
          <path d="M 32 30 Q 32 45, 50 45 Q 68 45, 68 30" stroke="#f59e0b" strokeWidth="4" fill="none" />
          <polygon points="32,24 28,34 36,34" fill="#ea580c" />
          <polygon points="68,24 64,34 72,34" fill="#ea580c" />
        </svg>
      );

    case 'gyani':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
          <circle cx="50" cy="50" r="38" fill="#fef3c7" />
          {/* Scholar with Holy Book */}
          <circle cx="50" cy="35" r="14" fill="#fed7aa" />
          <circle cx="50" cy="30" r="2" fill="#ea580c" />
          {/* Open Book */}
          <polygon points="26,62 50,56 74,62 70,82 50,76 30,82" fill="#f8fafc" stroke="#b45309" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center font-black text-red-900 text-lg">
          {wordName[0]}
        </div>
      );
  }
};

export const HindiMatchWordStage: React.FC<HindiMatchWordStageProps> = ({
  soundEnabled,
  onHome,
}) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentSet = HINDI_MATCH_LEVELS[levelIndex];

  // Top letter items
  const [letterItems, setLetterItems] = useState<HindiMatchItem[]>(currentSet.items);
  // Bottom object cards
  const [objectItems, setObjectItems] = useState<HindiMatchItem[]>([]);

  // State for matched pairs (store set of matched item IDs, e.g. 'अ')
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  // Currently selected top letter ID
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

  // Score
  const [score, setScore] = useState(0);
  const [showLevelVictory, setShowLevelVictory] = useState(false);

  // Container ref for measuring precise SVG line coordinates
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const objectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Line coordinates state: { id: string, x1: number, y1: number, x2: number, y2: number }
  const [lines, setLines] = useState<{ id: string; x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Live Line Drag state
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [dragLine, setDragLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // Error shake animation state
  const [errorId, setErrorId] = useState<string | null>(null);

  // Initialize level items and set bottom object cards order
  useEffect(() => {
    const items = HINDI_MATCH_LEVELS[levelIndex].items;
    setLetterItems(items);

    if (HINDI_MATCH_LEVELS[levelIndex].defaultBottomOrder) {
      const orderMap = HINDI_MATCH_LEVELS[levelIndex].defaultBottomOrder;
      const ordered = orderMap
        .map((id) => items.find((it) => it.id === id))
        .filter((it): it is HindiMatchItem => it !== undefined);
      setObjectItems(ordered);
    } else {
      setObjectItems([...items]);
    }

    setMatchedIds(new Set());
    setSelectedLetterId(null);
    setDraggingFrom(null);
    setDragLine(null);
    setLines([]);
    setShowLevelVictory(false);
  }, [levelIndex]);

  // Recalculate line coordinates
  const updateLineCoordinates = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newLines: { id: string; x1: number; y1: number; x2: number; y2: number }[] = [];

    matchedIds.forEach((id) => {
      const lEl = letterRefs.current[id];
      const oEl = objectRefs.current[id];

      if (lEl && oEl) {
        const lRect = lEl.getBoundingClientRect();
        const oRect = oEl.getBoundingClientRect();

        const x1 = lRect.left + lRect.width / 2 - containerRect.left;
        const y1 = lRect.bottom - containerRect.top - 8;

        const x2 = oRect.left + oRect.width / 2 - containerRect.left;
        const y2 = oRect.top - containerRect.top + 8;

        newLines.push({ id, x1, y1, x2, y2 });
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    updateLineCoordinates();
    window.addEventListener('resize', updateLineCoordinates);
    return () => window.removeEventListener('resize', updateLineCoordinates);
  }, [matchedIds, levelIndex, objectItems]);

  // Pointer down on top letter -> start line
  const handleLetterPointerDown = (item: HindiMatchItem, e: React.PointerEvent) => {
    if (matchedIds.has(item.id)) return;

    sounds.playSnap(soundEnabled);
    setSelectedLetterId(item.id);
    setDraggingFrom(item.id);

    try {
      if (containerRef.current) {
        containerRef.current.setPointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const lEl = letterRefs.current[item.id];
    if (lEl && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const lRect = lEl.getBoundingClientRect();
      const startX = lRect.left + lRect.width / 2 - containerRect.left;
      const startY = lRect.bottom - containerRect.top - 8;

      const currentX = e.clientX - containerRect.left;
      const currentY = e.clientY - containerRect.top;

      setDragLine({ x1: startX, y1: startY, x2: currentX, y2: currentY });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingFrom || !dragLine || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    setDragLine((prev) => (prev ? { ...prev, x2: currentX, y2: currentY } : null));
  };

  const checkMatch = (letterId: string, targetObjectId: string) => {
    const item = letterItems.find((it) => it.id === letterId);
    if (!item) return;

    if (letterId === targetObjectId) {
      // Correct match!
      sounds.speakHindiMatchPair(item.letter, item.wordName, soundEnabled);
      const nextMatched = new Set(matchedIds);
      nextMatched.add(letterId);
      setMatchedIds(nextMatched);
      setScore((prev) => prev + 10);
      setSelectedLetterId(null);

      // Check if level completed
      if (nextMatched.size === letterItems.length) {
        setTimeout(() => {
          sounds.playVictory(soundEnabled);
          setShowLevelVictory(true);
        }, 1200);
      }
    } else {
      // Wrong match
      sounds.speakMatchWrong(soundEnabled);
      setErrorId(targetObjectId);
      setTimeout(() => setErrorId(null), 500);
      setScore((prev) => Math.max(0, prev - 5));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingFrom) return;

    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const objectCard = elem?.closest('[data-object-id]');
    if (objectCard) {
      const targetId = objectCard.getAttribute('data-object-id');
      if (targetId && !matchedIds.has(targetId)) {
        checkMatch(draggingFrom, targetId);
      }
    }

    setDraggingFrom(null);
    setDragLine(null);
  };

  const handleObjectClick = (item: HindiMatchItem) => {
    if (matchedIds.has(item.id)) return;
    if (selectedLetterId) {
      checkMatch(selectedLetterId, item.id);
    }
  };

  const handleNextLevel = () => {
    sounds.playVictory(soundEnabled);
    const nextIdx = (levelIndex + 1) % HINDI_MATCH_LEVELS.length;
    setLevelIndex(nextIdx);
  };

  const handleSelectLevelTab = (idx: number) => {
    sounds.playSnap(soundEnabled);
    setLevelIndex(idx);
  };

  return (
    <div
      id="hindi-match-word-stage"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-screen overflow-hidden select-none flex flex-col justify-between"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 20%, #60a5fa 0%, #3b82f6 45%, #1d4ed8 100%)',
      }}
    >
      {/* Background Village / Classroom Backdrop Decor */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-2 left-6 w-28 h-8 bg-white/30 rounded-full blur-[1px]" />
        <div className="absolute top-8 right-12 w-36 h-9 bg-white/20 rounded-full blur-[1px]" />
        <div className="absolute bottom-0 w-full h-14 bg-gradient-to-t from-emerald-950 via-emerald-800 to-transparent" />
      </div>

      {/* TOP HEADER */}
      <div
        id="hindi-match-top-bar"
        className="relative z-20 w-full px-2 sm:px-6 py-1.5 flex items-center justify-between max-w-6xl mx-auto bg-emerald-600/95 border-b-2 border-emerald-300 shadow-lg rounded-b-2xl"
      >
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="bg-sky-400 border-2 border-white text-yellow-300 font-black text-xs sm:text-base px-3 sm:px-5 py-1 rounded-xl shadow cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वापस (Home)</span>
          </motion.button>

          {/* Level indicators */}
          <div className="hidden sm:flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/20">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span className="text-xs font-black text-yellow-300">{currentSet.title}</span>
          </div>
        </div>

        {/* Level Selector Dots / Pills */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl">
          {HINDI_MATCH_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => handleSelectLevelTab(idx)}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                levelIndex === idx
                  ? 'bg-yellow-400 text-red-950 scale-110 shadow-md ring-2 ring-white'
                  : 'bg-white/20 text-white hover:bg-white/40'
              }`}
              title={lvl.title}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold text-yellow-300 uppercase">स्कोर</span>
            <span className="text-base sm:text-2xl font-black text-white leading-none">{score}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNextLevel}
            className="bg-yellow-400 hover:bg-yellow-300 border-2 border-white text-red-950 font-black text-xs sm:text-base px-3 sm:px-5 py-1 rounded-xl shadow cursor-pointer"
          >
            अगला (Next)
          </motion.button>
        </div>
      </div>

      {/* SVG CONNECTING LINES OVERLAY */}
      <svg
        id="match-connecting-lines-svg"
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Active dragging line */}
        {dragLine && (
          <g id="hindi-drag-line-active">
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#ef4444"
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.9"
              filter="url(#glow)"
            />
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#facc15"
              strokeWidth="5"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
            <circle cx={dragLine.x1} cy={dragLine.y1} r="8" fill="#facc15" />
            <circle cx={dragLine.x2} cy={dragLine.y2} r="8" fill="#ef4444" />
          </g>
        )}

        {/* Locked matched lines */}
        {lines.map((line) => (
          <g key={line.id}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#22c55e"
              strokeWidth="11"
              strokeLinecap="round"
              opacity="0.85"
              filter="url(#glow)"
            />
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#fef08a"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx={line.x1} cy={line.y1} r="8" fill="#22c55e" />
            <circle cx={line.x2} cy={line.y2} r="8" fill="#22c55e" />
          </g>
        ))}
      </svg>

      {/* MATCH PLAYING CANVAS */}
      <div className="relative z-30 flex-1 flex flex-col justify-between w-full max-w-5xl mx-auto py-1 sm:py-3 px-2 sm:px-6">
        {/* TOP ROW: HINDI LETTER TILES */}
        <div id="match-letters-row" className="w-full flex items-center justify-around sm:justify-center sm:gap-10 pt-1">
          {letterItems.map((item) => {
            const isMatched = matchedIds.has(item.id);
            const isSelected = selectedLetterId === item.id;

            return (
              <motion.div
                key={item.id}
                ref={(el) => { letterRefs.current[item.id] = el; }}
                onPointerDown={(e) => handleLetterPointerDown(item, e)}
                whileHover={!isMatched ? { scale: 1.08 } : {}}
                whileTap={!isMatched ? { scale: 0.92 } : {}}
                animate={isSelected ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
                className={`relative w-12 h-12 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-2xl border-3 sm:border-4 flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 shadow-xl ${
                  isMatched
                    ? 'bg-emerald-600 border-yellow-300 ring-4 ring-emerald-300/80 shadow-emerald-950/70'
                    : isSelected
                    ? 'bg-red-600 border-yellow-300 ring-4 ring-yellow-300/90 shadow-red-950/80'
                    : 'bg-red-600 border-yellow-400 shadow-red-950/80 hover:bg-red-500'
                }`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.5), 0 6px 14px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  className="font-black text-2xl sm:text-4xl md:text-5xl text-yellow-300 pointer-events-none leading-none"
                  style={{
                    textShadow: '2px 2px 0px #991b1b, -1px -1px 0px #991b1b, 1px -1px 0px #991b1b, -1px 1px 0px #991b1b',
                  }}
                >
                  {item.letter}
                </span>

                {isMatched && (
                  <div className="absolute -top-1.5 -right-1.5 bg-yellow-300 text-emerald-900 rounded-full p-0.5 sm:p-1 border-2 border-white shadow-lg pointer-events-none">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* MIDDLE LINE-DRAWING CLEARANCE ZONE */}
        <div className="w-full flex-1 min-h-[40px] sm:min-h-[70px] pointer-events-none flex items-center justify-center opacity-40">
          <span className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase bg-black/25 px-4 py-0.5 rounded-full backdrop-blur-xs">
            ⬇ अक्षर को सही चित्र से मिलाओ (Drag to Match) ⬇
          </span>
        </div>

        {/* BOTTOM ROW: HINDI OBJECT CARDS WITH PICTURE & NAME */}
        <div id="match-objects-row" className="w-full flex items-center justify-around sm:justify-center sm:gap-10 pb-1">
          {objectItems.map((item) => {
            const isMatched = matchedIds.has(item.id);
            const isError = errorId === item.id;

            return (
              <motion.div
                key={item.id}
                data-object-id={item.id}
                ref={(el) => { objectRefs.current[item.id] = el; }}
                whileHover={!isMatched ? { scale: 1.06 } : {}}
                whileTap={!isMatched ? { scale: 0.94 } : {}}
                animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                onClick={() => handleObjectClick(item)}
                className={`relative w-16 h-18 sm:w-24 sm:h-26 md:w-28 md:h-30 rounded-2xl border-3 sm:border-4 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 shadow-xl p-1 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300/80'
                    : 'bg-[#fffcf7] border-[#00a2ff] hover:border-sky-300 shadow-sky-950/40'
                }`}
                style={{
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.9), 0 6px 16px rgba(0,0,0,0.3)',
                }}
              >
                {/* Illustration Image or Vector */}
                <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl">
                  <HindiIllustration type={item.svgType} wordName={item.wordName} />
                </div>

                {/* Word Label Pill at Bottom */}
                <div className="w-full bg-slate-900/80 rounded-lg py-0.5 px-1 text-center">
                  <span className="text-[11px] sm:text-sm font-black text-yellow-300 leading-tight block truncate">
                    {item.wordName}
                  </span>
                </div>

                {isMatched && (
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-lg pointer-events-none">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* LEVEL VICTORY MODAL */}
      <AnimatePresence>
        {showLevelVictory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-blue-900 to-indigo-950 border-4 border-yellow-400 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center"
            >
              <Sparkles className="w-14 h-14 text-yellow-300 animate-spin mb-2" />
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 mb-1">
                बहुत बढ़िया! शाबाश! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mb-4 font-medium">
                आपने <strong className="text-yellow-300">{currentSet.title}</strong> की सभी जोड़ियाँ सही मिला ली हैं!
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowLevelVictory(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 border border-white/40 text-white font-bold text-xs sm:text-sm shadow active:scale-95"
                >
                  दोबारा खेलें
                </button>

                <button
                  onClick={() => {
                    setShowLevelVictory(false);
                    handleNextLevel();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black text-xs sm:text-sm shadow active:scale-95 border-2 border-white flex items-center justify-center gap-1"
                >
                  <Play className="w-4 h-4 fill-red-950" />
                  <span>अगला लेवल</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
