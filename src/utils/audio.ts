// Web Audio API Synthesizer and Android-Optimized Hindi Speech Synthesis for Kids

class SoundManager {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeUtterance: SpeechSynthesisUtterance | null = null;
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
          window.speechSynthesis.resume();
          this.refreshVoices();

          if (!this.unlocked) {
            // Prime mobile speech synthesis queue with silent utterance
            const primer = new SpeechSynthesisUtterance('');
            primer.volume = 0;
            primer.rate = 1.0;
            primer.lang = 'hi-IN';
            window.speechSynthesis.speak(primer);
            this.unlocked = true;
          }
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

  // Select the sweetest, clearest young Hindi teacher voice
  private getBestVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (this.voices.length === 0) {
      this.refreshVoices();
    }
    const voices = this.voices.length > 0 ? this.voices : window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Google / Android native Hindi female / natural teacher voice
    // Android Google TTS names: "Google हिन्दी", "hi-in-x-hie-local", "hi-in-x-hie-network", "hi-in-x-hid-local"
    // Microsoft Swara: "Microsoft Swara Online (Natural) - Hindi (India)"
    // Apple iOS: "Lekha", "Kavya"
    const hindiTeacherVoice = voices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      const isHindi = lang.startsWith('hi') || name.includes('hindi') || name.includes('हिन्दी');
      const isTeacher =
        name.includes('female') ||
        name.includes('swara') ||
        name.includes('lekha') ||
        name.includes('kavya') ||
        name.includes('google') ||
        name.includes('natural') ||
        name.includes('hie') ||
        name.includes('hid');
      return isHindi && isTeacher;
    });
    if (hindiTeacherVoice) return hindiTeacherVoice;

    // 2. Any Hindi voice (hi-IN, hi)
    const anyHindiVoice = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      const name = v.name.toLowerCase();
      return lang.startsWith('hi') || name.includes('hindi') || name.includes('हिन्दी');
    });
    if (anyHindiVoice) return anyHindiVoice;

    // 3. Indian English natural female voice (e.g. Google English India, Microsoft Neerja)
    const indianEnglishVoice = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      const name = v.name.toLowerCase();
      return (
        (lang === 'en-in' || lang.startsWith('en-in')) &&
        (name.includes('female') || name.includes('google') || name.includes('natural') || name.includes('neerja'))
      );
    });
    if (indianEnglishVoice) return indianEnglishVoice;

    // 4. Any Indian English voice
    const anyIndianVoice = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      return lang === 'en-in' || lang.startsWith('en-in');
    });
    if (anyIndianVoice) return anyIndianVoice;

    // 5. Any natural female voice
    const naturalFemale = voices.find((v) => {
      const name = v.name.toLowerCase();
      return name.includes('female') || name.includes('natural');
    });
    if (naturalFemale) return naturalFemale;

    return voices[0] || null;
  }

  // Core Speech Method with Android Chromium GC Fix, Pause/Resume Fix & Young Teacher Pacing
  private speakWithTeacherVoice(text: string, rate = 0.85, pitch = 1.15) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      // 1. Cancel previous utterance
      window.speechSynthesis.cancel();

      // 2. Resume if suspended on Android
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // 3. Ensure voices are refreshed
      if (this.voices.length === 0) {
        this.refreshVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // CRITICAL FOR ANDROID: Set hi-IN so Google TTS activates the Hindi engine
      utterance.lang = 'hi-IN';

      // Young teacher pacing: slow, calm, distinct syllables for kids
      utterance.rate = rate; // 0.85 = gently slow & highly clear for children
      utterance.pitch = pitch; // 1.15 = warm, cheerful young teacher tone
      utterance.volume = 1.0;

      const bestVoice = this.getBestVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Root in instance property to fix Android Chrome V8 garbage collection bug
      this.activeUtterance = utterance;

      utterance.onend = () => {
        if (this.activeUtterance === utterance) {
          this.activeUtterance = null;
        }
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (this.activeUtterance === utterance) {
          this.activeUtterance = null;
        }
      };

      // Slight timeout to let Android audio hardware thread cycle
      setTimeout(() => {
        try {
          window.speechSynthesis.resume();
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('SpeechSynthesis speak failed:', err);
        }
      }, 50);
    } catch (err) {
      console.warn('Speech error:', err);
    }
  }

  // 1. Word Builder: Word completion spoken slowly & clearly by teacher
  speakHindiWordMeaning(word: string, soundEnabled = true) {
    if (!soundEnabled) return;

    this.playWordDestroy(soundEnabled);

    const HINDI_DATA: Record<string, { spell: string; word: string; hindi: string }> = {
      CAT: { spell: 'सी... ए... टी...', word: 'कैट', hindi: 'बिल्ली' },
      BAT: { spell: 'बी... ए... टी...', word: 'बैट', hindi: 'बल्ला' },
      RAT: { spell: 'आर... ए... टी...', word: 'रैट', hindi: 'चूहा' },
      HAT: { spell: 'एच... ए... टी...', word: 'हैट', hindi: 'टोपी' },
      FAN: { spell: 'एफ... ए... एन...', word: 'फैन', hindi: 'पंखा' },
      MAN: { spell: 'एम... ए... एन...', word: 'मैन', hindi: 'आदमी' },
      VAN: { spell: 'वी... ए... एन...', word: 'वैन', hindi: 'गाड़ी' },
      CAN: { spell: 'सी... ए... एन...', word: 'कैन', hindi: 'डिब्बा' },
      MAP: { spell: 'एम... ए... पी...', word: 'मैप', hindi: 'नक्शा' },
      CAP: { spell: 'सी... ए... पी...', word: 'कैप', hindi: 'टोपी' },
      TAP: { spell: 'टी... ए... पी...', word: 'टैप', hindi: 'नल' },
      LAP: { spell: 'एल... ए... पी...', word: 'लैप', hindi: 'गोद' },
      BALL: { spell: 'बी... ए... एल... एल...', word: 'बॉल', hindi: 'गेंद' },
      HALL: { spell: 'एच... ए... एल... एल...', word: 'हॉल', hindi: 'बड़ा कमरा' },
      WALL: { spell: 'डब्ल्यू... ए... एल... एल...', word: 'वॉल', hindi: 'दीवार' },
      TALL: { spell: 'टी... ए... एल... एल...', word: 'टॉल', hindi: 'लंबा' },
    };

    const item = HINDI_DATA[word.toUpperCase()] || { spell: word, word: word, hindi: word };
    // Gentle teacher speech: spelling with pauses, clear word pronunciation, Hindi meaning, warm praise
    const speechText = `${item.spell}! ... ${item.word}! ... ${item.word} मतलब ... ${item.hindi}! ... बहुत अच्छे बच्चों, शाबाश!`;

    this.speakWithTeacherVoice(speechText, 0.85, 1.15);
  }

  // 2. Fill in the Blank: Letter dropped correctly
  speakHindiLetterDrop(letter: string, prevLetter?: string, soundEnabled = true) {
    if (!soundEnabled) return;

    this.playWordDestroy(soundEnabled);

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const lName = HINDI_LETTERS[letter.toUpperCase()] || letter;
    const pName = prevLetter ? (HINDI_LETTERS[prevLetter.toUpperCase()] || prevLetter) : null;

    let speechText = `बिल्कुल सही! ... अक्षर ... ${lName}! ... शाबाश बच्चों!`;
    if (pName) {
      speechText = `बिल्कुल सही! ... ${pName} के बाद आता है ... ${lName}! ... बहुत बढ़िया!`;
    }

    this.speakWithTeacherVoice(speechText, 0.85, 1.15);
  }

  // 3. Fill in the Blank: Wrong letter selected
  speakHindiWrongAnswer(soundEnabled = true) {
    if (!soundEnabled) return;

    this.playError(soundEnabled);

    const wrongPhrases = [
      'ओहो! ... यह गलत है, फिर से कोशिश करो बच्चों!',
      'अरे नहीं! ... ध्यान से देखो और सही अक्षर चुनो!',
      'कोई बात नहीं! ... एक बार फिर सोचो और सही अक्षर लगाओ!',
    ];
    const phrase = wrongPhrases[Math.floor(Math.random() * wrongPhrases.length)];

    this.speakWithTeacherVoice(phrase, 0.88, 1.12);
  }

  // 4. Balloon Pop: Popped balloon response
  speakHindiBalloonPop(letter: string, isCorrect: boolean, targetLetter: string, soundEnabled = true) {
    if (!soundEnabled) return;

    if (isCorrect) {
      this.playWordDestroy(soundEnabled);
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

    let speechText = '';
    if (isCorrect) {
      speechText = `अरे वाह! ... ${lName} वाला गुब्बारा फूट गया! ... बिल्कुल सही! शाबाश!`;
    } else {
      speechText = `ओहो! ... यह तो ${lName} है! ... हमें ${targetName} वाला गुब्बारा फोड़ना था! ... फिर से ढूंढो बच्चों!`;
    }

    this.speakWithTeacherVoice(speechText, 0.88, 1.15);
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
    const speechText = `बच्चों ... अब ${targetName} वाले गुब्बारे ढूंढो और फोड़ो! ... ${targetName}!`;

    this.speakWithTeacherVoice(speechText, 0.85, 1.15);
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
    const speechText = `${letterName}! ... बहुत अच्छे!`;

    this.speakWithTeacherVoice(speechText, 0.82, 1.15);
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
    const textToSpeak = `${letterName} ... फॉर ... ${wordName}! ... बिल्कुल सही जोड़ी! बहुत बढ़िया!`;

    this.speakWithTeacherVoice(textToSpeak, 0.85, 1.15);
  }

  // 8. Match The Word: Wrong match pair
  speakMatchWrong(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playError(soundEnabled);

    const wrongPhrases = [
      'ओहो! ... यह गलत जोड़ी है बच्चों! ... सही चित्र से मिलाओ!',
      'फिर से कोशिश करो बच्चों! ... सही अक्षर ढूंढो!',
      'अरे नहीं! ... ध्यान से देखो और सही तस्वीर मिलाओ!',
    ];
    const phrase = wrongPhrases[Math.floor(Math.random() * wrongPhrases.length)];

    this.speakWithTeacherVoice(phrase, 0.88, 1.12);
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
