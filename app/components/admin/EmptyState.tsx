import React from 'react'
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

function EmptyState({
  title,
  description,
  buttonText,
  buttonLink,
}: {    
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <div className="text-center my-12">
      <svg
      className="mx-auto h-12 w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
    <h3 className="mt-2 text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {buttonText && buttonLink && (
      <div className="mt-6">
        <Link
          href={buttonLink}
        type="button"
        className="inline-flex items-center btn btn-primary"
      >
        <PlusIcon
          className="-ml-0.5 mr-1.5 h-5 w-5"
          aria-hidden="true"
          />
          {buttonText}
        </Link>
      </div>
      )}
  </div>
  )
}

export default EmptyState