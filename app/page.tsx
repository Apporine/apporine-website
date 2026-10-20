import { existsSync } from "node:fs";
import path from "node:path";
import { preload } from "react-dom";
import { HeroCarousel } from "@/components/hero/hero-carousel";
import { resolveSlideMedia } from "@/components/hero/resolve-slide-media";
import { slides } from "@/components/hero/slides";
import { Footer } from "@/components/home/footer/footer";
import { HowWeBuild } from "@/components/home/how-we-build";
import { Industries } from "@/components/home/industries";
import { INSIGHTS_SHOWN, Insights } from "@/components/home/insights";
import { Invitation } from "@/components/home/invitation";
import { Latest } from "@/components/home/latest/latest";
import { People } from "@/components/home/people";
import { Products } from "@/components/home/products/products";
import { RELYXUS_SCREENSHOT } from "@/components/home/products/relyxus-visual";
import { Trust } from "@/components/home/trust";
import { TwoWays } from "@/components/home/two-ways";
import { WhatWeBuild } from "@/components/home/what-we-build";
import { insights } from "@/lib/site";

/** Preload the first slide poster (the LCP image) for the matching viewport. */
function preloadFirstPoster(desktop: string | null, mobile: string | null) {
  if (desktop && mobile && desktop !== mobile) {
    preload(desktop, { as: "image", fetchPriority: "high", media: "(min-width: 768px)" });
    preload(mobile, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });
  } else if (desktop ?? mobile) {
    preload((desktop ?? mobile) as string, { as: "image", fetchPriority: "high" });
  }
}

/**
 * Server only, at build time (the homepage is static): the Relyxus screenshot
 * replaces its placeholder as soon as the file is in /public.
 */
function publicFileExists(publicPath: string): boolean {
  return existsSync(path.join(process.cwd(), "public", publicPath));
}

export default function Home() {
  const heroSlides = resolveSlideMedia(slides);
  const { desktop, mobile } = heroSlides[0].media;
  preloadFirstPoster(desktop.poster, mobile.poster);

  return (
    <>
      <main>
        <HeroCarousel slides={heroSlides} />
        <Latest />
        <TwoWays />
        <Products hasRelyxusScreenshot={publicFileExists(RELYXUS_SCREENSHOT)} />
        <HowWeBuild />
        <WhatWeBuild />
        <Industries />
        <Trust />
        <People />
        {insights.length >= INSIGHTS_SHOWN && <Insights articles={insights} />}
        <Invitation />
      </main>
      <Footer />
    </>
  );
}
