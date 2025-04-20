"use client";

import React from "react";
import { CldImage } from "next-cloudinary";

interface Image {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
}

export const Image = ({ src, width, height, alt, sizes }: Image) => {
  return (
    <CldImage
      width={width}
      height={height}
      src={src}
      sizes={sizes}
      alt={alt}
      className="rounded-md"
    />
  );
};
