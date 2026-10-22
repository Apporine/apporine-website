"use client";

import { useRef, useState } from "react";
import { focusRing } from "@/components/section/tone";
import { useScrollLock } from "@/lib/smooth-scroll";

// The voiceover, word for word.
const TRANSCRIPT =
  "The world’s great industries were built to last. Capital. Energy. Networks. Trade. They were built for their century. And they delivered. But the world no longer waits. Every year, it asks them to move faster than they were ever designed to move. Between that ambition and the systems beneath it, there is a gap. Others will advise you on it. We build what closes it. Products and platforms, engineered to be relied on for a decade. Not a quarter. Apporine. Pristine, by design.";

type TranscriptDialogProps = {
  /** The trigger's classes (the film's glass pill). */
  className: string;
  /** Called as the dialog opens (the film pauses). */
  onOpen: () => void;
};

function DocumentIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2.75h6.5L15 6.25v11H5z" />
      <path d="M11.5 2.75v3.5H15M7.75 10h4.5M7.75 13h4.5" />
    </svg>
  );
}

/** The "Transcript" pill and its native modal dialog (focus trap, Escape and focus return built in). */
export function TranscriptDialog({ className, onOpen }: TranscriptDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useScrollLock(open);

  return (
    <>
      <button
        type="button"
        data-cursor="button"
        aria-label="Open the film transcript"
        onClick={() => {
          onOpen();
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className={className}
      >
        <DocumentIcon />
        <span aria-hidden="true">Transcript</span>
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
