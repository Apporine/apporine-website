import { Composition } from "remotion";
import { Film } from "./film";
import { DURATION, FPS, HEIGHT, WIDTH } from "./timing";

export const Root: React.FC = () => (
  <Composition id="ApporineFilm" component={Film} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} />
);
