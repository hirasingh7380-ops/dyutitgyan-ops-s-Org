// Web Audio API Synthesizer for rich mobile game sound effects

class SoundManager {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Hindi Voice Speech Synthesis - Word Builder
  speakHindiWordMeaning(word: string, soundEnabled = true) {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Wake up audio context and play fanfare chime
    this.playWordDestroy(soundEnabled);

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const HINDI_DATA: Record<string, { spell: string; word: string; hindi: string }> = {
      CAT: { spell: 'सी ए टी', word: 'Cat', hindi: 'बिल्ली' },
      BAT: { spell: 'बी ए टी', word: 'Bat', hindi: 'बल्ला' },
      RAT: { spell: 'आर ए टी', word: 'Rat', hindi: 'चूहा' },
      HAT: { spell: 'एच ए टी', word: 'Hat', hindi: 'टोपी' },
      FAN: { spell: 'एफ ए एन', word: 'Fan', hindi: 'पंखा' },
      MAN: { spell: 'एम ए एन', word: 'Man', hindi: 'आदमी' },
      VAN: { spell: 'वी ए एन', word: 'Van', hindi: 'गाड़ी' },
      CAN: { spell: 'सी ए एन', word: 'Can', hindi: 'डिब्बा' },
      MAP: { spell: 'एम ए पी', word: 'Map', hindi: 'नक्शा' },
      CAP: { spell: 'सी ए पी', word: 'Cap', hindi: 'टोपी' },
      TAP: { spell: 'टी ए पी', word: 'Tap', hindi: 'नल' },
      LAP: { spell: 'एल ए पी', word: 'Lap', hindi: 'गोद' },
      BALL: { spell: 'बी ए एल एल', word: 'Ball', hindi: 'गेंद' },
      HALL: { spell: 'एच ए एल एल', word: 'Hall', hindi: 'बड़ा कमरा' },
      WALL: { spell: 'डब्ल्यू ए एल एल', word: 'Wall', hindi: 'दीवार' },
      TALL: { spell: 'टी ए एल एल', word: 'Tall', hindi: 'लंबा' },
    };

    const item = HINDI_DATA[word.toUpperCase()] || { spell: word, word: word, hindi: word };
    // Cheerful, fast & clear Hindi kid phrase matching same voice
    const speechText = `${item.spell}, ${item.word}! ${item.word} मतलब ${item.hindi}! शाबाश!`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.15; // Snappy, clear speech rate
    utterance.pitch = 1.35; // Cheerful voice pitch
    utterance.volume = 1.0;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Speak utterance
    window.speechSynthesis.speak(utterance);
  }

  // Speak when letter is dropped in Fill in the Blank mode
  speakHindiLetterDrop(letter: string, prevLetter?: string, soundEnabled = true) {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.playWordDestroy(soundEnabled);
    window.speechSynthesis.cancel();

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const lName = HINDI_LETTERS[letter.toUpperCase()] || letter;
    const pName = prevLetter ? (HINDI_LETTERS[prevLetter.toUpperCase()] || prevLetter) : null;

    let speechText = `बिल्कुल सही! ${lName}! शाबाश!`;
    if (pName) {
      speechText = `बिल्कुल सही! ${pName} के बाद ${lName}! बहुत बढ़िया!`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.15;
    utterance.pitch = 1.35;
    utterance.volume = 1.0;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Speak wrong answer response
  speakHindiWrongAnswer(soundEnabled = true) {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.playError(soundEnabled);
    window.speechSynthesis.cancel();

    const wrongPhrases = [
      'ओहो! गलत है! दूसरा अक्षर चुनो!',
      'फिर से कोशिश करो!',
      'अरे नहीं! सही अक्षर चुनो!',
    ];
    const phrase = wrongPhrases[Math.floor(Math.random() * wrongPhrases.length)];

    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 1.15;
    utterance.pitch = 1.35;
    utterance.volume = 1.0;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Speak response when popping a balloon
  speakHindiBalloonPop(letter: string, isCorrect: boolean, targetLetter: string, soundEnabled = true) {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isCorrect) {
      this.playWordDestroy(soundEnabled);
    } else {
      this.playError(soundEnabled);
    }

    window.speechSynthesis.cancel();

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
      speechText = `अरे वाह! ${lName} फोड़ दिया! बिल्कुल सही! शाबाश!`;
    } else {
      speechText = `ओहो! यह ${lName} है! हमें ${targetName} फोड़ना था! फिर से कोशिश करो!`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.35;
    utterance.volume = 1.0;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Speak announcement when balloon pop target letter changes
  speakHindiTargetLetter(targetLetter: string, soundEnabled = true) {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.playSnap(soundEnabled);
    window.speechSynthesis.cancel();

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const targetName = HINDI_LETTERS[targetLetter.toUpperCase()] || targetLetter;
    const speechText = `अब ${targetName} वाले गुब्बारे फोड़ो! ${targetName}!`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.35;
    utterance.volume = 1.0;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Speak letter name when clicked in Click Letter game mode
  speakHindiLetterClick(letter: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };
    const letterName = HINDI_LETTERS[letter.toUpperCase()] || letter;

    const utterance = new SpeechSynthesisUtterance(letterName);
    utterance.rate = 1.0;
    utterance.pitch = 1.35;
    utterance.volume = 1.0;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  private getBestVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prioritize Hindi / Indian English / Natural Female voices for natural energetic audio
    return (
      voices.find((v) => v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')) ||
      voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('hi_in')) ||
      voices.find((v) => v.name.toLowerCase().includes('google') && v.lang.toLowerCase().includes('en')) ||
      voices.find((v) => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('female')) ||
      voices[0]
    );
  }

  // Speak e.g. "A for Apple" when correctly matched in Match The Word
  speakMatchWord(letter: string, wordName: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const HINDI_LETTERS: Record<string, string> = {
      A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
      I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
      Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
      X: 'एक्स', Y: 'वाई', Z: 'जेड',
    };

    const letterName = HINDI_LETTERS[letter.toUpperCase()] || letter;
    const textToSpeak = `${letterName} फॉर ${wordName}! शाबाश!`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.15; // Natural snappy speech rate
    utterance.pitch = 1.35; // Cheerful enthusiastic tone
    utterance.volume = 1.0;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Speak wrong match phrase in Match The Word
  speakMatchWrong(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playError(soundEnabled);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const wrongPhrases = [
      'ओहो! गलत जोड़ी है! सही चित्र से मिलाओ!',
      'फिर से कोशिश करो!',
      'अरे नहीं! सही अक्षर से मिलाओ!',
    ];
    const phrase = wrongPhrases[Math.floor(Math.random() * wrongPhrases.length)];

    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 1.15;
    utterance.pitch = 1.35;
    utterance.volume = 1.0;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

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
