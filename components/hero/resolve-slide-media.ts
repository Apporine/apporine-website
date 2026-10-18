import { existsSync } from "node:fs";
import path from "node:path";
import type { Rendition, Slide, SlideContent } from "./slides";

/*
 * Server only. Checks which hero media files exist in /public/videos when the
 * page is rendered (at build time, as the homepage is static). Dropping new
 * files such as hero-03-bridge.mp4 into /public/videos therefore enables them
 * on the next build with no code changes; until then the slide shows the plum
 * gradient fallback.
 */

const VIDEOS_DIR = path.join(process.cwd(), "public", "videos");

function publicFile(fileName: string): string | null {
  return existsSync(path.join(VIDEOS_DIR, fileName)) ? `/videos/${fileName}` : null;
}

function rendition(baseName: string): Rendition {
  return {
    webm: publicFile(`${baseName}.webm`),
    mp4: publicFile(`${baseName}.mp4`),
    poster: publicFile(`${baseName}-poster.webp`),
  };
}

export function resolveSlideMedia(content: SlideContent[]): Slide[] {
  return content.map((slide) => {
    const desktop = rendition(slide.video);
    const mobile = rendition(`${slide.video}-mobile`);
    const hasMobileVideo = Boolean(mobile.webm || mobile.mp4);

    return {
      ...slide,
      media: {
        desktop,
        mobile: {
          webm: hasMobileVideo ? mobile.webm : desktop.webm,
          mp4: hasMobileVideo ? mobile.mp4 : desktop.mp4,
          poster: mobile.poster ?? desktop.poster,
        },
      },
    };
  });
}
