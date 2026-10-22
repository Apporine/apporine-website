import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GAP_TAIL, HOLD, SHOTS } from "./edit";
import { COLOURS } from "./fonts";
import { easeBrand, f, FPS, HEIGHT, progress, WIDTH } from "./timing";
import tracking from "./tracking.json";

// The citrine thread: 2 px, soft glow (8 px blur at 60%). Used three times only.
type Point = [number, number];
type Deck = { tower: Point; end: Point };
type TrackedFrame = { left: Deck; right: Deck };

const DRAW_START = 25.0;
const DRAW_TIME = 1.5;
const JOIN_TIME = 0.5;
const ACROSS = { start: HOLD.start, drawn: 44.5, point: 45.0 };

const GAP = SHOTS.find((shot) => shot.clip === "ai-bridge-gap")!;
const frames = (tracking as { frames: TrackedFrame[] }).frames;

const mix = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** The proxy frame of the bridge gap on screen at this composition frame (same rounding as the Sequences). */
const gapFrame = (frame: number, shot: { start: number; in: number }) =>
  frames[Math.min(frames.length - 1, f(shot.in) + frame - f(shot.start))];

const Line: React.FC<{ from: Point; to: Point; opacity?: number }> = ({ from, to, opacity = 1 }) => (
  <line
    x1={from[0]}
    y1={from[1]}
    x2={to[0]}
    y2={to[1]}
    stroke={COLOURS.citrine}
    strokeWidth={2}
    strokeLinecap="round"
    opacity={opacity}
  />
);

export const Thread: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / FPS;
  let lines: React.ReactNode = null;

  if (frame >= f(GAP.start) && frame < f(GAP.end) && time >= DRAW_START) {
    // From each tower toward the gap, stopping at the deck's open end.
    const { left, right } = gapFrame(frame, GAP);
    const drawn = progress(time, DRAW_START, DRAW_START + DRAW_TIME, easeBrand);
    lines = (
      <>
        <Line from={left.tower} to={mix(left.tower, left.end, drawn)} />
        <Line from={right.tower} to={mix(right.tower, right.end, drawn)} />
      </>
    );
  } else if (frame >= f(GAP_TAIL.start) && frame < f(GAP_TAIL.end)) {
    // The two threads extend and join across the gap, then leave with the dissolve.
    const { left, right } = gapFrame(frame, GAP_TAIL);
    const join = progress(time, GAP_TAIL.start, GAP_TAIL.start + JOIN_TIME, easeBrand);
    const middle = mix(left.end, right.end, 0.5);
    const opacity = 1 - progress(time, GAP_TAIL.dissolveStart, GAP_TAIL.end);
    lines = (
      <>
        <Line from={left.tower} to={mix(left.end, middle, join)} opacity={opacity} />
        <Line from={right.tower} to={mix(right.end, middle, join)} opacity={opacity} />
      </>
    );
  } else if (time >= ACROSS.start && time < HOLD.end) {
    // Across the frame centre, then contracting into one bright point at the centre.
    const centre: Point = [WIDTH / 2, HEIGHT / 2];
    const drawn = progress(time, ACROSS.start, ACROSS.drawn, easeBrand);
    const contract = progress(time, ACROSS.drawn, ACROSS.point, easeBrand);
    const from = mix([0, centre[1]], centre, contract);
    const to = mix(mix([0, centre[1]], [WIDTH, centre[1]], drawn), centre, contract);
    lines = (
      <>
        <Line from={from} to={to} />
        <circle cx={centre[0]} cy={centre[1]} r={3.5} fill={COLOURS.citrine} opacity={contract} />
      </>
    );
  }

  return (
    <AbsoluteFill>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ filter: "drop-shadow(0 0 8px rgba(245, 230, 99, 0.6))" }}
      >
        {lines}
      </svg>
    </AbsoluteFill>
  );
};
