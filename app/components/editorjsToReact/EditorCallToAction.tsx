"use client";

import React from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { parseMarkdown } from "../../utils/markdownParser";

interface Props {
  data: any;
}

function EditorCallToAction({ data }: Props) {

  return (
    <div
      className={`call-to-action relative w-screen -mx-[50vw] left-[50%] right-[50%] grid grid-cols-3 gap-4 p-8 ${
        data.hasBackgroundColour ? "bg-base-200/80" : ""
      }`}
    >
      <div
        className={`grid ${
          data.image ? "grid-cols-3 lg:grid-cols-4" : "grid-cols-3"
        } gap-4 p-8 py-32 relative z-10 col-span-full mx-auto max-w-7xl`}
      >
        <div
          className={`${data.image ? "col-span-3 lg:col-span-2" : "col-span-3"} self-center`}
        >
          {data.title && (
            <p
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
                data.image ? "w-full" : "w-2/3"
              }`}
            >
              {parseMarkdown(data.title)}
            </p>
          )}
          {data.description && (
            <p
              className={`my-4 antialiased tracking-wide pt-4 w-full whitespace-pre-wrap leading-relaxed text-pretty ${data.image ? "lg:w-3/4 w-full" : "lg:w-1/2"}`}>
              {parseMarkdown(data.description)}
            </p>
          )}
          {data.buttonUrl && data.buttonText && (
            <Link
              href={data.buttonUrl}
              className="btn btn-primary !no-underline w-fit mt-4 flex-grow"
            >
              {data.buttonText}
            </Link>
          )}
        </div>
        {data.image && (
          <div className="col-span-2 rounded-md self-center hidden lg:block">
            <CldImage
              className="rounded-md"
              src={data.image}
              height={500}
              width={500}
              alt="Call to action"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorCallToAction;
