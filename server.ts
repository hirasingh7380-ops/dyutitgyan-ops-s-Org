import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

const memoryCache = new Map<string, Buffer>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // TTS Endpoint: Returns real WAV audio playable by any browser, Android PWA, iOS, or PC
  app.get("/api/tts", async (req, res) => {
    try {
      const key = (req.query.key as string | undefined)?.trim();
      const text = (req.query.text as string | undefined)?.trim();

      if (!key && !text) {
        return res.status(400).json({ error: "Missing 'key' or 'text' query parameter" });
      }

      const cacheKey = key || text!;

      // 1. Check in-memory cache
      if (memoryCache.has(cacheKey)) {
        const cached = memoryCache.get(cacheKey)!;
        res.setHeader("Content-Type", "audio/wav");
        res.setHeader("Content-Length", cached.length);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.end(cached);
      }

      // 2. Check public/audio or dist/audio file
      const possibleDirs = [
        path.join(process.cwd(), "public/audio"),
        path.join(process.cwd(), "dist/audio"),
      ];

      if (key) {
        for (const dir of possibleDirs) {
          const mp3Path = path.join(dir, `${key}.mp3`);
          if (fs.existsSync(mp3Path)) {
            const buf = fs.readFileSync(mp3Path);
            memoryCache.set(cacheKey, buf);
            res.setHeader("Content-Type", "audio/mpeg");
            res.setHeader("Content-Length", buf.length);
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            return res.end(buf);
          }
          const wavPath = path.join(dir, `${key}.wav`);
          if (fs.existsSync(wavPath)) {
            const buf = fs.readFileSync(wavPath);
            memoryCache.set(cacheKey, buf);
            res.setHeader("Content-Type", "audio/wav");
            res.setHeader("Content-Length", buf.length);
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            return res.end(buf);
          }
        }
      }

      // 3. Fallback online generator: Google TTS (fast, unlimited, crystal clear Hindi)
      const promptText = text || key || "";
      if (!promptText) {
        return res.status(400).json({ error: "No text to speak" });
      }

      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(promptText)}&tl=hi&client=tw-ob`;
      const ttsRes = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (ttsRes.ok) {
        const arrayBuf = await ttsRes.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        memoryCache.set(cacheKey, buf);
        try {
          const targetDir = path.join(process.cwd(), "public/audio");
          fs.mkdirSync(targetDir, { recursive: true });
          if (key) {
            fs.writeFileSync(path.join(targetDir, `${key}.mp3`), buf);
          }
        } catch {}
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Length", buf.length);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.end(buf);
      }

      // 4. If Google TTS failed, try Gemini TTS as secondary fallback
      const ai = getAI();
      const result = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: promptText,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Kore",
              },
            },
          },
        },
      });

      const part = result.candidates?.[0]?.content?.parts?.[0];
      if (!part?.inlineData?.data) {
        throw new Error("No audio data returned from Gemini TTS");
      }

      const pcmBuffer = Buffer.from(part.inlineData.data, "base64");
      const wavBuffer = pcmToWav(pcmBuffer);

      // Save to memory cache and disk for future instant hits
      memoryCache.set(cacheKey, wavBuffer);
      try {
        const targetDir = path.join(process.cwd(), "public/audio");
        fs.mkdirSync(targetDir, { recursive: true });
        if (key) {
          fs.writeFileSync(path.join(targetDir, `${key}.wav`), wavBuffer);
        }
      } catch {
        // Ignore file write errors
      }

      res.setHeader("Content-Type", "audio/wav");
      res.setHeader("Content-Length", wavBuffer.length);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.end(wavBuffer);
    } catch (err: unknown) {
      console.error("TTS API error:", err);
      const errMsg = err instanceof Error ? err.message : "TTS generation failed";
      return res.status(500).json({ error: errMsg });
    }
  });

  // Serve static public folder explicitly
  app.use("/audio", express.static(path.join(process.cwd(), "public/audio")));

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
