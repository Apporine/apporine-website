"use client";

import Link from "next/link";
import { useState } from "react";
import { Chevron } from "@/components/nav/chevron";
import { focusRing, labelClass } from "@/components/section/tone";

export type FooterColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

/** Link with the light seam on hover and focus. */
export function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`group relative inline-block rounded-sm py-1.5 font-sans text-[15px] text-plum-200 transition-colors duration-240 ease-brand hover:text-plum-50 ${focusRing}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0.5 h-0.5 origin-left scale-x-0 rounded-[2px] bg-citrine shadow-[0_0_10px_rgba(245,230,99,0.6)] transition-transform duration-240 ease-brand group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right"
      />
    </Link>
  );
}

/**
 * Footer link grid (07-homepage-spec.md, section 13): five columns from
 * 1024px, two from 768px, an accordion on phones.
 */
export function FooterColumns({ columns }: { columns: FooterColumn[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav aria-label="Footer" className="grid border-b border-plum-700 py-6 md:grid-cols-2 md:gap-x-10 md:gap-y-12 md:py-16 lg:grid-cols-5">
      {columns.map((column) => {
        const expanded = open === column.heading;
        const listId = `footer-${column.heading.toLowerCase().replaceAll(" ", "-")}`;
        return (
          <div key={column.heading} className="border-b border-plum-800 last:border-b-0 md:border-b-0">
            <h2 className={`${labelClass} text-plum-400`}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={listId}
                onClick={() => setOpen(expanded ? null : column.heading)}
                className={`flex w-full items-center justify-between rounded-sm py-4 text-start uppercase md:hidden ${focusRing}`}
              >
                {column.heading}
                <Chevron open={expanded} className="size-3" />
              </button>
              <span className="hidden md:mb-4 md:block">{column.heading}</span>
            </h2>
            <ul id={listId} className={`pb-4 md:block md:pb-0 ${expanded ? "" : "max-md:hidden"}`}>
              {column.links.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
