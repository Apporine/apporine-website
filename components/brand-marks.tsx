"use client";

import Image, { type ImageLoader } from "next/image";

/*
 * Brand marks exported as PNG at 1x, 2x and 3x in /public/brand
 * (source: _brief/assets/brand/falcon/). The loader serves the smallest
 * export that covers the requested width, unprocessed.
 */
type BrandExport = { width: number; src: string };

function exportsLoader(files: BrandExport[]): ImageLoader {
  return ({ width }) => (files.find((file) => file.width >= width) ?? files[files.length - 1]).src;
}

const falconFiles: BrandExport[] = [
  { width: 213, src: "/brand/falcon-clean.png" },
  { width: 426, src: "/brand/falcon-clean@2x.png" },
  { width: 639, src: "/brand/falcon-clean@3x.png" },
];
const ringOFiles: BrandExport[] = [
  { width: 44, src: "/brand/wordmark-o.png" },
  { width: 88, src: "/brand/wordmark-o@2x.png" },
  { width: 132, src: "/brand/wordmark-o@3x.png" },
];
const falconLoader = exportsLoader(falconFiles);
const ringOLoader = exportsLoader(ringOFiles);

type MarkProps = {
  /** Rendered size in CSS pixels; the className sets the same size. */
  width: number;
  height: number;
  className?: string;
  preload?: boolean;
};

/** Apporine logo mark, the Falcon (about 2.28 to 1). Decorative: label the surrounding link. */
export function Falcon({ width, height, className, preload = false }: MarkProps) {
  return (
    <Image
      loader={falconLoader}
      src={falconFiles[falconFiles.length - 1].src}
      width={width}
      height={height}
      alt=""
      preload={preload}
      className={className}
    />
  );
}

/**
 * The O of the wordmark: the violet ring with the Falcon inside. Decorative.
 * Loaded eagerly (5 KB): it sits in a collapsed container until the reveal,
 * where a lazy image could arrive after its moment in the stagger.
 */
export function RingO({ width, height, className }: Omit<MarkProps, "preload">) {
  return (
    <Image
      loader={ringOLoader}
      src={ringOFiles[ringOFiles.length - 1].src}
      width={width}
      height={height}
      alt=""
      loading="eager"
      className={className}
    />
  );
}
