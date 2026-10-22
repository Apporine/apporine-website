import { loadVariableFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";

// Bricolage as the variable font, so the width axis (75) is available through font-stretch.
const display = loadBricolage("normal", { subsets: ["latin"] }).fontFamily;
const serif = loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const mono = loadPlexMono("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;

export const COLOURS = {
  pearl: "#FBF9FC",
  citrine: "#F5E663",
  plum800: "#2E0A3A",
  plum700: "#44145A",
  plum950: "18, 4, 26",
} as const;

export const headline: React.CSSProperties = {
  fontFamily: display,
  fontWeight: 800,
  fontStretch: "75%",
  textTransform: "uppercase",
  color: COLOURS.pearl,
};

export const accent: React.CSSProperties = {
  fontFamily: serif,
  fontStyle: "italic",
  fontWeight: 400,
  textTransform: "lowercase",
  color: COLOURS.citrine,
};

export const label: React.CSSProperties = {
  fontFamily: mono,
  fontWeight: 500,
  textTransform: "uppercase",
  color: COLOURS.pearl,
};
