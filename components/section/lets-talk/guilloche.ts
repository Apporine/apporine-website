/*
 * The Guilloché Reveal (homepage "Let’s talk"): engraved wave lines with the
 * Falcon engraved into them like a banknote watermark, softly visible
 * everywhere, gold wherever a light passes.
 *
 * Everything that does not move is drawn once per size into offscreen
 * canvases. The picture is base, faint layer, gold through the lights' mask,
 * glows, then the shade behind the text. The shade is linear, so it is
 * split: baked into the still layer, and cut out of the moving light layer
 * (destination-out), where the gold also holds back behind each line of copy. Each frame reuses the same mask and light canvases and
 * draws prepared light sprites, so nothing is allocated per frame.
 */

/** Marks the content block: the shade centres on it, and the gold holds back behind its headline and paragraphs. */
export const contentAttribute = { "data-guilloche-content": "" };

/** The Falcon whose alpha channel shapes the watermarks. */
export const FALCON_SRC = "/brand/falcon-clean@3x.png";

/** A Falcon watermark: centre and width in CSS pixels. */
export type Watermark = { x: number; y: number; width: number };

function clamp(min: number, value: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Watermark placement: a large Falcon right of the text and a small one on
 * the left; under 768px one Falcon low in the section.
 */
export function watermarks(width: number, height: number, viewportWidth: number): Watermark[] {
  if (viewportWidth < 768) return [{ x: width * 0.5, y: height * 0.8, width: viewportWidth * 0.7 }];
  return [
    { x: width * 0.76, y: height * 0.5, width: clamp(360, viewportWidth * 0.32, 620) },
    { x: width * 0.2, y: height * 0.42, width: clamp(180, viewportWidth * 0.16, 310) },
  ];
}

/** A light, in CSS pixels; strength 0 to 1. */
export type Light = { x: number; y: number; radius: number; strength: number };

/** Sprite resolution for the radial light and glow shapes. */
const SPRITE = 512;
/** The glow reaches 1.15 × the light radius. */
const GLOW_REACH = 1.15;

function canvas(width: number, height: number): HTMLCanvasElement {
  const element = document.createElement("canvas");
  element.width = width;
  element.height = height;
  return element;
}

function context(element: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = element.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is unavailable");
  return ctx;
}

/** A radial sprite: `stops` as [offset, colour] from the centre to the edge. */
function radialSprite(stops: [number, string][]): HTMLCanvasElement {
  const sprite = canvas(SPRITE, SPRITE);
  const ctx = context(sprite);
  const half = SPRITE / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  for (const [offset, colour] of stops) gradient.addColorStop(offset, colour);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SPRITE, SPRITE);
  return sprite;
}

