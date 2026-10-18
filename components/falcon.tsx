"use client";

import Image, { type ImageLoader } from "next/image";

/** The Falcon exports in /public/brand (source: _brief/assets/brand/falcon/). */
const files = [
  { width: 213, src: "/brand/falcon.png" },
  { width: 426, src: "/brand/falcon@2x.png" },
  { width: 639, src: "/brand/falcon@3x.png" },
];

/** Serves the smallest export that covers the requested width, unprocessed. */
const falconLoader: ImageLoader = ({ width }) =>
  (files.find((file) => file.width >= width) ?? files[files.length - 1]).src;

type FalconProps = {
  /** Rendered size in CSS pixels (about 2.28 to 1); the className sets the same size. */
  width: number;
  height: number;
  className?: string;
  preload?: boolean;
};

/** Apporine logo mark, the Falcon. Decorative: label the surrounding link. */
export function Falcon({ width, height, className, preload = false }: FalconProps) {
  return (
    <Image
      loader={falconLoader}
      src={files[files.length - 1].src}
      width={width}
      height={height}
      alt=""
      preload={preload}
      className={className}
    />
  );
}
