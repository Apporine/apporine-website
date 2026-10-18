import { preload } from "react-dom";
import { HeroCarousel } from "@/components/hero/hero-carousel";
import { resolveSlideMedia } from "@/components/hero/resolve-slide-media";
import { slides } from "@/components/hero/slides";
import { SiteHeader } from "@/components/site-header";

/** Preload the first slide poster (the LCP image) for the matching viewport. */
function preloadFirstPoster(desktop: string | null, mobile: string | null) {
  if (desktop && mobile && desktop !== mobile) {
    preload(desktop, { as: "image", fetchPriority: "high", media: "(min-width: 768px)" });
    preload(mobile, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });
  } else if (desktop ?? mobile) {
    preload((desktop ?? mobile) as string, { as: "image", fetchPriority: "high" });
  }
}

export default function Home() {
  const heroSlides = resolveSlideMedia(slides);
  const { desktop, mobile } = heroSlides[0].media;
  preloadFirstPoster(desktop.poster, mobile.poster);

  return (
    <>
      <SiteHeader />
      <main>
        <HeroCarousel slides={heroSlides} />
      </main>
    </>
  );
}
