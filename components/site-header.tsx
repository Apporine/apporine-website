"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { Chevron } from "@/components/nav/chevron";
import { MegaPanel } from "@/components/nav/mega-panel";
import { MobileMenu } from "@/components/nav/mobile-menu";
import { NavLogo } from "@/components/nav/nav-logo";
import { capsuleInset, capsulePadding, pillButton } from "@/components/nav/styles";
import { navItems, startBuilding, talkToUs } from "@/lib/navigation";
import { useScrollLock } from "@/lib/smooth-scroll";
import { useHiddenOnScrollDown, useMediaQuery, useScrolledPast } from "@/lib/use-browser-state";

// Timings from 05-navigation-spec.md section 5.
const OPEN_INTENT_MS = 120;
const CLOSE_DELAY_MS = 260;

type OpenedBy = "hover" | "focus" | "click";
type Seam = { left: number; width: number };

const panelId = (id: string) => `nav-panel-${id}`;

const itemClass =
  "flex items-center gap-1.5 rounded-pill px-3.5 py-3 font-sans text-[15px] leading-5 font-medium text-plum-50/85 transition-colors duration-(--dur-micro) ease-brand hover:text-plum-50 aria-expanded:text-plum-50 focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-citrine xl:max-[1439px]:px-2.5";

/**
 * Site navigation (05-navigation-spec.md): the Imperial Plum glass capsule,
 * the Falcon logo, five mega panels with the light seam from 1280px, and the
 * full screen menu below 1280px.
 */
