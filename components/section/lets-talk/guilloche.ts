/*
 * The Guilloché Reveal (homepage "Let’s talk"): engraved lines and two
 * rosettes, faint everywhere, gold where the light passes.
 *
 * Everything that does not move is drawn once per size into offscreen
 * canvases. The final picture is base, faint layer, gold through the light
 * mask, glow, then the centred darkening. The darkening is linear, so it is
 * split: baked into the still layer, and cut out of the moving light sprite
 * (destination-out). Each frame then only copies the still layer and adds one
 * small light sprite, with no allocation. Behind the text itself the gold is
 * held back (shields), so the copy stays readable at the brightest moment.
 */

/** Gold mask radius: clamp(170px, 14vw, 230px). Glow radius: 230px. */
const GLOW_RADIUS = 230;
const LIGHT_BOX = GLOW_RADIUS * 2;

export function maskRadius(width: number): number {
  return Math.min(230, Math.max(170, width * 0.14));
}

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

/** 80 horizontal guilloché lines and two elliptical rosettes of 44 rings, in CSS pixels. */
function patternPath(width: number, height: number): Path2D {
  const path = new Path2D();

  const lines = 80;
  for (let k = 0; k < lines; k++) {
    const y0 = height * (0.04 + (0.94 * k) / (lines - 1));
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

  for (const [cx, cy] of [
    [width * 0.12, height * 0.3],
    [width * 0.88, height * 0.72],
  ]) {
    for (let k = 0; k < 44; k++) {
      for (let angle = 0; angle <= Math.PI * 2 + 0.03; angle += 0.03) {
        const radius = 36 + k * 3.4 + Math.sin(angle * 12 + k * 0.3) * 6;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.62;
        if (angle === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
    }
  }

  return path;
}

/** Centred darkening: rgba(14,3,20,0.55) at the centre to 0 at 55% of the larger side. */
function paintDarkening(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const darkening = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.55);
  darkening.addColorStop(0, "rgba(14,3,20,0.55)");
  darkening.addColorStop(1, "rgba(14,3,20,0)");
  ctx.fillStyle = darkening;
  ctx.fillRect(0, 0, width, height);
}

/** Marks the content block: the gold holds back behind its headline and paragraphs. */
export const shieldAttribute = { "data-guilloche-shield": "" };

/** A text block to keep readable, in CSS pixels relative to the canvas. */
export type Shield = { x: number; y: number; width: number; height: number };

/**
 * Behind text the gold keeps a quarter of its strength, so every line of
 * copy holds 4.5:1 even with the light right on it. Soft edges, 12px out.
 */
const SHIELD_STRENGTH = 0.75;
const SHIELD_PAD = 12;
const SHIELD_SOFTNESS = 16;

function paintShields(ctx: CanvasRenderingContext2D, shields: Shield[], dpr: number) {
  ctx.fillStyle = `rgba(0,0,0,${SHIELD_STRENGTH})`;
  ctx.shadowColor = `rgba(0,0,0,${SHIELD_STRENGTH})`;
  ctx.shadowBlur = SHIELD_SOFTNESS * dpr;
  ctx.beginPath();
  for (const { x, y, width, height } of shields) {
    ctx.roundRect(x - SHIELD_PAD, y - SHIELD_PAD, width + SHIELD_PAD * 2, height + SHIELD_PAD * 2, SHIELD_PAD);
  }
  ctx.fill();
}

export type Guilloche = {
  /** Draws a frame with the light at (x, y), in CSS pixels. */
  draw(x: number, y: number): void;
};

/** Prepares the layers for a canvas of `width` × `height` CSS pixels at `dpr`. */
export function createGuilloche(
  target: HTMLCanvasElement,
  width: number,
  height: number,
  dpr: number,
  shields: Shield[],
): Guilloche {
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  target.width = pixelWidth;
  target.height = pixelHeight;
  const ctx = context(target);
  const path = patternPath(width, height);

  // Still layer: base, faint lines, darkening.
  const still = canvas(pixelWidth, pixelHeight);
  const stillCtx = context(still);
  stillCtx.scale(dpr, dpr);
  const base = stillCtx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#100318");
  base.addColorStop(1, "#26092F");
  stillCtx.fillStyle = base;
  stillCtx.fillRect(0, 0, width, height);
  stillCtx.strokeStyle = "rgba(201,179,222,0.10)";
  stillCtx.lineWidth = 0.7;
  stillCtx.stroke(path);
  paintDarkening(stillCtx, width, height);

  const gold = canvas(pixelWidth, pixelHeight);
  const goldCtx = context(gold);
  goldCtx.scale(dpr, dpr);
  goldCtx.strokeStyle = "rgba(255,226,120,1)";
  goldCtx.lineWidth = 1;
  goldCtx.stroke(path);

  // Light sprite pieces, centred in a 460px box.
  const box = Math.round(LIGHT_BOX * dpr);
  const centre = box / 2;
  const radius = maskRadius(width) * dpr;

  const mask = canvas(box, box);
  const maskCtx = context(mask);
  const maskGradient = maskCtx.createRadialGradient(centre, centre, 0, centre, centre, radius);
  maskGradient.addColorStop(0, "rgba(0,0,0,1)");
  maskGradient.addColorStop(0.45, "rgba(0,0,0,0.6)");
  maskGradient.addColorStop(1, "rgba(0,0,0,0)");
  maskCtx.fillStyle = maskGradient;
  maskCtx.fillRect(0, 0, box, box);

  const glow = canvas(box, box);
  const glowCtx = context(glow);
  const glowGradient = glowCtx.createRadialGradient(centre, centre, 0, centre, centre, GLOW_RADIUS * dpr);
  glowGradient.addColorStop(0, "rgba(245,200,110,0.16)");
  glowGradient.addColorStop(1, "rgba(245,200,110,0)");
  glowCtx.fillStyle = glowGradient;
  glowCtx.fillRect(0, 0, box, box);

  // Cut out of the light sprite, so gold and glow take the darkening too,
  // and hold back behind the text.
  const darkening = canvas(pixelWidth, pixelHeight);
  const darkeningCtx = context(darkening);
  darkeningCtx.scale(dpr, dpr);
  paintDarkening(darkeningCtx, width, height);
  paintShields(darkeningCtx, shields, dpr);

  // The one reused temporary canvas: the light sprite for this frame.
  const light = canvas(box, box);
  const lightCtx = context(light);

  return {
    draw(x, y) {
      const left = Math.round(x * dpr - centre);
      const top = Math.round(y * dpr - centre);

      lightCtx.globalCompositeOperation = "copy";
      lightCtx.drawImage(gold, left, top, box, box, 0, 0, box, box);
      lightCtx.globalCompositeOperation = "destination-in";
      lightCtx.drawImage(mask, 0, 0);
      lightCtx.globalCompositeOperation = "lighter";
      lightCtx.drawImage(glow, 0, 0);
      lightCtx.globalCompositeOperation = "destination-out";
      lightCtx.drawImage(darkening, left, top, box, box, 0, 0, box, box);

      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(still, 0, 0);
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(light, left, top);
    },
  };
}
