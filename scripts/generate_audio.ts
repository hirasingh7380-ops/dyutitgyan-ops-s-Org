import fs from "fs";
import path from "path";

const AUDIO_MAP: Record<string, string> = {
  test_greeting: "नमस्ते बच्चों! चलो मिलकर पढ़ाई करते हैं!",
  word_cat: "सी, ए, टी. कैट! कैट मतलब बिल्ली. शाबाश बच्चों!",
  word_bat: "बी, ए, टी. बैट! बैट मतलब बल्ला. शाबाश बच्चों!",
  word_rat: "आर, ए, टी. रैट! रैट मतलब चूहा. शाबाश बच्चों!",
  word_hat: "एच, ए, टी. हैट! हैट मतलब टोपी. शाबाश बच्चों!",
  word_fan: "एफ, ए, एन. फैन! फैन मतलब पंखा. शाबाश बच्चों!",
  word_man: "एम, ए, एन. मैन! मैन मतलब आदमी. शाबाश बच्चों!",
  word_van: "वी, ए, एन. वैन! वैन मतलब गाड़ी. शाबाश बच्चों!",
  word_can: "सी, ए, एन. कैन! कैन मतलब डिब्बा. शाबाश बच्चों!",
  word_map: "एम, ए, पी. मैप! मैप मतलब नक्शा. शाबाश बच्चों!",
  word_cap: "सी, ए, पी. कैप! कैप मतलब टोपी. शाबाश बच्चों!",
  word_tap: "टी, ए, पी. टैप! टैप मतलब नल. शाबाश बच्चों!",
  word_lap: "एल, ए, पी. लैप! लैप मतलब गोद. शाबाश बच्चों!",
  word_ball: "बी, ए, एल, एल. बॉल! बॉल मतलब गेंद. शाबाश बच्चों!",
  word_hall: "एच, ए, एल, एल. हॉल! हॉल मतलब बड़ा कमरा. शाबाश बच्चों!",
  word_wall: "डब्ल्यू, ए, एल, एल. वॉल! वॉल मतलब दीवार. शाबाश बच्चों!",
  word_tall: "टी, ए, एल, एल. टॉल! टॉल मतलब लंबा. शाबाश बच्चों!",
  correct: "बिल्कुल सही! शाबाश बच्चों!",
  wrong: "ओहो! यह गलत है, फिर से कोशिश करो बच्चों!",
  balloon_pop: "अरे वाह! गुब्बारा फूट गया! शाबाश!",
  balloon_wrong: "ओहो! गलत गुब्बारा, सही अक्षर वाला गुब्बारा फोड़ो!",
  match_pair: "बिल्कुल सही जोड़ी! बहुत बढ़िया!",
  victory: "अरे वाह! आपने सारे शब्द बना लिए! आप बहुत होशियार हो!"
};

// Add individual letters A-Z
const LETTERS: Record<string, string> = {
  A: 'ए', B: 'बी', C: 'सी', D: 'डी', E: 'ई', F: 'एफ', G: 'जी', H: 'एच',
  I: 'आई', J: 'जे', K: 'के', L: 'एल', M: 'एम', N: 'एन', O: 'ओ', P: 'पी',
  Q: 'क्यू', R: 'आर', S: 'एस', T: 'टी', U: 'यू', V: 'वी', W: 'डब्ल्यू',
  X: 'एक्स', Y: 'वाई', Z: 'जेड'
};

for (const [eng, hi] of Object.entries(LETTERS)) {
  AUDIO_MAP[`letter_${eng.toLowerCase()}`] = `${hi}! बहुत अच्छे!`;
  AUDIO_MAP[`find_${eng.toLowerCase()}`] = `बच्चों, अब ${hi} वाले गुब्बारे फोड़ो!`;
}

async function fetchTTS(text: string): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=hi&client=tw-ob`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  if (!res.ok) {
    throw new Error(`TTS failed with status ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  const targetDir = path.resolve("public/audio");
  fs.mkdirSync(targetDir, { recursive: true });

  const entries = Object.entries(AUDIO_MAP);
  console.log(`Starting audio generation for ${entries.length} items...`);

  for (const [key, text] of entries) {
    const mp3Path = path.join(targetDir, `${key}.mp3`);
    if (fs.existsSync(mp3Path)) {
      continue;
    }

    try {
      const buf = await fetchTTS(text);
      fs.writeFileSync(mp3Path, buf);
      console.log(`Saved ${key}.mp3 (${buf.length} bytes)`);
      // Small delay to be polite
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error(`Failed ${key}:`, err);
    }
  }

  console.log("All audio generated successfully!");
}

main();
