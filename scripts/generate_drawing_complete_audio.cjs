const fs = require('fs');
const path = require('path');
const https = require('https');

const AUDIO_DIR = path.join(process.cwd(), 'public/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const COMPLETE_PHRASES = {
  mango: 'अरे वाह बच्चों! आपने बहुत ही सुंदर आम बनाया! शाबाश!',
  tulip: 'अरे वाह बच्चों! आपने बहुत ही सुंदर ट्यूलिप फूल बनाया! शाबाश!',
  airplane: 'अरे वाह बच्चों! आपने बहुत ही सुंदर हवाई जहाज़ बनाया! शाबाश!',
  elephant: 'अरे वाह बच्चों! आपने बहुत ही प्यारा हाथी बनाया! शाबाश!',
  banana: 'अरे वाह बच्चों! आपने बहुत ही सुंदर केले बनाए! शाबाश!',
  scissors: 'अरे वाह बच्चों! आपने बहुत ही सुंदर कैंची बनाई! शाबाश!',
  purse: 'अरे वाह बच्चों! आपने बहुत ही सुंदर पर्स बनाया! शाबाश!',
  glasses: 'अरे वाह बच्चों! आपने बहुत ही सुंदर चश्मा बनाया! शाबाश!',
  tractor: 'अरे वाह बच्चों! आपने बहुत ही सुंदर ट्रैक्टर बनाया! शाबाश!',
  cake: 'अरे वाह बच्चों! आपने बहुत ही स्वादिष्ट केक बनाया! शाबाश!',
  candle: 'अरे वाह बच्चों! आपने बहुत ही सुंदर मोमबत्ती बनाई! शाबाश!',
  house: 'अरे वाह बच्चों! आपने बहुत ही सुंदर घर बनाया! शाबाश!',
  boat: 'अरे वाह बच्चों! आपने बहुत ही सुंदर नाव बनाई! शाबाश!',
  bus: 'अरे वाह बच्चों! आपने बहुत ही सुंदर बस बनाई! शाबाश!',
  pinwheel: 'अरे वाह बच्चों! आपने बहुत ही सुंदर फिरकी बनाई! शाबाश!',
  caterpillar: 'अरे वाह बच्चों! आपने बहुत ही प्यारा कैटरपिलर बनाया! शाबाश!',
  hen: 'अरे वाह बच्चों! आपने बहुत ही प्यारी मुर्गी बनाई! शाबाश!',
  icecream: 'अरे वाह बच्चों! आपने बहुत ही स्वादिष्ट आइसक्रीम बनाई! शाबाश!',
  lollipop: 'अरे वाह बच्चों! आपने बहुत ही सुंदर लॉलीपॉप बनाई! शाबाश!',
  duck: 'अरे वाह बच्चों! आपने बहुत ही प्यारी बतख बनाई! शाबाश!',
  flower: 'अरे वाह बच्चों! आपने बहुत ही सुंदर फूल बनाया! शाबाश!',
  umbrella: 'अरे वाह बच्चों! आपने बहुत ही सुंदर छतरी बनाई! शाबाश!',
  hat: 'अरे वाह बच्चों! आपने बहुत ही सुंदर टोपी बनाई! शाबाश!',
  ball: 'अरे वाह बच्चों! आपने बहुत ही सुंदर गेंद बनाई! शाबाश!',
  butterfly: 'अरे वाह बच्चों! आपने बहुत ही सुंदर तितली बनाई! शाबाश!',
  jug: 'अरे वाह बच्चों! आपने बहुत ही सुंदर जग बनाया! शाबाश!',
  capsicum: 'अरे वाह बच्चों! आपने बहुत ही सुंदर शिमला मिर्च बनाई! शाबाश!',
  brinjal: 'अरे वाह बच्चों! आपने बहुत ही सुंदर बैंगन बनाया! शाबाश!',
  kite: 'अरे वाह बच्चों! आपने बहुत ही सुंदर पतंग बनाई! शाबाश!',
  apple: 'अरे वाह बच्चों! आपने बहुत ही सुंदर सेब बनाया! शाबाश!',
};

function fetchTTS(text, filename) {
  return new Promise((resolve) => {
    const filePath = path.join(AUDIO_DIR, filename);
    const url =
      'https://translate.google.com/translate_tts?ie=UTF-8&q=' +
      encodeURIComponent(text) +
      '&tl=hi&client=tw-ob';
    https
      .get(
        url,
        { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } },
        (res) => {
          if (res.statusCode !== 200) {
            return resolve(false);
          }
          const data = [];
          res.on('data', (chunk) => data.push(chunk));
          res.on('end', () => {
            try {
              const buf = Buffer.concat(data);
              if (buf.length < 200) return resolve(false);
              fs.writeFileSync(filePath, buf);
              resolve(true);
            } catch {
              resolve(false);
            }
          });
        }
      )
      .on('error', () => resolve(false));
  });
}

async function main() {
  let okCount = 0;
  for (const [stage, text] of Object.entries(COMPLETE_PHRASES)) {
    const filename = `drawing_complete_${stage}.mp3`;
    const ok = await fetchTTS(text, filename);
    if (ok) okCount++;
    console.log(`${filename}: ${ok ? 'OK' : 'FAILED'}`);
    await new Promise((r) => setTimeout(r, 80));
  }
  console.log(`Generated ${okCount}/${Object.keys(COMPLETE_PHRASES).length} drawing completion MP3 files.`);
}

main().catch(console.error);
