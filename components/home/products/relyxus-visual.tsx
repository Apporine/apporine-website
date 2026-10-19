import Image from "next/image";

/** Real product screenshot; until it exists, the abstract skeleton below shows. */
export const RELYXUS_SCREENSHOT = "/products/relyxus/screen-1.png";

const bar = "rounded-full bg-plum-700";

function StatusRow({ incident = false }: { incident?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border-s-2 px-4 py-3.5 ${
        incident ? "border-citrine bg-plum-700/70" : "border-transparent bg-plum-900/70"
      }`}
    >
      <span className={`size-2 shrink-0 rounded-full ${incident ? "bg-citrine" : "bg-plum-600"}`} />
      <span className={`${bar} h-2 w-[38%] ${incident ? "bg-plum-400" : ""}`} />
      <span className={`${bar} ms-auto h-2 w-[18%]`} />
    </div>
  );
}

/**
 * Relyxus product visual, 16:10 (07-homepage-spec.md, section 5): the real
 * screenshot when present, otherwise a clearly abstract interface skeleton
 * (sidebar, header bar, three status rows and one highlighted incident row)
 * with no numbers or text. Decorative.
 */
export function RelyxusVisual({ hasScreenshot }: { hasScreenshot: boolean }) {
  if (hasScreenshot) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[12px]">
        <Image src={RELYXUS_SCREENSHOT} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover object-top" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="flex aspect-[16/10] overflow-hidden rounded-[12px] bg-plum-950">
      <div className="hidden w-[22%] shrink-0 flex-col gap-3 border-e border-plum-800 p-4 sm:flex">
        <span className="mb-3 size-6 rounded-md bg-plum-700" />
        {[70, 55, 62, 48].map((width) => (
          <span key={width} className={`${bar} h-2`} style={{ width: `${width}%` }} />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-plum-800 px-4">
          <span className={`${bar} h-2 w-[28%]`} />
          <span className="ms-auto size-6 rounded-full bg-plum-700" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2.5 p-4 md:p-6">
          <StatusRow />
          <StatusRow incident />
          <StatusRow />
          <StatusRow />
        </div>
      </div>
    </div>
  );
}
