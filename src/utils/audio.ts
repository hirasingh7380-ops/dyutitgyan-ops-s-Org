// Web Audio API Synthesizer and Android-Optimized Hindi Speech Synthesis for Kids

class SoundManager {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeUtterances: Set<SpeechSynthesisUtterance> = new Set();
  private unlocked = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupMobileUnlock();
      this.refreshVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.refreshVoices();
        };
      }
    }
  }

  // Mobile and Android Audio / Speech Primer on first user interaction
  private setupMobileUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.init();
      if ('speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          this.refreshVoices();
          this.unlocked = true;
        } catch {
          // Ignore
        }
      }

      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('click', unlock);
    };

    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private refreshVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        this.voices = available;
      }
    } catch {
      // Ignore
    }
  }

  // Select the sweetest, clearest voice available. Detects whether real Hindi voice is available.
  private getVoiceInfo(): { voice: SpeechSynthesisVoice | null; hasHindi: boolean; lang: string } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { voice: null, hasHindi: false, lang: 'hi-IN' };
    }

    if (this.voices.length === 0) {
      this.refreshVoices();
    }
    const voices = this.voices.length > 0 ? this.voices : window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      return { voice: null, hasHindi: false, lang: 'hi-IN' };
    }

    // 1. Google / Android native Hindi female / natural teacher voice
    const hindiTeacherVoice = voices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      const isHindi = lang.startsWith('hi') || name.includes('hindi') || name.includes('हिन्दी');
      const isFemaleTeacher =
        name.includes('female') ||
        name.includes('swara') ||
        name.includes('lekha') ||
        name.includes('kavya') ||
        name.includes('hie') ||
        name.includes('hid') ||
        name.includes('natural');
      return isHindi && isFemaleTeacher;
    });
    if (hindiTeacherVoice) {
      return { voice: hindiTeacherVoice, hasHindi: true, lang: hindiTeacherVoice.lang || 'hi-IN' };
    }

    // 2. Any Hindi voice (hi-IN, hi)
    const anyHindiVoice = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      const name = v.name.toLowerCase();
      return lang.startsWith('hi') || name.includes('hindi') || name.includes('हिन्दी');
    });
    if (anyHindiVoice) {
      return { voice: anyHindiVoice, hasHindi: true, lang: anyHindiVoice.lang || 'hi-IN' };
    }

    // 3. Indian English natural female / clear voice (Google en-IN, Microsoft Neerja)
    const indianEnglishVoice = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      const name = v.name.toLowerCase();
      return (
        (lang === 'en-in' || lang.startsWith('en-in')) &&
        (name.includes('female') || name.includes('google') || name.includes('natural') || name.includes('neerja'))
      );
    });
    if (indianEnglishVoice) {
      return { voice: indianEnglishVoice, hasHindi: false, lang: 'en-IN' };
    }

    // 4. Any Indian English voice
    const anyIndianVoice = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      return lang === 'en-in' || lang.startsWith('en-in');
    });
    if (anyIndianVoice) {
      return { voice: anyIndianVoice, hasHindi: false, lang: 'en-IN' };
    }

    // 5. Any natural female voice or default
    const naturalFemale = voices.find((v) => {
      const name = v.name.toLowerCase();
      return name.includes('female') || name.includes('natural');
    });
    if (naturalFemale) {
      return { voice: naturalFemale, hasHindi: false, lang: naturalFemale.lang || 'en-US' };
    }

    return { voice: voices[0] || null, hasHindi: false, lang: voices[0]?.lang || 'en-US' };
  }

  // Core Speech Method: Android Instant Execution, Memory Safe, Zero-Delay
  private speakWithTeacherVoice(
    hindiText: string,
    hinglishFallbackText?: string,
    rate = 0.88,
    pitch = 1.15
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      this.init();

      // Ensure voices are refreshed
      if (this.voices.length === 0) {
        this.refreshVoices();
      }

      const { voice, hasHindi, lang } = this.getVoiceInfo();

      // Text selection: if Android phone has native Hindi voice, speak Devanagari Hindi.
      // If phone only has English/Default voice, speak phonetic Hinglish so it speaks IMMEDIATELY without waiting or network failure!
      const textToSpeak = (hasHindi ? hindiText : (hinglishFallbackText || hindiText)).trim();
      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      utterance.lang = lang;
      if (voice) {
        utterance.voice = voice;
      }

      // Teacher pacing: gentle, clear and enthusiastic
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1.0;

      // Keep active reference in Set to prevent Android Chrome V8 garbage collector dropping audio mid-sentence
      this.activeUtterances.add(utterance);

      const cleanup = () => {
        this.activeUtterances.delete(utterance);
      };

      utterance.onend = cleanup;
      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        cleanup();
      };

      // Resume if browser suspended speechSynthesis
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // If already speaking, cancel smoothly and speak
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          try {
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
            window.speechSynthesis.speak(utterance);
          } catch (err) {
            console.warn('Delayed speak error:', err);
          }
        }, 15);
      } else {
        // Instant direct speak: zero delay!
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn('Speech error:', err);
    }
  }

  // Teacher Voice Greeting & Test (Instantly playable on Android)
  speakTestGreeting(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);
    this.speakWithTeacherVoice(
      'नमस्ते बच्चों! चलो मिलकर पढ़ाई करते हैं!',
      'Namaste bacchon! Chalo milkar padhai karte hain!',
      0.9,
      1.15
    );
  }

  // 1. Word Builder: Word completion spoken promptly & clearly
  speakHindiWordMeaning(word: string, soundEnabled = true) {
    if (!soundEnabled) return;

    const HINDI_DATA: Record<string, { spellHi: string; spellEn: string; wordHi: string; hindi: string; romanHindi: string }> = {
      CAT: { spellHi: 'सी, ए, टी', spellEn: 'C, A, T', wordHi: 'कैट', hindi: 'बिल्ली', romanHindi: 'billi' },
      BAT: { spellHi: 'बी, ए, टी', spellEn: 'B, A, T', wordHi: 'बैट', hindi: 'बल्ला', romanHindi: 'balla' },
      RAT: { spellHi: 'आर, ए, टी', spellEn: 'R, A, T', wordHi: 'रैट', hindi: 'चूहा', romanHindi: 'chuha' },
      HAT: { spellHi: 'एच, ए, टी', spellEn: 'H, A, T', wordHi: 'हैट', hindi: 'टोपी', romanHindi: 'topi' },
      FAN: { spellHi: 'एफ, ए, एन', spellEn: 'F, A, N', wordHi: 'फैन', hindi: 'पंखा', romanHindi: 'pankha' },
      MAN: { spellHi: 'एम, ए, एन', spellEn: 'M, A, N', wordHi: 'मैन', hindi: 'आदमी', romanHindi: 'aadmi' },
      VAN: { spellHi: 'वी, ए, एन', spellEn: 'V, A, N', wordHi: 'वैन', hindi: 'गाड़ी', romanHindi: 'gaadi' },
      CAN: { spellHi: 'सी, ए, एन', spellEn: 'C, A, N', wordHi: 'कैन', hindi: 'डिब्बा', romanHindi: 'dibba' },
      MAP: { spellHi: 'एम, ए, पी', spellEn: 'M, A, P', wordHi: 'मैप', hindi: 'नक्शा', romanHindi: 'naksha' },
      CAP: { spellHi: 'सी, ए, पी', spellEn: 'C, A, P', wordHi: 'कैप', hindi: 'टोपी', romanHindi: 'topi' },
      TAP: { spellHi: 'टी, ए, पी', spellEn: 'T, A, P', wordHi: 'टैप', hindi: 'नल', romanHindi: 'nal' },
      LAP: { spellHi: 'एल, ए, पी', spellEn: 'L, A, P', wordHi: 'लैप', hindi: 'गोद', romanHindi: 'god' },
      BALL: { spellHi: 'बी, ए, एल, एल', spellEn: 'B, A, L, L', wordHi: 'बॉल', hindi: 'गेंद', romanHindi: 'gend' },
      HALL: { spellHi: 'एच, ए, एल, एल', spellEn: 'H, A, L, L', wordHi: 'हॉल', hindi: 'बड़ा कमरा', romanHindi: 'bada kamra' },
      WALL: { spellHi: 'डब्ल्यू, ए, एल, एल', spellEn: 'W, A, L, L', wordHi: 'वॉल', hindi: 'दीवार', romanHindi: 'deewar' },
      TALL: { spellHi: 'टी, ए, एल, एल', spellEn: 'T, A, L, L', wordHi: 'टॉल', hindi: 'लंबा', romanHindi: 'lamba' },
    };

    const item = HINDI_DATA[word.toUpperCase()] || {
      spellHi: word,
      spellEn: word,
      wordHi: word,
      hindi: word,
      romanHindi: word,
    };

    const hindiText = `${item.spellHi}. ${item.wordHi}! ${item.wordHi} मतलब ${item.hindi}. शाबाश बच्चों!`;
    const hinglishText = `${item.spellEn}. ${word}! ${word} matlab ${item.romanHindi}. Shabash bacchon!`;

    this.speakWithTeacherVoice(hindiText, hinglishText, 0.9, 1.15);
  }

  // 2. Fill in the Blank: Letter dropped correctly
  speakHindiLetterDrop(letter: string, prevLetter?: string, soundEnabled = true) {
    if (!soundEnabled) return;

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const lName = HINDI_LETTERS[letter.toUpperCase()] || letter;
    const pName = prevLetter ? (HINDI_LETTERS[prevLetter.toUpperCase()] || prevLetter) : null;

    let hindiText = `बिल्कुल सही! अक्षर ${lName}. शाबाश बच्चों!`;
    let hinglishText = `Bilkul sahi! Letter ${letter}. Shabash bacchon!`;

    if (pName && prevLetter) {
      hindiText = `बिल्कुल सही! ${pName} के बाद आता है ${lName}! बहुत बढ़िया!`;
      hinglishText = `Bilkul sahi! ${prevLetter} ke baad aata hai ${letter}! Bahut badhiya!`;
    }

    this.speakWithTeacherVoice(hindiText, hinglishText, 0.9, 1.15);
  }

  // 3. Fill in the Blank: Wrong letter selected
  speakHindiWrongAnswer(soundEnabled = true) {
    if (!soundEnabled) return;

    this.playError(soundEnabled);

    const wrongHi = [
      'ओहो! यह गलत है, फिर से कोशिश करो बच्चों!',
      'अरे नहीं! ध्यान से देखो और सही अक्षर चुनो!',
      'कोई बात नहीं! एक बार फिर सोचो और सही अक्षर लगाओ!',
    ];
    const wrongEn = [
      'Oho! Yeh galat hai, fir se koshish karo bacchon!',
      'Arre nahi! Dhyan se dekho aur sahi letter chuno!',
      'Koi baat nahi! Ek baar fir socho aur sahi letter lagao!',
    ];
    const idx = Math.floor(Math.random() * wrongHi.length);

    this.speakWithTeacherVoice(wrongHi[idx], wrongEn[idx], 0.9, 1.12);
  }

  // 4. Balloon Pop: Popped balloon response
  speakHindiBalloonPop(letter: string, isCorrect: boolean, targetLetter: string, soundEnabled = true) {
    if (!soundEnabled) return;

    if (isCorrect) {
      this.playPop(soundEnabled);
    } else {
      this.playError(soundEnabled);
    }

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const lName = HINDI_LETTERS[letter.toUpperCase()] || letter;
    const targetName = HINDI_LETTERS[targetLetter.toUpperCase()] || targetLetter;

    let hindiText = '';
    let hinglishText = '';

    if (isCorrect) {
      hindiText = `अरे वाह! ${lName} फूट गया! शाबाश!`;
      hinglishText = `Arre wah! ${letter} phoot gaya! Shabash!`;
    } else {
      hindiText = `ओहो! यह ${lName} है, हमें ${targetName} चाहिए!`;
      hinglishText = `Oho! Yeh ${letter} hai, humein ${targetLetter} chahiye!`;
    }

    this.speakWithTeacherVoice(hindiText, hinglishText, 0.92, 1.15);
  }

  // 5. Balloon Pop: Target letter announcement
  speakHindiTargetLetter(targetLetter: string, soundEnabled = true) {
    if (!soundEnabled) return;

    this.playSnap(soundEnabled);

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const targetName = HINDI_LETTERS[targetLetter.toUpperCase()] || targetLetter;
    const hindiText = `बच्चों, अब ${targetName} वाले गुब्बारे फोड़ो!`;
    const hinglishText = `Bacchon, ab ${targetLetter} wale gubbare phodo!`;

    this.speakWithTeacherVoice(hindiText, hinglishText, 0.88, 1.15);
  }

  // 6. Click Letter: Spoken tile letter
  speakHindiLetterClick(letter: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const letterName = HINDI_LETTERS[letter.toUpperCase()] || letter;
    const hindiText = `${letterName}! बहुत अच्छे!`;
    const hinglishText = `${letter}! Bahut acche!`;

    this.speakWithTeacherVoice(hindiText, hinglishText, 0.88, 1.15);
  }

  // 7. Match The Word: Matching pair spoken
  speakMatchWord(letter: string, wordName: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const letterName = HINDI_LETTERS[letter.toUpperCase()] || letter;
    const hindiText = `${letterName} फॉर ${wordName}! बिल्कुल सही जोड़ी!`;
    const hinglishText = `${letter} for ${wordName}! Bilkul sahi!`;

    this.speakWithTeacherVoice(hindiText, hinglishText, 0.9, 1.15);
  }

  // 8. Match The Word: Wrong match pair
  speakMatchWrong(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playError(soundEnabled);

    const wrongHi = [
      'ओहो! गलत जोड़ी, फिर से मिलाओ!',
      'फिर से कोशिश करो बच्चों! सही अक्षर ढूंढो!',
      'अरे नहीं! सही तस्वीर से मिलाओ!',
    ];
    const wrongEn = [
      'Oho! Galat jodi, fir se milao!',
      'Fir se koshish karo bacchon! Sahi letter dhoondho!',
      'Arre nahi! Sahi photo se milao!',
    ];
    const idx = Math.floor(Math.random() * wrongHi.length);

    this.speakWithTeacherVoice(wrongHi[idx], wrongEn[idx], 0.9, 1.12);
  }

  // Web Audio Synthesizer Sounds
  playPop(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playSnap(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playFreezeError(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playError(soundEnabled = true) {
    this.playFreezeError(soundEnabled);
  }

  playWordDestroy(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Multi-note cheerful arpeggio for word destroy
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  playVictory(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const melody = [
      { note: 523.25, duration: 0.12 },
      { note: 659.25, duration: 0.12 },
      { note: 783.99, duration: 0.12 },
      { note: 1046.5, duration: 0.35 },
    ];

    melody.forEach((item, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime + idx * 0.12;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.note, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + item.duration);
    });
  }
}

export const sounds = new SoundManager();
