import { AbsoluteFill, useCurrentFrame } from "remotion";
import { accent, COLOURS, headline, label } from "./fonts";
import { easeBrand, FPS, progress } from "./timing";

// The on screen lines. They double as captions when the film plays muted on the website.
// A part in an array is the accent (Instrument Serif Italic, citrine).
type Part = string | [string];
type Row = { at: number; parts: Part[] };
type Caption = { start: number; end: number; rows: Row[]; denser?: Denser };
/** A stretch where the scrim is held at full strength and darker, for a bright background. */
type Denser = { start: number; end: number };

const REVEAL = 0.7;
const FADE_OUT = 0.4;
const ROW_STAGGER = 0.08;
const LEFT = 160;
const BOTTOM = 140;
const SIZE = 64;
const LINE = 0.95;
// Scrim alpha at its corner and at its middle stop, the stop's place, and the scrim's size (x the text block).
const SCRIM = { corner: 0.58, mid: 0.36, stop: 45, scale: 1 };
const SCRIM_DENSER = { corner: 0.8, mid: 0.68, stop: 55, scale: 1.25 };
const DENSER_RAMP = 0.3;

const rows = (at: number, ...lines: Part[][]): Row[] =>
  lines.map((parts, index) => ({ at: at + index * ROW_STAGGER, parts }));

const CAPTIONS: Caption[] = [
  { start: 0.4, end: 4.3, rows: rows(0.4, ["The world’s great industries"], ["were built to ", ["last."]]) },
  {
    start: 15.3,
    end: 23.8,
    rows: rows(15.3, ["Now they’re asked to move faster"], ["than they were ", ["designed to."]]),
  },
  {
    start: 24.5,
    end: 31.4,
    rows: [
      ...rows(24.5, ["Between that ambition and"], ["the systems beneath it,"]),
      { at: 28.64, parts: [["there is a gap."]] },
    ],
  },
  {
    start: 31.9,
    end: 37.4,
    rows: [
      { at: 31.9, parts: ["Others will advise you on it."] },
      { at: 34.53, parts: ["We build what ", ["closes it."]] },
    ],
  },
  {
    start: 37.7,
    end: 43.8,
    rows: [...rows(37.7, ["Engineered to be relied on"], ["for a ", ["decade."]]), { at: 42.66, parts: ["Not a quarter."] }],
    // Over the bright dissolve and the completed bridge (its railing crosses the text): 4.5:1.
    denser: { start: 37.5, end: 41.8 },
  },
];

// Spoken times of the four industries; each word stays until 10.00.
const INDUSTRIES = { end: 10.0, words: [["Capital", 4.67], ["Energy", 5.92], ["Networks", 7.07], ["Trade", 8.45]] as const };

/** A line slides up from behind an invisible edge. */
const Mask: React.FC<{ time: number; at: number; children: React.ReactNode }> = ({ time, at, children }) => {
  const shown = progress(time, at, at + REVEAL, easeBrand);
  return (
    // Padding keeps descenders and the italic overhang inside the mask.
    <span style={{ display: "inline-block", overflow: "hidden", padding: "0.12em 0.15em", margin: "-0.12em -0.15em", verticalAlign: "bottom" }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - shown) * 115}%)` }}>{children}</span>
    </span>
  );
};

/** Soft plum dark behind the text area only, anchored to the lower left. Never a box. */
const Scrim: React.FC<{ opacity: number; height: number; width: number; denser?: number }> = ({ opacity, height, width, denser = 0 }) => {
  const mix = (key: keyof typeof SCRIM) => SCRIM[key] + (SCRIM_DENSER[key] - SCRIM[key]) * denser;
  const [corner, mid, stop, scale] = [mix("corner"), mix("mid"), mix("stop"), mix("scale")];
  return (
  <div
    style={{
      position: "absolute",
      left: 0,
      bottom: 0,
      width: width * scale,
      height: height * scale,
      opacity,
      background: `radial-gradient(ellipse 100% 100% at 0% 100%, rgba(${COLOURS.plum950}, ${corner}) 0%, rgba(${COLOURS.plum950}, ${mid}) ${stop}%, rgba(${COLOURS.plum950}, 0) 100%)`,
    }}
  />
  );
};

const visibility = (time: number, start: number, end: number) =>
  Math.min(progress(time, start, start + REVEAL), 1 - progress(time, end - FADE_OUT, end));

const HeadlineCaption: React.FC<{ caption: Caption; time: number }> = ({ caption, time }) => {
  const opacity = visibility(time, caption.start, caption.end);
  const { denser } = caption;
  const dense = denser
    ? Math.min(progress(time, denser.start - DENSER_RAMP, denser.start), 1 - progress(time, denser.end, denser.end + DENSER_RAMP))
    : 0;
  if (opacity <= 0 && dense <= 0) return null;
  return (
    <AbsoluteFill>
      <Scrim
        opacity={Math.max(opacity, dense)}
        denser={dense}
        width={LEFT + 1100 + 260}
        height={BOTTOM + caption.rows.length * SIZE * LINE + 220}
      />
      <div style={{ position: "absolute", left: LEFT, bottom: BOTTOM, maxWidth: 1100, opacity, fontSize: SIZE, lineHeight: LINE }}>
        {caption.rows.map((row, index) => (
          <div key={index}>
            <Mask time={time} at={row.at}>
              {row.parts.map((part, partIndex) =>
                typeof part === "string" ? (
                  <span key={partIndex} style={{ ...headline, whiteSpace: "pre" }}>
                    {part}
                  </span>
                ) : (
                  <span key={partIndex} style={accent}>
                    {part[0]}
                  </span>
                ),
              )}
            </Mask>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const IndustriesCaption: React.FC<{ time: number }> = ({ time }) => {
  const opacity = visibility(time, INDUSTRIES.words[0][1], INDUSTRIES.end);
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill>
      <Scrim opacity={opacity} width={LEFT + 1300} height={BOTTOM + 220} />
      <div style={{ ...label, position: "absolute", left: LEFT, bottom: BOTTOM, opacity, fontSize: 40, letterSpacing: "0.18em", whiteSpace: "pre" }}>
        {INDUSTRIES.words.map(([word, at], index) => (
          <Mask key={word} time={time} at={at}>
            {index > 0 ? ` · ${word}` : word}
          </Mask>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => {
  const time = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill>
      {CAPTIONS.map((caption) => (
        <HeadlineCaption key={caption.start} caption={caption} time={time} />
      ))}
      <IndustriesCaption time={time} />
    </AbsoluteFill>
  );
};
