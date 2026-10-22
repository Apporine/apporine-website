import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "./captions";
import { GAP_TAIL, HOLD, segmentStart, SHOTS, type Shot } from "./edit";
import { EndCard } from "./end-card";
import { Soundtrack } from "./soundtrack";
import { Texture } from "./texture";
import { Thread } from "./thread";
import { DURATION, f, FPS, progress } from "./timing";

const FADE_UP = 0.6;
const FADE_OUT = 0.5;

const Clip: React.FC<{ shot: Shot; style?: React.CSSProperties }> = ({ shot, style }) => (
  <Sequence from={f(shot.start)} durationInFrames={f(shot.end) - f(shot.start)} name={shot.clip}>
    <OffthreadVideo src={staticFile(`clips/${shot.clip}.mp4`)} trimBefore={f(shot.in) - segmentStart(shot.clip)} muted style={style} />
  </Sequence>
);

/** Black over everything: the fade up from black at the start and the fade to black at the end. */
const Black: React.FC = () => {
  const time = useCurrentFrame() / FPS;
  const opacity = Math.max(1 - progress(time, 0, FADE_UP), progress(time, DURATION - FADE_OUT, DURATION));
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity }} />;
};

const GapTail: React.FC = () => {
  const time = useCurrentFrame() / FPS;
  return <Clip shot={GAP_TAIL} style={{ opacity: 1 - progress(time, GAP_TAIL.dissolveStart, GAP_TAIL.end) }} />;
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {SHOTS.map((shot) => (
      <Clip key={`${shot.clip}-${shot.start}`} shot={shot} />
    ))}
    <GapTail />
    <Sequence from={f(HOLD.start)} durationInFrames={f(HOLD.end) - f(HOLD.start)} name="control-room-hold">
      <Img src={staticFile(HOLD.image)} />
    </Sequence>
    <Thread />
    <EndCard />
    <Captions />
    <Texture />
    <Black />
    <Soundtrack />
  </AbsoluteFill>
);
