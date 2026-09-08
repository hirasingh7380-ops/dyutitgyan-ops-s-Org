// Universal Kids Audio Manager for Android (Installed PWA & Chrome) and Desktop
// Uses HTML5 Audio elements for 100% reliable real voice playback on all mobile devices,
// with Web Audio synthesizer chimes and Web Speech fallback.

class SoundManager {
  private ctx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
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

  // Mobile and Android Audio Primer on first user interaction (touch, pointer, click)
  private setupMobileUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.unlocked = true;
      this.init();

      // 1. Prime HTML5 Audio pipeline (critical for Android PWA & Chrome)
      try {
        const dummy = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFRm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        dummy.volume = 0.01;
        dummy.play().catch(() => {});
      } catch {
        // Ignore
      }

      // 2. Unpause Web Speech if browser suspended it
      if ('speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          this.refreshVoices();
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
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Core Play Audio method: Plays high-quality audio file with instant response on Android & PC
  private playAudio(key: string, fallbackHindiText?: string) {
    if (typeof window === 'undefined') return;

    // Ensure audio pipeline is initialized
    this.init();

    // Stop currently playing voice clip
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentAudio = null;
    }

    // Try primary MP3 / WAV from static audio or API proxy
    const audioUrl = `/audio/${key}.mp3`;
    const audio = new Audio(audioUrl);
    this.currentAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((_err) => {
        // Fallback 1: Try .wav format
        const wavAudio = new Audio(`/audio/${key}.wav`);
        this.currentAudio = wavAudio;
        wavAudio.play().catch(() => {
          // Fallback 2: Try /api/tts endpoint
          const apiAudio = new Audio(`/api/tts?key=${encodeURIComponent(key)}&text=${encodeURIComponent(fallbackHindiText || '')}`);
          this.currentAudio = apiAudio;
          apiAudio.play().catch(() => {
            // Fallback 3: Web Speech API synthesis
            if (fallbackHindiText) {
              this.speakWithTeacherVoice(fallbackHindiText);
            }
          });
        });
      });
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

  // Select voice if using SpeechSynthesis fallback
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

    const hindiVoice = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      const name = v.name.toLowerCase();
      return lang.startsWith('hi') || name.includes('hindi') || name.includes('हिन्दी');
    });
    if (hindiVoice) {
      return { voice: hindiVoice, hasHindi: true, lang: hindiVoice.lang || 'hi-IN' };
    }

    const indianEnglish = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      return lang === 'en-in' || lang.startsWith('en-in');
    });
    if (indianEnglish) {
      return { voice: indianEnglish, hasHindi: false, lang: 'en-IN' };
    }

    return { voice: voices[0] || null, hasHindi: false, lang: voices[0]?.lang || 'en-US' };
  }

  // Web Speech Fallback Method
  private speakWithTeacherVoice(hindiText: string, rate = 0.88, pitch = 1.15) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const { voice, lang } = this.getVoiceInfo();
      const textToSpeak = hindiText.trim();
      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang;
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1.0;

      this.activeUtterances.add(utterance);
      const cleanup = () => {
        this.activeUtterances.delete(utterance);
      };
      utterance.onend = cleanup;
      utterance.onerror = cleanup;

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }

  // Teacher Voice Greeting & Test (Instantly playable on Android phone & PC)
  speakTestGreeting(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);
    this.playAudio('test_greeting', 'नमस्ते बच्चों! चलो मिलकर पढ़ाई करते हैं!');
  }

  // 1. Word Builder: Word completion spoken clearly with Hindi translation
  speakHindiWordMeaning(word: string, soundEnabled = true) {
    if (!soundEnabled) return;

    const key = `word_${word.toLowerCase()}`;
    const HINDI_DATA: Record<string, string> = {
      CAT: 'सी, ए, टी. कैट मतलब बिल्ली. शाबाश बच्चों!',
      BAT: 'बी, ए, टी. बैट मतलब बल्ला. शाबाश बच्चों!',
      RAT: 'आर, ए, टी. रैट मतलब चूहा. शाबाश बच्चों!',
      HAT: 'एच, ए, टी. हैट मतलब टोपी. शाबाश बच्चों!',
      FAN: 'एफ, ए, एन. फैन मतलब पंखा. शाबाश बच्चों!',
      MAN: 'एम, ए, एन. मैन मतलब आदमी. शाबाश बच्चों!',
      VAN: 'वी, ए, एन. वैन मतलब गाड़ी. शाबाश बच्चों!',
      CAN: 'सी, ए, एन. कैन मतलब डिब्बा. शाबाश बच्चों!',
      MAP: 'एम, ए, पी. मैप मतलब नक्शा. शाबाश बच्चों!',
      CAP: 'सी, ए, पी. कैप मतलब टोपी. शाबाश बच्चों!',
      TAP: 'टी, ए, पी. टैप मतलब नल. शाबाश बच्चों!',
      LAP: 'एल, ए, पी. लैप मतलब गोद. शाबाश बच्चों!',
      BALL: 'बी, ए, एल, एल. बॉल मतलब गेंद. शाबाश बच्चों!',
      HALL: 'एच, ए, एल, एल. हॉल मतलब बड़ा कमरा. शाबाश बच्चों!',
      WALL: 'डब्ल्यू, ए, एल, एल. वॉल मतलब दीवार. शाबाश बच्चों!',
      TALL: 'टी, ए, एल, एल. टॉल मतलब लंबा. शाबाश बच्चों!',
    };

    const text = HINDI_DATA[word.toUpperCase()] || `${word} शाबाश बच्चों!`;
    this.playAudio(key, text);
  }

  // 2. Fill in the Blank: Letter Dropped Correctly ("A ke baad B, bilkul sahi!")
  speakLetterDrop(letter: string, prevLetter?: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playSnap(soundEnabled);

    const letterUpper = letter.toUpperCase();
    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ़', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'ज़ेड',
    };

    let prev = prevLetter?.toUpperCase();
    if (!prev && letterUpper > 'A' && letterUpper <= 'Z') {
      prev = String.fromCharCode(letterUpper.charCodeAt(0) - 1);
    }

    if (prev && prev !== letterUpper) {
      const key = `after_${prev.toLowerCase()}_${letterUpper.toLowerCase()}`;
      const prevHi = HINDI_LETTERS[prev] || prev;
      const currHi = HINDI_LETTERS[letterUpper] || letterUpper;
      const phrase = `${prevHi} के बाद ${currHi}, बिल्कुल सही!`;
      this.playAudio(key, phrase);
    } else {
      const key = `first_${letterUpper.toLowerCase()}`;
      const currHi = HINDI_LETTERS[letterUpper] || letterUpper;
      const phrase = `${currHi}! बिल्कुल सही!`;
      this.playAudio(key, phrase);
    }
  }

  speakHindiLetterDrop(letter: string, prevLetter?: string, soundEnabled = true) {
    this.speakLetterDrop(letter, prevLetter, soundEnabled);
  }

  // 3. Fill in the Blank: Wrong letter attempt
  speakWrongDrop(_letter?: string, _expectedLetter?: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playFreezeError(soundEnabled);
    this.playAudio('wrong', 'ओहो! यह गलत है, फिर से कोशिश करो बच्चों!');
  }

  speakHindiWrongAnswer(soundEnabled = true) {
    this.speakWrongDrop(undefined, undefined, soundEnabled);
  }

  // 4. Balloon Pop: Target letter prompt
  speakTargetLetter(letter: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playAudio(`find_${letter.toLowerCase()}`, `बच्चों, अब ${letter} वाले गुब्बारे फोड़ो!`);
  }

  speakHindiTargetLetter(letter: string, soundEnabled = true) {
    this.speakTargetLetter(letter, soundEnabled);
  }

  // 5. Balloon Pop: Pop feedback
  speakBalloonPop(_letter: string, isCorrect: boolean, _targetLetter?: string, soundEnabled = true) {
    if (!soundEnabled) return;

    if (isCorrect) {
      this.playPop(soundEnabled);
      this.playAudio('balloon_pop', 'अरे वाह! गुब्बारा फूट गया! शाबाश!');
    } else {
      this.playFreezeError(soundEnabled);
      this.playAudio('balloon_wrong', 'ओहो! गलत गुब्बारा, सही अक्षर वाला गुब्बारा फोड़ो!');
    }
  }

  speakHindiBalloonPop(letter: string, isCorrect: boolean, targetLetter?: string, soundEnabled = true) {
    this.speakBalloonPop(letter, isCorrect, targetLetter, soundEnabled);
  }

  // 6. Click The Letter
  speakClickLetter(letter: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playSnap(soundEnabled);
    this.playAudio(`letter_${letter.toLowerCase()}`, `${letter}! बहुत अच्छे!`);
  }

  speakHindiLetterClick(letter: string, soundEnabled = true) {
    this.speakClickLetter(letter, soundEnabled);
  }

  // 7. Match The Word: Correct Pair Matched (e.g. "A for Apple", "B for Ball")
  speakMatchPair(letter: string, word: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);

    const letterUpper = letter.toUpperCase();
    const MATCH_PHRASES: Record<string, string> = {
      A: 'ए फॉर एप्पल! बहुत बढ़िया!',
      B: 'बी फॉर बॉल! बहुत बढ़िया!',
      C: 'सी फॉर कैट! बहुत बढ़िया!',
      D: 'डी फॉर डॉग! बहुत बढ़िया!',
      E: 'ई फॉर एलिफेंट! बहुत बढ़िया!',
      F: 'एफ़ फॉर फिश! बहुत बढ़िया!',
      G: 'जी फॉर ग्रेप्स! बहुत बढ़िया!',
      H: 'एच फॉर हैट! बहुत बढ़िया!',
      I: 'आई फॉर आइसक्रीम! बहुत बढ़िया!',
      J: 'जे फॉर जग! बहुत बढ़िया!',
      K: 'के फॉर काइट! बहुत बढ़िया!',
      L: 'एल फॉर लायन! बहुत बढ़िया!',
      M: 'एम फॉर मैंगो! बहुत बढ़िया!',
      N: 'एन फॉर नेस्ट! बहुत बढ़िया!',
      O: 'ओ फॉर ऑरेंज! बहुत बढ़िया!',
      P: 'पी फॉर पैरट! बहुत बढ़िया!',
      Q: 'क्यू फॉर क्वीन! बहुत बढ़िया!',
      R: 'आर फॉर रोज़! बहुत बढ़िया!',
      S: 'एस फॉर सन! बहुत बढ़िया!',
      T: 'टी फॉर टाइगर! बहुत बढ़िया!',
      U: 'यू फॉर अम्ब्रेला! बहुत बढ़िया!',
      V: 'वी फॉर वैन! बहुत बढ़िया!',
      W: 'डब्ल्यू फॉर वॉच! बहुत बढ़िया!',
      X: 'एक्स फॉर ज़ायलोफ़ोन! बहुत बढ़िया!',
      Y: 'वाई फॉर याक! बहुत बढ़िया!',
      Z: 'ज़ेड फॉर ज़ेबरा! बहुत बढ़िया!',
    };

    const key = `match_for_${letterUpper.toLowerCase()}`;
    const fallbackText = MATCH_PHRASES[letterUpper] || `${letter} for ${word}! बहुत बढ़िया!`;
    this.playAudio(key, fallbackText);
  }

  speakMatchWord(letter: string, word: string, soundEnabled = true) {
    this.speakMatchPair(letter, word, soundEnabled);
  }

  // 8. Match The Word: Wrong match pair
  speakMatchWrong(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playFreezeError(soundEnabled);
    this.playAudio('wrong', 'ओहो! यह गलत है, फिर से कोशिश करो बच्चों!');
  }

  // Web Audio Synthesizer Sounds
  playPop(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
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
    } catch {
      // Ignore
    }
  }

  playSnap(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
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
    } catch {
      // Ignore
    }
  }

  playFreezeError(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
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
    } catch {
      // Ignore
    }
  }

  playError(soundEnabled = true) {
    this.playFreezeError(soundEnabled);
  }

  playWordDestroy(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
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
    } catch {
      // Ignore
    }
  }

  playVictory(soundEnabled = true) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
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
    } catch {
      // Ignore
    }
  }
}

export const sounds = new SoundManager();
