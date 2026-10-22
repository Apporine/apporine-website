// Builds the two audio layers the film plays (src/soundtrack.tsx):
//   public/audio/voice.wav      the voiceover at -16 LUFS, 48 kHz (timing untouched)
//   public/audio/music-bed.wav  track.mp3 with the level automation below, ducked under that voice
// Usage: node scripts/prepare-audio.mjs [voice file]   (default ../voice/voice-lewis.wav)
// Swapping the voice (an ElevenLabs take, say) only needs this script run again with the new file.
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const film = join(root, "..");
const out = join(root, "public", "audio");

const RATE = 48000;
const DURATION = 53.0;
const VOICE_LUFS = -16;

// Music level (dB applied to track.mp3) at composition times, linear in dB between keys.
const MUSIC_LEVEL = [
  [0.0, -6],
  [28.0, -6],
  [28.6, -36], // "there is a gap": near silence (-30 dB relative)
  [31.7, -36],
  [33.2, -6], // back up over 1.5 s
  [37.5, -6],
  [38.5, -4], // its fullest from 37.50
  [45.1, -4],
  [46.5, -2.5], // the swell under the Falcon
  [51.5, -2.5],
  [53.0, -90], // fade out
];

// Ducking under the voice: 6 dB, 150 ms attack, 400 ms release. The voice is read ahead by the
// attack time, so the music is fully down as each line begins.
const DUCK_DB = 6;
const ATTACK = 0.15;
const RELEASE = 0.4;
const SPEECH_WINDOW = 0.01;
const SPEECH_THRESHOLD_DB = -45;

function ffmpeg(args, input) {
  const run = spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { input, maxBuffer: 1 << 30 });
  if (run.status !== 0) throw new Error(run.stderr.toString());
  return run;
}

const decode = (file, channels) =>
  new Float32Array(new Uint8Array(ffmpeg(["-i", file, "-t", String(DURATION), "-ac", String(channels), "-ar", String(RATE), "-f", "f32le", "-"]).stdout).buffer);

function integratedLoudness(file) {
  const log = ffmpeg(["-i", file, "-af", "ebur128", "-f", "null", "-"]).stderr.toString();
  return Number(log.slice(log.lastIndexOf("Summary")).match(/I:\s+(-?[\d.]+) LUFS/)[1]);
}

function levelAt(time) {
  for (let i = 1; i < MUSIC_LEVEL.length; i++) {
    const [t1, db1] = MUSIC_LEVEL[i];
    const [t0, db0] = MUSIC_LEVEL[i - 1];
    if (time <= t1) return db0 + ((db1 - db0) * (time - t0)) / (t1 - t0);
  }
  return MUSIC_LEVEL.at(-1)[1];
}

mkdirSync(out, { recursive: true });
const voiceSource = resolve(process.argv[2] ?? join(film, "voice", "voice-lewis.wav"));

// 1. Voice: one fixed gain to -16 LUFS, nothing else.
const voiceGain = VOICE_LUFS - integratedLoudness(voiceSource);
const voicePath = join(out, "voice.wav");
ffmpeg(["-y", "-i", voiceSource, "-af", `volume=${voiceGain.toFixed(2)}dB`, "-ar", String(RATE), "-ac", "1", "-c:a", "pcm_s24le", voicePath]);
console.log(`voice   ${voiceSource} (${voiceGain >= 0 ? "+" : ""}${voiceGain.toFixed(2)} dB)`);

// 2. Where the voice speaks, in 10 ms windows.
const voice = decode(voicePath, 1);
const window = Math.round(SPEECH_WINDOW * RATE);
const speaking = new Uint8Array(Math.ceil((DURATION * RATE) / window));
for (let w = 0; w < speaking.length; w++) {
  let sum = 0;
  const end = Math.min(voice.length, (w + 1) * window);
  for (let i = w * window; i < end; i++) sum += voice[i] * voice[i];
  speaking[w] = 10 * Math.log10(sum / window + 1e-12) > SPEECH_THRESHOLD_DB ? 1 : 0;
}

// 3. Music: automation times ducking, sample by sample.
const music = decode(join(film, "music", "track.mp3"), 2);
const frames = music.length / 2;
const lookahead = Math.round(ATTACK * RATE);
const down = DUCK_DB / (ATTACK * RATE);
const up = DUCK_DB / (RELEASE * RATE);
let duck = 0;
for (let i = 0; i < frames; i++) {
  const target = speaking[Math.floor((i + lookahead) / window)] ? -DUCK_DB : 0;
  duck = target < duck ? Math.max(target, duck - down) : Math.min(target, duck + up);
  const gain = 10 ** ((levelAt(i / RATE) + duck) / 20);
  music[2 * i] *= gain;
  music[2 * i + 1] *= gain;
}
ffmpeg(
  ["-y", "-f", "f32le", "-ar", String(RATE), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", join(out, "music-bed.wav")],
  Buffer.from(music.buffer),
);
console.log("music   track.mp3 automated and ducked");
