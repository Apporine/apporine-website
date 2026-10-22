import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { accent, COLOURS, headline } from "./fonts";
import { easeBrand, FPS, progress } from "./timing";

// 45.10 to 53.00: the Falcon, the wordmark and the line, on Imperial Plum.
const PLUM_FADE = { start: 44.2, end: 45.1 };
// The Falcon and the wordmark at 130%, the line at 120% (220 px, 72 px and 40 px before).
const FALCON = { at: 45.1, rise: 0.9, width: 286, height: 125 };
const WORDMARK = { at: 45.38, stagger: 0.06, reveal: 0.45, size: 94, gap: 52 };
const LINE = { at: 47.04, fade: 0.6, size: 48, gap: 36 };

// A P P [O] R I N E; the O is the ring image.
const LETTERS = ["A", "P", "P", "O", "R", "I", "N", "E"];
// Bricolage Grotesque cap height is about 0.7 em; the ring O matches it, with a round letter's overshoot.
const RING_O = Math.round(WORDMARK.size * 0.74);

const CENTRE_Y = 540;
// The stack (Falcon, wordmark, line) centred on the frame.
const STACK_TOP = Math.round(CENTRE_Y - (FALCON.height + WORDMARK.gap + WORDMARK.size + LINE.gap + LINE.size) / 2);

export const EndCard: React.FC = () => {
  const time = useCurrentFrame() / FPS;
  const plum = progress(time, PLUM_FADE.start, PLUM_FADE.end);
  if (plum <= 0) return null;

  const falcon = progress(time, FALCON.at, FALCON.at + FALCON.rise, easeBrand);
  const bloom = progress(time, FALCON.at, FALCON.at + 0.6);
  const line = progress(time, LINE.at, LINE.at + LINE.fade, easeBrand);
  // The Falcon grows out of the point at the frame centre and rises into place.
  const falconRise = (CENTRE_Y - FALCON.height / 2 - STACK_TOP) * (1 - falcon);

  return (
    <AbsoluteFill
      style={{
        opacity: plum,
        backgroundColor: COLOURS.plum800,
        backgroundImage: `radial-gradient(ellipse 55% 60% at 50% 50%, ${COLOURS.plum700} 0%, rgba(68, 20, 90, 0) 100%)`,
      }}
    >
      {time >= FALCON.at && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: CENTRE_Y,
            width: 260,
            height: 260,
            marginLeft: -130,
            marginTop: -130,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(245, 230, 99, 0.85) 0%, rgba(245, 230, 99, 0.25) 18%, rgba(245, 230, 99, 0) 60%)`,
            transform: `scale(${0.03 + bloom * 0.97})`,
            opacity: 1 - bloom,
          }}
        />
      )}
      <div style={{ position: "absolute", top: STACK_TOP, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img
          src={staticFile("brand/falcon-clean@3x.png")}
          style={{
            width: FALCON.width,
            height: FALCON.height,
            opacity: falcon,
            transform: `translateY(${falconRise}px) scale(${0.15 + falcon * 0.85})`,
          }}
        />
        <div
          style={{
            ...headline,
            marginTop: WORDMARK.gap,
            fontSize: WORDMARK.size,
            lineHeight: 1,
            letterSpacing: "0.12em",
            marginRight: "-0.12em",
            display: "flex",
            alignItems: "center",
          }}
        >
          {LETTERS.map((letter, index) => {
            const shown = progress(time, WORDMARK.at + index * WORDMARK.stagger, WORDMARK.at + index * WORDMARK.stagger + WORDMARK.reveal, easeBrand);
            const style: React.CSSProperties = {
              display: "inline-block",
              opacity: shown,
              transform: `translateY(${(1 - shown) * 10}px)`,
              filter: `blur(${(1 - shown) * 6}px)`,
            };
            return letter === "O" ? (
              <Img
                key={index}
                src={staticFile("brand/wordmark-o@3x.png")}
                style={{ ...style, width: RING_O, height: RING_O, marginRight: "0.12em" }}
              />
            ) : (
              <span key={index} style={style}>
                {letter}
              </span>
            );
          })}
        </div>
        <div style={{ ...accent, textTransform: "none", marginTop: LINE.gap, fontSize: LINE.size, lineHeight: 1, opacity: line, transform: `translateY(${(1 - line) * 8}px)` }}>
          Pristine, by design.
        </div>
      </div>
    </AbsoluteFill>
  );
};
