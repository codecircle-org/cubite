import React from 'react'
import { Image } from "@/app/components/Image";

interface Props {
  block: {
    id: string;
    data: {
      title: string;
      description: string;
      buttonUrl: string;
      buttonText: string;
      image: string;
    };
  };
}

function CtaRender({ block }: Props) {
  return (
    <div key={block.id} className="overflow-hidden py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl !mt-3 !mb-0">
            {block.data.title}
          </h2>
          <p className="mt-6 text-base leading-7">
            {block.data.description}
          </p>
          <div className="mt-4 flex">
            <a
              className="btn btn-outline btn-ghost"
              href={block.data.buttonUrl}
            >
              {block.data.buttonText}
            </a>
          </div>
        </div>
        <div className="text-center">
          <div className="mt-4 flex text-sm leading-6 justify-end">
            <Image
              src={block.data.image}
              width={500}
              height={500}
              alt="test"
              sizes="100vw"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default CtaRender