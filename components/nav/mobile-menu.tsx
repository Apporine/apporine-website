"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { EASE_BRAND } from "@/components/hero/hero-motion";
import { gutter } from "@/components/layout";
import { navItems, startBuilding, talkToUs, type NavLink } from "@/lib/navigation";
import { Chevron } from "./chevron";
import { NavLogo } from "./nav-logo";
import { capsuleInset, capsulePadding, pillButton } from "./styles";

type MobileMenuProps = {
  open: boolean;
  reducedMotion: boolean;
  /** Closes the menu; `returnFocus` sends focus back to the Menu button. */
  onClose: (returnFocus: boolean) => void;
};

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-citrine";

function MenuLink({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const description = link.description && (
    <span className="mt-0.5 block font-sans text-sm leading-[1.45] text-plum-300">{link.description}</span>
  );
  if (!link.href) {
    return (
      <span role="link" aria-disabled="true" className="block py-2.5">
        <span className="block font-sans text-base font-semibold text-plum-400">{link.title}</span>
        {description}
      </span>
    );
  }
  return (
    <Link href={link.href} prefetch={false} onClick={onNavigate} className={`block rounded-sm py-2.5 ${focusRing}`}>
      <span className="block font-sans text-base font-semibold text-plum-50">{link.title}</span>
      {description}
    </Link>
  );
}

/** Keeps Tab and Shift+Tab inside `container`. */
function trapTab(event: React.KeyboardEvent, container: HTMLElement | null) {
  if (event.key !== "Tab" || !container) return;
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
  ).filter((element) => element.getClientRects().length > 0);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Full screen menu under 1280px (05-navigation-spec.md section 6): the five
 * items as an accordion, with Talk to us and Start building pinned below.
 * Focus is trapped inside, Escape closes, the page behind does not scroll.
 */
export function MobileMenu({ open, reducedMotion, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstItemRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose(true);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const navigate = () => onClose(false);
  const transition = { duration: reducedMotion ? 0 : 0.3, ease: EASE_BRAND };

  return (
    <AnimatePresence onExitComplete={() => setExpanded(null)}>
      {open && (
        <motion.div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-surface="dark"
          onKeyDown={(event) => trapTab(event, dialogRef.current)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={transition}
          className="fixed inset-0 z-[60] flex flex-col bg-plum-950 xl:hidden"
        >
          {/* Same place as the capsule row, so the Falcon does not jump. */}
          <div className={`mt-5 flex h-[72px] shrink-0 items-center justify-between ${capsuleInset} ${capsulePadding}`}>
            <NavLogo onClick={navigate} />
            <button type="button" onClick={() => onClose(true)} data-cursor="button" className={pillButton}>
              Close
            </button>
          </div>

          {/* Scrolls on its own while smooth scrolling is stopped behind the menu. */}
          <nav aria-label="Main" data-lenis-prevent className={`${gutter} min-h-0 flex-1 overflow-y-auto py-6`}>
            <ul>
              {navItems.map((item, index) => {
                const isExpanded = expanded === item.id;
                const panelId = `mobile-panel-${item.id}`;
                return (
                  <li key={item.id} className="border-b border-plum-700">
                    <button
                      ref={index === 0 ? firstItemRef : undefined}
                      id={`${panelId}-button`}
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className={`flex w-full items-center justify-between gap-4 rounded-sm py-4 text-start font-display text-[32px] leading-none font-extrabold text-plum-50 uppercase [font-variation-settings:'wdth'_75,'opsz'_96] ${focusRing}`}
                    >
                      {item.label}
                      <Chevron open={isExpanded} className="size-4" />
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={`${panelId}-button`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={transition}
                          className="overflow-hidden"
                        >
                          <ul className="pb-4">
                            {item.columns.flatMap((column) =>
                              column.links.map((link) => (
                                <li key={link.title}>
                                  <MenuLink link={link} onNavigate={navigate} />
                                </li>
                              )),
                            )}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={`${gutter} flex shrink-0 flex-col gap-3 pt-4 pb-6`}>
            <ButtonLink href={talkToUs.href} variant="secondary" onClick={navigate} className="w-full">
              {talkToUs.label}
            </ButtonLink>
            <ButtonLink href={startBuilding.href} variant="primary" onClick={navigate} className="w-full">
              {startBuilding.label}
            </ButtonLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
