// Renders the film and every deliverable into _brief/film/output.
//   1. Remotion: the picture (out/picture.mp4, no audio) and the mix (out/mix.wav)
//   2. The mix to -14 LUFS integrated, true peak at most -1 dB (out/mix-final.wav)
//   3. Master, web MP4, web WebM, poster, contact sheet
// Usage: node scripts/render.mjs [--skip-picture]
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const output = join(root, "..", "output");
const picture = join(out, "picture.mp4");
const mix = join(out, "mix.wav");
const mixFinal = join(out, "mix-final.wav");

const TARGET_LUFS = -14;
const LIMIT_DB = -1.3; // sample peak limit at 4x oversampling, which keeps the true peak under -1 dB
const WEB_LIMIT_MB = 15;
const DURATION = 53;
// Memory safe: one Chrome tab and a small frame cache for the video decoder.
const LOW_MEMORY = ["--concurrency=1", "--offthreadvideo-cache-size-in-bytes=268435456"];

function run(command, args, { quiet = false } = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: quiet ? "pipe" : "inherit", shell: command === "npx", maxBuffer: 1 << 28 });
  if (result.status !== 0) throw new Error(`${command} failed${quiet ? `:\n${result.stderr}` : ""}`);
  return result;
}
const ffmpeg = (args) => run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args]);

function loudness(file) {
  const log = run("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "ebur128=peak=true", "-f", "null", "-"], { quiet: true }).stderr.toString();
  const summary = log.slice(log.lastIndexOf("Summary"));
  return {
    integrated: Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)[1]),
    truePeak: Number(summary.match(/Peak:\s+(-?[\d.inf]+) dBFS/)[1]),
  };
}

const megabytes = (file) => statSync(file).size / 1e6;

mkdirSync(out, { recursive: true });
mkdirSync(output, { recursive: true });

// 1. Remotion
if (!process.argv.includes("--skip-picture")) {
  run("npx", ["remotion", "render", "ApporineFilm", "out/picture.mp4", "--codec=h264", "--crf=10", "--x264-preset=slow", "--color-space=bt709", "--muted", ...LOW_MEMORY]);
}
run("npx", ["remotion", "render", "ApporineFilm", "out/mix.wav", "--codec=wav", ...LOW_MEMORY]);

// 2. Loudness: one gain to -14 LUFS, then an oversampled limiter for the few voice peaks above -1 dB.
const before = loudness(mix);
const gain = TARGET_LUFS - before.integrated;
ffmpeg([
  "-i", mix,
  "-af", `volume=${gain.toFixed(2)}dB,aresample=192000,alimiter=limit=${10 ** (LIMIT_DB / 20)}:attack=5:release=60:level=disabled,aresample=48000`,
  "-c:a", "pcm_s24le", mixFinal,
]);
const after = loudness(mixFinal);
console.log(`mix: ${before.integrated} LUFS -> ${after.integrated} LUFS integrated, true peak ${after.truePeak} dBTP`);

// 3. Deliverables
const master = join(output, "apporine-film-master.mp4");
ffmpeg(["-i", picture, "-i", mixFinal, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", master]);

const webMp4 = join(output, "apporine-film-web.mp4");
const x264Web = ["-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-crf", "24"];
const encodeWeb = (cap) =>
  ffmpeg(["-i", picture, "-i", mixFinal, "-map", "0:v", "-map", "1:a", ...x264Web, ...cap, "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-shortest", webMp4]);
encodeWeb([]);
// The video bitrate that keeps a web file under the limit (128 kbps audio, 5% container headroom).
const videoKbps = Math.floor(((WEB_LIMIT_MB * 8e3) / DURATION) * 0.95 - 128);
let webCap = "none";
if (megabytes(webMp4) > WEB_LIMIT_MB) {
  // CRF 24, capped.
  webCap = `${videoKbps} kbps`;
  encodeWeb(["-maxrate", `${videoKbps}k`, "-bufsize", `${videoKbps * 2}k`]);
}

const webm = join(output, "apporine-film-web.webm");
// Constrained quality: CRF 34 with the same ceiling as the web MP4.
const vp9 = ["-c:v", "libvpx-vp9", "-crf", "34", "-b:v", `${videoKbps}k`, "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p"];
ffmpeg(["-i", picture, "-an", ...vp9, "-pass", "1", "-passlogfile", join(out, "vp9"), "-f", "null", "-"]);
ffmpeg(["-i", picture, "-i", mixFinal, "-map", "0:v", "-map", "1:a", ...vp9, "-pass", "2", "-passlogfile", join(out, "vp9"), "-c:a", "libopus", "-b:a", "128k", "-shortest", webm]);

const poster = join(output, "apporine-film-poster.webp");
ffmpeg(["-ss", "1.5", "-i", picture, "-frames:v", "1", "-c:v", "libwebp", "-quality", "86", poster]);

// One frame every 2 seconds (0 to 52 s), 6 across, each labelled with its time.
const sheet = join(output, "contact-sheet.jpg");
const font = "C\\:/Windows/Fonts/arial.ttf";
ffmpeg([
  "-i", picture,
  "-vf", [
    "select=not(mod(n\\,50))",
    "setpts=N/TB",
    "scale=480:270",
    `drawtext=fontfile='${font}':text='%{eif\\:n*2\\:d}.00 s':x=12:y=12:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6`,
    "tile=6x5:padding=6:margin=6:color=black",
  ].join(","),
  "-frames:v", "1", "-q:v", "3", sheet,
]);

rmSync(join(out, "vp9-0.log"), { force: true });
for (const file of [master, webMp4, webm, poster, sheet]) console.log(`${file}: ${megabytes(file).toFixed(2)} MB`);
console.log(`web mp4 bitrate cap: ${webCap}`);