/** 80 horizontal guilloché lines from 3% to 98% of the height, in CSS pixels. */
function wavePath(width: number, height: number): Path2D {
  const path = new Path2D();
  const lines = 80;
  for (let k = 0; k < lines; k++) {
    const y0 = height * (0.03 + (0.95 * k) / (lines - 1));
    for (let x = 0; x <= width + 3; x += 3) {
      const y =
        y0 +
        Math.sin(x * 0.016 + k * 0.22) * 14 +
        Math.sin(x * 0.006 - k * 0.13) * 24 +
        Math.cos(x * 0.028 + k * 0.4) * 4;
      if (x === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
  }
  return path;
}

/** The fine engraving inside each Falcon: lines 2.6px apart, gently waved, across its box. */
function falconFillPath(boxes: DOMRect[]): Path2D {
  const path = new Path2D();
  for (const box of boxes) {
    for (let y = box.top; y <= box.bottom; y += 2.6) {
      for (let x = box.left; x <= box.right + 2; x += 2) {
        const waved = y + Math.sin(x * 0.05 + y * 0.02) * 1.6;
        if (x === box.left) path.moveTo(x, waved);
        else path.lineTo(x, waved);
      }
    }
  }
  return path;
}

/**
 * Behind each line of copy the gold all but disappears, so the
 * text holds 4.5:1 even with a light right on it. Only the blurred shadow
 * of the shapes is drawn (the shapes sit offscreen), so the whole edge fades
 * like a haze, never a box; the pad keeps full strength over the text.
 */
const SHIELD_STRENGTH = 0.85;
const SHIELD_PAD = 28;
const SHIELD_SOFTNESS = 40;
const OFFSCREEN = 100_000;

function paintShields(ctx: CanvasRenderingContext2D, shields: DOMRect[], dpr: number) {
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.shadowColor = `rgba(0,0,0,${SHIELD_STRENGTH})`;
  ctx.shadowBlur = SHIELD_SOFTNESS * dpr;
  // Shadow offsets ignore the transform, so they are in device pixels.
  ctx.shadowOffsetX = OFFSCREEN * dpr;
  ctx.beginPath();
  for (const box of shields) {
    ctx.roundRect(box.x - SHIELD_PAD - OFFSCREEN, box.y - SHIELD_PAD, box.width + SHIELD_PAD * 2, box.height + SHIELD_PAD * 2, SHIELD_PAD);
  }
  // Twice: the blur thins a short line's shield, the second pass restores it.
  ctx.fill();
  ctx.fill();
  ctx.restore();
}

/** Shade behind the text: rgba(14,3,20,0.5) at the content centre to 0 at 36% of the larger side. */
function paintShade(ctx: CanvasRenderingContext2D, width: number, height: number, centre: { x: number; y: number }) {
  const shade = ctx.createRadialGradient(centre.x, centre.y, 0, centre.x, centre.y, Math.max(width, height) * 0.36);
  shade.addColorStop(0, "rgba(14,3,20,0.5)");
  shade.addColorStop(1, "rgba(14,3,20,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);
}

export type GuillocheScene = {
  /** Size in CSS pixels, and the device pixel ratio to draw at. */
  width: number;
  height: number;
  dpr: number;
  /** Centre of the content block: the shade behind the text centres on it. */
  textCentre: { x: number; y: number };
  /** Boxes of the lines of copy: the gold holds back behind them. */
  shields: DOMRect[];
  /** The Falcon image (its alpha is the shape); null leaves the watermarks out. */
  falcon: HTMLImageElement | null;
  placements: Watermark[];
};

export type Guilloche = {
  /** Draws a frame lit by `lights`. */
  draw(lights: readonly Light[]): void;
};

/** Prepares every layer of `scene` and draws frames into `target`. */
export function createGuilloche(target: HTMLCanvasElement, scene: GuillocheScene): Guilloche {
  const { width, height, dpr, textCentre, shields, falcon, placements } = scene;
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  target.width = pixelWidth;
  target.height = pixelHeight;
  const ctx = context(target);
  const waves = wavePath(width, height);

  // The Falcon shapes, drawn twice so the soft wing interiors read as solid.
  const boxes = falcon
    ? placements.map(({ x, y, width: w }) => {
        const h = (w * falcon.naturalHeight) / falcon.naturalWidth;
        return new DOMRect(x - w / 2, y - h / 2, w, h);
      })
    : [];
  const falconMask = canvas(pixelWidth, pixelHeight);
  const falconMaskCtx = context(falconMask);
  falconMaskCtx.scale(dpr, dpr);
  for (const box of boxes) {
    falconMaskCtx.drawImage(falcon!, box.x, box.y, box.width, box.height);
    falconMaskCtx.drawImage(falcon!, box.x, box.y, box.width, box.height);
  }
  const falconFill = falconFillPath(boxes);

  /** Wave lines with the Falcons cut out, and the Falcons filled with fine engraving. */
  function engrave(stroke: string, lineWidth: number): HTMLCanvasElement {
    const layer = canvas(pixelWidth, pixelHeight);
    const layerCtx = context(layer);
    layerCtx.scale(dpr, dpr);
    layerCtx.strokeStyle = stroke;
    layerCtx.lineWidth = lineWidth;
    layerCtx.stroke(waves);
    if (!boxes.length) return layer;

    const fill = canvas(pixelWidth, pixelHeight);
    const fillCtx = context(fill);
    fillCtx.scale(dpr, dpr);
    fillCtx.strokeStyle = stroke;
    fillCtx.lineWidth = lineWidth;
    fillCtx.stroke(falconFill);
    fillCtx.setTransform(1, 0, 0, 1, 0, 0);
    fillCtx.globalCompositeOperation = "destination-in";
    fillCtx.drawImage(falconMask, 0, 0);

    layerCtx.setTransform(1, 0, 0, 1, 0, 0);
    layerCtx.globalCompositeOperation = "destination-out";
    layerCtx.drawImage(falconMask, 0, 0);
    layerCtx.globalCompositeOperation = "source-over";
    layerCtx.drawImage(fill, 0, 0);
    return layer;
  }

  // Still layer: base, faint engraving, shade.
  const still = canvas(pixelWidth, pixelHeight);
  const stillCtx = context(still);
  stillCtx.scale(dpr, dpr);
  const base = stillCtx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#130420");
  base.addColorStop(1, "#2B0B36");
  stillCtx.fillStyle = base;
  stillCtx.fillRect(0, 0, width, height);
  stillCtx.drawImage(engrave("rgba(201,179,222,0.17)", 0.7), 0, 0, width, height);
  paintShade(stillCtx, width, height, textCentre);

  const gold = engrave("rgba(255,226,120,1)", 1);

  // Cut out of the light layer, so gold and glows take the shade too, and
  // hold back behind the copy.
  const shade = canvas(pixelWidth, pixelHeight);
  const shadeCtx = context(shade);
  shadeCtx.scale(dpr, dpr);
  paintShade(shadeCtx, width, height, textCentre);
  paintShields(shadeCtx, shields, dpr);

  // Light shape (full at the centre, 55% at 45% of the radius) and glow.
  const lightSprite = radialSprite([
    [0, "rgba(0,0,0,1)"],
    [0.45, "rgba(0,0,0,0.55)"],
    [1, "rgba(0,0,0,0)"],
  ]);
  const glowSprite = radialSprite([
    [0, "rgba(245,200,110,0.14)"],
    [1, "rgba(245,200,110,0)"],
  ]);

  // Reused every frame: the lights' combined mask, and the lit gold layer.
  const mask = canvas(pixelWidth, pixelHeight);
  const maskCtx = context(mask);
  const lit = canvas(pixelWidth, pixelHeight);
  const litCtx = context(lit);

  function stamp(layer: CanvasRenderingContext2D, sprite: HTMLCanvasElement, light: Light, reach: number) {
    const size = light.radius * reach * 2 * dpr;
    layer.globalAlpha = light.strength;
    layer.drawImage(sprite, light.x * dpr - size / 2, light.y * dpr - size / 2, size, size);
  }

  return {
    draw(lights) {
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.clearRect(0, 0, pixelWidth, pixelHeight);
      maskCtx.globalCompositeOperation = "lighter";
      for (const light of lights) if (light.strength > 0.002) stamp(maskCtx, lightSprite, light, 1);

      litCtx.globalAlpha = 1;
      litCtx.globalCompositeOperation = "copy";
      litCtx.drawImage(gold, 0, 0);
      litCtx.globalCompositeOperation = "destination-in";
      litCtx.drawImage(mask, 0, 0);
      litCtx.globalCompositeOperation = "lighter";
      for (const light of lights) if (light.strength > 0.002) stamp(litCtx, glowSprite, light, GLOW_REACH);
      litCtx.globalAlpha = 1;
      litCtx.globalCompositeOperation = "destination-out";
      litCtx.drawImage(shade, 0, 0);

      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(still, 0, 0);
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(lit, 0, 0);
    },
  };
}
