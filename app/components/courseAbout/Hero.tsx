"use client";

import React from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
const Hero = ({ coverImage, externalImageUrl, description, name }) => {
  return (
    <div className="min-h-48 relative isolate overflow-hidden">
      {coverImage && (
        <CldImage
          fill
          src={coverImage}
          sizes="100vw"
          alt={name}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-primary opacity-80 -z-10"></div>

      <div className="flex flex-col px-12 py-36">
        <p className="text-4xl w-2/3 font-semibold text-base-300">{name}</p>
        <p className="py-4 text-lg w-2/3 font-light text-base-200 my-2">{description}</p>
      </div>
    </div>
  );
};

export default Hero;