export function SiteHeader() {
  const [openId, setOpenId] = useState<string | null>(null);
  // Last opened panel: keeps the background height while the panel fades out.
  const [shownId, setShownId] = useState(navItems[0].id);
  const [switching, setSwitching] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [seam, setSeam] = useState<Seam | null>(null);
  const [panelHeights, setPanelHeights] = useState<Record<string, number>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusInside, setFocusInside] = useState(false);

  const capsuleRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const openedBy = useRef<OpenedBy | null>(null);
  // Focus returned to an item after Escape must not reopen its panel.
  const returningFocus = useRef(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const scrolled = useScrolledPast(80);
  const anyOpen = openId !== null;
  const hidden = useHiddenOnScrollDown(120, !reducedMotion && !anyOpen && !menuOpen && !focusInside);
  // The page stays put behind an open panel or the menu.
  useScrollLock(anyOpen || menuOpen);

  // Crossing the 1280px breakpoint closes whichever menu no longer exists.
  if (isDesktop && menuOpen) setMenuOpen(false);
  if (!isDesktop && openId) setOpenId(null);

  /** Moves the seam under an item: its width minus the side padding. */
  function measureSeam(id: string) {
    const item = itemRefs.current[id];
    const capsule = capsuleRef.current;
    if (!item || !capsule) return;
    const padding = parseFloat(getComputedStyle(item).paddingLeft);
    const itemBox = item.getBoundingClientRect();
    setSeam({
      left: itemBox.left - capsule.getBoundingClientRect().left + padding,
      width: itemBox.width - padding * 2,
    });
  }

  const close = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    setOpenId(null);
    setHoverId(null);
    openedBy.current = null;
  }, []);

  function open(id: string, by: OpenedBy) {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    setSwitching(openId !== null && openId !== id);
    setOpenId(id);
    setShownId(id);
    openedBy.current = by;
    measureSeam(id);
  }

  // Escape closes the open panel and returns focus to its item.
  useEffect(() => {
    if (!openId) return;
    const itemId = openId;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const focusWasInside = capsuleRef.current?.contains(document.activeElement);
      close();
      if (focusWasInside) {
        returningFocus.current = true;
        itemRefs.current[itemId]?.focus({ preventScroll: true });
        returningFocus.current = false;
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openId, close]);

  // Panel heights, so the Pearl background can morph between panels.
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setPanelHeights((previous) => {
        const next = { ...previous };
        for (const entry of entries) {
          const panel = entry.target as HTMLElement;
          if (panel.dataset.navPanel) next[panel.dataset.navPanel] = panel.offsetHeight;
        }
        return next;
      });
    });
    for (const panel of Object.values(panelRefs.current)) if (panel) observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  // No timer may fire after unmount.
  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  function onItemPointerEnter(id: string, event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    setHoverId(id);
    measureSeam(id);
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    if (openId) {
      if (openId !== id) open(id, "hover");
    } else {
      openTimer.current = window.setTimeout(() => open(id, "hover"), OPEN_INTENT_MS);
    }
  }

  function onItemPointerLeave(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(openTimer.current);
    setHoverId(null);
    if (openId) measureSeam(openId);
  }

  function onItemClick(id: string) {
    if (openId === id) {
      // A panel opened by hover or focus stays open on the first click.
      if (openedBy.current === "click") close();
      else openedBy.current = "click";
      return;
    }
    open(id, "click");
  }

  function onItemFocus(id: string, event: React.FocusEvent<HTMLButtonElement>) {
    if (!returningFocus.current && event.currentTarget.matches(":focus-visible")) open(id, "focus");
  }

  function onCapsulePointerLeave(event: React.PointerEvent) {
    if (event.pointerType !== "mouse" || !openId) return;
    closeTimer.current = window.setTimeout(close, CLOSE_DELAY_MS);
  }

  function onHeaderBlur(event: React.FocusEvent) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setFocusInside(false);
    if (openedBy.current !== "hover") close();
  }

  const closeMenu = useCallback((returnFocus: boolean) => {
    setMenuOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  const seamVisible = Boolean((hoverId ?? openId) && seam);
  const dense = scrolled || anyOpen;

  return (
    <>
      {/* Dims the page behind an open panel; a click here closes it. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-40 bg-[rgba(18,4,26,0.5)] transition-opacity duration-300 ease-brand motion-reduce:duration-200 ${
          anyOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <header
        data-surface="dark"
        onFocus={() => setFocusInside(true)}
        onBlur={onHeaderBlur}
        className={`pointer-events-none fixed inset-x-0 top-5 z-50 transition-[translate] duration-350 ease-brand ${
          hidden ? "-translate-y-[140%]" : ""
        }`}
      >
        <div
          ref={capsuleRef}
          onPointerEnter={() => window.clearTimeout(closeTimer.current)}
          onPointerLeave={onCapsulePointerLeave}
          className={`pointer-events-auto relative flex h-[72px] items-center justify-between rounded-pill border border-[rgba(165,59,239,0.42)] shadow-[inset_0_1px_0_rgba(239,230,246,0.14),0_0_0_1px_rgba(122,31,184,0.12),0_0_44px_rgba(122,31,184,0.28),0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-[22px] backdrop-saturate-[160%] transition-[background-color] duration-300 ease-brand motion-reduce:duration-200 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:pe-[26px] ${capsuleInset} ${capsulePadding} ${
            dense ? "bg-[rgba(46,10,58,0.86)]" : "bg-[rgba(46,10,58,0.62)]"
          }`}
        >
          <NavLogo onClick={close} />

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1.5 xl:max-[1439px]:gap-0.5">
              {navItems.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      ref={(element) => {
                        itemRefs.current[item.id] = element;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId(item.id)}
                      onPointerEnter={(event) => onItemPointerEnter(item.id, event)}
                      onPointerLeave={onItemPointerLeave}
                      onClick={() => onItemClick(item.id)}
                      onFocus={(event) => onItemFocus(item.id, event)}
                      className={itemClass}
                    >
                      {item.label}
                      <Chevron open={isOpen} />
                    </button>
                    <MegaPanel
                      ref={(element) => {
                        panelRefs.current[item.id] = element;
                      }}
                      item={item}
                      id={panelId(item.id)}
                      active={isOpen}
                      anyOpen={anyOpen}
                      switching={switching}
                      reducedMotion={reducedMotion}
                      onNavigate={close}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* From 1280px the padding is 26px on both sides so the items centre on the
              capsule; this negative margin keeps the button 12px from the edge. */}
          <div className="flex items-center gap-2 xl:-me-3.5 xl:justify-self-end">
            <div className="hidden items-center gap-2 xl:flex">
              <Link
                href={talkToUs.href}
                prefetch={false}
                onClick={close}
                className="rounded-pill px-3.5 py-2.5 font-sans text-[15px] leading-5 font-medium text-plum-50 transition-opacity duration-(--dur-micro) ease-brand hover:opacity-80 focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-citrine"
              >
                {talkToUs.label}
              </Link>
              <ButtonLink href={startBuilding.href} variant="primary" size="nav" onClick={close}>
                {startBuilding.label}
              </ButtonLink>
            </div>

            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
              data-cursor="button"
              className={`${pillButton} xl:hidden`}
            >
              Menu
            </button>
          </div>

          {/* The light seam, under the hovered or open item. */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-3.5 hidden h-0.5 rounded-[2px] bg-citrine shadow-[0_0_10px_rgba(245,230,99,0.6)] transition-[left,width,opacity] duration-320 ease-brand motion-reduce:transition-opacity motion-reduce:duration-200 xl:block ${
              seamVisible ? "opacity-100" : "opacity-0"
            }`}
            style={seam ?? undefined}
          />

          {/* Pearl panel background; its height morphs between panels. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-[calc(100%+10px)] hidden rounded-[28px] bg-plum-50 shadow-[0_30px_80px_rgba(18,4,26,0.55)] ease-brand motion-reduce:transition-opacity motion-reduce:duration-200 xl:block ${
              switching ? "transition-[height,opacity,translate] duration-280" : "transition-[opacity,translate] duration-240"
            } ${anyOpen ? "translate-y-0 opacity-100" : "-translate-y-2.5 opacity-0 motion-reduce:translate-y-0"}`}
            style={{ height: panelHeights[shownId] }}
          />
        </div>
      </header>

      <MobileMenu open={menuOpen} reducedMotion={reducedMotion} onClose={closeMenu} />
    </>
  );
}
