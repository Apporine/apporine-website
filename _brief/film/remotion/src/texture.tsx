import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HEIGHT, WIDTH } from "./timing";

/** A very subtle film grain (about 3%), new every frame, and a soft vignette (about 10%). */
export const Texture: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", opacity: 0.03 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 75% 75% at 50% 50%, rgba(11, 10, 13, 0) 55%, rgba(11, 10, 13, 0.1) 85%, rgba(11, 10, 13, 0.18) 100%)" }}
      />
    </AbsoluteFill>
  );
};
