const fs = require('fs');
const path = require('path');
const https = require('https');

const AUDIO_DIR = path.join(process.cwd(), 'public/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

function fetchTTS(text, filename) {
  return new Promise((resolve) => {
    const filePath = path.join(AUDIO_DIR, filename);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 100) {
      return resolve(false); // already exists
    }

    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + encodeURIComponent(text) + '&tl=hi&client=tw-ob';
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode !== 200) {
        return resolve(false);
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        try {
          fs.writeFileSync(filePath, Buffer.concat(data));
          resolve(true);
        } catch {
          resolve(false);
        }
      });
    }).on('error', () => resolve(false));
  });
}

const HINDI_SWAR = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];
const HINDI_VYANJAN = [
  'क', 'ख', 'ग', 'घ', 'ङ',
  'च', 'छ', 'ज', 'झ', 'ञ',
  'ट', 'ठ', 'ड', 'ढ', 'ण',
  'त', 'थ', 'द', 'ध', 'न',
  'प', 'फ', 'ब', 'भ', 'म',
  'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह',
  'क्ष', 'त्र', 'ज्ञ'
];
const ALL_HINDI = [...HINDI_SWAR, ...HINDI_VYANJAN];

const HINDI_NUMBERS = [
  '', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
  'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाइस', 'उनतीस', 'तीस',
  'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
  'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास'
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Starting audio generation...');

  // 1. General Greetings & Feedbacks
  const general = [
    { text: 'नमस्ते बच्चों! चलो मिलकर पढ़ाई करते हैं!', file: 'test_greeting.mp3' },
    { text: 'नमस्ते बच्चों! चलो मिलकर हिंदी वर्णमाला सीखते हैं!', file: 'hindi_greeting.mp3' },
    { text: 'नमस्ते बच्चों! चलो मिलकर 1 से 50 तक गणित और गिनती सीखते हैं!', file: 'math_greeting.mp3' },
    { text: 'ओहो! यह गलत गुब्बारा है, सही गुब्बारा फोड़ो!', file: 'hindi_wrong_pop.mp3' },
    { text: 'ओहो! यह गलत है, फिर से कोशिश करो बच्चों!', file: 'wrong.mp3' },
    { text: 'ओहो! यह गलत संख्या है, फिर से कोशिश करो बच्चों!', file: 'math_wrong.mp3' },
    { text: 'अरे वाह! गुब्बारा फूट गया! शाबाश!', file: 'balloon_pop.mp3' },
    { text: 'शाबाश बच्चों! बहुत बढ़िया!', file: 'victory.mp3' },
  ];

  for (const g of general) {
    await fetchTTS(g.text, g.file);
    await sleep(40);
  }

  // 2. Hindi Letters
  for (const letter of ALL_HINDI) {
    const enc = encodeURIComponent(letter);
    // letter click
    const clickText = `${letter}! बहुत अच्छे! शाबाश!`;
    await fetchTTS(clickText, `hindi_letter_${letter}.mp3`);
    await fetchTTS(clickText, `hindi_letter_${enc}.mp3`);

    // target letter for balloon pop
    const targetText = `बच्चों, अब ${letter} वाला गुब्बारा फोड़ो!`;
    await fetchTTS(targetText, `hindi_target_${letter}.mp3`);
    await fetchTTS(targetText, `hindi_target_${enc}.mp3`);

    // balloon pop success
    const popText = `शाबाश! ${letter} वाला गुब्बारा फूट गया!`;
    await fetchTTS(popText, `hindi_pop_${letter}.mp3`);
    await fetchTTS(popText, `hindi_pop_${enc}.mp3`);

    await sleep(50);
  }

  // 3. Math Numbers 1 to 50
  for (let n = 1; n <= 50; n++) {
    const hName = HINDI_NUMBERS[n];

    // Math number click
    const numText = `${n}, ${hName}! बहुत अच्छे!`;
    await fetchTTS(numText, `math_num_${n}.mp3`);

    // Math target balloon pop
    const targetText = `बच्चों, अब नंबर ${n} वाला गुब्बारा फोड़ो!`;
    await fetchTTS(targetText, `math_target_${n}.mp3`);

    // Math balloon pop
    const popText = `शाबाश! नंबर ${n} वाला गुब्बारा फूट गया!`;
    await fetchTTS(popText, `math_pop_${n}.mp3`);

    // Math blank fill "X ke baad Y, bilkul sahi!"
    if (n > 1) {
      const blankText = `${n - 1} के बाद ${n}, बिल्कुल सही!`;
      await fetchTTS(blankText, `math_after_${n - 1}_${n}.mp3`);
    } else {
      await fetchTTS(`1, एक! बिल्कुल सही!`, `math_first_1.mp3`);
    }

    await sleep(50);
  }

  console.log('Audio generation completed successfully!');
}

main().catch(console.error);
