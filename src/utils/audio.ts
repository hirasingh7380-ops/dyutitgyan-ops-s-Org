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

    // Stop currently playing voice clip and any queued Web Speech
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }

    // Try primary MP3 from public/audio
    const audioUrl = `/audio/${key}.mp3`;
    const audio = new Audio(audioUrl);
    this.currentAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((_err) => {
        // Fallback: If audio file is blocked or unavailable on mobile, use Web Speech synthesis immediately
        if (fallbackHindiText) {
          this.speakWithTeacherVoice(fallbackHindiText);
        }
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

  // Web Speech Fallback Method - Optimized for Android phones
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

      // Hold reference on window to prevent Android Chrome V8 garbage collection mid-speech
      const win = window as unknown as { __activeUtterances?: Set<SpeechSynthesisUtterance> };
      win.__activeUtterances = win.__activeUtterances || new Set();
      win.__activeUtterances.add(utterance);

      const cleanup = () => {
        win.__activeUtterances?.delete(utterance);
      };
      utterance.onend = cleanup;
      utterance.onerror = cleanup;

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
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
    if (!soundEnabled) return;
    if (isCorrect) {
      this.playPop(soundEnabled);
      this.playAudio(`hindi_pop_${encodeURIComponent(letter)}`, `शाबाश! ${letter} वाला गुब्बारा फूट गया!`);
    } else {
      this.playFreezeError(soundEnabled);
      this.playAudio(`hindi_wrong_pop`, `ओहो! यह गलत गुब्बारा है, ${targetLetter ? targetLetter + ' वाला' : 'सही'} गुब्बारा फोड़ो!`);
    }
  }

  // 6. Click The Letter
  speakClickLetter(letter: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playSnap(soundEnabled);
    this.playAudio(`letter_${letter.toLowerCase()}`, `${letter}! बहुत अच्छे!`);
  }

  speakHindiLetterClick(letter: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playSnap(soundEnabled);
    this.playAudio(`hindi_letter_${encodeURIComponent(letter)}`, `${letter}! बहुत अच्छे! शाबाश!`);
  }

  // Hindi Target Letter Prompt
  speakHindiTargetLetter(letter: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playAudio(`hindi_target_${encodeURIComponent(letter)}`, `बच्चों, अब ${letter} वाले गुब्बारे फोड़ो!`);
  }

  // Hindi Match Pair
  speakHindiMatchPair(letter: string, wordName: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);
    const phrase = `${letter} से ${wordName}! बहुत बढ़िया! शाबाश!`;
    this.playAudio(`hindi_match_${encodeURIComponent(letter)}`, phrase);
  }

  // Hindi Greeting for Hindi Menu
  speakHindiGreeting(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);
    this.playAudio('hindi_greeting', 'नमस्ते बच्चों! चलो मिलकर हिंदी वर्णमाला सीखते हैं!');
  }

  // Math Greeting for Math Menu
  speakMathGreeting(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);
    this.playAudio('math_greeting', 'नमस्ते बच्चों! चलो मिलकर 1 से 50 तक गणित और गिनती सीखते हैं!');
  }

  // Math Number Click: speaks e.g. "1, एक! बहुत अच्छे!"
  speakMathNumberClick(n: number, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playSnap(soundEnabled);
    const HINDI_NUMBERS = [
      '', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
      'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
      'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाइस', 'उनतीस', 'तीस',
      'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
      'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास'
    ];
    const hName = HINDI_NUMBERS[n] || String(n);
    this.playAudio(`math_num_${n}`, `${n}, ${hName}! बहुत अच्छे!`);
  }

  // Math Target Number Prompt for Balloon Pop
  speakMathTargetNumber(n: number, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playAudio(`math_target_${n}`, `बच्चों, अब नंबर ${n} वाला गुब्बारा फोड़ो!`);
  }

  // Math Balloon Pop Feedback
  speakMathBalloonPop(n: number, isCorrect: boolean, targetN?: number, soundEnabled = true) {
    if (!soundEnabled) return;
    if (isCorrect) {
      this.playPop(soundEnabled);
      this.playAudio(`math_pop_${n}`, `शाबाश! नंबर ${n} वाला गुब्बारा फूट गया!`);
    } else {
      this.playFreezeError(soundEnabled);
      this.playAudio('math_wrong', `ओहो! यह गलत गुब्बारा है, नंबर ${targetN || 'सही'} वाला गुब्बारा फोड़ो!`);
    }
  }

  // Math Fill in the Blank Drop / Click
  speakMathNumberDrop(curr: number, prev?: number, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playSnap(soundEnabled);
    if (prev !== undefined && prev !== curr) {
      this.playAudio(`math_after_${prev}_${curr}`, `${prev} के बाद ${curr}, बिल्कुल सही!`);
    } else if (curr > 1) {
      this.playAudio(`math_after_${curr - 1}_${curr}`, `${curr - 1} के बाद ${curr}, बिल्कुल सही!`);
    } else {
      this.playAudio('math_first_1', '1, एक! बिल्कुल सही!');
    }
  }

  // Math Wrong Answer
  speakMathWrongAnswer(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playFreezeError(soundEnabled);
    this.playAudio('math_wrong', 'ओहो! यह गलत संख्या है, फिर से कोशिश करो बच्चों!');
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

  // 9. Math Match The Word: Match number word with digit (1 to 20)
  speakMathMatchPair(num: number, word: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playVictory(soundEnabled);
    const HINDI_NUMBERS = [
      '', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
      'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस'
    ];
    const hName = HINDI_NUMBERS[num] || String(num);
    const key = `math_match_${num}`;
    const fallback = `${word}! नंबर ${num}, ${hName}! बिल्कुल सही!`;
    this.playAudio(key, fallback);
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

  // 10. Drawing Stage: Shikshika (Teacher) Voice for Android Mobile & PC
  speakDrawingIntro(soundEnabled = true, stage: 'mango' | 'tulip' | 'airplane' | 'elephant' | 'banana' | 'scissors' | 'purse' | 'glasses' | 'tractor' | 'cake' | 'candle' | 'house' | 'boat' | 'bus' | 'pinwheel' | 'caterpillar' | 'hen' | 'icecream' | 'lollipop' | 'duck' | 'flower' | 'umbrella' | 'hat' | 'ball' | 'butterfly' | 'jug' | 'capsicum' | 'apple' | 'kite' | 'brinjal' = 'mango') {
    if (!soundEnabled) return;
    let text = 'बच्चों, रंग चुनो और कटिंग इमेज को सही जगह पर लगाओ!';
    if (stage === 'mango') {
      text = 'बच्चों, रंग चुनो और कटिंग आम को सही जगह पर लगाओ!';
    } else if (stage === 'tulip') {
      text = 'बच्चों, रंग चुनो और कटिंग ट्यूलिप फूल को सही जगह पर लगाओ!';
    } else if (stage === 'airplane') {
      text = 'बच्चों, रंग चुनो और कटिंग हवाई जहाज़ को सही जगह पर लगाओ!';
    } else if (stage === 'elephant') {
      text = 'बच्चों, रंग चुनो और कटिंग हाथी को सही जगह पर लगाओ!';
    } else if (stage === 'banana') {
      text = 'बच्चों, रंग चुनो और कटिंग केले को सही जगह पर लगाओ!';
    } else if (stage === 'scissors') {
      text = 'बच्चों, रंग चुनो और कटिंग कैंची को सही जगह पर लगाओ!';
    } else if (stage === 'purse') {
      text = 'बच्चों, रंग चुनो और कटिंग पर्स को सही जगह पर लगाओ!';
    } else if (stage === 'glasses') {
      text = 'बच्चों, रंग चुनो और कटिंग चश्मा को सही जगह पर लगाओ!';
    } else if (stage === 'tractor') {
      text = 'बच्चों, रंग चुनो और कटिंग ट्रैक्टर को सही जगह पर लगाओ!';
    } else if (stage === 'cake') {
      text = 'बच्चों, रंग चुनो और कटिंग केक को सही जगह पर लगाओ!';
    } else if (stage === 'candle') {
      text = 'बच्चों, रंग चुनो और कटिंग मोमबत्ती को सही जगह पर लगाओ!';
    } else if (stage === 'house') {
      text = 'बच्चों, रंग चुनो और कटिंग घर को सही जगह पर लगाओ!';
    } else if (stage === 'boat') {
      text = 'बच्चों, रंग चुनो और कटिंग नाव को सही जगह पर लगाओ!';
    } else if (stage === 'bus') {
      text = 'बच्चों, रंग चुनो और कटिंग बस को सही जगह पर लगाओ!';
    } else if (stage === 'pinwheel') {
      text = 'बच्चों, रंग चुनो और कटिंग फिरकी को सही जगह पर लगाओ!';
    } else if (stage === 'caterpillar') {
      text = 'बच्चों, रंग चुनो और कटिंग कैटरपिलर को सही जगह पर लगाओ!';
    } else if (stage === 'hen') {
      text = 'बच्चों, रंग चुनो और कटिंग मुर्गी को सही जगह पर लगाओ!';
    } else if (stage === 'icecream') {
      text = 'बच्चों, रंग चुनो और कटिंग आइसक्रीम को सही जगह पर लगाओ!';
    } else if (stage === 'lollipop') {
      text = 'बच्चों, रंग चुनो और कटिंग लॉलीपॉप को सही जगह पर लगाओ!';
    } else if (stage === 'duck') {
      text = 'बच्चों, रंग चुनो और कटिंग बतख को सही जगह पर लगाओ!';
    } else if (stage === 'flower') {
      text = 'बच्चों, रंग चुनो और कटिंग फूल को सही जगह पर लगाओ!';
    } else if (stage === 'umbrella') {
      text = 'बच्चों, रंग चुनो और कटिंग छतरी को सही जगह पर लगाओ!';
    } else if (stage === 'hat') {
      text = 'बच्चों, रंग चुनो और कटिंग टोपी को सही जगह पर लगाओ!';
    } else if (stage === 'ball') {
      text = 'बच्चों, रंग चुनो और कटिंग गेंद को सही जगह पर लगाओ!';
    } else if (stage === 'butterfly') {
      text = 'बच्चों, रंग चुनो और कटिंग तितली को सही जगह पर लगाओ!';
    } else if (stage === 'jug') {
      text = 'बच्चों, रंग चुनो और कटिंग जग को सही जगह पर लगाओ!';
    } else if (stage === 'capsicum') {
      text = 'बच्चों, रंग चुनो और कटिंग शिमला मिर्च को सही जगह पर लगाओ!';
    } else if (stage === 'brinjal') {
      text = 'बच्चों, रंग चुनो और कटिंग बैंगन को सही जगह पर लगाओ!';
    } else if (stage === 'kite') {
      text = 'बच्चों, रंग चुनो और कटिंग पतंग को सही जगह पर लगाओ!';
    } else if (stage === 'apple') {
      text = 'बच्चों, रंग चुनो और कटिंग सेब को सही जगह पर लगाओ!';
    }
    this.playAudio(`drawing_intro_${stage}`, text);
  }

  speakDrawingColorSelected(colorId: string, soundEnabled = true) {
    if (!soundEnabled) return;
    this.playPop(soundEnabled);
    const HINDI_COLOR_MAP: Record<string, string> = {
      RED: 'लाल रंग! अब कटिंग इमेज को छुओ!',
      GREEN: 'हरा रंग! बहुत अच्छे!',
      BLUE: 'नीला रंग! बहुत बढ़िया!',
      YELLOW: 'पीला रंग! शाबाश!',
      PINK: 'गुलाबी रंग! बहुत सुंदर!',
      BLACK: 'काला रंग!',
    };
    const speech = HINDI_COLOR_MAP[colorId] || `${colorId} रंग!`;
    this.playAudio(`drawing_col_${colorId.toLowerCase()}`, speech);
  }

  speakDrawingPieceColored(
    piece: 'mango_stem' | 'mango_leaf_top' | 'mango_leaf_bot' | 'mango_body' | 'tulip_petal_top' | 'tulip_petal_left_inner' | 'tulip_petal_right_inner' | 'tulip_petal_left' | 'tulip_petal_center' | 'tulip_petal_right' | 'tulip_stem' | 'tulip_leaf_left' | 'tulip_leaf_right' | 'airplane_body' | 'airplane_cockpit' | 'airplane_wing_left' | 'airplane_engine_l1' | 'airplane_engine_l2' | 'airplane_wing_right' | 'airplane_engine_r1' | 'airplane_engine_r2' | 'airplane_tail' | 'elephant_head' | 'elephant_body' | 'elephant_tusk' | 'elephant_leg_back' | 'elephant_leg_front' | 'banana_stem' | 'banana_right_top' | 'banana_right_bot' | 'banana_left_top' | 'banana_left_bot' | 'banana_tip_right' | 'banana_tip_left' | 'scissors_blade_left' | 'scissors_blade_right' | 'scissors_pivot_ring' | 'scissors_pivot_screw' | 'scissors_handle' | 'purse_handle' | 'purse_ring_left' | 'purse_ring_right' | 'purse_flap' | 'purse_body' | 'purse_lock' | 'glasses_arm_left' | 'glasses_arm_right' | 'glasses_frame' | 'glasses_lens_left' | 'glasses_lens_right' | 'tractor_body' | 'tractor_win_left' | 'tractor_win_right' | 'tractor_exhaust' | 'tractor_fender' | 'tractor_tire_rear' | 'tractor_hub_rear' | 'tractor_tire_front' | 'tractor_hub_front' | 'cake_top' | 'cake_heart_top' | 'cake_heart_left' | 'cake_heart_right' | 'cake_layer_top' | 'cake_layer_bot' | 'cake_plate' | 'candle_flame' | 'candle_wick' | 'candle_wax' | 'candle_body' | 'house_chimney' | 'house_roof' | 'house_win_top' | 'house_wall' | 'house_win_bot' | 'house_door' | 'house_base_left' | 'house_base_right' | 'boat_mast' | 'boat_sail_ltop' | 'boat_sail_lmid' | 'boat_sail_lbot' | 'boat_sail_right' | 'boat_hull_top' | 'boat_hull_bot' | 'bus_body' | 'bus_win1' | 'bus_win2' | 'bus_win3' | 'bus_win4' | 'bus_wheel1' | 'bus_wheel2' | 'pinwheel_blade_tl' | 'pinwheel_blade_tr' | 'pinwheel_center' | 'pinwheel_blade_br' | 'pinwheel_blade_bl' | 'pinwheel_stick' | 'caterpillar_head' | 'caterpillar_seg1' | 'caterpillar_seg2' | 'caterpillar_seg3' | 'caterpillar_seg4' | 'hen_comb' | 'hen_head' | 'hen_beak' | 'hen_wattle' | 'hen_body' | 'hen_foot_left' | 'hen_foot_right' | 'icecream_top' | 'icecream_body' | 'icecream_stick' | 'lollipop_top' | 'lollipop_band' | 'lollipop_bottom' | 'lollipop_stick' | 'duck_body' | 'duck_wing' | 'duck_beak' | 'duck_foot_left' | 'duck_foot_right' | 'flower_center' | 'flower_petal_top' | 'flower_petal_top_right' | 'flower_petal_bottom_right' | 'flower_petal_bottom' | 'flower_petal_bottom_left' | 'flower_petal_top_left' | 'leaf' | 'body' | 'kite_quad' | 'kite_tail' | 'brinjal_calyx' | 'brinjal_body' | 'capsicum_body' | 'capsicum_stem' | 'capsicum_lobe' | 'jug_body' | 'jug_handle' | 'jug_rim' | 'jug_base' | 'butterfly_body' | 'butterfly_wing_tl' | 'butterfly_wing_bl' | 'butterfly_wing_tr' | 'butterfly_wing_br' | 'ball_cap' | 'ball_top_mid' | 'ball_top_right' | 'ball_top_left' | 'ball_bottom_left' | 'ball_bottom_center' | 'ball_bottom_right' | 'hat_crown' | 'hat_band' | 'hat_brim' | 'umbrella_canopy_left' | 'umbrella_canopy_mid' | 'umbrella_canopy_right' | 'umbrella_handle',
    soundEnabled = true
  ) {
    if (!soundEnabled) return;
    this.playSnap(soundEnabled);
    let text = 'रंग भर दिया, शाबाश!';
    if (piece === 'mango_stem') text = 'आम के डंठल में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'mango_leaf_top') text = 'पत्ती के ऊपरी हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'mango_leaf_bot') text = 'पत्ती के निचले हिस्से में रंग भर दिया, बहुत खूब!';
    else if (piece === 'mango_body') text = 'रसीले आम में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'tulip_petal_top') text = 'ऊपरी पंखुड़ी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'tulip_petal_left_inner') text = 'बाईं ऊपरी पंखुड़ी में रंग भर दिया, शाबाश!';
    else if (piece === 'tulip_petal_right_inner') text = 'दाईं ऊपरी पंखुड़ी में रंग भर दिया, बहुत खूब!';
    else if (piece === 'tulip_petal_left') text = 'बाईं पंखुड़ी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'tulip_petal_center') text = 'बीच वाली पंखुड़ी में रंग भर दिया, शाबाश!';
    else if (piece === 'tulip_petal_right') text = 'दाईं पंखुड़ी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'tulip_stem') text = 'फूल की डंडी में रंग भर दिया, बहुत खूब!';
    else if (piece === 'tulip_leaf_left') text = 'बाईं पत्ती में रंग भर दिया, शाबाश!';
    else if (piece === 'tulip_leaf_right') text = 'दाईं पत्ती में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'airplane_body') text = 'हवाई जहाज़ के शरीर में रंग भर दिया, शाबाश!';
    else if (piece === 'airplane_cockpit') text = 'कॉकपिट की खिड़की में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'airplane_wing_left') text = 'बाएँ पंख में रंग भर दिया, बहुत खूब!';
    else if (piece === 'airplane_engine_l1') text = 'बाएँ बाहरी इंजन में रंग भर दिया, शाबाश!';
    else if (piece === 'airplane_engine_l2') text = 'बाएँ भीतरी इंजन में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'airplane_wing_right') text = 'दाएँ पंख में रंग भर दिया, बहुत खूब!';
    else if (piece === 'airplane_engine_r1') text = 'दाएँ भीतरी इंजन में रंग भर दिया, शाबाश!';
    else if (piece === 'airplane_engine_r2') text = 'दाएँ बाहरी इंजन में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'airplane_tail') text = 'जहाज़ की पूंछ में रंग भर दिया, बहुत खूब!';
    else if (piece === 'elephant_head') text = 'हाथी के सिर और सूँड़ में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'elephant_body') text = 'हाथी के शरीर में रंग भर दिया, शाबाश!';
    else if (piece === 'elephant_tusk') text = 'हाथी के दाँत में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'elephant_leg_back') text = 'हाथी के पिछले पैर में रंग भर दिया, बहुत खूब!';
    else if (piece === 'elephant_leg_front') text = 'हाथी के अगले पैर में रंग भर दिया, शाबाश!';
    else if (piece === 'banana_stem') text = 'केले के डंठल में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'banana_right_top') text = 'दाएँ केले के ऊपरी हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'banana_right_bot') text = 'दाएँ केले के निचले हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'banana_left_top') text = 'बाएँ केले के ऊपरी हिस्से में रंग भर दिया, बहुत खूब!';
    else if (piece === 'banana_left_bot') text = 'बाएँ केले के निचले हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'banana_tip_right') text = 'दाएँ केले के सिरे में रंग भर दिया, शाबाश!';
    else if (piece === 'banana_tip_left') text = 'बाएँ केले के सिरे में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'scissors_blade_left') text = 'कैंची की बाईं धार में रंग भर दिया, शाबाश!';
    else if (piece === 'scissors_blade_right') text = 'कैंची की दाईं धार में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'scissors_pivot_ring') text = 'कैंची के बीच वाले हिस्से में रंग भर दिया, बहुत खूब!';
    else if (piece === 'scissors_pivot_screw') text = 'कैंची के पेंच में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'scissors_handle') text = 'कैंची के हत्थे में रंग भर दिया, शाबाश!';
    else if (piece === 'purse_handle') text = 'पर्स के हैंडल में रंग भर दिया, शाबाश!';
    else if (piece === 'purse_ring_left') text = 'पर्स के बाएँ छल्ले में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'purse_ring_right') text = 'पर्स के दाएँ छल्ले में रंग भर दिया, बहुत खूब!';
    else if (piece === 'purse_flap') text = 'पर्स के फ्लैप में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'purse_body') text = 'पर्स के निचले हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'purse_lock') text = 'पर्स के लॉक में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'glasses_arm_left') text = 'चश्मे की बाईं डंडी में रंग भर दिया, शाबाश!';
    else if (piece === 'glasses_arm_right') text = 'चश्मे की दाईं डंडी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'glasses_frame') text = 'चश्मे के फ्रेम में रंग भर दिया, बहुत खूब!';
    else if (piece === 'glasses_lens_left') text = 'चश्मे के बाएँ शीशे में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'glasses_lens_right') text = 'चश्मे के दाएँ शीशे में रंग भर दिया, शाबाश!';
    else if (piece === 'tractor_body') text = 'ट्रैक्टर के शरीर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'tractor_win_left') text = 'पीछे की खिड़की में रंग भर दिया, शाबाश!';
    else if (piece === 'tractor_win_right') text = 'सामने की खिड़की में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'tractor_exhaust') text = 'साइलेंसर में रंग भर दिया, बहुत खूब!';
    else if (piece === 'tractor_fender') text = 'मडगार्ड में रंग भर दिया, शाबाश!';
    else if (piece === 'tractor_tire_rear') text = 'बड़े टायर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'tractor_hub_rear') text = 'बड़े पहिये के बीच में रंग भर दिया, शाबाश!';
    else if (piece === 'tractor_tire_front') text = 'छोटे टायर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'tractor_hub_front') text = 'छोटे पहिये के बीच में रंग भर दिया, बहुत खूब!';
    else if (piece === 'cake_top') text = 'केक के ऊपरी हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'cake_heart_top') text = 'छोटे दिल में रंग भर दिया, शाबाश!';
    else if (piece === 'cake_heart_left') text = 'बड़े दिल में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'cake_heart_right') text = 'दाएँ दिल में रंग भर दिया, बहुत खूब!';
    else if (piece === 'cake_layer_top') text = 'क्रीम की परत में रंग भर दिया, शाबाश!';
    else if (piece === 'cake_layer_bot') text = 'केक के निचले हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'cake_plate') text = 'प्लेट में रंग भर दिया, शाबाश!';
    else if (piece === 'candle_flame') text = 'मोमबत्ती की लौ में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'candle_wick') text = 'मोमबत्ती की बत्ती में रंग भर दिया, शाबाश!';
    else if (piece === 'candle_wax') text = 'पिघले मोम में रंग भर दिया, बहुत खूब!';
    else if (piece === 'candle_body') text = 'मोमबत्ती के शरीर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'house_chimney') text = 'चिमनी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'house_roof') text = 'घर की छत में रंग भर दिया, शाबाश!';
    else if (piece === 'house_win_top') text = 'ऊपरी खिड़की में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'house_wall') text = 'घर की दीवार में रंग भर दिया, बहुत खूब!';
    else if (piece === 'house_win_bot') text = 'निचली खिड़की में रंग भर दिया, शाबाश!';
    else if (piece === 'house_door') text = 'दरवाज़े में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'house_base_left') text = 'बाईं नींव में रंग भर दिया, शाबाश!';
    else if (piece === 'house_base_right') text = 'दाईं नींव में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'boat_mast') text = 'नाव के डंडे में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'boat_sail_ltop') text = 'बाएँ ऊपरी हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'boat_sail_lmid') text = 'बाएँ बीच वाले हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'boat_sail_lbot') text = 'बाएँ निचले हिस्से में रंग भर दिया, बहुत खूब!';
    else if (piece === 'boat_sail_right') text = 'दाएँ पाल में रंग भर दिया, शाबाश!';
    else if (piece === 'boat_hull_top') text = 'नाव की ऊपरी पट्टी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'boat_hull_bot') text = 'नाव के निचले हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'bus_body') text = 'बस के शरीर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'bus_win1') text = 'पहली खिड़की में रंग भर दिया, शाबाश!';
    else if (piece === 'bus_win2') text = 'दूसरी खिड़की में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'bus_win3') text = 'तीसरी खिड़की में रंग भर दिया, बहुत खूब!';
    else if (piece === 'bus_win4') text = 'चौथी खिड़की में रंग भर दिया, शाबाश!';
    else if (piece === 'bus_wheel1') text = 'पिछले पहिये में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'bus_wheel2') text = 'अगले पहिये में रंग भर दिया, शाबाश!';
    else if (piece === 'pinwheel_blade_tl') text = 'ऊपरी बाएँ पंख में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'pinwheel_blade_tr') text = 'ऊपरी दाएँ पंख में रंग भर दिया, शाबाश!';
    else if (piece === 'pinwheel_center') text = 'फिरकी के बीच वाले गोले में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'pinwheel_blade_br') text = 'निचले दाएँ पंख में रंग भर दिया, बहुत खूब!';
    else if (piece === 'pinwheel_blade_bl') text = 'निचले बाएँ पंख में रंग भर दिया, शाबाश!';
    else if (piece === 'pinwheel_stick') text = 'फिरकी की डंडी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'caterpillar_head') text = 'कैटरपिलर के चेहरे में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'caterpillar_seg1') text = 'पहले गोले में रंग भर दिया, शाबाश!';
    else if (piece === 'caterpillar_seg2') text = 'दूसरे गोले में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'caterpillar_seg3') text = 'तीसरे गोले में रंग भर दिया, बहुत खूब!';
    else if (piece === 'caterpillar_seg4') text = 'चौथे गोले में रंग भर दिया, शाबाश!';
    else if (piece === 'hen_comb') text = 'मुर्गी की कलगी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'hen_head') text = 'मुर्गी के सिर और गर्दन में रंग भर दिया, शाबाश!';
    else if (piece === 'hen_beak') text = 'मुर्गी की चोंच में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'hen_wattle') text = 'गले की कलगी में रंग भर दिया, बहुत खूब!';
    else if (piece === 'hen_body') text = 'मुर्गी के शरीर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'hen_foot_left') text = 'मुर्गी के बाएँ पैर में रंग भर दिया, शाबाश!';
    else if (piece === 'hen_foot_right') text = 'मुर्गी के दाएँ पैर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'icecream_top') text = 'आइसक्रीम के ऊपरी हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'icecream_body') text = 'आइसक्रीम के निचले हिस्से में रंग भर दिया, बहुत खूब!';
    else if (piece === 'icecream_stick') text = 'आइसक्रीम की डंडी में रंग भर दिया, शाबाश!';
    else if (piece === 'lollipop_top') text = 'लॉलीपॉप के ऊपरी हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'lollipop_band') text = 'बीच की पट्टी में रंग भर दिया, शाबाश!';
    else if (piece === 'lollipop_bottom') text = 'लॉलीपॉप के निचले हिस्से में रंग भर दिया, बहुत खूब!';
    else if (piece === 'lollipop_stick') text = 'लॉलीपॉप की डंडी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'duck_body') text = 'बतख के शरीर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'duck_wing') text = 'पंख में रंग भर दिया, बहुत खूब!';
    else if (piece === 'duck_beak') text = 'चोंच में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'duck_foot_left') text = 'बाएँ पैर में रंग भर दिया, शाबाश!';
    else if (piece === 'duck_foot_right') text = 'दाएँ पैर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'flower_center') text = 'फूल के बीच वाले हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'flower_petal_top') text = 'ऊपरी पंखुड़ी में रंग भर दिया, शाबाश!';
    else if (piece === 'flower_petal_top_right') text = 'ऊपरी दाईं पंखुड़ी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'flower_petal_bottom_right') text = 'निचली दाईं पंखुड़ी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'flower_petal_bottom') text = 'निचली पंखुड़ी में रंग भर दिया, शाबाश!';
    else if (piece === 'flower_petal_bottom_left') text = 'निचली बाईं पंखुड़ी में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'flower_petal_top_left') text = 'ऊपरी बाईं पंखुड़ी में रंग भर दिया, शाबाश!';
    else if (piece === 'leaf') text = 'पत्ती में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'body') text = 'सेब में रंग भर दिया, शाबाश!';
    else if (piece === 'kite_quad') text = 'पतंग के हिस्से में रंग भर दिया, बहुत खूब!';
    else if (piece === 'kite_tail') text = 'पतंग की पूंछ में रंग भर दिया, शाबाश!';
    else if (piece === 'brinjal_calyx') text = 'ताज में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'brinjal_body') text = 'बैंगन में रंग भर दिया, शाबाश!';
    else if (piece === 'capsicum_body') text = 'शिमला मिर्च में रंग भर दिया, शाबाश!';
    else if (piece === 'capsicum_stem') text = 'डंठल में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'capsicum_lobe') text = 'हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'jug_body') text = 'जग में रंग भर दिया, शाबाश!';
    else if (piece === 'jug_handle') text = 'हत्थे में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'jug_rim') text = 'किनारे में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'jug_base') text = 'पेंदे में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'butterfly_body') text = 'तितली के शरीर में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'butterfly_wing_tl') text = 'बाएँ ऊपरी पंख में रंग भर दिया, शाबाश!';
    else if (piece === 'butterfly_wing_bl') text = 'बाएँ निचले पंख में रंग भर दिया, शाबाश!';
    else if (piece === 'butterfly_wing_tr') text = 'दाएँ ऊपरी पंख में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'butterfly_wing_br') text = 'दाएँ निचले पंख में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'ball_cap') text = 'गेंद के केंद्र में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'ball_top_mid') text = 'गेंद के ऊपरी हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'ball_top_right') text = 'गेंद के ऊपरी दाएँ हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'ball_top_left') text = 'गेंद के ऊपरी बाएँ हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'ball_bottom_left') text = 'गेंद के निचले बाएँ हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'ball_bottom_center') text = 'गेंद के सामने वाले हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'ball_bottom_right') text = 'गेंद के निचले दाएँ हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'hat_crown') text = 'टोपी के ऊपरी हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'hat_band') text = 'टोपी की पट्टी में रंग भर दिया, शाबाश!';
    else if (piece === 'hat_brim') text = 'टोपी के निचले घेरे में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'umbrella_canopy_left') text = 'छतरी के बाएँ हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'umbrella_canopy_mid') text = 'छतरी के बीच वाले हिस्से में रंग भर दिया, शाबाश!';
    else if (piece === 'umbrella_canopy_right') text = 'छतरी के दाएँ हिस्से में रंग भर दिया, बहुत सुंदर!';
    else if (piece === 'umbrella_handle') text = 'छतरी के हैंडल में रंग भर दिया, बहुत सुंदर!';
    this.playAudio(`drawing_colored_${piece}`, text);
  }

  speakDrawingWrongDrop(soundEnabled = true) {
    if (!soundEnabled) return;
    this.playFreezeError(soundEnabled);
    this.playAudio('drawing_wrong_drop', 'ओहो! यह गलत जगह है, आउटलाइन में सही जगह लगाओ!');
  }

  speakDrawingPiecePlaced(
    piece: 'mango_stem' | 'mango_leaf_top' | 'mango_leaf_bot' | 'mango_body' | 'tulip_petal_top' | 'tulip_petal_left_inner' | 'tulip_petal_right_inner' | 'tulip_petal_left' | 'tulip_petal_center' | 'tulip_petal_right' | 'tulip_stem' | 'tulip_leaf_left' | 'tulip_leaf_right' | 'airplane_body' | 'airplane_cockpit' | 'airplane_wing_left' | 'airplane_engine_l1' | 'airplane_engine_l2' | 'airplane_wing_right' | 'airplane_engine_r1' | 'airplane_engine_r2' | 'airplane_tail' | 'elephant_head' | 'elephant_body' | 'elephant_tusk' | 'elephant_leg_back' | 'elephant_leg_front' | 'banana_stem' | 'banana_right_top' | 'banana_right_bot' | 'banana_left_top' | 'banana_left_bot' | 'banana_tip_right' | 'banana_tip_left' | 'scissors_blade_left' | 'scissors_blade_right' | 'scissors_pivot_ring' | 'scissors_pivot_screw' | 'scissors_handle' | 'purse_handle' | 'purse_ring_left' | 'purse_ring_right' | 'purse_flap' | 'purse_body' | 'purse_lock' | 'glasses_arm_left' | 'glasses_arm_right' | 'glasses_frame' | 'glasses_lens_left' | 'glasses_lens_right' | 'tractor_body' | 'tractor_win_left' | 'tractor_win_right' | 'tractor_exhaust' | 'tractor_fender' | 'tractor_tire_rear' | 'tractor_hub_rear' | 'tractor_tire_front' | 'tractor_hub_front' | 'cake_top' | 'cake_heart_top' | 'cake_heart_left' | 'cake_heart_right' | 'cake_layer_top' | 'cake_layer_bot' | 'cake_plate' | 'candle_flame' | 'candle_wick' | 'candle_wax' | 'candle_body' | 'house_chimney' | 'house_roof' | 'house_win_top' | 'house_wall' | 'house_win_bot' | 'house_door' | 'house_base_left' | 'house_base_right' | 'boat_mast' | 'boat_sail_ltop' | 'boat_sail_lmid' | 'boat_sail_lbot' | 'boat_sail_right' | 'boat_hull_top' | 'boat_hull_bot' | 'bus_body' | 'bus_win1' | 'bus_win2' | 'bus_win3' | 'bus_win4' | 'bus_wheel1' | 'bus_wheel2' | 'pinwheel_blade_tl' | 'pinwheel_blade_tr' | 'pinwheel_center' | 'pinwheel_blade_br' | 'pinwheel_blade_bl' | 'pinwheel_stick' | 'caterpillar_head' | 'caterpillar_seg1' | 'caterpillar_seg2' | 'caterpillar_seg3' | 'caterpillar_seg4' | 'hen_comb' | 'hen_head' | 'hen_beak' | 'hen_wattle' | 'hen_body' | 'hen_foot_left' | 'hen_foot_right' | 'icecream_top' | 'icecream_body' | 'icecream_stick' | 'lollipop_top' | 'lollipop_band' | 'lollipop_bottom' | 'lollipop_stick' | 'duck_body' | 'duck_wing' | 'duck_beak' | 'duck_foot_left' | 'duck_foot_right' | 'flower_center' | 'flower_petal_top' | 'flower_petal_top_right' | 'flower_petal_bottom_right' | 'flower_petal_bottom' | 'flower_petal_bottom_left' | 'flower_petal_top_left' | 'leaf' | 'body' | 'kite_quad' | 'kite_tail' | 'brinjal_calyx' | 'brinjal_body' | 'capsicum_body' | 'capsicum_stem' | 'capsicum_lobe' | 'jug_body' | 'jug_handle' | 'jug_rim' | 'jug_base' | 'butterfly_body' | 'butterfly_wing_tl' | 'butterfly_wing_bl' | 'butterfly_wing_tr' | 'butterfly_wing_br' | 'ball_cap' | 'ball_top_mid' | 'ball_top_right' | 'ball_top_left' | 'ball_bottom_left' | 'ball_bottom_center' | 'ball_bottom_right' | 'hat_crown' | 'hat_band' | 'hat_brim' | 'umbrella_canopy_left' | 'umbrella_canopy_mid' | 'umbrella_canopy_right' | 'umbrella_handle',
    soundEnabled = true
  ) {
    if (!soundEnabled) return;
    this.playSnap(soundEnabled);
    let text = 'शाबाश! सही जगह लग गई!';
    if (piece === 'mango_stem') text = 'शाबाश! आम का डंठल सही जगह लग गया!';
    else if (piece === 'mango_leaf_top') text = 'शाबाश! पत्ती का ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'mango_leaf_bot') text = 'शाबाश! पत्ती का निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'mango_body') text = 'शाबाश! आम सही जगह लग गया!';
    else if (piece === 'tulip_petal_top') text = 'शाबाश! ऊपरी पंखुड़ी सही जगह लग गई!';
    else if (piece === 'tulip_petal_left_inner') text = 'शाबाश! बाईं ऊपरी पंखुड़ी सही जगह लग गई!';
    else if (piece === 'tulip_petal_right_inner') text = 'शाबाश! दाईं ऊपरी पंखुड़ी सही जगह लग गई!';
    else if (piece === 'tulip_petal_left') text = 'शाबाश! बाईं पंखुड़ी सही जगह लग गई!';
    else if (piece === 'tulip_petal_center') text = 'शाबाश! बीच वाली पंखुड़ी सही जगह लग गई!';
    else if (piece === 'tulip_petal_right') text = 'शाबाश! दाईं पंखुड़ी सही जगह लग गई!';
    else if (piece === 'tulip_stem') text = 'शाबाश! फूल की डंडी सही जगह लग गई!';
    else if (piece === 'tulip_leaf_left') text = 'शाबाश! बाईं पत्ती सही जगह लग गई!';
    else if (piece === 'tulip_leaf_right') text = 'शाबाश! दाईं पत्ती सही जगह लग गई!';
    else if (piece === 'airplane_body') text = 'शाबाश! हवाई जहाज़ का शरीर सही जगह लग गया!';
    else if (piece === 'airplane_cockpit') text = 'शाबाश! कॉकपिट की खिड़की सही जगह लग गई!';
    else if (piece === 'airplane_wing_left') text = 'शाबाश! बायाँ पंख सही जगह लग गया!';
    else if (piece === 'airplane_engine_l1') text = 'शाबाश! बायाँ बाहरी इंजन सही जगह लग गया!';
    else if (piece === 'airplane_engine_l2') text = 'शाबाश! बायाँ भीतरी इंजन सही जगह लग गया!';
    else if (piece === 'airplane_wing_right') text = 'शाबाश! दायाँ पंख सही जगह लग गया!';
    else if (piece === 'airplane_engine_r1') text = 'शाबाश! दायाँ भीतरी इंजन सही जगह लग गया!';
    else if (piece === 'airplane_engine_r2') text = 'शाबाश! दायाँ बाहरी इंजन सही जगह लग गया!';
    else if (piece === 'airplane_tail') text = 'शाबाश! जहाज़ की पूंछ सही जगह लग गई!';
    else if (piece === 'elephant_head') text = 'शाबाश! हाथी का सिर सही जगह लग गया!';
    else if (piece === 'elephant_body') text = 'शाबाश! हाथी का शरीर सही जगह लग गया!';
    else if (piece === 'elephant_tusk') text = 'शाबाश! हाथी का दाँत सही जगह लग गया!';
    else if (piece === 'elephant_leg_back') text = 'शाबाश! हाथी का पिछला पैर सही जगह लग गया!';
    else if (piece === 'elephant_leg_front') text = 'शाबाश! हाथी का अगला पैर सही जगह लग गया!';
    else if (piece === 'banana_stem') text = 'शाबाश! केले का डंठल सही जगह लग गया!';
    else if (piece === 'banana_right_top') text = 'शाबाश! दाएँ केले का ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'banana_right_bot') text = 'शाबाश! दाएँ केले का निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'banana_left_top') text = 'शाबाश! बाएँ केले का ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'banana_left_bot') text = 'शाबाश! बाएँ केले का निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'banana_tip_right') text = 'शाबाश! दाएँ केले का सिरा सही जगह लग गया!';
    else if (piece === 'banana_tip_left') text = 'शाबाश! बाएँ केले का सिरा सही जगह लग गया!';
    else if (piece === 'scissors_blade_left') text = 'शाबाश! कैंची की बाईं धार सही जगह लग गई!';
    else if (piece === 'scissors_blade_right') text = 'शाबाश! कैंची की दाईं धार सही जगह लग गई!';
    else if (piece === 'scissors_pivot_ring') text = 'शाबाश! कैंची का बीच वाला हिस्सा सही जगह लग गया!';
    else if (piece === 'scissors_pivot_screw') text = 'शाबाश! कैंची का पेंच सही जगह लग गया!';
    else if (piece === 'scissors_handle') text = 'शाबाश! कैंची का हत्था सही जगह लग गया!';
    else if (piece === 'purse_handle') text = 'शाबाश! पर्स का हैंडल सही जगह लग गया!';
    else if (piece === 'purse_ring_left') text = 'शाबाश! पर्स का बायाँ छल्ला सही जगह लग गया!';
    else if (piece === 'purse_ring_right') text = 'शाबाश! पर्स का दायाँ छल्ला सही जगह लग गया!';
    else if (piece === 'purse_flap') text = 'शाबाश! पर्स का फ्लैप सही जगह लग गया!';
    else if (piece === 'purse_body') text = 'शाबाश! पर्स का निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'purse_lock') text = 'शाबाश! पर्स का लॉक सही जगह लग गया!';
    else if (piece === 'glasses_arm_left') text = 'शाबाश! चश्मे की बाईं डंडी सही जगह लग गई!';
    else if (piece === 'glasses_arm_right') text = 'शाबाश! चश्मे की दाईं डंडी सही जगह लग गई!';
    else if (piece === 'glasses_frame') text = 'शाबाश! चश्मे का फ्रेम सही जगह लग गया!';
    else if (piece === 'glasses_lens_left') text = 'शाबाश! चश्मे का बायाँ शीशा सही जगह लग गया!';
    else if (piece === 'glasses_lens_right') text = 'शाबाश! चश्मे का दायाँ शीशा सही जगह लग गया!';
    else if (piece === 'tractor_body') text = 'शाबाश! ट्रैक्टर का शरीर सही जगह लग गया!';
    else if (piece === 'tractor_win_left') text = 'शाबाश! पीछे की खिड़की सही जगह लग गई!';
    else if (piece === 'tractor_win_right') text = 'शाबाश! सामने की खिड़की सही जगह लग गई!';
    else if (piece === 'tractor_exhaust') text = 'शाबाश! साइलेंसर सही जगह लग गया!';
    else if (piece === 'tractor_fender') text = 'शाबाश! मडगार्ड सही जगह लग गया!';
    else if (piece === 'tractor_tire_rear') text = 'शाबाश! बड़ा टायर सही जगह लग गया!';
    else if (piece === 'tractor_hub_rear') text = 'शाबाश! बड़े पहिये का बीच वाला हिस्सा सही जगह लग गया!';
    else if (piece === 'tractor_tire_front') text = 'शाबाश! छोटा टायर सही जगह लग गया!';
    else if (piece === 'tractor_hub_front') text = 'शाबाश! छोटे पहिये का बीच वाला हिस्सा सही जगह लग गया!';
    else if (piece === 'cake_top') text = 'शाबाश! केक का ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'cake_heart_top') text = 'शाबाश! छोटा दिल सही जगह लग गया!';
    else if (piece === 'cake_heart_left') text = 'शाबाश! बड़ा दिल सही जगह लग गया!';
    else if (piece === 'cake_heart_right') text = 'शाबाश! दायाँ दिल सही जगह लग गया!';
    else if (piece === 'cake_layer_top') text = 'शाबाश! क्रीम की परत सही जगह लग गई!';
    else if (piece === 'cake_layer_bot') text = 'शाबाश! केक का निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'cake_plate') text = 'शाबाश! प्लेट सही जगह लग गई!';
    else if (piece === 'candle_flame') text = 'शाबाश! मोमबत्ती की लौ सही जगह लग गई!';
    else if (piece === 'candle_wick') text = 'शाबाश! मोमबत्ती की बत्ती सही जगह लग गई!';
    else if (piece === 'candle_wax') text = 'शाबाश! पिघला मोम सही जगह लग गया!';
    else if (piece === 'candle_body') text = 'शाबाश! मोमबत्ती का शरीर सही जगह लग गया!';
    else if (piece === 'house_chimney') text = 'शाबाश! चिमनी सही जगह लग गई!';
    else if (piece === 'house_roof') text = 'शाबाश! घर की छत सही जगह लग गई!';
    else if (piece === 'house_win_top') text = 'शाबाश! ऊपरी खिड़की सही जगह लग गई!';
    else if (piece === 'house_wall') text = 'शाबाश! घर की दीवार सही जगह लग गई!';
    else if (piece === 'house_win_bot') text = 'शाबाश! निचली खिड़की सही जगह लग गई!';
    else if (piece === 'house_door') text = 'शाबाश! दरवाज़ा सही जगह लग गया!';
    else if (piece === 'house_base_left') text = 'शाबाश! बाईं नींव सही जगह लग गई!';
    else if (piece === 'house_base_right') text = 'शाबाश! दाईं नींव सही जगह लग गई!';
    else if (piece === 'boat_mast') text = 'शाबाश! नाव का डंडा सही जगह लग गया!';
    else if (piece === 'boat_sail_ltop') text = 'शाबाश! बायाँ ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'boat_sail_lmid') text = 'शाबाश! बीच का हिस्सा सही जगह लग गया!';
    else if (piece === 'boat_sail_lbot') text = 'शाबाश! बायाँ निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'boat_sail_right') text = 'शाबाश! दायाँ पाल सही जगह लग गया!';
    else if (piece === 'boat_hull_top') text = 'शाबाश! नाव की ऊपरी पट्टी सही जगह लग गई!';
    else if (piece === 'boat_hull_bot') text = 'शाबाश! नाव का निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'bus_body') text = 'शाबाश! बस का शरीर सही जगह लग गया!';
    else if (piece === 'bus_win1') text = 'शाबाश! पहली खिड़की सही जगह लग गई!';
    else if (piece === 'bus_win2') text = 'शाबाश! दूसरी खिड़की सही जगह लग गई!';
    else if (piece === 'bus_win3') text = 'शाबाश! तीसरी खिड़की सही जगह लग गई!';
    else if (piece === 'bus_win4') text = 'शाबाश! चौथी खिड़की सही जगह लग गई!';
    else if (piece === 'bus_wheel1') text = 'शाबाश! पिछला पहिया सही जगह लग गया!';
    else if (piece === 'bus_wheel2') text = 'शाबाश! अगला पहिया सही जगह लग गया!';
    else if (piece === 'pinwheel_blade_tl') text = 'शाबाश! ऊपरी बायाँ पंख सही जगह लग गया!';
    else if (piece === 'pinwheel_blade_tr') text = 'शाबाश! ऊपरी दायाँ पंख सही जगह लग गया!';
    else if (piece === 'pinwheel_center') text = 'शाबाश! बीच वाला गोला सही जगह लग गया!';
    else if (piece === 'pinwheel_blade_br') text = 'शाबाश! निचला दायाँ पंख सही जगह लग गया!';
    else if (piece === 'pinwheel_blade_bl') text = 'शाबाश! निचला बायाँ पंख सही जगह लग गया!';
    else if (piece === 'pinwheel_stick') text = 'शाबाश! फिरकी की डंडी सही जगह लग गई!';
    else if (piece === 'caterpillar_head') text = 'शाबाश! कैटरपिलर का चेहरा सही जगह लग गया!';
    else if (piece === 'caterpillar_seg1') text = 'शाबाश! पहला गोला सही जगह लग गया!';
    else if (piece === 'caterpillar_seg2') text = 'शाबाश! दूसरा गोला सही जगह लग गया!';
    else if (piece === 'caterpillar_seg3') text = 'शाबाश! तीसरा गोला सही जगह लग गया!';
    else if (piece === 'caterpillar_seg4') text = 'शाबाश! चौथा गोला सही जगह लग गया!';
    else if (piece === 'hen_comb') text = 'शाबाश! मुर्गी की कलगी सही जगह लग गई!';
    else if (piece === 'hen_head') text = 'शाबाश! मुर्गी का सिर सही जगह लग गया!';
    else if (piece === 'hen_beak') text = 'शाबाश! मुर्गी की चोंच सही जगह लग गई!';
    else if (piece === 'hen_wattle') text = 'शाबाश! गले की कलगी सही जगह लग गई!';
    else if (piece === 'hen_body') text = 'शाबाश! मुर्गी का शरीर सही जगह लग गया!';
    else if (piece === 'hen_foot_left') text = 'शाबाश! मुर्गी का बायाँ पैर सही जगह लग गया!';
    else if (piece === 'hen_foot_right') text = 'शाबाश! मुर्गी का दायाँ पैर सही जगह लग गया!';
    else if (piece === 'icecream_top') text = 'शाबाश! आइसक्रीम का ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'icecream_body') text = 'शाबाश! आइसक्रीम का निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'icecream_stick') text = 'शाबाश! आइसक्रीम की डंडी सही जगह लग गई!';
    else if (piece === 'lollipop_top') text = 'शाबाश! लॉलीपॉप का ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'lollipop_band') text = 'शाबाश! बीच की पट्टी सही जगह लग गई!';
    else if (piece === 'lollipop_bottom') text = 'शाबाश! लॉलीपॉप का निचला हिस्सा सही जगह लग गया!';
    else if (piece === 'lollipop_stick') text = 'शाबाश! लॉलीपॉप की डंडी सही जगह लग गई!';
    else if (piece === 'duck_body') text = 'शाबाश! बतख का शरीर सही जगह लग गया!';
    else if (piece === 'duck_wing') text = 'शाबाश! पंख सही जगह लग गया!';
    else if (piece === 'duck_beak') text = 'शाबाश! चोंच सही जगह लग गई!';
    else if (piece === 'duck_foot_left') text = 'शाबाश! बायाँ पैर सही जगह लग गया!';
    else if (piece === 'duck_foot_right') text = 'शाबाश! दायाँ पैर सही जगह लग गया!';
    else if (piece === 'flower_center') text = 'शाबाश! फूल का बीच वाला हिस्सा सही जगह लग गया!';
    else if (piece === 'flower_petal_top') text = 'शाबाश! ऊपरी पंखुड़ी सही जगह लग गई!';
    else if (piece === 'flower_petal_top_right') text = 'शाबाश! ऊपरी दाईं पंखुड़ी सही जगह लग गई!';
    else if (piece === 'flower_petal_bottom_right') text = 'शाबाश! निचली दाईं पंखुड़ी सही जगह लग गई!';
    else if (piece === 'flower_petal_bottom') text = 'शाबाश! निचली पंखुड़ी सही जगह लग गई!';
    else if (piece === 'flower_petal_bottom_left') text = 'शाबाश! निचली बाईं पंखुड़ी सही जगह लग गई!';
    else if (piece === 'flower_petal_top_left') text = 'शाबाश! ऊपरी बाईं पंखुड़ी सही जगह लग गई!';
    else if (piece === 'leaf') text = 'शाबाश! पत्ती सही जगह लग गई!';
    else if (piece === 'body') text = 'शाबाश! सेब सही जगह लग गया!';
    else if (piece === 'kite_quad') text = 'शाबाश! पतंग का हिस्सा सही जगह लग गया!';
    else if (piece === 'kite_tail') text = 'शाबाश! पतंग की पूंछ सही जगह लग गई!';
    else if (piece === 'brinjal_calyx') text = 'शाबाश! ताज सही जगह लग गया!';
    else if (piece === 'brinjal_body') text = 'शाबाश! बैंगन सही जगह लग गया!';
    else if (piece === 'capsicum_body') text = 'शाबाश! शिमला मिर्च सही जगह लग गई!';
    else if (piece === 'capsicum_stem') text = 'शाबाश! डंठल सही जगह लग गया!';
    else if (piece === 'capsicum_lobe') text = 'शाबाश! सही जगह लग गया!';
    else if (piece === 'jug_body') text = 'शाबाश! जग सही जगह लग गया!';
    else if (piece === 'jug_handle') text = 'शाबाश! हत्था सही जगह लग गया!';
    else if (piece === 'jug_rim') text = 'शाबाश! किनारा सही जगह लग गया!';
    else if (piece === 'jug_base') text = 'शाबाश! पेंदा सही जगह लग गया!';
    else if (piece === 'butterfly_body') text = 'शाबाश! तितली का शरीर सही जगह लग गया!';
    else if (piece === 'butterfly_wing_tl') text = 'शाबाश! बायाँ ऊपरी पंख सही जगह लग गया!';
    else if (piece === 'butterfly_wing_bl') text = 'शाबाश! बायाँ निचला पंख सही जगह लग गया!';
    else if (piece === 'butterfly_wing_tr') text = 'शाबाश! दायाँ ऊपरी पंख सही जगह लग गया!';
    else if (piece === 'butterfly_wing_br') text = 'शाबाश! दायाँ निचला पंख सही जगह लग गया!';
    else if (piece === 'ball_cap') text = 'शाबाश! गेंद का केंद्र सही जगह लग गया!';
    else if (piece === 'ball_top_mid') text = 'शाबाश! गेंद का ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'ball_top_right') text = 'शाबाश! गेंद का ऊपरी दाएँ हिस्सा सही जगह लग गया!';
    else if (piece === 'ball_top_left') text = 'शाबाश! गेंद का ऊपरी बाएँ हिस्सा सही जगह लग गया!';
    else if (piece === 'ball_bottom_left') text = 'शाबाश! गेंद का निचला बाएँ हिस्सा सही जगह लग गया!';
    else if (piece === 'ball_bottom_center') text = 'शाबाश! गेंद का सामने वाला हिस्सा सही जगह लग गया!';
    else if (piece === 'ball_bottom_right') text = 'शाबाश! गेंद का निचला दाएँ हिस्सा सही जगह लग गया!';
    else if (piece === 'hat_crown') text = 'शाबाश! टोपी का ऊपरी हिस्सा सही जगह लग गया!';
    else if (piece === 'hat_band') text = 'शाबाश! टोपी की पट्टी सही जगह लग गई!';
    else if (piece === 'hat_brim') text = 'शाबाश! टोपी का निचला घेरा सही जगह लग गया!';
    else if (piece === 'umbrella_canopy_left') text = 'शाबाश! छतरी का बायाँ हिस्सा सही जगह लग गया!';
    else if (piece === 'umbrella_canopy_mid') text = 'शाबाश! छतरी का बीच वाला हिस्सा सही जगह लग गया!';
    else if (piece === 'umbrella_canopy_right') text = 'शाबाश! छतरी का दायाँ हिस्सा सही जगह लग गया!';
    else if (piece === 'umbrella_handle') text = 'शाबाश! छतरी का हैंडल सही जगह लग गया!';
    this.playAudio(`drawing_placed_${piece}`, text);
  }

  speakDrawingComplete(stage: 'mango' | 'tulip' | 'airplane' | 'elephant' | 'banana' | 'scissors' | 'purse' | 'glasses' | 'tractor' | 'cake' | 'candle' | 'house' | 'boat' | 'bus' | 'pinwheel' | 'caterpillar' | 'hen' | 'icecream' | 'lollipop' | 'duck' | 'flower' | 'ball' | 'butterfly' | 'jug' | 'capsicum' | 'apple' | 'kite' | 'brinjal' | 'hat' | 'umbrella' = 'mango', soundEnabled = true) {
    if (!soundEnabled) return;
    let text = 'अरे वाह बच्चों! बहुत सुंदर चित्र बनाया! शाबाश!';
    if (stage === 'mango') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर आम बनाया! शाबाश!';
    } else if (stage === 'tulip') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर ट्यूलिप फूल बनाया! शाबाश!';
    } else if (stage === 'airplane') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर हवाई जहाज़ बनाया! शाबाश!';
    } else if (stage === 'elephant') {
      text = 'अरे वाह बच्चों! आपने बहुत ही प्यारा हाथी बनाया! शाबाश!';
    } else if (stage === 'banana') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर केले बनाए! शाबाश!';
    } else if (stage === 'scissors') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर कैंची बनाई! शाबाश!';
    } else if (stage === 'purse') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर पर्स बनाया! शाबाश!';
    } else if (stage === 'glasses') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर चश्मा बनाया! शाबाश!';
    } else if (stage === 'tractor') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर ट्रैक्टर बनाया! शाबाश!';
    } else if (stage === 'cake') {
      text = 'अरे वाह बच्चों! आपने बहुत ही स्वादिष्ट केक बनाया! शाबाश!';
    } else if (stage === 'candle') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर मोमबत्ती बनाई! शाबाश!';
    } else if (stage === 'house') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर घर बनाया! शाबाश!';
    } else if (stage === 'boat') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर नाव बनाई! शाबाश!';
    } else if (stage === 'bus') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर बस बनाई! शाबाश!';
    } else if (stage === 'pinwheel') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर फिरकी बनाई! शाबाश!';
    } else if (stage === 'caterpillar') {
      text = 'अरे वाह बच्चों! आपने बहुत ही प्यारा कैटरपिलर बनाया! शाबाश!';
    } else if (stage === 'hen') {
      text = 'अरे वाह बच्चों! आपने बहुत ही प्यारी मुर्गी बनाई! शाबाश!';
    } else if (stage === 'icecream') {
      text = 'अरे वाह बच्चों! आपने बहुत ही स्वादिष्ट आइसक्रीम बनाई! शाबाश!';
    } else if (stage === 'lollipop') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर लॉलीपॉप बनाई! शाबाश!';
    } else if (stage === 'duck') {
      text = 'अरे वाह बच्चों! आपने बहुत ही प्यारी बतख बनाई! शाबाश!';
    } else if (stage === 'flower') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर फूल बनाया! शाबाश!';
    } else if (stage === 'umbrella') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर छतरी बनाई! शाबाश!';
    } else if (stage === 'hat') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर टोपी बनाई! शाबाश!';
    } else if (stage === 'ball') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर गेंद बनाई! शाबाश!';
    } else if (stage === 'butterfly') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर तितली बनाई! शाबाश!';
    } else if (stage === 'jug') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर जग बनाया! शाबाश!';
    } else if (stage === 'capsicum') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर शिमला मिर्च बनाई! शाबाश!';
    } else if (stage === 'brinjal') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर बैंगन बनाया! शाबाश!';
    } else if (stage === 'kite') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर पतंग बनाई! शाबाश!';
    } else if (stage === 'apple') {
      text = 'अरे वाह बच्चों! आपने बहुत ही सुंदर सेब बनाया! शाबाश!';
    }
    this.playAudio(`drawing_complete_${stage}`, text);
  }

  speakDrawingNext(stage: 'mango' | 'tulip' | 'airplane' | 'elephant' | 'banana' | 'scissors' | 'purse' | 'glasses' | 'tractor' | 'cake' | 'candle' | 'house' | 'boat' | 'bus' | 'pinwheel' | 'caterpillar' | 'hen' | 'icecream' | 'lollipop' | 'duck' | 'flower' | 'ball' | 'butterfly' | 'jug' | 'capsicum' | 'apple' | 'kite' | 'brinjal' | 'hat' | 'umbrella' = 'mango', soundEnabled = true) {
    if (!soundEnabled) return;
    this.playPop(soundEnabled);
    let text = 'चलो फिर से नया चित्र बनाते हैं!';
    if (stage === 'mango') {
      text = 'चलो अब आम का चित्र बनाते हैं!';
    } else if (stage === 'tulip') {
      text = 'चलो अब ट्यूलिप फूल का चित्र बनाते हैं!';
    } else if (stage === 'airplane') {
      text = 'चलो अब हवाई जहाज़ का चित्र बनाते हैं!';
    } else if (stage === 'elephant') {
      text = 'चलो अब हाथी का चित्र बनाते हैं!';
    } else if (stage === 'banana') {
      text = 'चलो अब केले का चित्र बनाते हैं!';
    } else if (stage === 'scissors') {
      text = 'चलो अब कैंची का चित्र बनाते हैं!';
    } else if (stage === 'purse') {
      text = 'चलो अब पर्स का चित्र बनाते हैं!';
    } else if (stage === 'glasses') {
      text = 'चलो अब चश्मे का चित्र बनाते हैं!';
    } else if (stage === 'tractor') {
      text = 'चलो अब ट्रैक्टर का चित्र बनाते हैं!';
    } else if (stage === 'cake') {
      text = 'चलो अब केक का चित्र बनाते हैं!';
    } else if (stage === 'candle') {
      text = 'चलो अब मोमबत्ती का चित्र बनाते हैं!';
    } else if (stage === 'house') {
      text = 'चलो अब घर का चित्र बनाते हैं!';
    } else if (stage === 'boat') {
      text = 'चलो अब नाव का चित्र बनाते हैं!';
    } else if (stage === 'bus') {
      text = 'चलो अब बस का चित्र बनाते हैं!';
    } else if (stage === 'pinwheel') {
      text = 'चलो अब फिरकी का चित्र बनाते हैं!';
    } else if (stage === 'caterpillar') {
      text = 'चलो अब कैटरपिलर का चित्र बनाते हैं!';
    } else if (stage === 'hen') {
      text = 'चलो अब मुर्गी का चित्र बनाते हैं!';
    } else if (stage === 'icecream') {
      text = 'चलो अब आइसक्रीम का चित्र बनाते हैं!';
    } else if (stage === 'lollipop') {
      text = 'चलो अब लॉलीपॉप का चित्र बनाते हैं!';
    } else if (stage === 'duck') {
      text = 'चलो अब बतख का चित्र बनाते हैं!';
    } else if (stage === 'flower') {
      text = 'चलो अब फूल का चित्र बनाते हैं!';
    } else if (stage === 'umbrella') {
      text = 'चलो अब छतरी का चित्र बनाते हैं!';
    } else if (stage === 'hat') {
      text = 'चलो अब टोपी का चित्र बनाते हैं!';
    } else if (stage === 'ball') {
      text = 'चलो अब गेंद का चित्र बनाते हैं!';
    } else if (stage === 'butterfly') {
      text = 'चलो अब तितली का चित्र बनाते हैं!';
    } else if (stage === 'jug') {
      text = 'चलो अब जग का चित्र बनाते हैं!';
    } else if (stage === 'capsicum') {
      text = 'चलो अब शिमला मिर्च का चित्र बनाते हैं!';
    } else if (stage === 'brinjal') {
      text = 'चलो अब बैंगन का चित्र बनाते हैं!';
    } else if (stage === 'kite') {
      text = 'चलो अब पतंग का चित्र बनाते हैं!';
    } else if (stage === 'apple') {
      text = 'चलो अब सेब का चित्र बनाते हैं!';
    }
    this.playAudio(`drawing_next_${stage}`, text);
  }
}

export const sounds = new SoundManager();
