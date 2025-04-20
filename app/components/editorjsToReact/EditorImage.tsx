// {"id":"kyKlkx6t4G","data":{"src":"courseCovers/umlbac55gypvkcj0k10p","caption":"this is the image caption"},"type":"image"}

"use client";

import React from "react";
import { CldImage } from "next-cloudinary";

interface Props {
  src: string;
  caption: string;
}

const EditorImage = ({ src, caption }: Props) => {
  return (
    <figure className="flex flex-col items-center my-4">
      <CldImage
        width="1028"
        height="600"
        src={src}
        sizes="100vw"
        alt={caption}
        className="rounded-md shadow-lg"
      />
      <figcaption className="mt-2 text-sm text-gray-500">{caption}</figcaption>
    </figure>
  );
};

export default EditorImage;
