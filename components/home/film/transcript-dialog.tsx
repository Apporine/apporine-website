"use client";

import { useRef, useState } from "react";
import { focusRing } from "@/components/section/tone";
import { useScrollLock } from "@/lib/smooth-scroll";

// The voiceover, word for word.
const TRANSCRIPT =
  "The world’s great industries were built to last. Capital. Energy. Networks. Trade. They were built for their century. And they delivered. But the world no longer waits. Every year, it asks them to move faster than they were ever designed to move. Between that ambition and the systems beneath it, there is a gap. Others will advise you on it. We build what closes it. Products and platforms, engineered to be relied on for a decade. Not a quarter. Apporine. Pristine, by design.";

/** "Read the transcript": a native modal dialog (focus trap, Escape and focus return built in). */
export function TranscriptDialog({ className = "" }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useScrollLock(open);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className={`rounded-sm py-1.5 font-sans text-[15px] font-medium text-plum-200 underline decoration-plum-400 underline-offset-4 transition-colors duration-240 ease-brand hover:text-plum-50 ${focusRing} ${className}`}
      >
        Read the transcript
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="film-transcript-title"
        data-surface="dark"
        data-lenis-prevent=""
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // A click on the backdrop closes the dialog.
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-auto w-[min(640px,calc(100vw-48px))] rounded-[28px] border border-white/15 bg-plum-950 p-0 text-plum-100 backdrop:bg-[rgba(11,10,13,0.72)] backdrop:backdrop-blur-sm"
      >
        <div className="p-7 md:p-10">
          <div className="mb-6 flex items-start justify-between gap-6">
            <h2 id="film-transcript-title" className="font-mono text-xs leading-[1.3] font-medium tracking-[0.18em] text-plum-300 uppercase">
              The Apporine film: transcript
            </h2>
            <form method="dialog">
              <button
                type="submit"
                data-cursor="button"
                aria-label="Close transcript"
                className={`-m-2 inline-flex size-10 items-center justify-center rounded-full text-plum-100 transition-colors duration-240 ease-brand hover:bg-white/10 ${focusRing}`}
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4.5 4.5l11 11m0-11l-11 11" />
                </svg>
              </button>
            </form>
          </div>
          <p className="font-sans text-[17px] leading-[1.65]">{TRANSCRIPT}</p>
        </div>
      </dialog>
    </>
  );
}
