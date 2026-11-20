const fs = require('fs');
const path = require('path');
const https = require('https');

const AUDIO_DIR = path.join(process.cwd(), 'public/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const PHRASES = {
  hindi_wb_intro: 'बच्चों, बाईं ओर से अक्षर और दाईं ओर से अक्षर जोड़कर नया हिंदी शब्द बनाओ!',
  hindi_wb_victory: 'अरे वाह बच्चों! आपने सभी सोलह हिंदी शब्द बना दिए! बहुत-बहुत शाबाश!',
  hindi_wb_nal: 'न, ल, नल! नल से पानी आता है. शाबाश बच्चों!',
  hindi_wb_hal: 'ह, ल, हल! किसान खेत में हल चलाता है. शाबाश बच्चों!',
  hindi_wb_kal: 'क, ल, कल! शाबाश बच्चों!',
  hindi_wb_chal: 'च, ल, चल! चलो आगे बढ़ें. शाबाश बच्चों!',
  hindi_wb_thag: 'ठ, ग, ठग! शाबाश बच्चों!',
  hindi_wb_jag: 'ज, ग, जग! जग में पानी रखते हैं. शाबाश बच्चों!',
  hindi_wb_khag: 'ख, ग, खग! खग मतलब चिड़िया. शाबाश बच्चों!',
  hindi_wb_pag: 'प, ग, पग! पग मतलब कदम. शाबाश बच्चों!',
  hindi_wb_dhan: 'ध, न, धन! शाबाश बच्चों!',
  hindi_wb_man: 'म, न, मन! मन लगाकर पढ़ाई करो. शाबाश बच्चों!',
  hindi_wb_jan: 'ज, न, जन! जन मतलब लोग. शाबाश बच्चों!',
  hindi_wb_tan: 'त, न, तन! तन मतलब शरीर. शाबाश बच्चों!',
  hindi_wb_nat: 'न, ट, नट! शाबाश बच्चों!',
  hindi_wb_khat: 'ख, ट, खट! शाबाश बच्चों!',
  hindi_wb_tat: 'त, ट, तट! तट मतलब नदी का किनारा. शाबाश बच्चों!',
  hindi_wb_vat: 'व, ट, वट! वट मतलब बरगद का पेड़. शाबाश बच्चों!',
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
  for (const [key, text] of Object.entries(PHRASES)) {
    const filename = `${key}.mp3`;
    const ok = await fetchTTS(text, filename);
    if (ok) okCount++;
    console.log(`${filename}: ${ok ? 'OK' : 'FAILED'}`);
    await new Promise((r) => setTimeout(r, 80));
  }
  console.log(`Generated ${okCount}/${Object.keys(PHRASES).length} Hindi Word Builder MP3 files.`);
}

main().catch(console.error);
