"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { GateMark } from "@/components/icons/gate-mark";
import { useScrolledPast } from "@/lib/use-browser-state";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Build with us", href: "/build" },
  { label: "Insights", href: "/insights" },
  { label: "Company", href: "/company" },
];

const talkToUs = { label: "Talk to us", href: "/contact" };
const bookWalkthrough = { label: "Book a walkthrough", href: "/contact?route=walkthrough" };

const container = "mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-16";
const outline =
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-citrine";
const focusRing = `rounded-sm ${outline}`;

export function SiteHeader() {
  const scrolled = useScrolledPast(80);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  // While the mobile menu is open: lock page scroll, focus the first link,
  // and close on Escape, returning focus to the menu button.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMenuLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const solid = scrolled && !menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-(--dur-standard) ease-brand ${
        solid ? "bg-plum-950/85 backdrop-blur-[16px]" : "bg-transparent"
      }`}
    >
      <div className={`${container} flex h-[72px] items-center justify-between gap-6`}>
        <Link
          href="/"
          prefetch={false}
          className={`flex items-center gap-2.5 text-plum-50 ${focusRing}`}
        >
          <GateMark size={20} className="text-citrine" />
          <span className="font-sans text-[15px] font-semibold tracking-[0.24em]">APPORINE</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className={`relative font-sans text-[15px] font-medium text-plum-50/80 transition-colors duration-(--dur-micro) ease-brand after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-citrine after:transition-transform after:duration-(--dur-standard) after:ease-brand hover:text-plum-50 hover:after:scale-x-100 focus-visible:after:scale-x-100 ${focusRing}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href={talkToUs.href}
              prefetch={false}
              className={`font-sans text-[15px] font-medium text-plum-50 transition-opacity hover:opacity-80 ${focusRing}`}
            >
              {talkToUs.label}
            </Link>
            <ButtonLink href={bookWalkthrough.href} variant="primary" size="small">
              {bookWalkthrough.label}
            </ButtonLink>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex h-11 min-w-11 items-center justify-center rounded-pill border border-plum-600 px-4 font-sans text-sm font-semibold text-plum-50 transition-colors hover:border-plum-300 lg:hidden ${outline}`}
          >
            Menu
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-plum-950 lg:hidden"
        >
          <nav aria-label="Main" className={`${container} py-10`}>
            <ul className="flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <Link
                    ref={index === 0 ? firstMenuLinkRef : undefined}
                    href={link.href}
                    prefetch={false}
                    onClick={closeMenu}
                    className={`font-sans text-2xl font-medium text-plum-50 ${focusRing}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-4 border-t border-plum-700 pt-8">
                <Link
                  href={talkToUs.href}
                  prefetch={false}
                  onClick={closeMenu}
                  className={`font-sans text-lg font-medium text-plum-50 ${focusRing}`}
                >
                  {talkToUs.label}
                </Link>
              </li>
              <li>
                <ButtonLink
                  href={bookWalkthrough.href}
                  variant="primary"
                  onClick={closeMenu}
                  className="w-full"
                >
                  {bookWalkthrough.label}
                </ButtonLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
