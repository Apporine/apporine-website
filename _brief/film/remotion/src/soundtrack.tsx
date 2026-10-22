import { Html5Audio, staticFile } from "remotion";

// Two separate layers, both made by scripts/prepare-audio.mjs:
//   voice.wav       the voiceover at about -16 LUFS, from 0.00. Swap it with: npm run prepare:audio -- <voice file>
//   music-bed.wav   track.mp3 with its level automation and the ducking under that voice already applied
export const Soundtrack: React.FC = () => (
  <>
    <Html5Audio src={staticFile("audio/music-bed.wav")} />
    <Html5Audio src={staticFile("audio/voice.wav")} />
  </>
);
