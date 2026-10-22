// Builds the editing media from the untouched sources in _brief/film.
//   1. proxies/<name>.mp4      1920x1080, 25 fps, ungraded (slow, run once)
//   2. public/clips/<name>.mp4 the graded part of the proxy the edit uses, with 1 s handles
//      (its first frame is recorded in src/segments.json for the composition)
// One clip at a time, to keep memory low.
// Usage: node scripts/prepare-video.mjs [--grade-only] [name ...]
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const film = join(root, "..");
const proxies = join(root, "proxies");
const clips = join(root, "public", "clips");

const FIT = "scale=1920:1080:flags=lanczos";

// The look shared by every clip: warm neutral, saturation about 88%, gentle contrast,
// blacks lifted very slightly, soft highlights.
const BASE = [
  "eq=saturation=0.88",
  "curves=master='0/0.022 0.25/0.245 0.5/0.5 0.75/0.75 1/0.965'",
  "colorbalance=rm=0.012:bm=-0.012:rh=0.008:bh=-0.01",
];

// Per clip: source, how to frame it, and the corrections that bring it to the base look.
const CLIPS = {
  // Daylight kept neutral: the sky and sea calmed so they do not read as a blue cast.
  "shot-01-city": { src: "shots/shot-01-city.mp4", fit: FIT, grade: ["huesaturation=saturation=-0.35:colors=c+b"] },
  "shot-02-capital": { src: "shots/shot-02-capital.mp4", fit: FIT, grade: [] },
  "shot-02-energy": { src: "shots/shot-02-energy.mp4", fit: FIT, grade: [] },
  "shot-02-networks": { src: "shots/shot-02-networks.mp4", fit: FIT, grade: [] },
  // Green sea.
  "shot-02-trade": { src: "shots/shot-02-trade.mp4", fit: FIT, grade: ["huesaturation=saturation=-0.4:colors=g+c", "colorbalance=gm=-0.03"] },
  // Strong orange autumn trees.
  "shot-03-dam": { src: "shots/shot-03-dam.mp4", fit: FIT, grade: ["huesaturation=saturation=-0.45:colors=r+y", "colorbalance=rm=-0.03:bm=0.02"] },
  // Vertical 2160x3840: a landscape band of the light trails, below the skyline and towers.
  "shot-04-speed": { src: "shots/shot-04-speed.mp4", fit: `crop=2160:1215:0:2040,${FIT}`, grade: ["huesaturation=saturation=-0.25:colors=r+m"] },
  // Blue departure boards.
  "shot-05-crowd": { src: "shots/shot-05-crowd.mp4", fit: FIT, grade: ["huesaturation=saturation=-0.45:colors=c+b", "colorbalance=bm=-0.02"] },
  // The blue pharmacy cross sign in the background.
  "shot-05-payment": { src: "shots/shot-05-payment.mp4", fit: FIT, grade: ["huesaturation=saturation=-0.5:colors=c+b"] },
  // 4096x2160 (DCI): a centred 16:9 crop, so nothing is squeezed. Cool window light.
  "shot-07-boardroom": {
    src: "shots/shot-07-boardroom.mp4",
    fit: `crop=3840:2160,${FIT}`,
    grade: ["huesaturation=saturation=-0.35:colors=c+b", "colorbalance=rm=0.03:bm=-0.03"],
  },
  // Teal sky and green cast.
  "shot-09-bridge": {
    src: "shots/shot-09-bridge.mp4",
    fit: FIT,
    grade: ["huesaturation=saturation=-0.85:colors=c+b", "huesaturation=saturation=-0.45:colors=g", "colorbalance=gs=-0.04:gm=-0.08:gh=-0.12:rh=0.05:bm=-0.02:rm=0.02"],
  },
  // Blue video wall.
  "shot-09-control-room": {
    src: "shots/shot-09-control-room.mp4",
    fit: FIT,
    grade: ["huesaturation=saturation=-0.5:colors=c+b", "colorbalance=rm=0.03:bm=-0.04"],
  },
  "ai-bridge-gap": { src: "ai/ai-bridge-gap.mp4", fit: FIT, grade: [] },
  "ai-connection": { src: "ai/ai-connection.mp4", fit: FIT, grade: [] },
  // Warm desk light.
  "build-typing": { src: "apporine/build-typing.mp4", fit: FIT, grade: ["huesaturation=saturation=-0.25:colors=r+y", "colorbalance=rm=-0.02:bm=0.03"] },
  // Cool city through the glass.
  "build-sketch": { src: "apporine/build-sketch.mp4", fit: FIT, grade: ["huesaturation=saturation=-0.3:colors=c+b", "colorbalance=gm=-0.02:bm=-0.02"] },
};

const H264 = ["-c:v", "libx264", "-preset", "medium", "-g", "25", "-pix_fmt", "yuv420p",
  "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-an"];

function ffmpeg(args) {
  const run = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (run.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}

const gradeOnly = process.argv.includes("--grade-only");
const names = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
mkdirSync(proxies, { recursive: true });
mkdirSync(clips, { recursive: true });

// The frames of each proxy the edit uses (same rounding as the composition), with 1 s handles.
const edit = JSON.parse(readFileSync(join(root, "src", "edit.json"), "utf8"));
const f = (seconds) => Math.round(seconds * 25);
const HANDLE = 25;
function segment(name) {
  const uses = [...edit.shots, edit.gapTail].filter((shot) => shot.clip === name);
  const first = Math.min(...uses.map((shot) => f(shot.in)));
  const last = Math.max(...uses.map((shot) => f(shot.in) + f(shot.end) - f(shot.start)));
  return { start: Math.max(0, first - HANDLE), end: last + HANDLE };
}
const segmentsFile = join(root, "src", "segments.json");
const segments = existsSync(segmentsFile) ? JSON.parse(readFileSync(segmentsFile, "utf8")) : {};

for (const [name, clip] of Object.entries(CLIPS)) {
  if (names.length && !names.includes(name)) continue;
  const proxy = join(proxies, `${name}.mp4`);
  if (!gradeOnly || !existsSync(proxy)) {
    console.log(`proxy  ${name}`);
    ffmpeg(["-i", join(film, clip.src), "-vf", `${clip.fit},fps=25,setsar=1`, ...H264, "-crf", "14", proxy]);
  }
  const { start, end } = segment(name);
  console.log(`grade  ${name} (proxy frames ${start} to ${end})`);
  const trim = `trim=start_frame=${start}:end_frame=${end},setpts=PTS-STARTPTS`;
  ffmpeg(["-i", proxy, "-vf", [trim, ...clip.grade, ...BASE].join(","), ...H264, "-crf", "15", join(clips, `${name}.mp4`)]);
  segments[name] = start;
  writeFileSync(segmentsFile, `${JSON.stringify(segments, null, 2)}
`);
}

// The control room's last frame on screen (composition frame 1097 = proxy frame 25 + 52), held 43.90 to 45.10.
if (!names.length || names.includes("shot-09-control-room")) {
  const frame = 77 - segments["shot-09-control-room"];
  ffmpeg(["-i", join(clips, "shot-09-control-room.mp4"), "-vf", `select=eq(n\\,${frame})`, "-frames:v", "1", join(clips, "control-room-hold.png")]);
}
